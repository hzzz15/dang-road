from fastapi import APIRouter, Query
import json
import os
from collections import Counter 

router = APIRouter()


json_file_path = os.path.abspath("backend/data/animal_data_updated.json")

if not os.path.exists(json_file_path):
    raise FileNotFoundError(f"JSON 파일을 찾을 수 없습니다: {json_file_path}")

with open(json_file_path, "r", encoding="utf-8") as file:
    dogs_data = json.load(file)

# 추천 API 
@router.get("/api/recommend_dogs")
def recommend_dogs(tags: str = Query(..., description="사용자가 선택한 태그 목록")):
    user_tags = tags.split(",")  
    user_tags = [tag.strip().replace("'", "").replace(" ", "") for tag in user_tags]  # ✅ 공백 및 따옴표 제거

    print(f"\n🔹 사용자가 선택한 태그: {user_tags}\n")

    recommended_dogs = []
    matching_tags_list = []  

    for dog in dogs_data:
        dog_tags = [tag.strip().replace("'", "").replace(" ", "") for tag in dog["태그"]]  
        matching_tags = list(set(user_tags) & set(dog_tags))  # 일치하는 태그들
        match_count = len(matching_tags)  # 태그 매칭 개수 확인

        if match_count > 0:
            dog_data = {**dog, "match_count": match_count, "matching_tags": matching_tags}
            recommended_dogs.append(dog_data)
            matching_tags_list.extend(matching_tags) 

    recommended_dogs.sort(key=lambda x: x["match_count"], reverse=True)

    # 가장 많이 겹치는 태그 3개 계산
    tag_counter = Counter(matching_tags_list)
    top_3_tags = tag_counter.most_common(3)

    return {
    "recommended_dogs": recommended_dogs,
    "top_3_tags": top_3_tags
    }