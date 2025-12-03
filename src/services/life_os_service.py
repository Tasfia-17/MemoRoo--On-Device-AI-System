from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete, update
from uuid import UUID
from typing import List, Optional

from src.models.mood_log import MoodLog
from src.models.timeline_event import TimelineEvent
from src.models.wiki_entry import WikiEntry
from src.models.habit import Habit
from src.schemas.life_os import (
    MoodLogCreate, MoodLogResponse,
    TimelineEventCreate, TimelineEventResponse,
    WikiEntryCreate, WikiEntryUpdate, WikiEntryResponse,
    HabitCreate, HabitUpdate, HabitResponse
)
from src.core.exceptions import (
    UserNotFoundException, # Not used directly here, but good to know it exists
    UnauthorizedAccessException,
    MoodLogNotFoundException,
    TimelineEventNotFoundException,
    WikiEntryNotFoundException,
    HabitNotFoundException
)

class MoodLogNotFoundException(Exception):
    pass

class TimelineEventNotFoundException(Exception):
    pass

class WikiEntryNotFoundException(Exception):
    pass

class HabitNotFoundException(Exception):
    pass

class LifeOsService:
    def __init__(self, db: AsyncSession):
        self.db = db

    # --- Mood Logs ---
    async def get_mood_log_by_id(self, user_id: UUID, log_id: UUID) -> MoodLog:
        result = await self.db.execute(
            select(MoodLog).filter(MoodLog.id == log_id, MoodLog.user_id == user_id)
        )
        mood_log = result.scalar_one_or_none()
        if not mood_log:
            raise MoodLogNotFoundException(f"MoodLog with id {log_id} not found.")
        return mood_log

    async def get_all_mood_logs(self, user_id: UUID) -> List[MoodLog]:
        result = await self.db.execute(select(MoodLog).filter(MoodLog.user_id == user_id).order_by(MoodLog.timestamp.desc()))
        return result.scalars().all()

    async def create_mood_log(self, user_id: UUID, log_data: MoodLogCreate) -> MoodLog:
        new_log = MoodLog(**log_data.model_dump(), user_id=user_id)
        self.db.add(new_log)
        await self.db.commit()
        await self.db.refresh(new_log)
        return new_log

    async def delete_mood_log(self, user_id: UUID, log_id: UUID):
        mood_log = await self.get_mood_log_by_id(user_id, log_id)
        await self.db.delete(mood_log)
        await self.db.commit()

    # --- Timeline Events ---
    async def get_timeline_event_by_id(self, user_id: UUID, event_id: UUID) -> TimelineEvent:
        result = await self.db.execute(
            select(TimelineEvent).filter(TimelineEvent.id == event_id, TimelineEvent.user_id == user_id)
        )
        event = result.scalar_one_or_none()
        if not event:
            raise TimelineEventNotFoundException(f"TimelineEvent with id {event_id} not found.")
        return event

    async def get_all_timeline_events(self, user_id: UUID) -> List[TimelineEvent]:
        result = await self.db.execute(select(TimelineEvent).filter(TimelineEvent.user_id == user_id).order_by(TimelineEvent.timestamp.desc()))
        return result.scalars().all()

    async def create_timeline_event(self, user_id: UUID, event_data: TimelineEventCreate) -> TimelineEvent:
        new_event = TimelineEvent(**event_data.model_dump(), user_id=user_id)
        self.db.add(new_event)
        await self.db.commit()
        await self.db.refresh(new_event)
        return new_event
    
    async def delete_timeline_event(self, user_id: UUID, event_id: UUID):
        event = await self.get_timeline_event_by_id(user_id, event_id)
        await self.db.delete(event)
        await self.db.commit()

    # --- Wiki Entries ---
    async def get_wiki_entry_by_id(self, user_id: UUID, entry_id: UUID) -> WikiEntry:
        result = await self.db.execute(
            select(WikiEntry).filter(WikiEntry.id == entry_id, WikiEntry.user_id == user_id)
        )
        entry = result.scalar_one_or_none()
        if not entry:
            raise WikiEntryNotFoundException(f"WikiEntry with id {entry_id} not found.")
        return entry

    async def get_all_wiki_entries(self, user_id: UUID, search_query: Optional[str] = None) -> List[WikiEntry]:
        query = select(WikiEntry).filter(WikiEntry.user_id == user_id)
        if search_query:
            query = query.filter(WikiEntry.title.ilike(f"%{search_query}%") | WikiEntry.summary.ilike(f"%{search_query}%"))
        result = await self.db.execute(query.order_by(WikiEntry.created_at.desc()))
        return result.scalars().all()

    async def create_wiki_entry(self, user_id: UUID, entry_data: WikiEntryCreate) -> WikiEntry:
        new_entry = WikiEntry(**entry_data.model_dump(), user_id=user_id)
        self.db.add(new_entry)
        await self.db.commit()
        await self.db.refresh(new_entry)
        return new_entry

    async def update_wiki_entry(self, user_id: UUID, entry_id: UUID, entry_data: WikiEntryUpdate) -> WikiEntry:
        entry = await self.get_wiki_entry_by_id(user_id, entry_id)
        
        update_data = entry_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(entry, key, value)

        await self.db.commit()
        await self.db.refresh(entry)
        return entry

    async def delete_wiki_entry(self, user_id: UUID, entry_id: UUID):
        entry = await self.get_wiki_entry_by_id(user_id, entry_id)
        await self.db.delete(entry)
        await self.db.commit()

    # --- Habits ---
    async def get_habit_by_id(self, user_id: UUID, habit_id: UUID) -> Habit:
        result = await self.db.execute(
            select(Habit).filter(Habit.id == habit_id, Habit.user_id == user_id)
        )
        habit = result.scalar_one_or_none()
        if not habit:
            raise HabitNotFoundException(f"Habit with id {habit_id} not found.")
        return habit

    async def get_all_habits(self, user_id: UUID) -> List[Habit]:
        result = await self.db.execute(select(Habit).filter(Habit.user_id == user_id).order_by(Habit.created_at))
        return result.scalars().all()

    async def create_habit(self, user_id: UUID, habit_data: HabitCreate) -> Habit:
        new_habit = Habit(**habit_data.model_dump(), user_id=user_id)
        self.db.add(new_habit)
        await self.db.commit()
        await self.db.refresh(new_habit)
        return new_habit

    async def update_habit(self, user_id: UUID, habit_id: UUID, habit_data: HabitUpdate) -> Habit:
        habit = await self.get_habit_by_id(user_id, habit_id)
        
        update_data = habit_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(habit, key, value)

        await self.db.commit()
        await self.db.refresh(habit)
        return habit
    
    async def complete_habit_step(self, user_id: UUID, habit_id: UUID, value_increment: float = 1.0) -> Habit:
        habit = await self.get_habit_by_id(user_id, habit_id)
        habit.current_value += value_increment
        habit.streak_count += 1 # Simple increment for demo
        habit.last_completed = datetime.now()
        await self.db.commit()
        await self.db.refresh(habit)
        return habit

    async def delete_habit(self, user_id: UUID, habit_id: UUID):
        habit = await self.get_habit_by_id(user_id, habit_id)
        await self.db.delete(habit)
        await self.db.commit()
