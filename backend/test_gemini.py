from app.gemini import extract_job_application


text = """
Aku baru apply di Telkom Indonesia sebagai
Frontend Developer lewat LinkedIn kemarin.
"""


result = extract_job_application(text)

print(result)