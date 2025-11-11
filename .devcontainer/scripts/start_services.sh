#!/usr/bin/env bash
set -euo pipefail

# Try to start local Postgres and Redis when running inside the devcontainer.
# If Docker is available, fall back to using docker compose as a last resort.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${SCRIPT_DIR}/.."

echo "Starting development services (Postgres + Redis)..."

# If Docker is available and a docker-compose.yml exists, prefer local system services first.
if command -v service >/dev/null 2>&1; then
  echo "Attempting to start services using 'service' (if available)..."
  service postgresql start 2>/dev/null || true
  service redis-server start 2>/dev/null || true
fi

# Debian/Ubuntu: pg_ctlcluster may be present inside the container feature setup
if command -v pg_ctlcluster >/dev/null 2>&1; then
  echo "Starting postgres cluster via pg_ctlcluster if needed..."
  pg_ctlcluster 15 main start 2>/dev/null || true
fi

# Try to start redis-server directly if installed
if command -v redis-server >/dev/null 2>&1; then
  echo "Ensuring redis-server is running (daemonize)..."
  # start redis in daemon mode if not already running
  if ! pgrep -x redis-server >/dev/null 2>&1; then
    redis-server --daemonize yes || true
  else
    echo "redis-server already running"
  fi
fi

# Try to start postgres if available via postgres command (initdb/data dir usually handled by feature)
if command -v pg_ctl >/dev/null 2>&1; then
  echo "Checking postgres status..."
  if ! pg_isready -q; then
    echo "postgres is not responding to pg_isready. If postgres is installed by the feature it should already be running."
  else
    echo "postgres ready"
  fi
fi

# If nothing else worked and docker compose is available, use docker-compose as a fallback
if command -v docker >/dev/null 2>&1 || command -v docker-compose >/dev/null 2>&1; then
  if [ -f "${REPO_ROOT}/backend/docker-compose.yml" ]; then
    echo "Docker available — starting Postgres+Redis via docker compose as fallback..."
    docker compose -f "${REPO_ROOT}/backend/docker-compose.yml" up -d db redis || docker-compose -f "${REPO_ROOT}/backend/docker-compose.yml" up -d db redis
    exit 0
  fi
fi

echo "Start-services script finished. If Postgres or Redis are not running, confirm the devcontainer features installed them (or install/run locally)."
