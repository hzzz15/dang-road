from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from backend.database.session import get_db
from backend.routers.auth import get_current_user
from backend.model import Pet
from backend.schemas.pets import PetCreate, PetResponse
from uuid import UUID
from sqlalchemy.future import select

router = APIRouter()


@router.get("", response_model=list[PetResponse])
async def get_pets(
    db: AsyncSession = Depends(get_db),
    user_uuid: UUID = Depends(get_current_user) 
):
    """
    현재 사용자의 반려동물 목록 조회
    """
    pets = await db.execute(
        select(Pet).where(Pet.owner_id == str(user_uuid))
    )
    return [PetResponse.from_orm(pet) for pet in pets.scalars().all()]

# 비동기 세션으로 변경
@router.post("", response_model=PetResponse)
async def register_pet(
    pet_data: PetCreate,
    db: AsyncSession = Depends(get_db),
):
    """
    반려동물 정보 등록 API
    """

    if isinstance(pet_data.birth_date, str):
        try:
            birth_date_obj = datetime.strptime(pet_data.birth_date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid birth_date format. Expected YYYY-MM-DD.")
    else:
        birth_date_obj = pet_data.birth_date

    new_pet = Pet(
        name=pet_data.name,
        breed=pet_data.breed,
        size=pet_data.size,
        weight=pet_data.weight,
        gender=pet_data.gender,
        notes=pet_data.notes,
        pet_mbti=pet_data.pet_mbti,
        is_neutered=pet_data.is_neutered,
        image_url=pet_data.image_url,
        birth_date=birth_date_obj,
    )

    db.add(new_pet)
    await db.commit()  
    await db.refresh(new_pet)  

    return new_pet