from flask import Blueprint, jsonify, request, current_app
from src.models.user_model import User

password_bp = Blueprint("password", __name__)


# POST /auth/forgot
@password_bp.route("/forgot", methods=["POST"])
def forgot_password():
    data = request.get_json() or {}
    email = data.get("email")
    if not email:
        return jsonify({"error": "Email requis"}), 400

    users_col = current_app.db.users
    user = User.get_by_email(users_col, email)
    if not user:
        return jsonify({"error": "Aucun compte associé à cet email"}), 404

    return (
        jsonify(
            {
                "message": "Email de réinitialisation envoyé (simulation)",
                "token": "mock-reset-token",
            }
        ),
        200,
    )


# POST /auth/reset
@password_bp.route("/reset", methods=["POST"])
def reset_password():
    data = request.get_json() or {}
    token = data.get("token")
    new_password = data.get("password")

    if not token or not new_password:
        return jsonify({"error": "Token et nouveau mot de passe requis"}), 400

    if token != "mock-reset-token":
        return jsonify({"error": "Token invalide ou expiré"}), 400

    return jsonify({"message": "Mot de passe réinitialisé (simulation)"}), 200
