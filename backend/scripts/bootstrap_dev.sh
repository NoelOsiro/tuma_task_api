#!/usr/bin/env bash
# bootstrap_dev.sh - bring up local development stack and copy .env
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    echo "Copied .env.example to .env - please edit with real values if needed"
  else
    echo ".env.example not found; please create a .env file"
  fi
fi

# Start docker compose
docker compose up -d

echo "Dev stack started. Run 'docker compose ps' to inspect containers."
