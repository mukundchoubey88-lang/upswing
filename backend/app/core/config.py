"""
Application configuration loaded from environment variables.
"""
from typing import List
from pydantic import validator
from pydantic_settings import BaseSettings
import json


class Settings(BaseSettings):
    """Application settings loaded from environment variables via .env file."""

    # Application
    APP_NAME: str = "EDUVISION AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"

    # Database
    DATABASE_URL: str = "sqlite:///./eduvision.db"

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    # API
    API_V1_STR: str = "/api/v1"

    # ML Configuration
    ML_MODEL_PATH: str = "models/v1/model.joblib"
    RISK_CONFIG_PATH: str = "configs/risk_rules.yaml"
    RECOMMENDATIONS_CONFIG_PATH: str = "configs/recommendations.yaml"

    # Risk Scoring Weights (ML vs Rule-based blend)
    ML_WEIGHT: float = 0.65
    RULE_WEIGHT: float = 0.35

    # Risk Level Thresholds
    LOW_RISK_THRESHOLD: int = 40  # 0-39 = Low
    HIGH_RISK_THRESHOLD: int = 70  # 70-100 = High, 40-69 = Medium

    # Background Jobs
    ENABLE_SCHEDULER: bool = False
    SCORING_SCHEDULE_CRON: str = "0 2 * * 1"  # Every Monday at 2 AM

    # Logging
    LOG_LEVEL: str = "INFO"

    @validator("CORS_ORIGINS", pre=True)
    def parse_cors_origins(cls, v):
        """Parse CORS origins from JSON string if provided as string."""
        if isinstance(v, str):
            return json.loads(v)
        return v

    @validator("ML_WEIGHT", "RULE_WEIGHT")
    def validate_weights(cls, v, field):
        """Ensure weights are between 0 and 1."""
        if not 0 <= v <= 1:
            raise ValueError(f"{field.name} must be between 0 and 1")
        return v

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"
        case_sensitive = True


# Singleton instance
settings = Settings()
