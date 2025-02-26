from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from backend.database import Base
import uuid

class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid_id = Column(UUID(as_uuid=True), nullable=False)
    pet_id = Column(Integer, nullable=False)
    trainer_id = Column(Integer, nullable=False)
    schedule = Column(TIMESTAMP(timezone=False), nullable=False)
    status = Column(String, nullable=False, default="pending")
    address = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    created_at = Column(
        TIMESTAMP(timezone=False),
        server_default=func.now(),
        nullable=False
    )