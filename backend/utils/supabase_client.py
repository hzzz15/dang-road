import httpx
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

HEADERS = {
    "Content-Type": "application/json",
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
}

# Supabase 통신
async def supabase_request(method: str, endpoint: str, data=None, params=None):
    async with httpx.AsyncClient() as client:
        url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
        response = await client.request(method, url, headers=HEADERS, json=data, params=params)
        response.raise_for_status() 
        return response.json()
