from typing import Generator, Annotated
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.connection import get_db_session
from src.core.security import get_current_user_id
from src.services.user_service import UserService
from src.services.auth_service import AuthService
from src.services.memory_card_service import MemoryCardService
from src.services.attachment_service import AttachmentService
from src.services.graph_service import GraphService
from src.services.chat_service import ChatService
from src.services.life_os_service import LifeOsService
from src.services.ai_pipeline_service import AiPipelineService

# Database session dependency
async def get_db() -> Generator[AsyncSession, None, None]:
    async for session in get_db_session():
        yield session

# Current user ID dependency
CurrentUser = Annotated[str, Depends(get_current_user_id)]

# Service dependencies
def get_user_service(db: Annotated[AsyncSession, Depends(get_db)]) -> UserService:
    return UserService(db)

def get_auth_service(db: Annotated[AsyncSession, Depends(get_db)]) -> AuthService:
    return AuthService(db)

def get_memory_card_service(db: Annotated[AsyncSession, Depends(get_db)]) -> MemoryCardService:
    return MemoryCardService(db)

def get_attachment_service(db: Annotated[AsyncSession, Depends(get_db)]) -> AttachmentService:
    return AttachmentService(db)

def get_graph_service(db: Annotated[AsyncSession, Depends(get_db)]) -> GraphService:
    return GraphService(db)

def get_chat_service(db: Annotated[AsyncSession, Depends(get_db)]) -> ChatService:
    return ChatService(db)

def get_life_os_service(db: Annotated[AsyncSession, Depends(get_db)]) -> LifeOsService:
    return LifeOsService(db)

def get_ai_pipeline_service(db: Annotated[AsyncSession, Depends(get_db)]) -> AiPipelineService:
    return AiPipelineService(db)
