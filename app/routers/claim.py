from fastapi import APIRouter, Body, HTTPException
from typing import Optional

router = APIRouter(prefix="/v1/claims", tags=["claims"])

# Giả lập DB claims
db_claims = {}

@router.post("/listings/{listing_id}/claims")
def create_claim(listing_id: str, requester_id: str = Body(...)):
    # Chỉ cho phép 1 claim PENDING/user/listing
    for c in db_claims.values():
        if c["listing_id"] == listing_id and c["requester_id"] == requester_id and c["status"] == "PENDING":
            raise HTTPException(status_code=400, detail="Already has a pending claim")
    claim_id = f"c_{len(db_claims)+1}"
    claim = {
        "id": claim_id,
        "listing_id": listing_id,
        "requester_id": requester_id,
        "status": "PENDING"
    }
    db_claims[claim_id] = claim
    return claim

@router.post("/{id}/accept")
def accept_claim(id: str):
    claim = db_claims.get(id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    claim["status"] = "ACCEPTED"
    # Auto reject các claim khác cùng listing
    for c in db_claims.values():
        if c["listing_id"] == claim["listing_id"] and c["id"] != id and c["status"] == "PENDING":
            c["status"] = "REJECTED"
    db_claims[id] = claim
    return claim

@router.post("/{id}/reject")
def reject_claim(id: str):
    claim = db_claims.get(id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    claim["status"] = "REJECTED"
    db_claims[id] = claim
    return claim

@router.post("/{id}/cancel")
def cancel_claim(id: str):
    claim = db_claims.get(id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    claim["status"] = "CANCELLED"
    db_claims[id] = claim
    return claim
