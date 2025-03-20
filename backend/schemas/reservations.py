from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
import uuid

class ReservationCreate(BaseModel):
    uuid_id: uuid.UUID  
    pet_id: int
    trainer_id: int
    schedule: datetime
    status: str = "pending"
    
class ReservationResponse(BaseModel):
    id: int
    uuid_id: str
    pet_id: int
    trainer_id: int
    schedule: datetime
    status: str
    address: str
    latitude: float
    longitude: float

    class Config:
        orm_mode = True