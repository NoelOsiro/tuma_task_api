#!/usr/bin/env bash
set -euo pipefail

# This script runs in the devcontainer during postCreateCommand.
# It installs Postgres and Redis (via apt), starts the services, then sets up the backend Python deps and Prisma.

echo "Running devcontainer setup..."

# Ensure apt is non-interactive
export DEBIAN_FRONTEND=noninteractive

# Try to ensure pip is available (some images may not have pip in PATH)
if ! python -m pip --version >/dev/null 2>&1; then
  echo "pip not found — attempting to install via ensurepip..."
  if python -m ensurepip --upgrade >/dev/null 2>&1; then
    python -m pip install --upgrade pip || true
  else
    echo "ensurepip not available. Attempting get-pip.py bootstrap..."
    # Try bootstrap get-pip.py as a last resort
    GET_PIP_URL="https://bootstrap.pypa.io/get-pip.py"
    TMP_PIP_SCRIPT="/tmp/get-pip.py"
    if command -v curl >/dev/null 2>&1; then
      curl -sSfL "$GET_PIP_URL" -o "$TMP_PIP_SCRIPT" || true
    elif command -v wget >/dev/null 2>&1; then
      wget -qO "$TMP_PIP_SCRIPT" "$GET_PIP_URL" || true
    fi
    if [ -f "$TMP_PIP_SCRIPT" ]; then
      echo "Running get-pip.py to install pip..."
      python "$TMP_PIP_SCRIPT" || echo "get-pip.py failed."
      rm -f "$TMP_PIP_SCRIPT"
    else
      echo "Could not download get-pip.py. pip installation skipped. Use an image with pip or install pip manually."
    fi
  fi
fi

# If apt is available, install lightweight client tools for readiness checks (not servers).
# Installing full database servers inside the app container is optional and often discouraged.
if command -v apt-get >/dev/null 2>&1; then
  echo "apt-get available — installing client utilities (postgres-client, redis-tools)..."
  sudo apt-get update -y || true
  sudo apt-get install -y postgresql-client redis-tools || true
else
  echo "apt-get not available in this image; cannot install client tools. If you need Postgres/Redis inside the devcontainer, consider using a different base image or run services on the host (docker-compose)."
fi

# We intentionally avoid attempting to install and run system Postgres/Redis servers inside this container
# because it's brittle across different base images. Use the 'Start Postgres + Redis' task, docker-compose,
# or run the services on your host/VM instead.

# Confirm client tools and attempt simple readiness checks if possible
if command -v pg_isready >/dev/null 2>&1; then
  echo "Postgres readiness:" && pg_isready -h localhost -p 5432 || true
elif command -v psql >/dev/null 2>&1; then
  echo "psql client available but pg_isready not found."
fi

if command -v redis-cli >/dev/null 2>&1; then
  echo "Redis ping:" && redis-cli -h localhost -p 6379 ping || true
fi

# Backend setup: install Python deps and run prisma generate
if [ -d "backend" ]; then
  echo "Installing Python requirements and running prisma generate..."
  cd backend
  python -m pip install --upgrade pip || true
  pip install -r requirements.txt || true
  # prisma may be installed via npm or as a binary; attempt to run it if present
  if command -v prisma >/dev/null 2>&1; then
    prisma generate || true
  else
    echo "prisma CLI not found in PATH. If you're using Prisma, install the CLI in the devcontainer or run 'npx prisma generate' in the backend folder."
  fi
  cd - >/dev/null || true
else
  echo "backend directory not found; skipping Python deps and prisma generate"
fi

echo "Devcontainer setup finished."
