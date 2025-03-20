import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")) 
ENV_PATH = os.path.join(BASE_DIR, ".env") 

if os.path.exists(ENV_PATH):  
    load_dotenv(ENV_PATH, override=True) 
    print(f".env 파일 로드 완료: {ENV_PATH}")
else:
    raise ValueError(f".env 파일을 찾을 수 없습니다 확인된 경로: {ENV_PATH}")

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("환경 변수 DATABASE_URL이 설정되지 않았습니다.")

# 비동기 DB 엔진 생성
engine = create_async_engine(DATABASE_URL, echo=True, future=True)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

async def get_db():
    db = AsyncSessionLocal()
    try:
        yield db
    finally:
        await db.close()
