import asyncpg
from typing import Optional

from app.core.config import settings

# Connection pool (initialized on startup)
pool: Optional[asyncpg.pool.Pool] = None


async def init_db_pool() -> None:
    """Initialize the asyncpg connection pool."""
    global pool
    if pool is None:
        pool = await asyncpg.create_pool(dsn=settings.DATABASE_URL)


async def close_db_pool() -> None:
    """Close the pool if initialized."""
    global pool
    if pool is not None:
        await pool.close()
        pool = None


class _AcquireContext:
    def __init__(self, pool: asyncpg.pool.Pool):
        self._pool = pool

    async def __aenter__(self):
        self._conn = await self._pool.acquire()
        return self._conn

    async def __aexit__(self, exc_type, exc, tb):
        await self._pool.release(self._conn)


def acquire_connection():
    """Helper to acquire a connection as an async context manager.

    Usage:
        async with acquire_connection() as conn:
            await conn.fetchval('SELECT 1')
    """
    if pool is None:
        raise RuntimeError("Database pool is not initialized")
    return _AcquireContext(pool)
