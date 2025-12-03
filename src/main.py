from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from src.config.settings import settings
from src.api import api_router
import logging

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("MemoRoo Backend starting up...")
    # Initialize AI models here, load vector store, etc.
    logger.info("MemoRoo Backend started.")
    yield
    logger.info("MemoRoo Backend shutting down...")
    # Clean up resources, save state if necessary
    logger.info("MemoRoo Backend shut down.")

app = FastAPI(
    title="MemoRoo Backend API",
    version="0.1.0",
    description="Backend API for MemoRoo - Your AI Memory Layer",
    docs_url="/docs" if settings.ENVIRONMENT == "development" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT == "development" else None,
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Restrict origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/health")
async def health_check():
    return {"status": "ok", "environment": settings.ENVIRONMENT}
