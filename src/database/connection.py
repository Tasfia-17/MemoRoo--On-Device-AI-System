from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

from src.config.settings import settings

# Synchronous engine for Alembic migrations
sync_engine = create_engine(settings.DATABASE_URL, echo=True)

# Asynchronous engine for FastAPI application
async_engine = create_async_engine(settings.ASYNC_DATABASE_URL, echo=True)

AsyncSessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=async_engine, class_=AsyncSession)

# Dependency to get an async session
async def get_db_session():
    async with AsyncSessionLocal() as session:
        yield session
