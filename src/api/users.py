from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.schemas.user import UserResponse
from src.database.connection import get_db
from src.services.user_service import UserService
from src.api.deps import CurrentUser

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def read_current_user(
    current_user_id: CurrentUser,
    user_service: Annotated[UserService, Depends(get_user_service)]
):
    return await user_service.get_user_by_id(UUID(current_user_id))
