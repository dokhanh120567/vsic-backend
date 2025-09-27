from sqlalchemy import Column, Integer, String, Float, TIMESTAMP, ForeignKey, Text, JSON
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Listing(Base):
    __tablename__ = "listings"
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    photos = Column(JSON)
    portions = Column(Integer)
    original_price_cents = Column(Integer)
    sale_price_cents = Column(Integer)
    commission_cents = Column(Integer)
    lat = Column(Float)
    lng = Column(Float)
    expires_at = Column(TIMESTAMP)
    pickup_start = Column(TIMESTAMP)
    pickup_end = Column(TIMESTAMP)
    status = Column(String, default="OPEN")
    created_at = Column(TIMESTAMP)
