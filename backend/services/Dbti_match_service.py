import time
import openai
import random
import os
import re
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.models.Dbti_match import Pet, Trainer, MatchScore

# 환경 변수 또는 기본값으로 OpenAI API 키 설정
openai.api_key = os.getenv("OPENAI_API_KEY")

def get_openai_recommendation(prompt: str) -> tuple:
    """
    GPT-4 API를 호출하여, 추천 메시지를 생성하는 함수.
    최대 300 토큰 정도의 답변을 생성하며, 추천 점수와 상세 설명이 포함된 단일 텍스트 메시지를 반환함.
    """
    time.sleep(2)
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.2
        )
        recommendation = response["choices"][0]["message"]["content"].strip()

        # GPT 응답에서 숫자(0~100 사이)를 추출 (예: "**궁합 점수: 85**")
        match = re.search(r"궁합\s*점수[:：]?\s*(\d{1,3})", recommendation)
        if match:
            gpt_score = int(match.group(1))  # 첫 번째 숫자를 점수로 사용
            recommendation = recommendation.replace(match.group(0), "").strip()
        else:
            gpt_score = 50  # 기본값
            recommendation = recommendation

    except Exception as e:
        print(f"OpenAI Error: {e}")
        gpt_score = 0
        recommendation = "추천 메시지를 생성하는 데 실패했습니다."

    return gpt_score, recommendation

async def get_pet_matches(pet_id: int, db: AsyncSession) -> dict:
    """
    특정 반려동물(pet_id)에 대해 **랜덤한 2명의 트레이너**만 선택하여 점수를 계산하고 반환하는 함수.
    """
    # 1. 반려동물 정보 조회
    result = await db.execute(select(Pet).filter(Pet.id == pet_id))
    pet = result.scalars().first()
    if not pet:
        raise Exception("Pet not found")
    pet_mbti = pet.pet_mbti
    if not pet_mbti:
        raise Exception("pet_mbti 정보가 없습니다.")
    
    # 2. 모든 트레이너 조회
    result = await db.execute(select(Trainer))
    trainers = result.scalars().all()
    if not trainers:
        raise Exception("등록된 트레이너가 없습니다.")

    # ✅ 디버깅용 - 트레이너 이미지 URL 확인
    for trainer in trainers:
        print(f"🎯 트레이너 {trainer.name} (ID: {trainer.id})의 이미지 URL: {trainer.trainer_image_url}")

    best_matches = []

    for trainer in trainers:
        trainer_mbti = trainer.trainer_mbti
        experience = trainer.experience or 0

        # GPT 추천 메시지 생성
        prompt = f"강아지 MBTI: {pet_mbti}, 트레이너 MBTI: {trainer_mbti}, 경력: {experience}년"
        total_score, recommendation = get_openai_recommendation(prompt)

        print(f"✅ {trainer.name} (ID: {trainer.id}) - GPT 추천 점수: {total_score}")
        print(f"🖼️ 트레이너 이미지 URL: {trainer.trainer_image_url}")  # URL 로깅 추가

        best_matches.append({
            "trainer_id": trainer.id,
            "name": f"{trainer.name} 트레이너" if trainer.name else "이름 없음 트레이너",
            "trainer_image_url": trainer.trainer_image_url,  # ✅ trainer_image_url 포함
            "trainer_mbti": trainer_mbti,
            "experience": experience,
            "mbti_match_score": total_score,       
            "activity_match_score": total_score,  
            "total_match_score": total_score,  
            "recommendation": recommendation
        })

    top_10_matches = sorted(best_matches, key=lambda x: x["total_match_score"], reverse=True)[:10]

    pet_data = {
        "id": pet.id,
        "uuid_id": str(pet.uuid_id),
        "name": pet.name,
        "pet_mbti": pet.pet_mbti
    }
    
    return {"pet": pet_data, "matches": top_10_matches}
