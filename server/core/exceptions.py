class ApiError(Exception):
    """Base class for API exceptions"""
    status_code = 500
    
class ValidationError(ApiError):
    """Raised for validation errors"""
    status_code = 400
    
class AuthenticationError(ApiError):
    """Raised for authentication errors"""
    status_code = 401
    
class ForbiddenError(ApiError):
    """Raised for authorization errors"""
    status_code = 403
    
class NotFoundError(ApiError):
    """Raised when a resource is not found"""
    status_code = 404