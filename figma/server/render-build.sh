#!/bin/bash
set -e

echo "Installing dependencies..."
npm ci

echo "Building TypeScript..."
npm run build

echo "Running database migrations..."
npx prisma generate
npx prisma migrate deploy

echo "Build complete!"
