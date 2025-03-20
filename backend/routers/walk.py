from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from backend.models.walk import WalkingRoute
from backend.schemas.walk import WalkingRouteCreate
from sqlalchemy.future import select

router = APIRouter()

@router.post("/save-walking-route")
async def save_walking_route_api(route_data: WalkingRouteCreate, db: AsyncSession = Depends(get_db)):
    """
    산책이 끝난 후 walking_routes 테이블에 거리, 걸음 수, 예상 소요 시간을 저장
    """
    try:
        # 새로운 산책 기록 객체 생성 (기존 create_reservation과 같은 방식)
        new_route = WalkingRoute(
            uuid_id=route_data.uuid_id,  # UUID 자동 변환
            reservation_id=route_data.reservation_id,
            start_latitude=route_data.start_latitude,
            start_longitude=route_data.start_longitude,
            end_latitude=route_data.end_latitude,
            end_longitude=route_data.end_longitude,
            distance_km=route_data.distance_km,
            estimated_steps=route_data.estimated_steps,
            estimated_time=route_data.estimated_time,
            feedback=route_data.feedback,
        )

        # DB에 저장
        db.add(new_route)
        await db.commit()
        await db.refresh(new_route)  # 새로 생성된 데이터 리턴

        return {"message": "산책 데이터 저장 성공", "data": new_route}
    
    except Exception as e:
        print(f"🚨 산책 데이터 저장 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"서버 오류: {str(e)}")

@router.get("/reports")
async def get_walk_reports(db: AsyncSession = Depends(get_db)):
    """
    `walking_routes` 테이블에서 모든 산책 데이터를 불러온다.
    """
    async with db as session:
        result = await session.execute(select(WalkingRoute).order_by(WalkingRoute.created_at.desc()))
        walk_reports = result.scalars().all()
        return walk_reports