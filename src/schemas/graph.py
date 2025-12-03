from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from uuid import UUID
from enum import Enum as PyEnum

class GraphNodeType(str, PyEnum):
    source = "source"
    chunk = "chunk"
    inferred = "inferred"
    root = "root"
    memory_card = "memory-card"
    insight = "insight"
    pain_point = "pain-point"
    solution = "solution"

class GraphNodeBase(BaseModel):
    label: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    type: GraphNodeType
    tags: List[str] = []
    metadata: dict = {}
    position_3d_x: Optional[float] = None
    position_3d_y: Optional[float] = None
    position_3d_z: Optional[float] = None

class GraphNodeCreate(GraphNodeBase):
    memory_card_id: Optional[UUID] = None
    embedding_id: Optional[UUID] = None

class GraphNodeUpdate(GraphNodeBase):
    label: Optional[str] = None
    type: Optional[GraphNodeType] = None

class GraphNodeResponse(GraphNodeBase):
    id: UUID
    user_id: UUID
    memory_card_id: Optional[UUID] = None
    embedding_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class GraphEdgeCreate(BaseModel):
    source_node_id: UUID
    target_node_id: UUID
    type: str = Field(..., description="e.g., Informs, Constraints, Derives Insight")
    strength: Optional[float] = Field(None, ge=0.0, le=1.0)

class GraphEdgeUpdate(BaseModel):
    type: Optional[str] = None
    strength: Optional[float] = Field(None, ge=0.0, le=1.0)

class GraphEdgeResponse(BaseModel):
    id: UUID
    user_id: UUID
    source_node_id: UUID
    target_node_id: UUID
    type: str
    strength: Optional[float] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
