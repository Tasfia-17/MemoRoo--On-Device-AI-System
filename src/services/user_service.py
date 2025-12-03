from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID

from src.models.user import User
from src.schemas.user import UserCreate
from src.core.exceptions import UserNotFoundException, DuplicateUserException
from src.core.security import get_password_hash

class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_by_id(self, user_id: UUID) -> User:
        result = await self.db.execute(select(User).filter(User.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            raise UserNotFoundException()
        return user

    async def get_user_by_email(self, email: str) -> User | None:
        result = await self.db.execute(select(User).filter(User.email == email))
        return result.scalar_one_or_none()

    async def get_user_by_username(self, username: str) -> User | None:
        result = await self.db.execute(select(User).filter(User.username == username))
        return result.scalar_one_or_none()

    async def create_user(self, user_data: UserCreate) -> User:
        if await self.get_user_by_email(user_data.email):
            raise DuplicateUserException(detail="Email already registered")
        if await self.get_user_by_username(user_data.username):
            raise DuplicateUserException(detail="Username already registered")
        
        hashed_password = get_password_hash(user_data.password)
        new_user = User(
            username=user_data.username,
            email=user_data.email,
            password_hash=hashed_password
        )
        self.db.add(new_user)
        await self.db.commit()
        await self.db.refresh(new_user)
        return new_user
