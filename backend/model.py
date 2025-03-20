from sqlalchemy import Column, Integer, String, Boolean,Date,  ForeignKey, Float, UUID
from sqlalchemy.ext.declarative import declarative_base
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    uuid_id = Column(UUID, unique=True, nullable=False, default=uuid.uuid4)
    user_id = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone_number = Column(String, nullable=True)
    address = Column(String, nullable=True)
    nickname = Column(String, nullable=True)
    is_walker = Column(Boolean, default=False)

class Pet(Base):
    __tablename__ = "pets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    breed = Column(String, nullable=False)
    size = Column(String, nullable=True)
    weight = Column(Float, nullable=False)
    gender = Column(String, nullable=False)
    notes = Column(String, nullable=True)
    pet_mbti = Column(String, nullable=True)
    is_neutered = Column(Boolean, nullable=False)
    image_url = Column(String, nullable=True)
    birth_date = Column(Date, nullable=True)
