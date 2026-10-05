"""
Custom exceptions for the application with consistent error handling.
"""
from typing import Any, Optional, Dict


class AppException(Exception):
    """Base exception for all application errors."""
    
    def __init__(
        self,
        message: str,
        status_code: int = 500,
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)


class AuthenticationError(AppException):
    """Raised when authentication fails."""
    
    def __init__(self, message: str = "Authentication failed", details: Optional[Dict] = None):
        super().__init__(message, status_code=401, details=details)


class AuthorizationError(AppException):
    """Raised when user lacks permission for an action."""
    
    def __init__(self, message: str = "Insufficient permissions", details: Optional[Dict] = None):
        super().__init__(message, status_code=403, details=details)


class NotFoundError(AppException):
    """Raised when a requested resource is not found."""
    
    def __init__(self, resource: str, identifier: Any):
        message = f"{resource} with id '{identifier}' not found"
        super().__init__(message, status_code=404, details={"resource": resource, "id": identifier})


class ValidationError(AppException):
    """Raised when data validation fails."""
    
    def __init__(self, message: str, errors: Optional[Dict] = None):
        super().__init__(message, status_code=422, details={"validation_errors": errors or {}})


class ConflictError(AppException):
    """Raised when there's a data conflict (e.g., duplicate unique field)."""
    
    def __init__(self, message: str, details: Optional[Dict] = None):
        super().__init__(message, status_code=409, details=details)


class DataQualityError(AppException):
    """Raised when data quality checks fail."""
    
    def __init__(self, message: str, failed_rows: Optional[list] = None):
        super().__init__(
            message,
            status_code=422,
            details={"failed_rows": failed_rows or []}
        )


class MLModelError(AppException):
    """Raised when ML model operations fail."""
    
    def __init__(self, message: str, details: Optional[Dict] = None):
        super().__init__(message, status_code=500, details=details)


class InsufficientDataError(AppException):
    """Raised when there's not enough data for an operation."""
    
    def __init__(self, message: str = "Insufficient data for computation", details: Optional[Dict] = None):
        super().__init__(message, status_code=422, details=details)
