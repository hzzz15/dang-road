import os
import httpx
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

async def fetch_place_autocomplete(input_text: str) -> list:
    """
    Google Places API를 사용해 주소 자동완성 결과를 가져옵니다.
    """
    url = "https://maps.googleapis.com/maps/api/place/autocomplete/json"
    params = {
        "input": input_text,
        "key": GOOGLE_API_KEY,
        "types": "geocode", 
        "language": "ko",    
        "components": "country:KR"
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)

    print(f"📩 입력된 `input_text`: {input_text}")
    print(f"🔎 API 응답 데이터: {response.json()}")  

    if response.status_code != 200:
        raise Exception(f"Google Places API 요청 실패: {response.status_code}")

    data = response.json()
    if "predictions" not in data:
        raise Exception("예상 결과를 찾을 수 없습니다.")

    # 필요한 정보만 추출
    predictions = [
        {"description": item["description"], "place_id": item["place_id"]}
        for item in data["predictions"]
    ]
    return predictions