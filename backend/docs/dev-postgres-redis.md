# Local development: Postgres, Redis, and MinIO

This document explains how to bring up a local stack for development and run quick smoke tests.

Prerequisites

- Docker and Docker Compose (compose v2 recommended).
- Copy `backend/.env.example` to `backend/.env` and fill in values for `DATABASE_URL`, `REDIS_URL`, and MinIO credentials.

Bring up the stack

From the `backend` directory:

```bash
# start services
docker compose up -d

# see logs
docker compose logs -f
```

Verify services

- Postgres should be available on port 5432
- Redis should be available on port 6379
- MinIO console should be available on port 9001 (console) and API on 9000

Smoke tests

Set your environment variables (for PowerShell):

```powershell
# from backend folder
Set-Content -Path .env -Value (Get-Content .env -Raw)
$env:DATABASE_URL = (Get-Content .env | Select-String 'DATABASE_URL' | ForEach-Object { $_.ToString().Split('=')[1].Trim() })
$env:REDIS_URL = (Get-Content .env | Select-String 'REDIS_URL' | ForEach-Object { $_.ToString().Split('=')[1].Trim() })
```

Or use a tool like `direnv` or `python-dotenv` to load the file into your shell.

Quick Python checks (requires the packages in `requirements.txt` to be installed):

```bash
python -c "import os, psycopg2; conn=psycopg2.connect(os.environ['DATABASE_URL']); cur=conn.cursor(); cur.execute('SELECT 1'); print(cur.fetchone()); conn.close()"
python -c "import os, redis; r=redis.from_url(os.environ['REDIS_URL']); print(r.ping())"
```

Next steps

- Wire a DB client and migrations (Prisma, Alembic) and add an automated smoke test that the app can run migrations and connect.
- Add a lightweight health endpoint in the app that checks DB and Redis connectivity and returns 200 when ok.
