from typing import Annotated, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, status, Query

from src.schemas.life_os import (
    MoodLogCreate, MoodLogResponse,
    TimelineEventCreate, TimelineEventResponse,
    WikiEntryCreate, WikiEntryUpdate, WikiEntryResponse,
    HabitCreate, HabitUpdate, HabitResponse
)
from src.services.life_os_service import LifeOsService
from src.api.deps import CurrentUser

router = APIRouter()

# --- Mood Logs ---
@router.post("/mood-logs", response_model=MoodLogResponse, status_code=status.HTTP_201_CREATED)
async def create_mood_log(
    log_data: MoodLogCreate,
    current_user_id: CurrentUser,
    life_os_service: Annotated[LifeOsService, Depends()]
):
    return await life_os_service.create_mood_log(UUID(current_user_id), log_data)

@router.get("/mood-logs", response_model=List[MoodLogResponse])
async def get_all_mood_logs(
    current_user_id: CurrentUser,
    life_os_service: Annotated[LifeOsService, Depends()]
):
    return await life_os_service.get_all_mood_logs(UUID(current_user_id))

@router.delete("/mood-logs/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_mood_log(
    log_id: UUID,
    current_user_id: CurrentUser,
    life_os_service: Annotated[LifeOsService, Depends()]
):
    await life_os_service.delete_mood_log(UUID(current_user_id), log_id)
    return None

# --- Timeline Events ---
@router.post("/timeline-events", response_model=TimelineEventResponse, status_code=status.HTTP_201_CREATED)
async def create_timeline_event(
    event_data: TimelineEventCreate,
    current_user_id: CurrentUser,
    life_os_service: Annotated[LifeOsService, Depends()]
):
    return await life_os_service.create_timeline_event(UUID(current_user_id), event_data)

@router.get("/timeline-events", response_model=List[TimelineEventResponse])
async def get_all_timeline_events(
    current_user_id: CurrentUser,
    life_os_service: Annotated[LifeOsService, Depends()]
):
    return await life_os_service.get_all_timeline_events(UUID(current_user_id))

@router.delete("/timeline-events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_timeline_event(
    event_id: UUID,
    current_user_id: CurrentUser,
    life_os_service: Annotated[LifeOsService, Depends()]
):
    await life_os_service.delete_timeline_event(UUID(current_user_id), event_id)
    return None

# --- Wiki Entries ---
@router.post("/wiki-entries", response_model=WikiEntryResponse, status_code=status.HTTP_201_CREATED)
async def create_wiki_entry(
    entry_data: WikiEntryCreate,
    current_user_id: CurrentUser,
    life_os_service: Annotated[LifeOsService, Depends()]
):
    return await life_os_service.create_wiki_entry(UUID(current_user_id), entry_data)

@router.get("/wiki-entries", response_model=List[WikiEntryResponse])
async def get_all_wiki_entries(
    current_user_id: CurrentUser,
    life_os_service: Annotated[LifeOsService, Depends()]
):
    return await life_os_service.get_all_wiki_entries(UUID(current_user_id))

@router.get("/wiki-entries/{entry_id}", response_model=WikiEntryResponse)
async def get_wiki_entry_by_id(
    entry_id: UUID,
    current_user_id: CurrentUser,
    life_os_service: Annotated[LifeOsService, Depends()]
):
    return await life_os_service.get_wiki_entry_by_id(UUID(current_user_id), entry_id)

@router.put("/wiki-entries/{entry_id}", response_model=WikiEntryResponse)
async def update_wiki_entry(
    entry_id: UUID,
    entry_data: WikiEntryUpdate,
    current_user_id: CurrentUser,
    life_os_service: Annotated[LifeOsService, Depends()]
):
    return await life_os_service.update_wiki_entry(UUID(current_user_id), entry_id, entry_data)

@router.delete("/wiki-entries/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_wiki_entry(
    entry_id: UUID,
    current_user_id: CurrentUser,
    life_os_service: Annotated[LifeOsService, Depends()]
):
    await life_os_service.delete_wiki_entry(UUID(current_user_id), entry_id)
    return None

# --- Habits ---
@router.post("/habits", response_model=HabitResponse, status_code=status.HTTP_201_CREATED)
async def create_habit(
    habit_data: HabitCreate,
    current_user_id: CurrentUser,
    life_os_service: Annotated[LifeOsService, Depends()]
):
    return await life_os_service.create_habit(UUID(current_user_id), habit_data)

@router.get("/habits", response_model=List[HabitResponse])
async def get_all_habits(
    current_user_id: CurrentUser,
    life_os_service: Annotated[LifeOsService, Depends()]
):
    return await life_os_service.get_all_habits(UUID(current_user_id))

@router.get("/habits/{habit_id}", response_model=HabitResponse)
async def get_habit_by_id(
    habit_id: UUID,
    current_user_id: CurrentUser,
    life_os_service: Annotated[LifeOsService, Depends()]
):
    return await life_os_service.get_habit_by_id(UUID(current_user_id), habit_id)

@router.put("/habits/{habit_id}", response_model=HabitResponse)
async def update_habit(
    habit_id: UUID,
    habit_data: HabitUpdate,
    current_user_id: CurrentUser,
    life_os_service: Annotated[LifeOsService, Depends()]
):
    return await life_os_service.update_habit(UUID(current_user_id), habit_id, habit_data)

@router.patch("/habits/{habit_id}/complete", response_model=HabitResponse)
async def complete_habit_step(
    habit_id: UUID,
    current_user_id: CurrentUser,
    life_os_service: Annotated[LifeOsService, Depends()]
):
    return await life_os_service.complete_habit_step(UUID(current_user_id), habit_id)

@router.delete("/habits/{habit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_habit(
    habit_id: UUID,
    current_user_id: CurrentUser,
    life_os_service: Annotated[LifeOsService, Depends()]
):
    await life_os_service.delete_habit(UUID(current_user_id), habit_id)
    return None
