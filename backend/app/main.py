"""
UPSWING - Main FastAPI Application
Student Academic Performance Detection & Early Warning System
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.config import settings
from app.database import init_db, Base, engine
from app.api.routes import auth_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.students import router as students_router

# Import all models to ensure they're registered with Base
from app.models import (
    User,
    Student,
    Subject,
    Attendance,
    Assessment,
    Assignment,
    AcademicHistory,
    RiskScore,
    RiskFactor,
    Intervention,
    Notification,
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    logger.info("🚀 Starting UPSWING Backend...")
    logger.info(f"📊 Database: {settings.DATABASE_URL}")
    
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully")
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("👋 Shutting down EDUVISION AI Backend...")


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered Student Academic Performance Detection & Early Warning System",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(dashboard_router, prefix=settings.API_V1_STR)
app.include_router(students_router, prefix=settings.API_V1_STR)

# Health check
@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "database": "connected",
    }

# Root endpoint
@app.get("/")
def root():
    """Root endpoint with API information."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "tagline": "Detect Early. Understand Why. Take Action. Improve Outcomes.",
        "api_base": settings.API_V1_STR,
        "docs": "/docs",
        "health": "/health",
    }
