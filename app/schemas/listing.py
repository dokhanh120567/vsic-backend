from pydantic import BaseModel, Field, conint
from typing import List, Optional, Literal
from datetime import datetime

ListingType = Literal["FOOD", "ITEM", "OTHER"]

class ListingBase(BaseModel):
    type: ListingType
    title: str
    description: Optional[str] = None

    # Dùng default_factory cho list để không bị mutable default
    photos: List[str] = Field(default_factory=list)

    # Cho phép để trống (server sẽ tự tính), nhưng nếu có thì phải >= 0
    portions: Optional[conint(ge=1)] = None
    original_price_cents: Optional[conint(ge=0)] = None
    sale_price_cents: Optional[conint(ge=0)] = None
    commission_cents: Optional[conint(ge=0)] = None

    lat: Optional[float] = None
    lng: Optional[float] = None

    # Dùng datetime thay vì str
    expires_at: Optional[datetime] = None
    pickup_start: Optional[datetime] = None
    pickup_end: Optional[datetime] = None

class ListingCreate(ListingBase):
    # Nếu muốn “ép” phải có original_price khi không gửi sale:
    # original_price_cents: conint(ge=0)
    # hoặc giữ như hiện tại để linh hoạt
    pass

class ListingOut(ListingBase):
    id: str
    owner_id: str
    status: Literal["OPEN", "CLAIM_APPROVED", "RESERVED", "PAID"] = "OPEN"
