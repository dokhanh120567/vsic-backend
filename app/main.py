from fastapi import FastAPI

from app.routers.user import router as user_router
from app.routers.listing import router as listing_router
from app.routers.auth import router as auth_router
from app.routers.claim import router as claim_router
from app.routers.order import router as order_router
from app.routers.review import router as review_router
from app.routers.volunteer import router as volunteer_router
from app.routers.chat import router as chat_router

app = FastAPI(title="VSIC Demo API", description="Backend for VSIC MVP", version="0.1.0")

app.include_router(user_router)
app.include_router(listing_router)
app.include_router(auth_router)
app.include_router(claim_router)
app.include_router(order_router)
app.include_router(review_router)
app.include_router(volunteer_router)
app.include_router(chat_router)

@app.get("/")
def root():
    return {"message": "API is running"}
