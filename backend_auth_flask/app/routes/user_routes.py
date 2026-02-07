from flask import Blueprint, request, g
from ..services.user_service import UserService
from ..services.auth_utils import token_required

user_bp = Blueprint('user_bp', __name__, url_prefix='/auth')

@user_bp.route('/user', methods=['GET'])
@token_required
def user_profile():
    # g.user is set by the @token_required decorator
    return UserService.get_user_profile(g.user)

@user_bp.route('/me', methods=['GET'])
@token_required
def me():
    # g.user is set by the @token_required decorator
    return UserService.get_user_profile(g.user)

@user_bp.route('/update', methods=['PATCH'])
@token_required
def update_profile():
    # g.user is set by the @token_required decorator
    data = request.get_json()
    return UserService.update_user_profile(g.user, data)
