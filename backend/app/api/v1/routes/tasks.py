from fastapi import APIRouter
from app.models.task import TaskCreate, TaskOut

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("/", response_model=list[TaskOut])
async def get_tasks():
    # TODO: wire up database/service
    return []


@router.post("/", response_model=TaskOut)
async def new_task(payload: TaskCreate):
    # TODO: call task service to persist
    return TaskOut(id=1, title=payload.title, description=payload.description)
