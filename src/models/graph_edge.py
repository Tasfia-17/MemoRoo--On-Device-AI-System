from sqlalchemy import Column, String, DateTime, ForeignKey, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from src.database.base import Base

class GraphEdge(Base):
    __tablename__ = "graph_edges"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    source_node_id = Column(UUID(as_uuid=True), ForeignKey("graph_nodes.id"), nullable=False)
    target_node_id = Column(UUID(as_uuid=True), ForeignKey("graph_nodes.id"), nullable=False)
    type = Column(String, nullable=False) # e.g., "Informs", "Constraints", "Derives Insight"
    strength = Column(Float, nullable=True) # 0-1 confidence/strength
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    user = relationship("User", backref="graph_edges")
    source_node = relationship("GraphNode", foreign_keys=[source_node_id], backref="outgoing_edges")
    target_node = relationship("GraphNode", foreign_keys=[target_node_id], backref="incoming_edges")

    def __repr__(self):
        return f"<GraphEdge(id=\\\\'{self.id}\\' source=\\\\'{self.source_node_id}\\' target=\\\\'{self.target_node_id}\\' type=\\\\'{self.type}\\' )>"
