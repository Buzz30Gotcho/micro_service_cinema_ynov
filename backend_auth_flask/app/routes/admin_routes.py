from flask import Blueprint, request, g, jsonify
from ..services.admin_service import AdminService
from ..services.auth_utils import admin_required

admin_bp = Blueprint('admin_bp', __name__, url_prefix='/auth/admin')

@admin_bp.route('/test', methods=['GET'])
@admin_required
def admin_test():
    return jsonify({"message": "Admin test route successful"})

@admin_bp.route('/users', methods=['GET'])
@admin_required
def admin_all_users():
    return AdminService.get_all_users()

@admin_bp.route('/me', methods=['GET'])
@admin_required
def admin_me():
    # g.user is set by the @admin_required decorator
    return jsonify({
        "id": g.user.id,
        "first_name": g.user.first_name,
        "last_name": g.user.last_name,
        "email": g.user.email,
        "role": g.user.role
    })

@admin_bp.route('/<int:id>', methods=['GET'])
@admin_required
def admin_get_user(id):
    return AdminService.get_user_by_id(id)

@admin_bp.route('/register', methods=['POST'])
@admin_required
def admin_register():
    data = request.get_json()
    return AdminService.create_user(data)

@admin_bp.route('/update/<int:id>', methods=['PUT'])
@admin_required
def admin_update_user(id):
    data = request.get_json()
    return AdminService.update_user(id, data)

@admin_bp.route('/delete/<int:id>', methods=['DELETE'])
@admin_required
def admin_delete_user(id):
    # g.user is set by the @admin_required decorator
    return AdminService.delete_user(id, g.user.id)
