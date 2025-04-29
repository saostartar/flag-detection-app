import os
import sys
import argparse
from getpass import getpass
from flask import Flask

# Set up command line argument parsing
parser = argparse.ArgumentParser(description='Create an admin user for the Flag Detection App')
parser.add_argument('--username', '-u', help='Admin username')
parser.add_argument('--email', '-e', help='Admin email')
parser.add_argument('--password', '-p', help='Admin password (not recommended, use interactive prompt instead)', default=None)
parser.add_argument('--env', help='Environment to use (development, production)', default='development')

def create_admin(app, username, email, password):
    with app.app_context():
        from domain.services.admin_service import AdminService
        from core.exceptions import ValidationError
        
        try:
            # Create the admin user
            admin = AdminService.setup_admin(username, email, password)
            print(f"✅ Admin user created successfully!")
            print(f"Username: {admin.username}")
            print(f"Email: {admin.email}")
            return True
        except ValidationError as e:
            print(f"❌ Error: {str(e)}")
            return False
        except Exception as e:
            print(f"❌ Unexpected error: {str(e)}")
            return False

def main():
    args = parser.parse_args()
    
    # Create Flask app
    from app import create_app
    app = create_app(args.env)
    
    # Get username
    username = args.username
    while not username:
        username = input("Enter admin username: ")
        if not username:
            print("Username cannot be empty.")
    
    # Get email
    email = args.email
    while not email:
        email = input("Enter admin email: ")
        if not email:
            print("Email cannot be empty.")
    
    # Get password
    password = args.password
    if not password:
        while True:
            password = getpass("Enter admin password: ")
            if not password:
                print("Password cannot be empty.")
                continue
                
            confirm_password = getpass("Confirm password: ")
            if password != confirm_password:
                print("Passwords do not match. Please try again.")
            else:
                break
    
    # Create the admin user
    success = create_admin(app, username, email, password)
    
    # Exit with appropriate status code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()