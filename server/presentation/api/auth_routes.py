from flask import Blueprint, request, jsonify, current_app, session
from flask_login import login_required, login_user
from domain.services.auth_service import AuthService
from presentation.schemas.user_schema import user_to_dict
from core.exceptions import ApiError, AuthenticationError, ValidationError
from domain.models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/login', methods=['POST'])
def login():
    try:
        # Enhanced logging for debugging
        current_app.logger.info(f"Login request received: {request.content_type}")
        current_app.logger.info(f"Request headers: {request.headers}")
        
        # Check if already logged in
        if AuthService.get_current_user():
            user = AuthService.get_current_user()
            return jsonify({
                'message': 'Already logged in',
                'user': user_to_dict(user)
            }), 200
        
        # Make sure we can get the JSON data
        if not request.is_json:
            current_app.logger.error(f"Request content type is not JSON: {request.content_type}")
            try:
                data = request.get_json(force=True)
                current_app.logger.info("Successfully parsed JSON with force=True")
            except Exception as e:
                current_app.logger.error(f"Failed to parse JSON: {str(e)}")
                return jsonify({'error': 'Invalid JSON format'}), 400
        else:
            data = request.get_json()
        
        # Log what we received (without sensitive data)
        current_app.logger.info(f"Login data received: {{'username': '{data.get('username')}'}}") 
        
        username = data.get('username')
        password = data.get('password')
        
        # Basic validation
        if not username or not password:
            current_app.logger.warning("Missing username or password")
            return jsonify({'error': 'Username and password are required'}), 400
        
        # Attempt login
        try:    
            user = AuthService.login(username, password)
            current_app.logger.info(f"Login successful for user: {username}")
            
            # Set session cookie explicitly
            session['user_id'] = user.id
            
            # Return success response with user data
            return jsonify({
                'message': 'Login successful',
                'user': user_to_dict(user)
            }), 200
        except AuthenticationError as e:
            current_app.logger.error(f"Authentication error: {str(e)}")
            return jsonify({'error': str(e)}), 401
        except Exception as e:
            current_app.logger.error(f"Unexpected error during login: {str(e)}")
            return jsonify({'error': 'An unexpected error occurred'}), 500
    except Exception as e:
        current_app.logger.error(f"Exception in login route: {str(e)}")
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/api/logout', methods=['POST'])
@login_required
def logout():
    AuthService.logout()
    return jsonify({'message': 'Logged out successfully'}), 200

@auth_bp.route('/api/current-user', methods=['GET'])
def get_current_user():
    user = AuthService.get_current_user()
    if user:
        return jsonify({'user': user_to_dict(user)}), 200
    else:
        return jsonify({'user': None}), 200