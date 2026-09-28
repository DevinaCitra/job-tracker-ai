from sqlalchemy import Column, Integer, String, Text, Date
from app.database import Base


class JobApplication(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String(100), nullable=False)
    position = Column(String(100), nullable=False)
    location = Column(String(100))
    job_type = Column(String(50))
    source = Column(String(50))
    job_url = Column(String(500))
    date_applied = Column(Date)
    status = Column(String(50), nullable=False, default="Applied")
    notes = Column(Text)