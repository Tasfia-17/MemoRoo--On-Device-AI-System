from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, SecretStr
import os

class Settings(BaseSettings):
    # Database settings
    DATABASE_URL: str = Field(..., env="DATABASE_URL")
    ASYNC_DATABASE_URL: str = Field(..., env="ASYNC_DATABASE_URL")

    # Security settings
    SECRET_KEY: SecretStr = Field(..., env="SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # File storage settings
    MEDIA_PATH: str = Field("data/users", env="MEDIA_PATH") # Relative to project root
    GLOBAL_MODELS_PATH: str = Field("data/global_models", env="GLOBAL_MODELS_PATH")

    # AI Model paths (relative to GLOBAL_MODELS_PATH or absolute)
    LLM_MODEL_PATH: str = Field("llm/llm_quantized_int8.torch", env="LLM_MODEL_PATH")
    OCR_MODEL_PATH: str = Field("ocr/ocr_tflite_model.tflite", env="OCR_MODEL_PATH")
    WHISPER_MODEL_PATH: str = Field("whisper/whisper_tiny_int8.tflite", env="WHISPER_MODEL_PATH")
    EMBEDDING_MODEL_PATH: str = Field("embeddings/embedding_model.tflite", env="EMBEDDING_MODEL_PATH")

    # Sentry DSN for error tracking (optional)
    SENTRY_DSN: str | None = Field(None, env="SENTRY_DSN")

    # Environment (e.g., "development", "production")
    ENVIRONMENT: str = Field("development", env="ENVIRONMENT")

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
