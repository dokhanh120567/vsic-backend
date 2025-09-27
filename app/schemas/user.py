from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal

# Có thể siết role bằng Literal nếu bạn muốn set cứng
Role = Literal["DONOR_BIZ", "RECIPIENT", "VOLUNTEER", "ADMIN"]

class UserBase(BaseModel):
    email: EmailStr
    role: Role  # nếu muốn nới lỏng: role: str
    name: Optional[str] = None
    phone: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    address_hint: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(min_length=8)

class UserOut(UserBase):
    id: str
    rating_avg: float = 0.0
    rating_count: int = 0
