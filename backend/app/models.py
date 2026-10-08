from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from app.database import Base


class JobApplication(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
    Integer,
    ForeignKey("users.id"),
    nullable=False,
    index=True
    )

    company = Column(String(100), nullable=False)
    position = Column(String(100), nullable=False)
    location = Column(String(100))
    job_type = Column(String(50))
    source = Column(String(50))
    job_url = Column(String(500))
    date_applied = Column(Date)
    status = Column(String(50), nullable=False, default="Applied")
    notes = Column(Text)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)