from fastapi import APIRouter, Body, HTTPException
from typing import List

router = APIRouter(prefix="/v1/reviews", tags=["reviews"])

# Giả lập DB reviews
db_reviews = {}

@router.post("/", status_code=201)
def create_review(data: dict = Body(...)):
    # Kiểm tra unique (listing_id, from_user, to_user)
    for r in db_reviews.values():
        if r["listing_id"] == data["listing_id"] and r["from_user"] == data["from_user"] and r["to_user"] == data["to_user"]:
            raise HTTPException(status_code=400, detail="Review already exists for this user/listing pair")
    review_id = f"r_{len(db_reviews)+1}"
    review = {
        "id": review_id,
        "listing_id": data["listing_id"],
        "from_user": data["from_user"],
        "to_user": data["to_user"],
        "stars": data["stars"],
        "tags": data.get("tags", []),
        "note": data.get("note", "")
    }
    db_reviews[review_id] = review
    return review

@router.get("/user/{id}")
def get_user_reviews(id: str):
    reviews = [r for r in db_reviews.values() if r["to_user"] == id]
    return {"reviews": reviews}
