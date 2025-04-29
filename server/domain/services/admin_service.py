from datetime import datetime, timedelta
from domain.models.user import User
from domain.models.detection_log import DetectionLog
from infrastructure.database import db
from core.exceptions import ValidationError

class AdminService:
    @staticmethod
    def get_dashboard_data():
        # Get basic stats for admin dashboard
        total_users = User.query.count()
        total_detections = DetectionLog.query.count()
        
        # Get detections from the last 7 days
        week_ago = datetime.utcnow() - timedelta(days=7)
        recent_detections = DetectionLog.query.filter(
            DetectionLog.timestamp >= week_ago
        ).order_by(DetectionLog.timestamp.desc()).limit(10).all()
        
        return {
            'total_users': total_users,
            'total_detections': total_detections,
            'recent_detections': recent_detections
        }
        
    @staticmethod
    def get_detection_logs(page=1, per_page=20):
        return DetectionLog.query.order_by(
            DetectionLog.timestamp.desc()
        ).paginate(page=page, per_page=per_page)
        
    @staticmethod
    def get_all_users():
        return User.query.all()
        
    @staticmethod
    def create_user(username, email, password, is_admin=False):
        # Validate data
        if not all([username, email, password]):
            raise ValidationError("Username, email, and password are required")
            
        # Check if user already exists
        if User.query.filter_by(username=username).first():
            raise ValidationError("Username already exists")
        
        if User.query.filter_by(email=email).first():
            raise ValidationError("Email already exists")
        
        # Create new user
        user = User(username=username, email=email, is_admin=is_admin)
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        return user
        
    @staticmethod
    def setup_admin(username, email, password):
        # Check if there are any users first - this should only be used once
        if User.query.count() > 0:
            raise ValidationError("Admin already set up")
            
        admin = User(username=username, email=email, is_admin=True)
        admin.set_password(password)
        
        db.session.add(admin)
        db.session.commit()
        
        return admin