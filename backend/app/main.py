from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.core.config import settings
from app.api.v1.routes import auth, tasks, users
from app.core import db as core_db
from app.db import redis as redis_mod


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    try:
        await core_db.init_db_pool()
    except Exception:
        # Don't crash startup for local dev; health endpoint will report failures.
        pass
    try:
        yield
    finally:
        # shutdown
        try:
            await core_db.close_db_pool()
        except Exception:
            pass
        try:
            # close redis client if supported
            if hasattr(redis_mod.redis_client, "close"):
                await redis_mod.redis_client.close()
        except Exception:
            pass


app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(tasks.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)


@app.get("/")
def health_check():
    return {"status": "ok", "message": "TumaTask backend running!"}


@app.get("/health")
async def health():
    checks = {}
    # DB check
    try:
        if core_db.pool is None:
            checks["database"] = "uninitialized"
        else:
            async with core_db.acquire_connection() as conn:
                val = await conn.fetchval("SELECT 1")
                checks["database"] = "ok" if val == 1 else f"unexpected:{val}"
    except Exception as e:
        checks["database"] = f"error: {e}"

    # Redis check
    try:
        pong = await redis_mod.redis_client.ping()
        checks["redis"] = "ok" if pong else "no-pong"
    except Exception as e:
        checks["redis"] = f"error: {e}"

    overall = "ok" if all(v == "ok" for v in checks.values()) else "degraded"
    return {"status": overall, "checks": checks}
