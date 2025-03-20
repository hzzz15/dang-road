from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import date

class PetCreate(BaseModel):
    name: str
    breed: str
    size: Optional[str] = None
    weight: float
    gender: str
    notes: Optional[str] = None
    pet_mbti: Optional[str] = None
    is_neutered: bool
    image_url: Optional[str] = None
    birth_date: Optional[date] = None

class PetResponse(PetCreate):
    id: int  

    class Config:
        from_attributes = True  

    @classmethod
    def from_orm(cls, obj):
        """✅ SQLAlchemy 모델을 Pydantic 응답 모델로 변환하는 메서드"""
        return cls(
            id=obj.id,
            uuid_id=str(obj.uuid_id),  
            name=obj.name,
            breed=obj.breed,
            size=obj.size,
            weight=obj.weight,
            gender=obj.gender,
            notes=obj.notes,
            pet_mbti=obj.pet_mbti,
            is_neutered=obj.is_neutered,
            image_url=obj.image_url,
            birth_date=obj.birth_date
        )
