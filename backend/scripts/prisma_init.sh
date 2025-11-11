#!/usr/bin/env bash
set -euo pipefail

# Initialize Prisma locally (dev): run migrations, generate client, and seed
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    echo "Copied .env.example to .env — please update values if necessary"
  else
    echo ".env not found and .env.example missing — please create DATABASE_URL in .env"
    exit 1
  fi
fi

echo "Running Prisma migrate (dev) against DATABASE_URL"
# use npx so global prisma not required
npx prisma migrate dev --schema=prisma/schema.prisma --name init

echo "Generating Prisma Python client"
npx prisma generate --schema=prisma/schema.prisma

echo "Running seed script (if any)"
python backend/scripts/prisma_seed.py || true

echo "Prisma init complete."
