from flask import Blueprint, request, jsonify
from flask_login import login_required
from domain.services.manual_calculation_service import ManualCalculationService
from domain.services.model_information_service import ModelInfoService
from core.exceptions import ApiError

manual_calculation_bp = Blueprint('manual_calculation', __name__)
manual_calc_service = ManualCalculationService()

@manual_calculation_bp.route('/api/admin/model-info', methods=['GET'])
@login_required
def get_model_info():
    """Get model metadata information"""
    try:
        model_info = ModelInfoService.get_model_metadata()
        return jsonify(model_info), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@manual_calculation_bp.route('/api/admin/model-metrics', methods=['GET'])
@login_required
def get_model_metrics():
    """Get detailed model training metrics"""
    try:
        metrics = ModelInfoService.get_training_metrics()
        return jsonify(metrics), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@manual_calculation_bp.route('/api/admin/manual-calculation', methods=['POST'])
@login_required
def calculate_manually():
    """Process an image and return manual calculation steps"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
            
        image_file = request.files['image']
        
        result = manual_calc_service.process_flag_image(image_file)
        
        return jsonify(result), 200
        
    except ApiError as e:
        return jsonify({'error': str(e)}), e.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500