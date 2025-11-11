#!/bin/bash
set -e

echo "📦 Setting up dev environment..."
pip install --upgrade pip
pip install -r requirements.txt || true

# Install Prisma CLI globally for schema management
npm install -g prisma

echo "✅ Dev environment ready!"
