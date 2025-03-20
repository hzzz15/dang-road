from pydantic import BaseModel
from typing import Optional, List

# User
class UserBase(BaseModel):
    user_id: str
    name: str
    email: str
    phone_number: Optional[str] = None
    address: Optional[str] = None
    nickname: Optional[str] = None
    is_walker: bool = False

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    uuid_id: str 
    class Config:
        orm_mode = True

# Trainer
class TrainerBase(BaseModel):
    name: str
    address: Optional[str] = None
    introduction: Optional[str] = None
    experience: int = 0
    rating: float = 0
    is_verified: bool = False
    trainer_mbti: Optional[str] = None
    trainer_image_url: Optional[str] = None

class TrainerCreate(TrainerBase):
    pass

class TrainerResponse(TrainerBase):
    id: int
    uuid_id: str

    class Config:
        orm_mode = True

# Pet
class PetBase(BaseModel):
    name: str
    breed: Optional[str] = None
    size: Optional[str] = None
    weight: Optional[float] = None
    gender: Optional[str] = None
    notes: Optional[str] = None
    pet_mbti: Optional[str] = None
    is_neutered: bool = False
    image_url: Optional[str] = None
    birth_date: Optional[str] = None

class PetCreate(PetBase):
    pass

class PetResponse(PetBase):
    id: int
    uuid_id: Optional[str] = None
    name: Optional[str] = None
    pet_mbti: Optional[str] = None

    class Config:
        orm_mode = True

# MatchScore
class MatchScoreBase(BaseModel):
    pet_id: int
    trainer_id: int
    mbti_match_score: float
    activity_match_score: float
    total_match_score: float

class MatchScoreCreate(MatchScoreBase):
    pass

class MatchScoreResponse(MatchScoreBase):
    id: int

    class Config:
        orm_mode = True

# Match
class MatchBase(BaseModel):
    pet_id: int
    trainer_id: int
    schedule: Optional[str] = None 
    status: Optional[str] = None
    route: Optional[str] = None
    distance: Optional[float] = None
    walk_duration: Optional[str] = None
    steps: Optional[int] = None

class MatchCreate(MatchBase):
    pass

class MatchResponse(MatchBase):
    id: int
    uuid_id: str

    class Config:
        orm_mode = True

# 매칭 결과 반환용
class MatchResult(BaseModel):
    trainer_id: int
    trainer_mbti: str
    experience: int
    mbti_match_score: float
    activity_match_score: float
    total_match_score: float
    trainer_image_url: Optional[str] = None 
    name : str 
    recommendation: str 

class PetMatchResponse(BaseModel):
    pet: PetResponse
    matches: List[MatchResult]