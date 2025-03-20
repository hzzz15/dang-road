from pydantic import BaseModel
from typing import List

class MbtiTestRequest(BaseModel):
    answers: List[str] 

class MbtiTestResponse(BaseModel):
    mbti: str         
