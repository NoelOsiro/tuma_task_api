#!/usr/bin/env bash
set -euo pipefail

# This script runs in the devcontainer during postCreateCommand.
# It installs Postgres and Redis (via apt), starts the services, then sets up the backend Python deps and Prisma.

echo "Running devcontainer setup..."

# Ensure apt is non-interactive
export DEBIAN_FRONTEND=noninteractive

# Update and install packages
if command -v apt-get >/dev/null 2>&1; then
  echo "Updating apt and installing postgresql and redis-server..."
  sudo apt-get update -y
  sudo apt-get install -y postgresql redis-server
else
  echo "apt-get not available in this image; ensure postgres and redis are present by other means."
fi

# Start services
if command -v service >/dev/null 2>&1; then
  echo "Starting postgresql and redis-server via service..."
  sudo service postgresql start || true
  sudo service redis-server start || true
fi

# Try pg_ctlcluster for Debian-based feature setups
if command -v pg_ctlcluster >/dev/null 2>&1; then
  echo "Ensuring postgres cluster is running via pg_ctlcluster..."
  sudo pg_ctlcluster 15 main start || true
fi

# Confirm services
if command -v pg_isready >/dev/null 2>&1; then
  echo "Postgres readiness:" && pg_isready -h localhost -p 5432 || true
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
