from flask import Blueprint, jsonify
from presentation.api.auth_routes import auth_bp
from presentation.api.admin_routes import admin_bp
from presentation.api.detection_routes import detection_bp
from core.exceptions import ApiError

def register_routes(app):
    """Register all route blueprints with the app"""
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(detection_bp)
    
    # Register error handlers
    @app.errorhandler(ApiError)
    def handle_api_error(error):
        response = jsonify({'error': str(error)})
        response.status_code = error.status_code
        return response
        
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Resource not found'}), 404
        
    @app.errorhandler(500)
    def server_error(error):
        return jsonify({'error': 'An unexpected server error occurred'}), 500