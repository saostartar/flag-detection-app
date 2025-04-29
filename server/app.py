from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager
from flask_migrate import Migrate
from infrastructure.database import db
from domain.models.user import User
from presentation.api.detection_routes import detection_bp
from presentation.api.admin_routes import admin_bp
from presentation.api.user_routes import user_bp
from config import config_by_name
import os

def create_app(config_name='development'):
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])
    
    # Initialize CORS
    CORS(app, supports_credentials=True)
    
    # Initialize database
    db.init_app(app)
    
    # Initialize Flask-Migrate
    migrate = Migrate(app, db)
    
    # Initialize Flask-Login
    login_manager = LoginManager()
    login_manager.init_app(app)
    
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    # Register blueprints
    app.register_blueprint(detection_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(user_bp)
    
    @app.route('/health')
    def health_check():
        return {'status': 'ok'}
    
    return app

if __name__ == '__main__':
    env = os.getenv('FLASK_ENV', 'development')
    app = create_app(env)
    
    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()
    
    app.run(debug=True)