# app/routers/mbti_router.py
from fastapi import APIRouter, HTTPException
from backend.schemas.Dbti_schema import MbtiTestRequest, MbtiTestResponse
from backend.services.Dbti_service import calculate_mbti, save_mbti_result

router = APIRouter()

@router.get("/submitMbtiTest", response_model=MbtiTestResponse)
async def submit_mbti_test(answers: str):
    answers_list = answers.split(",")
    if len(answers_list) != 12:
        raise HTTPException(status_code=400, detail="답변 수가 올바르지 않습니다.")
    mbti = calculate_mbti(answers_list)
    save_mbti_result(answers_list, mbti)
    return MbtiTestResponse(mbti=mbti)

