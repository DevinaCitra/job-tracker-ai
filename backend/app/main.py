import jwt

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.models import JobApplication, User
from app.schemas import (
    JobApplicationCreate,
    JobApplicationResponse,
    JobApplicationUpdate,
    JobApplicationListResponse,
    ChatRequest,
    UserCreate
)
from app.gemini import extract_job_application

from app.security import (
    hash_password,
    verify_password,
    create_access_token,
    SECRET_KEY,
    ALGORITHM
)

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Token tidak valid atau sudah expired",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise credentials_exception

    except InvalidTokenError:
        raise credentials_exception

    user = db.query(User).filter(
        User.id == int(user_id)
    ).first()

    if user is None:
        raise credentials_exception

    return user


@app.get("/users/me")
def get_me(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://job-tracker-ai-gold.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))

    return {
        "message": "Job Tracker API is running",
        "database": result.scalar()
    }


@app.post("/applications")
def create_application(
    application: JobApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_application = JobApplication(
        user_id=current_user.id,
        company=application.company,
        position=application.position,
        location=application.location,
        job_type=application.job_type,
        source=application.source,
        job_url=application.job_url,
        date_applied=application.date_applied,
        status=application.status,
        notes=application.notes
    )

    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    return new_application

@app.get("/applications", response_model=JobApplicationListResponse)
def get_applications(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(JobApplication).filter(
        JobApplication.user_id == current_user.id
    )

    total = query.count()

    offset = (page - 1) * limit

    applications = query.offset(offset).limit(limit).all()

    total_pages = (total + limit - 1) // limit

    return {
        "data": applications,
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": total_pages
    }

@app.get("/applications/search", response_model=list[JobApplicationResponse])
def search_applications(
    company: str | None = None,
    status: str | None = None,
    source: str | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(JobApplication).filter(
        JobApplication.user_id == current_user.id
    )

    if company:
        query = query.filter(
            JobApplication.company.ilike(f"%{company}%")
        )

    if status:
        query = query.filter(
            JobApplication.status.ilike(f"%{status}%")
        )

    if source:
        query = query.filter(
            JobApplication.source.ilike(f"%{source}%")
        )

    return query.all()

@app.get("/applications/stats")
def get_application_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    applications = db.query(JobApplication).filter(
        JobApplication.user_id == current_user.id
    ).all()

    total = len(applications)

    applied = sum(
        1 for application in applications
        if application.status == "Applied"
    )

    interview = sum(
        1 for application in applications
        if application.status == "Interview"
    )

    offer = sum(
        1 for application in applications
        if application.status == "Offer"
    )

    rejected = sum(
        1 for application in applications
        if application.status == "Rejected"
    )

    return {
        "total": total,
        "applied": applied,
        "interview": interview,
        "offer": offer,
        "rejected": rejected
    }

@app.post("/chat")
def chat(request: ChatRequest):
    result = extract_job_application(request.message)

    return result

@app.post("/register")
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email sudah terdaftar"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Registrasi berhasil",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email
        }
    }

@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    print("LOGIN EMAIL:", repr(form_data.username))

    user = db.query(User).filter(
    User.email == form_data.username
).first()

print("USER FOUND:", user is not None)

if user is None:
    raise HTTPException(
        status_code=401,
        detail="Email atau password salah"
    )

password_valid = verify_password(
    form_data.password,
    user.hashed_password
)

print("PASSWORD VALID:", password_valid)

if not password_valid:
    raise HTTPException(
        status_code=401,
        detail="Email atau password salah"
    )

@app.get("/applications/{application_id}", response_model=JobApplicationResponse)
def get_application(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    application = db.query(JobApplication).filter(
        JobApplication.id == application_id,
        JobApplication.user_id == current_user.id
    ).first()

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    return application



@app.put("/applications/{application_id}", response_model=JobApplicationResponse)
def update_application(
    application_id: int,
    application: JobApplicationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing_application = db.query(JobApplication).filter(
        JobApplication.id == application_id,
        JobApplication.user_id == current_user.id
    ).first()

    if existing_application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    update_data = application.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(existing_application, field, value)

    db.commit()
    db.refresh(existing_application)

    return existing_application


@app.delete("/applications/{application_id}")
def delete_application(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    application = db.query(JobApplication).filter(
        JobApplication.id == application_id,
        JobApplication.user_id == current_user.id
    ).first()

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    db.delete(application)
    db.commit()

    return {
        "message": "Application deleted successfully"
    }

