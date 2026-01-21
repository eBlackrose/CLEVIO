# CLEVIO Deployment Guide

Complete guide for deploying CLEVIO to production.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Local Development](#local-development)
4. [Docker Deployment](#docker-deployment)
5. [Cloud Deployment (AWS/GCP/Azure)](#cloud-deployment)
6. [Domain & SSL Setup](#domain--ssl-setup)
7. [Monitoring & Logging](#monitoring--logging)
8. [Backup & Recovery](#backup--recovery)
9. [Scaling](#scaling)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js** 18+ ([download](https://nodejs.org/))
- **Docker** 20+ & Docker Compose ([download](https://www.docker.com/))
- **PostgreSQL** 15+ (for production)
- **Git** ([download](https://git-scm.com/))

### Required Accounts
- **SendGrid** account for email (or alternative SMTP)
- **Docker Hub** account (for container registry)
- **Cloud provider** account (AWS/GCP/Azure) - optional

---

## Environment Variables

### Backend (`figma/server/.env`)

```env
# ===========================
# DATABASE
# ===========================
# Development (SQLite)
DATABASE_URL="file:./dev.db"

# Production (PostgreSQL)
# DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# ===========================
# APPLICATION
# ===========================
NODE_ENV="production"
PORT="3001"
APP_BASE_URL="https://your-domain.com"

# ===========================
# SECURITY
# ===========================
# Generate with: openssl rand -base64 32
JWT_SECRET="your-super-secure-jwt-secret-min-32-characters"

# ===========================
# EMAIL (SendGrid)
# ===========================
EMAIL_MODE="sendgrid"  # or "log" for development
SENDGRID_API_KEY="SG.xxxxxxxxxxxxxxxxxxxxx"
SENDGRID_FROM_EMAIL="noreply@your-domain.com"

# ===========================
# OTP SETTINGS
# ===========================
OTP_EXP_MINUTES="10"
OTP_MAX_ATTEMPTS="5"
OTP_RESEND_COOLDOWN_SECONDS="30"

# ===========================
# ADMIN SEEDING (Development Only)
# ===========================
SEED_ADMIN_EMAIL="admin@your-domain.com"
SEED_ADMIN_PASSWORD="changeme"
SEED_ADMIN_FIRSTNAME="Admin"
SEED_ADMIN_LASTNAME="User"
```

### Frontend (`figma/.env`)

```env
# ===========================
# API Configuration
# ===========================
VITE_API_URL="https://api.your-domain.com"
VITE_APP_BASE_URL="https://your-domain.com"
```

### Docker Compose (`.env` in root)

```env
# PostgreSQL
POSTGRES_USER="clevio"
POSTGRES_PASSWORD="CHANGE_THIS_IN_PRODUCTION"
POSTGRES_DB="clevio_prod"

# Backend
JWT_SECRET="your-super-secure-jwt-secret"
EMAIL_MODE="sendgrid"
SENDGRID_API_KEY="SG.xxxxx"
SENDGRID_FROM_EMAIL="noreply@your-domain.com"
APP_BASE_URL="https://your-domain.com"

# Optional
OTP_EXP_MINUTES="10"
OTP_MAX_ATTEMPTS="5"
```

---

## Local Development

### Quick Start

```bash
# Clone repository
git clone https://github.com/your-org/clevio.git
cd clevio

# Backend setup
cd figma/server
npm install
cp .env.example .env
# Edit .env with your values
npx prisma migrate dev
npm run dev

# Frontend setup (new terminal)
cd ../figma
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

Access:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **API Health**: http://localhost:3001/api/health

---

## Docker Deployment

### Option 1: Docker Compose (Recommended)

**1. Clone and configure:**
```bash
git clone https://github.com/your-org/clevio.git
cd clevio
cp .env.example .env
# Edit .env with production values
```

**2. Start services:**
```bash
docker-compose up -d
```

**3. Run migrations:**
```bash
docker-compose exec backend npx prisma migrate deploy
```

**4. Verify:**
```bash
curl http://localhost/api/health
```

### Option 2: Individual Containers

**Backend:**
```bash
cd figma/server
docker build -t clevio-backend .
docker run -d \
  --name clevio-backend \
  -p 3001:3001 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="..." \
  clevio-backend
```

**Frontend:**
```bash
cd figma
docker build -t clevio-frontend .
docker run -d \
  --name clevio-frontend \
  -p 80:80 \
  clevio-frontend
```

---

## Cloud Deployment

### AWS (Amazon Web Services)

#### Using ECS (Elastic Container Service)

**1. Create ECR repositories:**
```bash
aws ecr create-repository --repository-name clevio-backend
aws ecr create-repository --repository-name clevio-frontend
```

**2. Build and push images:**
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build and push backend
cd figma/server
docker build -t clevio-backend .
docker tag clevio-backend:latest ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/clevio-backend:latest
docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/clevio-backend:latest

# Build and push frontend
cd ../figma
docker build -t clevio-frontend .
docker tag clevio-frontend:latest ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/clevio-frontend:latest
docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/clevio-frontend:latest
```

**3. Create RDS PostgreSQL database:**
- Engine: PostgreSQL 15
- Instance class: db.t3.micro (start small)
- Storage: 20 GB SSD
- Multi-AZ: Enabled (for production)
- Public access: No
- Backup retention: 7 days

**4. Create ECS task definitions and services** via AWS Console or Terraform.

**5. Configure Application Load Balancer:**
- Target backend on port 3001
- Target frontend on port 80
- Health checks: `/api/health` and `/health`

#### Using Elastic Beanstalk (Simpler)

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p docker clevio

# Create environment
eb create clevio-prod

# Deploy
eb deploy
```

### GCP (Google Cloud Platform)

#### Using Cloud Run

**1. Build and push to GCR:**
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/clevio-backend figma/server
gcloud builds submit --tag gcr.io/PROJECT_ID/clevio-frontend figma
```

**2. Deploy services:**
```bash
# Backend
gcloud run deploy clevio-backend \
  --image gcr.io/PROJECT_ID/clevio-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL="..." \
  --set-env-vars JWT_SECRET="..."

# Frontend
gcloud run deploy clevio-frontend \
  --image gcr.io/PROJECT_ID/clevio-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

**3. Create Cloud SQL PostgreSQL instance:**
```bash
gcloud sql instances create clevio-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1
```

### Azure

#### Using Container Instances

**1. Create resource group:**
```bash
az group create --name clevio-rg --location eastus
```

**2. Create container registry:**
```bash
az acr create --resource-group clevio-rg --name clevioregistry --sku Basic
```

**3. Push images:**
```bash
az acr login --name clevioregistry
docker tag clevio-backend clevioregistry.azurecr.io/clevio-backend
docker push clevioregistry.azurecr.io/clevio-backend
```

**4. Create PostgreSQL:**
```bash
az postgres flexible-server create \
  --resource-group clevio-rg \
  --name clevio-db \
  --location eastus \
  --admin-user clevio \
  --admin-password SecurePassword123! \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32
```

---

## Domain & SSL Setup

### Using Nginx + Let's Encrypt (Manual)

**1. Install Certbot:**
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

**2. Obtain SSL certificate:**
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

**3. Update nginx.conf:**
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://frontend:80;
    }

    location /api {
        proxy_pass http://backend:3001;
    }
}
```

**4. Auto-renewal:**
```bash
sudo certbot renew --dry-run
```

### Using Cloudflare (Easiest)

1. Point domain DNS to your server IP
2. Enable Cloudflare proxy (orange cloud)
3. SSL/TLS mode: Full (strict)
4. Auto HTTPS rewrites: Enabled

---

## Monitoring & Logging

### Application Monitoring

**Add Sentry (Recommended):**

```bash
# Backend
npm install @sentry/node

# In server.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

**Frontend:**
```bash
npm install @sentry/react

# In main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

### Log Aggregation

**Using Docker logs:**
```bash
# View live logs
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

**Using Loki + Grafana:**

Add to `docker-compose.yml`:
```yaml
loki:
  image: grafana/loki:latest
  ports:
    - "3100:3100"
  volumes:
    - ./loki-config.yml:/etc/loki/local-config.yaml

grafana:
  image: grafana/grafana:latest
  ports:
    - "3000:3000"
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=admin
```

### Health Checks

**Backend health endpoint:**
```bash
curl http://your-domain.com/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-21T...",
  "environment": "production"
}
```

**Setup monitoring service:**
- **UptimeRobot**: https://uptimerobot.com (free)
- **Pingdom**: https://www.pingdom.com
- **Better Uptime**: https://betteruptime.com

---

## Backup & Recovery

### Database Backups

**Automated backup script:**
```bash
#!/bin/bash
# scripts/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
docker-compose exec -T postgres pg_dump -U clevio clevio_prod | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Upload to S3 (optional)
aws s3 cp $BACKUP_DIR/db_$DATE.sql.gz s3://your-bucket/backups/

# Keep only last 30 days locally
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete

echo "Backup completed: db_$DATE.sql.gz"
```

**Schedule with cron:**
```bash
crontab -e

# Daily at 2 AM
0 2 * * * /path/to/backup.sh >> /var/log/backup.log 2>&1
```

**Restore:**
```bash
gunzip -c backups/db_20240121_020000.sql.gz | docker-compose exec -T postgres psql -U clevio -d clevio_prod
```

---

## Scaling

### Horizontal Scaling

**Using Docker Swarm:**
```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml clevio

# Scale backend
docker service scale clevio_backend=3

# Scale frontend
docker service scale clevio_frontend=2
```

**Using Kubernetes:**
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: clevio-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: clevio-backend
  template:
    metadata:
      labels:
        app: clevio-backend
    spec:
      containers:
      - name: backend
        image: your-registry/clevio-backend:latest
        resources:
          requests:
            cpu: 100m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi
```

### Vertical Scaling

**Increase Docker resources:**
```yaml
# docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2G
        reservations:
          cpus: '1.0'
          memory: 1G
```

---

## Troubleshooting

### Backend not starting

**Check logs:**
```bash
docker-compose logs backend
```

**Common issues:**
- DATABASE_URL incorrect → verify PostgreSQL connection
- JWT_SECRET missing → add to .env
- Port 3001 in use → change PORT in .env

### Frontend not loading

**Check nginx logs:**
```bash
docker-compose logs frontend
```

**Common issues:**
- API calls failing → verify VITE_API_URL
- Build failed → run `npm run build` locally first
- CORS errors → verify APP_BASE_URL in backend .env

### Database connection errors

**Test connection:**
```bash
docker-compose exec postgres psql -U clevio -d clevio_prod -c "SELECT version();"
```

**Reset database:**
```bash
docker-compose down -v
docker-compose up -d postgres
docker-compose exec backend npx prisma migrate deploy
```

### Performance issues

**Check resource usage:**
```bash
docker stats
```

**Optimize Prisma queries:**
```bash
# Enable query logging
docker-compose exec backend npx prisma studio
```

**Add database indexes** (see POSTGRESQL_MIGRATION.md)

---

## Production Checklist

Before going live:

- [ ] All environment variables set correctly
- [ ] PostgreSQL configured with strong password
- [ ] JWT_SECRET is 32+ characters random string
- [ ] SendGrid API key configured and verified
- [ ] SSL certificate installed and auto-renewal working
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled
- [ ] Database backups scheduled
- [ ] Monitoring/alerting configured
- [ ] Health checks passing
- [ ] Error tracking (Sentry) integrated
- [ ] Load testing completed
- [ ] Security audit performed
- [ ] Rollback plan documented
- [ ] Team trained on deployment process

---

## Support & Resources

- **Documentation**: This file + SECURITY_REVIEW.md + POSTGRESQL_MIGRATION.md
- **Issue Tracking**: GitHub Issues
- **Status Page**: https://status.your-domain.com (setup with Statuspage.io)
- **Monitoring Dashboard**: http://your-domain.com:3000 (Grafana)

---

## Next Steps

1. Review [SECURITY_REVIEW.md](./SECURITY_REVIEW.md) for security improvements
2. Follow [POSTGRESQL_MIGRATION.md](./POSTGRESQL_MIGRATION.md) to switch to PostgreSQL
3. Setup CI/CD pipeline (`.github/workflows/ci.yml` is ready)
4. Configure monitoring and alerts
5. Run load tests
6. Schedule team demo/training
7. Launch! 🚀
