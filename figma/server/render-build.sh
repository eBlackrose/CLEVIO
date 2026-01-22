#!/bin/bash
set -e

echo "Installing dependencies..."
npm ci

echo "Configuring Prisma for PostgreSQL (production)..."
# Switch datasource provider from sqlite to postgresql for production
sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma

echo "Building TypeScript..."
npm run build

echo "Setting up database..."
npx prisma generate
npx prisma db push --accept-data-loss --skip-generate

echo "Build complete!"
