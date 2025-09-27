from fastapi import APIRouter, Body, HTTPException
from typing import List, Optional
from app.schemas.listing import ListingCreate, ListingOut

router = APIRouter(prefix="/v1/listings", tags=["listings"])

# Giả lập DB listings
db_listings = {}

@router.post("/", response_model=ListingOut, status_code=201)
def create_listing(listing: ListingCreate = Body(...)):
    if listing.type == "SALE":
        if not listing.original_price_cents or listing.original_price_cents < 4000:
            raise HTTPException(status_code=400, detail="original_price_cents must be >= 4000 for SALE")
        sale_price = listing.original_price_cents // 4
        commission = listing.original_price_cents // 16
        seller_take = sale_price - commission
    else:
        sale_price = None
        commission = None
        seller_take = None
    new_listing = {
        "id": f"l_{len(db_listings)+1}",
        "owner_id": 1,
        "type": listing.type,
        "title": listing.title,
        "description": listing.description,
        "photos": listing.photos or [],
        "portions": listing.portions,
        "original_price_cents": listing.original_price_cents,
        "sale_price_cents": sale_price,
        "commission_cents": commission,
        "lat": listing.lat,
        "lng": listing.lng,
        "expires_at": listing.expires_at,
        "pickup_start": listing.pickup_start,
        "pickup_end": listing.pickup_end,
        "status": "OPEN",
        "created_at": None
    }
    db_listings[new_listing["id"]] = new_listing
    return new_listing

@router.get("/", response_model=List[ListingOut])
def list_listings(type: Optional[str] = None, status: Optional[str] = None, lat: Optional[float] = None, lng: Optional[float] = None, radius_km: Optional[int] = None):
    items = list(db_listings.values())
    if type:
        items = [l for l in items if l["type"] == type]
    if status:
        items = [l for l in items if l["status"] == status]
    # Lọc theo vị trí (Euclidean, demo)
    if lat is not None and lng is not None and radius_km is not None:
        def calc_distance(l):
            if l["lat"] is not None and l["lng"] is not None:
                dx = (l["lat"] - lat) * 111_000  # 1 độ lat ~ 111km
                dy = (l["lng"] - lng) * 111_000
                dist = (dx**2 + dy**2) ** 0.5
                return dist
            return float('inf')
        items = [l for l in items if calc_distance(l) <= radius_km * 1000]
        items.sort(key=calc_distance)
    return items

@router.get("/{id}", response_model=ListingOut)
def get_listing(id: str):
    listing = db_listings.get(id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing

@router.patch("/{id}", response_model=ListingOut)
def update_listing(id: str, data: dict = Body(...)):
    listing = db_listings.get(id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    listing.update(data)
    db_listings[id] = listing
    return listing

@router.delete("/{id}")
def delete_listing(id: str):
    listing = db_listings.get(id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    listing["status"] = "CANCELLED"
    db_listings[id] = listing
    return {"message": "Listing cancelled"}
