from flask import Blueprint, request, jsonify
from flask_login import current_user
from domain.services.detection_service import DetectionService
from domain.services.admin_service import AdminService
from core.exceptions import ApiError, ValidationError

detection_bp = Blueprint('detection', __name__)
detection_service = DetectionService()

@detection_bp.route('/api/detect', methods=['POST'])
def detect_flag():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
            
        image_file = request.files['image']
        
        # Get user ID if logged in
        user_id = current_user.id if current_user.is_authenticated else None
        
        result = detection_service.detect_flag(
            image_file=image_file,
            ip_address=request.remote_addr,
            user_agent=request.headers.get('User-Agent', ''),
            user_id=user_id
        )
        
        return jsonify(result), 200
        
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400
    except ApiError as e:
        return jsonify({'error': str(e)}), e.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@detection_bp.route('/api/setup-admin', methods=['POST'])
def setup_admin():
    # Existing code...
    pass