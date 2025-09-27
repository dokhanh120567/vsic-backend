from sqlalchemy import Column, Integer, String, Float, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String)
    role = Column(String, nullable=False)
    name = Column(String)
    phone = Column(String)
    rating_avg = Column(Float, default=0)
    rating_count = Column(Integer, default=0)
    lat = Column(Float)
    lng = Column(Float)
    address_hint = Column(String)
    created_at = Column(TIMESTAMP)
