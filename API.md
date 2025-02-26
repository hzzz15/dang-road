
### **사용자 API**

** ✔️사용자 정보 등록: 새로운 사용자를 등록 
[POST] /users/api/auth/signup

**REQUEST
{"email": "string","password": "string", "name": "string","phone_number": "string","address": "string","nickname": "string"}

**RESPONSE
{"message": "회원가입이 완료되었습니다!", "user_id": "string"}

** ✔️로그인: 이메일과 비밀번호를 입력해 로그인
[POST] /users/api/auth/login

**Request
{"email": "string","password": "string"}

**Response
{"access_token": "string","token_type": "bearer", "user": {"user_id": "string", "email": "string", "name": "string" }}

** ✔️강아지 정보 등록: 새로운 반려동물 정보를 등록
[POST] /pets/register

**Request
{"user_id": "string","name": "string", "breed": "string", "size": "string", "weight": "number"  "gender": "string", "notes": "string", "pet_mbti": "string","is_neutered": "boolean","image_url": "string", "birth_date": "string"}

**Response
{ "message": "반려동물 정보가 등록되었습니다!","pet_id": "string"}

** ✔️트레이너 정보 등록: 새로운 트레이너 정보를 등록
[POST] /trainers/register

**Request
{"user_id": "string","name": "string","trainer_mbti": "string", "experience": "number", "certifications": ["string"], "bio": "string", "image_url": "string"}

**Response
{ "message": "트레이너 정보가 등록되었습니다!", "trainer_id": "string"}




### **매칭 API** 
** ✔️강아지 MBTI 조회 : 강아지 댕bti 테스트 후 결과 저장
[GET] /api/submitMbtiTest

**Request
{
  "mbti": "string"
}

**Response
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}

** ✔️산책 매칭 : 특정 반려동물(pet_id)에 대해 트레이너를 추천받음
[GET] /match/pet/{pet_id}/matches

**Request
{
  "pet": {
    "name": "string",
    "breed": "string",
    "size": "string",
    "weight": 0,
    "gender": "string",
    "notes": "string",
    "pet_mbti": "string",
    "is_neutered": false,
    "image_url": "string",
    "birth_date": "string",
    "id": 0,
    "uuid_id": "string"
  },
  "matches": [
    {
      "trainer_id": 0,
      "trainer_mbti": "string",
      "experience": 0,
      "mbti_match_score": 0,
      "activity_match_score": 0,
      "total_match_score": 0,
      "trainer_image_url": "string",
      "name": "string",
      "recommendation": "string"
    }
  ]
}

**Response
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}

** ✔️임보 테스트 : 임시보호 테스트로 사용자와 강아지 태그 교집합 계산
[GET] /api/recommend_dogs

**Request
"string"

**Response
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}

### **주소 API** 
** ✔️주소 저장: Walk2에서 입력된 주소를 DB에 저장 
[POST] /api/address/save-address

Request:
{
  "address": "string"
}
Response:
{
  "message": "주소 저장 성공",
  "data": "저장된 주소 데이터"
}

** ✔️모든 주소 조회 
[GET] /api/address/addresses
Response:
[
  {
    "latitude": "float",
    "longitude": "float"
  }
]

** ✔️가장 최근 주소 조회 
[GET] /api/address/latest
Response:
{
  "address": "string",
  "latitude": "float",
  "longitude": "float",
  "created_at": "datetime"
}

** ✔️주소 자동완성 (Google Places API)
[GET] /api/places/autocomplete
Request:
{
  "input_text": "string"
}
Response:
{
  "predictions": ["string", "string"]
}

** ✔️예약 생성 API : 최신 주소 데이터를 기반으로 예약 생성 
[POST] /api/reservations/create

Request:
{
  "uuid_id": "string",
  "pet_id": "int",
  "trainer_id": "int",
  "schedule": "datetime",
  "status": "string"
}
Response:
{
  "reservation_id": "int",
  "address": "string"
}

** ✔️가장 최근 예약 조회 
[GET] /api/reservations/latest?uuid_id={uuid_id}

Response:
{
  "id": "int",
  "schedule": "datetime",
  "status": "string"
}

** ✔️예약 출발지 좌표 조회 
[GET] /api/reservations/{reservation_id}/address

Response:
{
  "latitude": "float",
  "longitude": "float"
}

** ✔️산책 기록 저장 API
[POST] /api/walk/save-walking-route

Request:
{
  "uuid_id": "string",
  "reservation_id": "int",
  "start_latitude": "float",
  "start_longitude": "float",
  "end_latitude": "float",
  "end_longitude": "float",
  "distance_km": "float",
  "estimated_steps": "int",
  "estimated_time": "int",
  "feedback": "string"
}
Response:
{
  "message": "산책 데이터 저장 성공",
  "data": "저장된 산책 데이터"
}

### **리뷰 API**
** ✔️태그 리뷰 조회 : 리뷰를 태그별로 나눠서 볼 수 있음
[POST] /api/reviews

{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}

