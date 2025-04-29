import os
from domain.models.detection_log import DetectionLog
from infrastructure.database import db
from infrastructure.external.roboflow_client import RoboflowClient

class DetectionService:
    def __init__(self):
        self.roboflow_client = RoboflowClient()
    
    def detect_flag(self, image_file, ip_address="", user_agent="", user_id=None):
        temp_path = "temp_image.jpg"
        image_file.save(temp_path)
        
        try:
            # Send to Roboflow API
            result = self.roboflow_client.detect_flag(temp_path)
            
            # Log the detection
            if 'predictions' in result and len(result['predictions']) > 0:
                # Log only the highest confidence prediction
                prediction = max(result['predictions'], key=lambda x: x.get('confidence', 0))
                log = DetectionLog(
                    flag_detected=prediction.get('class', 'unknown'),
                    confidence=prediction.get('confidence', 0),
                    ip_address=ip_address,
                    user_agent=user_agent,
                    user_id=user_id
                )
                db.session.add(log)
                db.session.commit()
            
            # Remove temp file
            os.remove(temp_path)
            
            return result
        except Exception as e:
            if os.path.exists(temp_path):
                os.remove(temp_path)
            raise e
    
    def get_user_detection_logs(self, user_id, page=1, per_page=10):
        """
        Get detection logs for a specific user with pagination
        """
        # Calculate offset for pagination
        offset = (page - 1) * per_page
        
        # Get logs for the user
        logs = DetectionLog.query.filter_by(user_id=user_id) \
            .order_by(DetectionLog.timestamp.desc()) \
            .limit(per_page).offset(offset).all()
            
        # Get total count for pagination
        total = DetectionLog.query.filter_by(user_id=user_id).count()
        
        # Calculate total pages
        pages = (total + per_page - 1) // per_page  # Ceiling division
        
        return {
            'logs': logs,
            'total': total,
            'pages': pages,
            'current_page': page
        }