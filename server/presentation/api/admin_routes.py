from flask import Blueprint, request, jsonify
from flask_login import login_required
from core.security import admin_required
from domain.services.admin_service import AdminService
from presentation.schemas.user_schema import user_to_dict
from presentation.schemas.detection_schema import detection_log_to_dict
from core.exceptions import ApiError, ValidationError

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/api/admin/dashboard', methods=['GET'])
@login_required
@admin_required
def admin_dashboard():
    try:
        data = AdminService.get_dashboard_data()
        
        # Format recent detections for response
        recent_data = [
            detection_log_to_dict(log) for log in data['recent_detections']
        ]
        
        return jsonify({
            'total_users': data['total_users'],
            'total_detections': data['total_detections'],
            'recent_detections': recent_data
        }), 200
        
    except ApiError as e:
        return jsonify({'error': str(e)}), e.status_code
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred'}), 500

@admin_bp.route('/api/admin/detection-logs', methods=['GET'])
@login_required
@admin_required
def get_detection_logs():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        logs = AdminService.get_detection_logs(page, per_page)
        
        log_data = [detection_log_to_dict(log) for log in logs.items]
        
        return jsonify({
            'logs': log_data,
            'total': logs.total,
            'pages': logs.pages,
            'current_page': logs.page
        }), 200
        
    except ApiError as e:
        return jsonify({'error': str(e)}), e.status_code
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred'}), 500

@admin_bp.route('/api/admin/users', methods=['GET'])
@login_required
@admin_required
def get_users():
    try:
        users = AdminService.get_all_users()
        user_data = [user_to_dict(user) for user in users]
        
        return jsonify({'users': user_data}), 200
        
    except ApiError as e:
        return jsonify({'error': str(e)}), e.status_code
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred'}), 500

@admin_bp.route('/api/admin/create-user', methods=['POST'])
@login_required
@admin_required
def create_user():
    try:
        data = request.get_json()
        
        user = AdminService.create_user(
            username=data.get('username'),
            email=data.get('email'),
            password=data.get('password'),
            is_admin=data.get('is_admin', False)
        )
        
        return jsonify({
            'message': 'User created successfully',
            'user': user_to_dict(user)
        }), 201
        
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400
    except ApiError as e:
        return jsonify({'error': str(e)}), e.status_code
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred'}), 500