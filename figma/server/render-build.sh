#!/bin/bash
set -e

echo "Installing dependencies..."
npm ci

echo "Building TypeScript..."
npm run build

echo "Setting up database..."
npx prisma generate
npx prisma db push --accept-data-loss --skip-generate

echo "Build complete!"
