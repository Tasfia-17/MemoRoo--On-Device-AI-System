from typing import Annotated

from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from src.schemas.auth import Token
from src.schemas.user import UserCreate, UserResponse
from src.database.connection import get_db
from src.services.user_service import UserService
from src.services.auth_service import AuthService
from src.core.exceptions import InvalidCredentialsException

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_data: UserCreate,
    user_service: Annotated[UserService, Depends(get_user_service)]
):
    return await user_service.create_user(user_data)

@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    auth_service = AuthService(db) # AuthService needs db directly for authentication
    user = await auth_service.authenticate_user(UserLogin(username=form_data.username, password=form_data.password))
    
    # Note: user.id is UUID, create_user_access_token expects str
    return await auth_service.create_user_access_token(user.id)
