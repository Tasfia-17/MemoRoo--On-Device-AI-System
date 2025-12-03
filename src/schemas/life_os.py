from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from uuid import UUID
from enum import Enum as PyEnum

# MoodLog Schemas
class MoodLogCreate(BaseModel):
    mood_label: str = Field(..., min_length=1, max_length=50)
    score: Optional[int] = Field(None, ge=0, le=100)
    note: Optional[str] = None

class MoodLogResponse(MoodLogCreate):
    id: UUID
    user_id: UUID
    timestamp: datetime
    created_at: datetime

    class Config:
        from_attributes = True

# TimelineEvent Schemas
class TimelineEventType(str, PyEnum):
    voice = "voice"
    photo = "photo"
    text = "text"
    event = "event"
    habit_completion = "habit_completion"

class TimelineEventBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    type: TimelineEventType
    mood_context: Optional[str] = None
    metadata: dict = {}

class TimelineEventCreate(TimelineEventBase):
    memory_card_id: Optional[UUID] = None

class TimelineEventResponse(TimelineEventBase):
    id: UUID
    user_id: UUID
    timestamp: datetime
    memory_card_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# WikiEntry Schemas
class WikiEntryBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    type: Optional[str] = None # e.g., "Project", "Event", "Knowledge"
    summary: str = Field(..., min_length=1)
    content: Optional[str] = None # Full content, if different from summary
    tags: List[str] = []

class WikiEntryCreate(WikiEntryBase):
    embedding_id: Optional[UUID] = None

class WikiEntryUpdate(WikiEntryBase):
    title: Optional[str] = None
    type: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = None

class WikiEntryResponse(WikiEntryBase):
    id: UUID
    user_id: UUID
    embedding_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Habit Schemas
class HabitBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    target_value: Optional[float] = None
    current_value: float = 0.0
    unit: Optional[str] = None
    frequency: str = "daily"

class HabitCreate(HabitBase):
    pass

class HabitUpdate(HabitBase):
    name: Optional[str] = None
    current_value: Optional[float] = None
    streak_count: Optional[int] = None
    last_completed: Optional[datetime] = None

class HabitResponse(HabitBase):
    id: UUID
    user_id: UUID
    streak_count: int
    last_completed: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
