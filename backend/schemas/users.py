from pydantic import BaseModel
from typing import Optional

class UserResponse(BaseModel):
    id: int
    name: str
    email: Optional[str] = None  
    phone_number: Optional[str] = None
    address: Optional[str] = None
    is_walker: Optional[bool] = False
    nickname: Optional[str] = None
    user_id: str

    class Config:
        orm_mode = True
