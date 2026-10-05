"""
Structured logging with request IDs for traceability.
"""
import logging
import sys
import uuid
from contextvars import ContextVar
from typing import Optional
from pythonjsonlogger import jsonlogger
from app.core.config import settings


# Context variable to store request ID across async calls
request_id_var: ContextVar[Optional[str]] = ContextVar("request_id", default=None)


class RequestIDFilter(logging.Filter):
    """Add request ID to log records."""
    
    def filter(self, record):
        record.request_id = request_id_var.get() or "no-request-id"
        return True


def setup_logging():
    """Configure structured JSON logging for the application."""
    
    # Create logger
    logger = logging.getLogger()
    logger.setLevel(getattr(logging, settings.LOG_LEVEL.upper()))
    
    # Remove existing handlers
    logger.handlers = []
    
    # Create console handler
    handler = logging.StreamHandler(sys.stdout)
    
    # Use JSON formatter
    formatter = jsonlogger.JsonFormatter(
        "%(asctime)s %(levelname)s %(name)s %(request_id)s %(message)s",
        rename_fields={"levelname": "level", "asctime": "timestamp", "name": "logger"}
    )
    
    handler.setFormatter(formatter)
    handler.addFilter(RequestIDFilter())
    
    logger.addHandler(handler)
    
    return logger


def get_request_id() -> str:
    """Get current request ID or generate a new one."""
    req_id = request_id_var.get()
    if not req_id:
        req_id = str(uuid.uuid4())
        request_id_var.set(req_id)
    return req_id


def set_request_id(req_id: str):
    """Set the request ID for the current context."""
    request_id_var.set(req_id)


# Initialize logger
logger = setup_logging()
