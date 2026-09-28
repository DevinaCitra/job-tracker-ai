import os

from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel


load_dotenv()


class JobApplicationData(BaseModel):
    is_job_application: bool
    company: str
    position: str
    source: str | None = None
    date_applied: str | None = None


client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def extract_job_application(user_text: str):

    prompt = f"""
    You are an AI assistant for a Job Application Tracker.

    Your task is to determine whether the user's message contains
    information about a real job application.

    Set is_job_application to TRUE only when the user is actually
    talking about applying, having applied, submitting an application,
    or registering for a job position.

    Examples of TRUE:
    - "Aku baru apply di Telkom sebagai Frontend Developer"
    - "Saya melamar di Shopee untuk posisi Backend Engineer"
    - "Kemarin saya daftar kerja di Tokopedia sebagai UI UX Designer"

    Examples of FALSE:
    - "apply"
    - "halo"
    - "apa kabar"
    - "aku mau cari kerja"
    - "gimana cara apply kerja?"
    - "lowongan frontend developer"
    - "aku tertarik dengan pekerjaan di Telkom"

    IMPORTANT:
    - Do NOT guess missing company or position.
    - If the message does not contain enough information, return null.
    - Do not invent any information.

    Extract:
    - is_job_application
    - company
    - position
    - source
    - date_applied

    Date must use YYYY-MM-DD format if explicitly mentioned.
    If the date is not mentioned, return null.

    User message:
    {user_text}
    """

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": JobApplicationData.model_json_schema()
        }
    )

    return JobApplicationData.model_validate_json(
        response.text
    )