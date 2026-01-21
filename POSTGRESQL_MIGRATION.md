# PostgreSQL Migration Guide

## Overview
This guide explains how to migrate from SQLite (development) to PostgreSQL (production).

---

## Prerequisites

- PostgreSQL 15+ installed
- Access to production database server
- Backup of existing SQLite database (if migrating data)

---

## Step 1: Update Prisma Schema

The schema is already PostgreSQL-compatible. No changes needed.

**Current schema location:** `figma/server/prisma/schema.prisma`

---

## Step 2: Update DATABASE_URL

### Development (SQLite)
```env
DATABASE_URL="file:./dev.db"
```

### Production (PostgreSQL)
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

**Example:**
```env
DATABASE_URL="postgresql://clevio:securepassword@localhost:5432/clevio_prod?schema=public"
```

---

## Step 3: Create PostgreSQL Database

### Using Docker (Recommended)
```bash
docker run --name clevio-postgres \
  -e POSTGRES_USER=clevio \
  -e POSTGRES_PASSWORD=securepassword \
  -e POSTGRES_DB=clevio_prod \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### Using Docker Compose (Easier)
```bash
cd /path/to/CLEVIO
docker-compose up -d postgres
```

### Manual Setup
```bash
# Connect to PostgreSQL
psql -U postgres

# Create user
CREATE USER clevio WITH PASSWORD 'securepassword';

# Create database
CREATE DATABASE clevio_prod OWNER clevio;

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE clevio_prod TO clevio;
```

---

## Step 4: Run Migrations

```bash
cd figma/server

# Set production DATABASE_URL
export DATABASE_URL="postgresql://clevio:securepassword@localhost:5432/clevio_prod"

# Generate Prisma Client for PostgreSQL
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Verify schema
npx prisma db pull
```

---

## Step 5: Migrate Existing Data (Optional)

### Option A: Export/Import via Prisma Studio

**Export from SQLite:**
```bash
# Set SQLite URL
export DATABASE_URL="file:./dev.db"

# Open Prisma Studio
npx prisma studio

# Manually export data (JSON format)
```

**Import to PostgreSQL:**
```bash
# Set PostgreSQL URL
export DATABASE_URL="postgresql://..."

# Use seed script or manual import
npx prisma db seed
```

### Option B: Custom Migration Script

Create `figma/server/scripts/migrate-data.ts`:

```typescript
import { PrismaClient as SQLitePrisma } from '@prisma/client';
import { PrismaClient as PostgresPrisma } from '@prisma/client';

const sqlite = new SQLitePrisma({
  datasources: { db: { url: 'file:./dev.db' } }
});

const postgres = new PostgresPrisma({
  datasources: { db: { url: process.env.DATABASE_URL } }
});

async function migrate() {
  // Migrate users
  const users = await sqlite.user.findMany();
  for (const user of users) {
    await postgres.user.create({ data: user });
  }

  // Migrate companies
  const companies = await sqlite.company.findMany();
  for (const company of companies) {
    await postgres.company.create({ data: company });
  }

  // ... repeat for all tables
  
  console.log('Migration complete!');
}

migrate().catch(console.error).finally(() => {
  sqlite.$disconnect();
  postgres.$disconnect();
});
```

Run:
```bash
npx tsx scripts/migrate-data.ts
```

---

## Step 6: Update Environment Files

### Production `.env`
```env
# Database
DATABASE_URL="postgresql://clevio:SECURE_PASSWORD@db.example.com:5432/clevio_prod"

# Security
JWT_SECRET="your-production-jwt-secret-min-32-chars"

# Email
EMAIL_MODE="sendgrid"
SENDGRID_API_KEY="SG.xxxxxxxxxxxxx"
SENDGRID_FROM_EMAIL="noreply@clevio.com"

# App
APP_BASE_URL="https://clevio.com"
NODE_ENV="production"
PORT="3001"

# OTP Settings
OTP_EXP_MINUTES="10"
OTP_MAX_ATTEMPTS="5"
OTP_RESEND_COOLDOWN_SECONDS="30"
```

---

## Step 7: Test Connection

```bash
cd figma/server

# Set production DATABASE_URL
export DATABASE_URL="postgresql://..."

# Test connection
npx prisma db execute --stdin <<< "SELECT version();"

# View database in Prisma Studio
npx prisma studio
```

---

## Step 8: Performance Optimization (PostgreSQL)

### Add Indexes

Update `schema.prisma`:

```prisma
model User {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  passwordHash String
  role         String   @default("user")
  createdAt    DateTime @default(now())
  
  @@index([email])
  @@index([createdAt])
}

model OTPCode {
  id        Int      @id @default(autoincrement())
  email     String
  code      String
  expiresAt DateTime
  verified  Boolean  @default(false)
  
  @@index([email, verified])
  @@index([expiresAt])
}

model Employee {
  id        Int     @id @default(autoincrement())
  companyId Int
  email     String
  
  @@index([companyId])
  @@index([email])
}
```

Apply indexes:
```bash
npx prisma migrate dev --name add_indexes
```

### Connection Pooling

Update DATABASE_URL with pool settings:
```env
DATABASE_URL="postgresql://clevio:password@host:5432/clevio_prod?schema=public&connection_limit=10&pool_timeout=10"
```

---

## Step 9: Backup Strategy

### Automated Backups (Docker)

Create `scripts/backup-postgres.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
CONTAINER="clevio-postgres"
DB_NAME="clevio_prod"

mkdir -p $BACKUP_DIR

docker exec $CONTAINER pg_dump -U clevio $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

Schedule with cron:
```bash
# Daily backup at 2 AM
0 2 * * * /path/to/backup-postgres.sh
```

### Restore from Backup

```bash
gunzip -c backup_20240101_020000.sql.gz | docker exec -i clevio-postgres psql -U clevio -d clevio_prod
```

---

## Step 10: Monitoring

### Enable Query Logging

In `server.ts`:

```typescript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

### Slow Query Monitoring

```bash
# In PostgreSQL
ALTER DATABASE clevio_prod SET log_min_duration_statement = 1000; -- Log queries > 1s
```

---

## Rollback Plan

If migration fails:

1. **Keep SQLite as fallback:**
   ```bash
   export DATABASE_URL="file:./dev.db"
   npm run dev
   ```

2. **Restore PostgreSQL from backup:**
   ```bash
   docker exec -i clevio-postgres psql -U clevio -d clevio_prod < backup.sql
   ```

3. **Check migration status:**
   ```bash
   npx prisma migrate status
   ```

---

## Common Issues

### Issue: Connection refused
**Solution:** Check PostgreSQL is running, firewall allows port 5432

### Issue: Authentication failed
**Solution:** Verify username/password in DATABASE_URL

### Issue: Migrations out of sync
**Solution:** 
```bash
npx prisma migrate resolve --applied "migration-name"
npx prisma migrate deploy
```

### Issue: Slow queries
**Solution:** Add indexes, use connection pooling, analyze query plans:
```sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
```

---

## Production Checklist

- [ ] PostgreSQL installed and running
- [ ] Database created with correct owner
- [ ] DATABASE_URL updated in `.env`
- [ ] Migrations deployed successfully
- [ ] Existing data migrated (if applicable)
- [ ] Indexes added for performance
- [ ] Connection pooling configured
- [ ] Backup strategy implemented
- [ ] Monitoring enabled
- [ ] Rollback plan documented
- [ ] Team notified of migration

---

## Performance Comparison

| Feature | SQLite | PostgreSQL |
|---------|--------|------------|
| Concurrent writes | ❌ Limited | ✅ Excellent |
| Connection pooling | ❌ No | ✅ Yes |
| Full-text search | ⚠️ Basic | ✅ Advanced |
| JSON queries | ⚠️ Limited | ✅ Full support |
| Scaling | ❌ Single file | ✅ Horizontal |
| Replication | ❌ No | ✅ Built-in |
| **Production-ready** | ❌ No | ✅ Yes |
