from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from uuid import UUID
from enum import Enum as PyEnum

class ChatMessageRole(str, PyEnum):
    user = "user"
    ai = "ai"

class ChatMessageBase(BaseModel):
    role: ChatMessageRole
    content: str
    related_memory_ids: List[UUID] = []
    action: Optional[str] = None # e.g., "memory_created", "memory_updated"
    mood_context: Optional[str] = None # e.g., "Stressed", "Curious"

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessageResponse(ChatMessageBase):
    id: UUID
    conversation_id: UUID
    timestamp: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ConversationBase(BaseModel):
    title: Optional[str] = None

class ConversationCreate(ConversationBase):
    pass

class ConversationResponse(ConversationBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    messages: List[ChatMessageResponse] = []

    class Config:
        from_attributes = True
