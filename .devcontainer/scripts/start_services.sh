#!/bin/bash
set -e

echo "🚀 Starting Postgres, Redis, and MinIO..."
# Resolve script directory and reference backend/docker-compose.yml from repo root
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMPOSE_FILE="$SCRIPT_DIR/../../backend/docker-compose.yml"

if [ ! -f "$COMPOSE_FILE" ]; then
	echo "ERROR: docker-compose file not found at $COMPOSE_FILE"
	exit 1
fi

docker compose -f "$COMPOSE_FILE" up -d
echo "✅ Services are running!"
