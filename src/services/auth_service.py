from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import timedelta
from uuid import UUID

from src.models.user import User
from src.schemas.auth import UserLogin, Token
from src.core.exceptions import InvalidCredentialsException
from src.core.security import verify_password, create_access_token
from src.config.settings import settings

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def authenticate_user(self, user_data: UserLogin) -> User:
        # Try to find user by username or email
        result = await self.db.execute(
            select(User).filter(
                (User.username == user_data.username) | 
                (User.email == user_data.username) # Allow login with email as well
            )
        )
        user = result.scalar_one_or_none()

        if not user or not verify_password(user_data.password, user.password_hash):
            raise InvalidCredentialsException()
        
        return user

    async def create_user_access_token(self, user_id: UUID) -> Token:
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"user_id": str(user_id)},
            expires_delta=access_token_expires
        )
        return Token(access_token=access_token, token_type="bearer")
