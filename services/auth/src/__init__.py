from datetime import timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt_identity,
    verify_jwt_in_request,
    get_jwt,
)
from flask_login import LoginManager
from pymongo import MongoClient
import pymongo
from .config import Config

# Initialisation des extensions sans les lier tout de suite
login_manager = LoginManager()
mongo_client = MongoClient()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # CORS config
    CORS(
        app,
        resources={
            r"/*": {
                "origins": [
                    "http://localhost:3000",
                    "http://localhost:5173",
                    "http://localhost:4010",
                    "http://127.0.0.1:3000",
                    "http://127.0.0.1:4010",
                ]
            }
        },
        supports_credentials=True,
    )

    # 1. Configuration base de données
    client = MongoClient(app.config["MONGO_URI"])
    db_name = app.config["MONGO_DB"]
    app.db = client[db_name]

    # Permettre de stocker les JWT révoqués & supprimer automatiquement après expiration
    try:
        app.db.jwt_blocklist.create_index([("jti", pymongo.ASCENDING)], unique=True)
    except Exception:
        pass
    try:
        app.db.jwt_blocklist.create_index("expires_at", expireAfterSeconds=0)
    except Exception:
        pass

    # 2. Setup Flask-Login
    login_manager.init_app(app)

    # Désactiver la redirection HTML par défaut de Flask-Login
    @login_manager.unauthorized_handler
    def unauthorized():
        return (
            jsonify({"error": "Unauthorized", "message": "Authentification requise."}),
            401,
        )

    # 3. Setup JWT
    app.config.setdefault("JWT_SECRET_KEY", app.config.get("SECRET_KEY"))
    # Utiliser les durées définies dans Config
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(seconds=app.config.get("JWT_ACCESS_TOKEN_EXPIRES", 1800))
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(seconds=app.config.get("JWT_REFRESH_TOKEN_EXPIRES", 604800))

    jwt = JWTManager()
    jwt.init_app(app)

    # Blacklist des tokens (revocation)
    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        jti = jwt_payload.get("jti")
        if not jti:
            return False
        return bool(app.db.jwt_blocklist.find_one({"jti": jti}))

    @app.after_request
    def refresh_jwt(response):

        try:
            # optional=True évite d'élever une erreur si aucun token n'est fourni
            verify_jwt_in_request(optional=True)

            identity = get_jwt_identity()
            if identity:
                claims = get_jwt() or {}
                email = claims.get("email")
                # ne pas écraser le token s'il a déjà été défini par la route (ex: /login ou /me)
                if "X-Access-Token" not in response.headers:
                    # créer un nouveau token et l'envoyer dans l'en-tête de réponse
                    new_token = (
                        create_access_token(
                            identity=identity, additional_claims={"email": email}
                        )
                        if email
                        else None
                    )
                    response.headers["X-Access-Token"] = new_token
        except Exception:
            # token absent, invalide ou erreur context JWT -> on ne fait rien
            pass

        return response

    # 4. Import et Enregistrement des Blueprints (Routes)
    from src.routes.auth_routes import auth_bp
    from src.routes.misc_routes import misc_bp
    from src.routes.admin_routes import admin_bp
    from src.routes.password_routes import password_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(
        admin_bp, url_prefix="/auth/admin"
    )  # Check prefix correctness
    app.register_blueprint(password_bp, url_prefix="/auth")
    app.register_blueprint(misc_bp)

    return app
