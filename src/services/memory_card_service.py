from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from uuid import UUID
from typing import List, Dict, Any

from src.models.memory_card import MemoryCard
from src.schemas.memory_card import MemoryCardCreate, MemoryCardUpdate, MemoryCardCanvasPositionUpdate
from src.core.exceptions import MemoryCardNotFoundException, UnauthorizedAccessException

class MemoryCardService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_memory_card_by_id(self, user_id: UUID, memory_card_id: UUID) -> MemoryCard:
        result = await self.db.execute(
            select(MemoryCard).filter(MemoryCard.id == memory_card_id, MemoryCard.user_id == user_id)
        )
        memory_card = result.scalar_one_or_none()
        if not memory_card:
            raise MemoryCardNotFoundException()
        return memory_card

    async def get_all_memory_cards(self, user_id: UUID) -> List[MemoryCard]:
        result = await self.db.execute(select(MemoryCard).filter(MemoryCard.user_id == user_id))
        return result.scalars().all()

    async def create_memory_card(self, user_id: UUID, card_data: MemoryCardCreate) -> MemoryCard:
        new_card = MemoryCard(**card_data.model_dump(), user_id=user_id)
        self.db.add(new_card)
        await self.db.commit()
        await self.db.refresh(new_card)
        return new_card

    async def update_memory_card(self, user_id: UUID, memory_card_id: UUID, card_data: MemoryCardUpdate) -> MemoryCard:
        memory_card = await self.get_memory_card_by_id(user_id, memory_card_id)
        
        update_data = card_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(memory_card, key, value)

        await self.db.commit()
        await self.db.refresh(memory_card)
        return memory_card
    
    async def update_memory_card_canvas_position(self, user_id: UUID, memory_card_id: UUID, position_data: MemoryCardCanvasPositionUpdate) -> MemoryCard:
        memory_card = await self.get_memory_card_by_id(user_id, memory_card_id)
        
        memory_card.canvas_position_x = position_data.x
        memory_card.canvas_position_y = position_data.y

        await self.db.commit()
        await self.db.refresh(memory_card)
        return memory_card

    async def delete_memory_card(self, user_id: UUID, memory_card_id: UUID):
        memory_card = await self.get_memory_card_by_id(user_id, memory_card_id)
        await self.db.delete(memory_card)
        await self.db.commit()
