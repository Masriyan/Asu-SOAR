from sqlalchemy import Column, Integer, String, JSON, Boolean, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class Playbook(Base):
    __tablename__ = "playbooks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    active = Column(Boolean, default=True)
    
    # Store the ReactFlow JSON nodes and edges
    graph_data = Column(JSON, nullable=False, default={})
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    severity = Column(String, default="Low")
    status = Column(String, default="In-Progress")
    
    # The Context Data JSON Blob (used by DAG runner to store outputs)
    context_data = Column(JSON, nullable=False, default={})
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
