from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from backend.models.Dbti_match import MbtiResult 

def calculate_mbti(answers: List[str]) -> str:
    categories = ["E/I", "S/N", "T/F", "J/P"]
    mbti = ""
    for i, category in enumerate(categories):
        sub_answers = answers[i*3:(i+1)*3]
        first_letter = category[0]
        second_letter = category[2]
        count_first = sum(1 for answer in sub_answers if answer == first_letter)
        if count_first >= 2:
            mbti += first_letter
        else:
            mbti += second_letter
    return mbti

async def save_mbti_result(answers: List[str], mbti: str, db: AsyncSession):
    new_result = MbtiResult(answers=answers, mbti=mbti)
    # DB에 저장
    db.add(new_result)
    try:
        await db.commit()             
        await db.refresh(new_result)    
    except Exception as e:
        await db.rollback()            
        raise e
    return new_result
