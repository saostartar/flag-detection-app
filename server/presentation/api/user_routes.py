from flask import Blueprint, request, jsonify, session
from flask_login import login_required, current_user
from domain.services.auth_service import AuthService
from domain.services.detection_service import DetectionService
from presentation.schemas.detection_schema import detection_log_to_dict
from core.exceptions import ApiError, ValidationError

user_bp = Blueprint('user', __name__)
auth_service = AuthService()
detection_service = DetectionService()

@user_bp.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate input
        if not data or not all(key in data for key in ['username', 'email', 'password']):
            return jsonify({'error': 'Missing required fields'}), 400
            
        success, message = auth_service.register_user(
            username=data['username'],
            email=data['email'],
            password=data['password']
        )
        
        if success:
            return jsonify({'message': message}), 201
        else:
            return jsonify({'error': message}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Validate input
        if not data or not all(key in data for key in ['username', 'password']):
            return jsonify({'error': 'Missing required fields'}), 400
            
        success, user = auth_service.login(
            username=data['username'],
            password=data['password']
        )
        
        if success:
            return jsonify({
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_admin': user.is_admin
                }
            }), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/api/logout', methods=['POST'])
def logout():
    auth_service.logout()
    return jsonify({'message': 'Logout successful'}), 200

@user_bp.route('/api/current-user', methods=['GET'])
def get_current_user():
    if current_user.is_authenticated:
        return jsonify({
            'user': {
                'id': current_user.id,
                'username': current_user.username,
                'email': current_user.email,
                'is_admin': current_user.is_admin
            }
        }), 200
    else:
        return jsonify({'user': None}), 200

@user_bp.route('/api/user/detection-logs', methods=['GET'])
@login_required
def get_user_logs():
    try:
        # Get page parameter, default to 1
        page = request.args.get('page', 1, type=int)
        
        # Get logs for the current user
        result = detection_service.get_user_detection_logs(current_user.id, page)
        
        # Convert logs to dictionaries
        logs_dict = [detection_log_to_dict(log) for log in result['logs']]
        
        return jsonify({
            'logs': logs_dict,
            'total': result['total'],
            'pages': result['pages'],
            'current_page': result['current_page']
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500