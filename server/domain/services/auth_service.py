from domain.models.user import User
from infrastructure.database import db
from werkzeug.security import generate_password_hash
from flask_login import login_user, logout_user
from datetime import datetime

class AuthService:
    def register_user(self, username, email, password):
        """
        Register a new user
        """
        # Check if user already exists
        if User.query.filter_by(username=username).first():
            return False, "Username already exists"
        
        if User.query.filter_by(email=email).first():
            return False, "Email already exists"
        
        # Create new user
        user = User(
            username=username,
            email=email,
            is_admin=False
        )
        user.set_password(password)
        
        # Save to database
        db.session.add(user)
        db.session.commit()
        
        return True, "Registration successful"
    
    def login(self, username, password):
        """
        Authenticate and login a user
        """
        user = User.query.filter_by(username=username).first()
        
        if user and user.check_password(password):
            # Update last login time
            user.last_login = datetime.utcnow()
            db.session.commit()
            
            # Login the user
            login_user(user)
            return True, user
        
        return False, None
    
    def logout(self):
        """
        Logout the current user
        """
        logout_user()
        return True