# Dev Postgres + Redis + object storage (task)

Description

- Provision a local dev Postgres and Redis (docker-compose)
- Configure object storage (minio or use Supabase storage) for media
- Ensure connection strings and migrations path configured

Acceptance

- Local docker-compose brings up Postgres + Redis + MinIO and app connects

## Expanded plan (developer-friendly)

This task provides a small, reproducible local development environment for the backend. It covers:

- A docker-compose that starts Postgres, Redis and MinIO (object storage)
- Example environment variables and connection strings
- Steps to run migrations and a lightweight smoke test
- Acceptance criteria and troubleshooting notes

### Environment variables

Add these to `backend/.env` (copy from `.env.example`):

- `DATABASE_URL` — e.g. `postgresql://tuma:tuma_pass@localhost:5432/tuma_dev`
- `REDIS_URL` — e.g. `redis://localhost:6379/0`
- `MINIO_ENDPOINT` — e.g. `http://localhost:9000`
- `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY`

### Docker Compose (local dev)

Create `backend/docker-compose.yml` that defines three services:

- postgres: Postgres 15 with a named volume and basic env vars
- redis: official redis image
- minio: MinIO server with console enabled

When running `docker compose up -d` from `backend/`, the services should be reachable on the host ports defined in the compose file.

### Migrations & schema

We don't prescribe a specific migration tool here (Prisma, Alembic, or Django migrations are all valid). The acceptance test simply checks that the app can connect using `DATABASE_URL` and run a lightweight query (e.g., SELECT 1). If you're using Prisma or Alembic, add project-specific instructions here.

### Smoke test

After `docker compose up -d` and `.env` configured, run from the repo root:

```bash
# run a simple connectivity check (adjust to your project's runner)
python -c "import os, psycopg2; print('PG ok' if psycopg2.connect(os.environ['DATABASE_URL']).cursor().execute('SELECT 1') is None else 'PG fail')"
# redis
python -c "import os, redis; r=redis.from_url(os.environ['REDIS_URL']); r.ping(); print('redis ok')"
```

### Acceptance criteria

- `docker compose up -d` completes and containers are healthy
- App can connect to Postgres and Redis using `DATABASE_URL` and `REDIS_URL`
- MinIO is reachable and its console is accessible (optional for initial acceptance)

### Troubleshooting

- If ports are in use, adjust the compose host ports.
- Use `docker compose logs <service>` to inspect failures.
- Check env var names and ensure `.env` is loaded by your local runner (for example, `dotenv` or `docker compose --env-file`).

### Next steps (follow-ups)

- Wire a minimal DB client in `backend/app/core/db.py` and a Redis client in `backend/app/db/redis.py` (similar to the Auth work). Add a `/health` route to verify connectivity and include a pytest smoke test.
- Add a `scripts/` helper to bootstrap dev data (optional).
