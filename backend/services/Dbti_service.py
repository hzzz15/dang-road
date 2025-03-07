# app/services/mbti_service.py
from typing import List

def calculate_mbti(answers: List[str]) -> str:
    """
    answers 배열은 총 12개 (각 카테고리별 3문항)
    각 카테고리(순서대로 "E/I", "S/N", "T/F", "J/P")에서
    첫 번째 글자(예: "E" 등)가 2개 이상이면 그 글자, 그렇지 않으면 두 번째 글자("I" 등)를 선택
    """
    categories = ["E/I", "S/N", "T/F", "J/P"]
    mbti = ""
    for i, category in enumerate(categories):
        sub_answers = answers[i*3:(i+1)*3]
        first_letter = category[0]  # 예: "E"
        second_letter = category[2] # 예: "I" (문자열 "E/I"에서 인덱스 2)
        count_first = sum(1 for answer in sub_answers if answer == first_letter)
        if count_first >= 2:
            mbti += first_letter
        else:
            mbti += second_letter
    return mbti

def save_mbti_result(answers: List[str], mbti: str):
    """
    실제 DB에 저장하는 로직을 구현합니다.
    아래는 예시 코드이며, SQLAlchemy나 다른 ORM, 혹은 직접 DB 쿼리를 날리는 방식으로 구현하면 됩니다.
    """
    print("DB에 저장 (예시):", answers, mbti)
