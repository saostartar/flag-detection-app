import functools
from flask import jsonify
from flask_login import current_user
from core.exceptions import ForbiddenError

def admin_required(f):
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            raise ForbiddenError("Admin privileges required")
        return f(*args, **kwargs)
    return decorated_function