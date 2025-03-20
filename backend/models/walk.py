from sqlalchemy import Column, String, ForeignKey, Integer, Float, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID 
from sqlalchemy.sql import func
from backend.database import Base

class WalkingRoute(Base):
    __tablename__ = "walking_routes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)  
    reservation_id = Column(Integer, nullable=False) 
    start_latitude = Column(Float, nullable=False)
    start_longitude = Column(Float, nullable=False)
    end_latitude = Column(Float, nullable=False)
    end_longitude = Column(Float, nullable=False)
    distance_km = Column(Float, nullable=True)
    estimated_steps = Column(Integer, nullable=True)
    estimated_time = Column(Integer, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    uuid_id = Column(UUID, nullable=False)
    feedback = Column(String, nullable=True)

class WalkReport(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)  
    walk_id = Column(Integer, nullable=False)  
    uuid_id = Column(UUID, nullable=False)
    trainer_id = Column(Integer, nullable=True) 
    feedback = Column(String, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    distance = Column(Float, ForeignKey("walking_routes.distance_km"), nullable=False)
    steps = Column(Integer, ForeignKey("walking_routes.estimated_steps"), nullable=False)
    time = Column(Integer, ForeignKey("walking_routes.estimated_time"), nullable=False)



