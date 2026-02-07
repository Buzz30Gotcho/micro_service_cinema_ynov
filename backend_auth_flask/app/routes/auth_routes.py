from flask import Blueprint, request, jsonify, current_app
from ..services.auth_service import AuthService

auth_bp = Blueprint('auth_bp', __name__, url_prefix='/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    return AuthService.create_user(data)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    result = AuthService.login_user(data)

    # Check if AuthService.login_user returned an error response (jsonify object + status code)
    if isinstance(result, tuple) and len(result) == 2 and hasattr(result[0], 'is_json'):
        return result # Return the (response, status_code) tuple directly

    # If not an error, unpack the successful login data
    user, access_token, refresh_token, access_expires, refresh_expires = result 

    response = jsonify({
        "message": "Logged in successfully",
        "user": {
            "id": user.id,
            "role": user.role,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email
        }
    })

    response.set_cookie(
        'access_token', 
        value=access_token, 
        httponly=True, 
        secure=not current_app.debug, 
        samesite='Strict',
        max_age=access_expires.total_seconds()
    )
    response.set_cookie(
        'refresh_token', 
        value=refresh_token, 
        httponly=True, 
        secure=not current_app.debug, 
        samesite='Strict',
        max_age=refresh_expires.total_seconds()
    )
    return response

@auth_bp.route('/refresh', methods=['POST'])
def refresh():
    refresh_token = request.cookies.get('refresh_token')
    access_token, error_response = AuthService.refresh_access_token(refresh_token)
    if error_response:
        return error_response
    return jsonify({"access_token": access_token}), 200

@auth_bp.route('/logout', methods=['POST'])
def logout():
    refresh_token = request.cookies.get('refresh_token')
    response = AuthService.logout_user(refresh_token)
    response.set_cookie('access_token', '', expires=0)
    response.set_cookie('refresh_token', '', expires=0)
    return response

@auth_bp.route('/forgot', methods=['POST'])
def forgot():
    data = request.get_json()
    email = data.get('email')
    return AuthService.forgot_password(email)

@auth_bp.route('/reset', methods=['POST'])
def reset():
    data = request.get_json()
    token = data.get('token')
    password = data.get('password')
    password_confirm = data.get('confirm_password')
    return AuthService.reset_password(token, password, password_confirm)
