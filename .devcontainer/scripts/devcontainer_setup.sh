#!/bin/bash
set -e

echo "📦 Setting up dev environment..."
# Resolve repo root relative to this script so installs run from the repo
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

python -m pip install --upgrade pip

REQ_FILE="$REPO_ROOT/backend/requirements.txt"
if [ -f "$REQ_FILE" ]; then
	echo "Installing Python requirements from $REQ_FILE"
	python -m pip install -r "$REQ_FILE" || true
else
	echo "WARNING: requirements file not found at $REQ_FILE — skipping Python deps"
fi

# Install Prisma CLI globally for schema management (uses npm)
if command -v npm >/dev/null 2>&1; then
	npm install -g prisma || true
else
	echo "npm not found; skipping global prisma install. You can use npx prisma instead."
fi

echo "✅ Dev environment ready!"
