from .. import db
from ..models import User
from flask import jsonify

class UserService:

    @staticmethod
    def get_user_profile(user):
        return jsonify({
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role": user.role
        })

    @staticmethod
    def update_user_profile(user, data):
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')

        if email and email != user.email:
            if User.query.filter_by(email=email).first():
                return jsonify({"message": "Email already exists"}), 400
            user.email = email

        if first_name:
            user.first_name = first_name
        
        if last_name:
            user.last_name = last_name

        db.session.commit()

        return jsonify({
            "message": "User updated successfully",
            "user": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
            }
        }), 200
