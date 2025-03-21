from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from backend.models.address import Address
from backend.schemas.address import AddressCreate
from backend.services.address import save_address_to_db, get_all_addresses
from sqlalchemy.future import select

router = APIRouter()

@router.post("/save-address")
async def save_address(address: AddressCreate, db: AsyncSession = Depends(get_db)):
    """Walk2에서 입력된 주소를 DB에 저장하는 API"""
    try:
        result = await save_address_to_db(address.address, db)
        return {"message": "주소 저장 성공", "data": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/addresses")
async def get_addresses(session: AsyncSession = Depends(get_db)):  # ✅ 변경된 get_db 사용
    try:
        result = await session.execute(select(Address))
        addresses = result.scalars().all()
        print("DB에서 가져온 데이터:", addresses)
        return [{"latitude": addr.latitude, "longitude": addr.longitude} for addr in addresses]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await session.close()


# ✅ 가장 최근 주소 가져오기
@router.get("/latest")
async def get_latest_address(session: AsyncSession = Depends(get_db)):  
    try:
        result = await session.execute(select(Address).order_by(Address.id.desc()).limit(1))
        latest_address = result.scalars().first()

        if not latest_address:
            raise HTTPException(status_code=404, detail="최근 주소를 찾을 수 없습니다.")

        return {
            "address": latest_address.address,
            "latitude": latest_address.latitude,
            "longitude": latest_address.longitude,
            "created_at": latest_address.created_at
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await session.close()