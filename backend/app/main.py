from fastapi import FastAPI

from app.core.config import settings
from app.api.v1.routes import auth, tasks, users

app = FastAPI(title=settings.PROJECT_NAME)

app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(tasks.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)


@app.get("/")
def health_check():
    return {"status": "ok", "message": "TumaTask backend running!"}
