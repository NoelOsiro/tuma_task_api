from fastapi import APIRouter
from app.models.user import UserOut

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserOut)
async def read_me():
    # TODO: return current authenticated user
    return UserOut(id=1, email="dev@example.com")
