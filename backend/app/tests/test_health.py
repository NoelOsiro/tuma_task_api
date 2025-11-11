import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.core import db as core_db
from app.db import redis as redis_mod


class DummyConn:
    async def fetchval(self, q):
        return 1


class DummyPool:
    class _acq:
        async def __aenter__(self):
            return DummyConn()

        async def __aexit__(self, exc_type, exc, tb):
            return False

    def acquire(self):
        return DummyPool._acq()


class DummyRedis:
    async def ping(self):
        return True


@pytest.mark.asyncio
async def test_health_endpoint_monkeypatched(monkeypatch):
    # Prevent real init/close from running and provide dummy resources

    async def fake_init():
        core_db.pool = DummyPool()

    async def fake_close():
        core_db.pool = None

    monkeypatch.setattr(core_db, "init_db_pool", fake_init)
    monkeypatch.setattr(core_db, "close_db_pool", fake_close)
    monkeypatch.setattr(redis_mod, "redis_client", DummyRedis())

    # Use TestClient to trigger startup which will call our fake_init
    with TestClient(app) as client:
        resp = client.get("/health")
        assert resp.status_code == 200
        body = resp.json()
        assert "checks" in body
        assert body["checks"]["database"] == "ok"
        assert body["checks"]["redis"] == "ok"
