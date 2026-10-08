from datetime import date
from pydantic import BaseModel


class JobApplicationCreate(BaseModel):
    company: str
    position: str
    location: str | None = None
    job_type: str | None = None
    source: str | None = None
    job_url: str | None = None
    date_applied: date | None = None
    status: str = "Applied"
    notes: str | None = None


class JobApplicationResponse(JobApplicationCreate):
    id: int

    class Config:
        from_attributes = True

class JobApplicationUpdate(BaseModel):
    company: str | None = None
    position: str | None = None
    location: str | None = None
    job_type: str | None = None
    source: str | None = None
    job_url: str | None = None
    date_applied: date | None = None
    status: str | None = None
    notes: str | None = None

class JobApplicationListResponse(BaseModel):
    data: list[JobApplicationResponse]
    page: int
    limit: int
    total: int
    total_pages: int

class JobApplicationListResponse(BaseModel):
    data: list[JobApplicationResponse]
    page: int
    limit: int
    total: int
    total_pages: int


class ChatRequest(BaseModel):
    message: str

class UserCreate(BaseModel):
    name: str
    email: str
    password: str 

class Token(BaseModel):
    access_token: str
    token_type: str