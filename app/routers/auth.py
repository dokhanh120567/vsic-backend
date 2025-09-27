from fastapi import APIRouter, HTTPException, Body
from app.schemas.user import UserCreate, UserOut
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core import db

router = APIRouter(prefix="/v1/auth", tags=["auth"])

@router.post("/register", response_model=UserOut, status_code=201)
def register(user: UserCreate = Body(...)):
    if db.get_user_by_email(user.email):
        raise HTTPException(status_code=409, detail="Email already registered")
    if len(user.password) < 8:
        raise HTTPException(status_code=400, detail="Password too short (min 8)")
    uid = f"u_{len(db.users_by_id) + 1}"
    rec = {
        "id": uid,
        "email": user.email,
        "role": user.role or "RECIPIENT",
        "name": user.name,
        "phone": user.phone,
        "lat": user.lat,
        "lng": user.lng,
        "address_hint": user.address_hint,
        "password_hash": get_password_hash(user.password),
        "rating_avg": 0.0,
        "rating_count": 0,
    }
    db.add_user(rec)
    out = rec.copy()
    out.pop("password_hash", None)
    return out

@router.post("/login")
def login(email: str = Body(...), password: str = Body(...)):
    rec = db.get_user_by_email(email)
    if not rec or not verify_password(password, rec["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": rec["id"], "email": rec["email"], "role": rec["role"]})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/user/{email}", response_model=UserOut)
def get_user_by_email(email: str):
    rec = db.get_user_by_email(email)
    if not rec:
        raise HTTPException(status_code=404, detail="User not found")
    out = rec.copy()
    out.pop("password_hash", None)
    return out
