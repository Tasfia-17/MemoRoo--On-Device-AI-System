from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from uuid import UUID
from enum import Enum as PyEnum

class MemoryCardType(str, PyEnum):
    note = "note"
    link = "link"
    file = "file"
    voice = "voice"
    image = "image"

class MemoryCardBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    content: Optional[str] = None
    type: MemoryCardType
    url: Optional[str] = None
    tags: List[str] = []
    metadata: dict = {}

class MemoryCardCreate(MemoryCardBase):
    pass

class MemoryCardUpdate(MemoryCardBase):
    title: Optional[str] = None
    type: Optional[MemoryCardType] = None

class MemoryCardResponse(MemoryCardBase):
    id: UUID
    user_id: UUID
    attachment_id: Optional[UUID] = None
    embedding_id: Optional[UUID] = None
    canvas_position_x: Optional[float] = None
    canvas_position_y: Optional[float] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class MemoryCardCanvasPositionUpdate(BaseModel):
    x: float
    y: float
