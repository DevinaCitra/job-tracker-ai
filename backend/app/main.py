from fastapi import Depends, FastAPI, HTTPException, Query
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.models import JobApplication
from app.schemas import (
    JobApplicationCreate,
    JobApplicationResponse,
    JobApplicationUpdate,
    JobApplicationListResponse
)


app = FastAPI()


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
    db: Session = Depends(get_db)
):
    new_application = JobApplication(
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
    db: Session = Depends(get_db)
):
    query = db.query(JobApplication).order_by(JobApplication.id.desc())

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
    db: Session = Depends(get_db)
):
    query = db.query(JobApplication)

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
    db: Session = Depends(get_db)
):
    applications = db.query(JobApplication).all()

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


@app.get("/applications/{application_id}", response_model=JobApplicationResponse)
def get_application(
    application_id: int,
    db: Session = Depends(get_db)
):
    application = db.query(JobApplication).filter(
        JobApplication.id == application_id
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
    db: Session = Depends(get_db)
):
    existing_application = db.query(JobApplication).filter(
        JobApplication.id == application_id
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
    db: Session = Depends(get_db)
):
    application = db.query(JobApplication).filter(
        JobApplication.id == application_id
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

