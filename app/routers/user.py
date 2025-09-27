from fastapi import APIRouter
from typing import List

router = APIRouter(prefix="/v1/users", tags=["users"])

@router.get("/", response_model=List[dict])
def list_users():
    # TODO: Trả về danh sách user (demo)
    return []

@router.post("/register")
def register_user():
    # TODO: Đăng ký user mới
    return {"message": "User registered"}
