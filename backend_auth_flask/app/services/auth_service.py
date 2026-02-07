import bcrypt
import jwt
import datetime
import secrets
from flask import current_app, jsonify
from .. import db, mail
from ..models import User, Token, Reset
from flask_mail import Message

class AuthService:

    @staticmethod
    def create_user(data):
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        password = data.get('password')

        if not all([first_name, last_name, email, password]):
            return jsonify({"message": "All fields are required"}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({"message": "Email already exists"}), 400

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        new_user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=hashed_password.decode('utf-8')
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User registered successfully"}), 201

    @staticmethod
    def login_user(data):
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"message": "Email and password are required"}), 400

        user = User.query.filter_by(email=email).first()

        if not user or not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            return jsonify({"message": " Identifiants invalides "}), 401

        access_token_expires = datetime.timedelta(minutes=15)
        access_token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + access_token_expires
        }, current_app.config['JWT_SECRET_KEY'], algorithm="HS256")

        refresh_token_expires = datetime.timedelta(days=30)
        refresh_token = secrets.token_hex(32)
        refresh_token_expiry_date = datetime.datetime.utcnow() + refresh_token_expires
        
        new_token = Token(
            token=refresh_token,
            user_id=user.id,
            expired_at=refresh_token_expiry_date
        )
        db.session.add(new_token)
        db.session.commit()

        return user, access_token, refresh_token, access_token_expires, refresh_token_expires

    @staticmethod
    def refresh_access_token(refresh_token_value):
        if not refresh_token_value:
            return None, (jsonify({"message": "Refresh token is required"}), 400)

        token = Token.query.filter_by(token=refresh_token_value).first()

        if not token:
            return None, (jsonify({"message": "Invalid refresh token"}), 401)

        if token.expired_at < datetime.datetime.utcnow():
            db.session.delete(token)
            db.session.commit()
            return None, (jsonify({"message": "Refresh token has expired"}), 401)

        user = User.query.get(token.user_id)
        if not user:
            return None, (jsonify({"message": "User not found"}), 401)
        
        access_token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
        }, current_app.config['JWT_SECRET_KEY'], algorithm="HS256")

        return access_token, None

    @staticmethod
    def logout_user(refresh_token_value):
        if refresh_token_value:
            token = Token.query.filter_by(token=refresh_token_value).first()
            if token:
                db.session.delete(token)
                db.session.commit()
        return jsonify({"message": "Logout successful"})

    @staticmethod
    def forgot_password(email):
        if not email:
            return jsonify({"message": "Email is required"}), 400

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"message": "If a user with that email exists, a password reset link has been sent."}), 200

        Reset.query.filter_by(email=email).delete()

        token = secrets.token_hex(32)
        expires_at = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        
        new_reset = Reset(email=email, token=token, expires_at=expires_at)
        db.session.add(new_reset)
        db.session.commit()

        msg = Message('Password Reset Request', sender='central10cinema@gmail.com', recipients=[email])
        frontend_url = "http://localhost:5173"
        msg.html = f'<a href="{frontend_url}/reset/{token}">Cliquer Ici Pour Modifier Votre Mot De Passe</a>'
        mail.send(msg)
                
        return jsonify({"message": "If a user with that email exists, a password reset link has been sent."}), 200

    @staticmethod
    def reset_password(token, password, password_confirm):
        if not all([token, password, password_confirm]):
            return jsonify({"message": "All fields are required"}), 400

        if password != password_confirm:
            return jsonify({"message": "Passwords do not match"}), 400

        reset_request = Reset.query.filter_by(token=token).first()

        if not reset_request or reset_request.expires_at < datetime.datetime.utcnow():
            if reset_request:
                db.session.delete(reset_request)
                db.session.commit()
            return jsonify({"message": "Invalid or expired token"}), 400

        user = User.query.filter_by(email=reset_request.email).first()
        if not user:
            return jsonify({"message": "User not found"}), 404

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user.password = hashed_password.decode('utf-8')
        
        db.session.delete(reset_request)
        db.session.commit()

        return jsonify({"message": "Password updated successfully"}), 200
