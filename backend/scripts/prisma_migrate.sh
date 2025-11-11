#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <migration-name>"
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

NAME="$1"

echo "Creating migration: $NAME"
npx prisma migrate dev --schema=prisma/schema.prisma --name "$NAME"

echo "Generating client"
npx prisma generate --schema=prisma/schema.prisma

echo "Migration complete. Commit prisma/migrations/" 
