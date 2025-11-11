from fastapi import APIRouter, Depends
from app.core.security import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/ping")
async def auth_ping():
    return {"ok": True}


@router.get("/me")
async def read_me(current_user: dict = Depends(get_current_user)):
    """Protected endpoint returning user info from Auth0."""
    return {"user": current_user}
