import bcrypt
from .. import db
from ..models import User
from flask import jsonify

class AdminService:

    @staticmethod
    def get_all_users():
        users = User.query.all()
        users_data = []
        for user in users:
            users_data.append({
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "role": user.role
            })
        return jsonify(users_data)

    @staticmethod
    def get_user_by_id(user_id):
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404
        
        return jsonify({
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role": user.role
        })

    @staticmethod
    def create_user(data):
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'client')

        if not all([first_name, last_name, email, password]):
            return jsonify({"message": "All fields are required"}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({"message": "Email already exists"}), 400

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        new_user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=hashed_password.decode('utf-8'),
            role=role
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": f"User {email} registered successfully as {role}"}), 201

    @staticmethod
    def update_user(user_id, data):
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404
            
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        role = data.get('role')

        if email and email != user.email:
            if User.query.filter_by(email=email).first():
                return jsonify({"message": "Email already exists"}), 400
            user.email = email

        if first_name:
            user.first_name = first_name
        
        if last_name:
            user.last_name = last_name
            
        if role:
            user.role = role

        db.session.commit()
        
        return jsonify({"message": "User updated successfully"}), 200

    @staticmethod
    def delete_user(user_id, current_admin_id):
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404
        
        if current_admin_id == user_id:
            return jsonify({"message": "Cannot delete currently logged in user"}), 400

        db.session.delete(user)
        db.session.commit()
        
        return jsonify({"message": "User deleted successfully"}), 200
