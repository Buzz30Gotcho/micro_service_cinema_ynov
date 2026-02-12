from bson import ObjectId
from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import get_jwt_identity, jwt_required
from src.models.user_model import User
from src.services.user_service import serialize_user
from src.services.validation_service import (
    validate_admin_register,
    validate_user_update_profile,
)

admin_bp = Blueprint("admin", __name__)


def is_admin(user_id):
    users_col = current_app.db.users
    user_doc = users_col.find_one({"_id": ObjectId(user_id)})
    if not user_doc:
        return False
    # Check role
    role = user_doc.get("role")
    return role in ["admin", "Administrateur"]


@admin_bp.before_request
@jwt_required()
def check_admin_access():
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({"error": "Accès refusé. Droits d'administrateur requis."}), 403


# GET /auth/admin/users
@admin_bp.route("/users", methods=["GET"])
def get_all_users():
    users_col = current_app.db.users
    users_cursor = users_col.find()
    users = []
    for doc in users_cursor:
        users.append(serialize_user(doc))
    return jsonify(users), 200


# GET /auth/admin/<id>
@admin_bp.route("/<user_id>", methods=["GET"])
def get_user_by_id(user_id):
    users_col = current_app.db.users
    try:
        doc = users_col.find_one({"_id": ObjectId(user_id)})
        if not doc:
            return jsonify({"error": "Utilisateur non trouvé"}), 404
        return jsonify(serialize_user(doc)), 200
    except Exception:
        return jsonify({"error": "ID invalide"}), 400


# POST /auth/admin/register
@admin_bp.route("/register", methods=["POST"])
def admin_register_user():
    data = request.get_json() or {}

    # Validation logic
    is_valid, error_response = validate_admin_register(data)
    if not is_valid:
        return jsonify(error_response), 400

    users_col = current_app.db.users
    if User.get_by_email(users_col, data["email"]):
        return jsonify({"error": "Email déjà pris"}), 409

    try:
        role = data.get("role", "client")

        new_user = User.create(
            users_col,
            data["email"],
            data["password"],
            data.get("first_name"),
            data.get("last_name"),
            role=role,
        )

        return jsonify({"message": "Utilisateur créé", "id": new_user.id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# PUT /auth/admin/update/<id>
@admin_bp.route("/update/<user_id>", methods=["PUT"])
def admin_update_user(user_id):
    data = request.get_json() or {}
    users_col = current_app.db.users

    updates = {
        k: v
        for k, v in data.items()
        if k in ["first_name", "last_name", "role", "email"]
    }

    if "password" in data and data["password"]:
        from werkzeug.security import generate_password_hash

        updates["password"] = generate_password_hash(data["password"])

    if not updates:
        return jsonify({"message": "Aucune modification fournie"}), 400

    try:
        res = users_col.update_one({"_id": ObjectId(user_id)}, {"$set": updates})
        if res.matched_count == 0:
            return jsonify({"error": "Utilisateur non trouvé"}), 404
        return jsonify({"message": "Utilisateur mis à jour"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# DELETE /auth/admin/delete/<id>
@admin_bp.route("/delete/<user_id>", methods=["DELETE"])
def admin_delete_user(user_id):
    users_col = current_app.db.users
    try:
        res = users_col.delete_one({"_id": ObjectId(user_id)})
        if res.deleted_count == 0:
            return jsonify({"error": "Utilisateur non trouvé"}), 404
        return jsonify({"message": "Utilisateur supprimé"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# GET /auth/admin/me (Profile of the admin)
@admin_bp.route("/me", methods=["GET"])
def admin_me():
    identity = get_jwt_identity()
    users_col = current_app.db.users
    doc = users_col.find_one({"_id": ObjectId(identity)})
    if not doc:
        return jsonify({"error": "Utilisateur non trouvé"}), 404
    return jsonify(serialize_user(doc)), 200
