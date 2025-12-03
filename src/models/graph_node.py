from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Enum, Float
from sqlalchemy.dialects.postgresql import UUID, ARRAY, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from src.database.base import Base

class GraphNode(Base):
    __tablename__ = "graph_nodes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    label = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    type = Column(Enum("source", "chunk", "inferred", "root", "memory-card", "insight", "pain-point", "solution", name="graph_node_type"), nullable=False)
    memory_card_id = Column(UUID(as_uuid=True), ForeignKey("memory_cards.id"), nullable=True)
    embedding_id = Column(UUID(as_uuid=True), ForeignKey("embeddings.id"), nullable=True)
    tags = Column(ARRAY(String), default=[]))
    metadata = Column(JSONB, default={})
    position_3d_x = Column(Float, nullable=True)
    position_3d_y = Column(Float, nullable=True)
    position_3d_z = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    user = relationship("User", backref="graph_nodes")
    memory_card = relationship("MemoryCard", backref="graph_node_representation")
    embedding = relationship("Embedding", backref="graph_node_source")

    def __repr__(self):
        return f"<GraphNode(id=\\\'{self.id}\\' label=\\\'{self.label}\\' type=\\\'{self.type}\\' )>"
