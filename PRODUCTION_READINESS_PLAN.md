# CLEVIO Production-Readiness Plan
**Created:** January 21, 2026  
**Estimated Total Time:** 8-13 days  
**Target:** Fully production-ready application

---

## 📋 TABLE OF CONTENTS

1. [Critical Path (Must Do)](#phase-1-critical-path-security--data-integrity)
2. [Quality Assurance (Should Do)](#phase-2-quality-assurance-testing)
3. [Type Safety (Nice to Have)](#phase-3-type-safety-typescript-cleanup)
4. [Production Polish](#phase-4-production-polish)
5. [Deployment & Verification](#phase-5-deployment--verification)

---

## PHASE 1: Critical Path (Security & Data Integrity)
**Duration:** 3-4 days  
**Priority:** 🚨 BLOCKING (Cannot deploy without this)

### Task 1.1: Implement JWT Authentication (2-3 days)

**Current Issue:** All dashboard APIs use insecure `?email=` query params.

**Step-by-step fix:**

#### 1.1.1 Install JWT dependency
```bash
cd figma/server
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken
```

#### 1.1.2 Create auth middleware
**File:** `figma/server/src/middleware/authenticate.ts`
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: payload.id }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(500).json({ error: 'Authentication error' });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
```

#### 1.1.3 Update verify-2fa to return JWT
**File:** `figma/server/src/server.ts` (around line 358)
```typescript
// After successful OTP verification
app.post('/api/user/verify-2fa', authLimiter, async (req, res) => {
  // ... existing validation ...
  
  if (otp.code === code) {
    // Mark OTP as verified
    await prisma.otpCode.updateMany({
      where: { email },
      data: { verified: true }
    });

    // Mark user as verified
    await prisma.user.update({
      where: { email },
      data: { verified: true }
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' } // 7-day expiry
    );

    res.status(200).json({ 
      success: true,
      token, // Return token to frontend
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  }
  // ... rest of code
});
```

#### 1.1.4 Apply middleware to all protected routes
**File:** `figma/server/src/server.ts`
```typescript
import { authenticate, requireAdmin, AuthRequest } from './middleware/authenticate';

// Update all dashboard endpoints
app.get('/api/user/me', authenticate, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id }, // Use authenticated user ID
    include: { company: { include: { /* ... */ } } }
  });
  res.json(user);
});

app.get('/api/company', authenticate, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: { company: true }
  });
  res.json({ company: user?.company });
});

// Apply to ALL dashboard endpoints:
// - /api/company (GET, PUT)
// - /api/notifications (GET, PUT)
// - /api/team (GET, POST, PUT, DELETE)
// - /api/payments/amex (GET, PUT)
// - /api/billing/history (GET)
// - /api/subscriptions (GET, PUT)
// - /api/payroll/* (GET, PUT, POST)
// - /api/advisory (GET, POST)

// Admin endpoints need both authenticate + requireAdmin
app.get('/api/admin/dashboard', authenticate, requireAdmin, async (req, res) => {
  // Admin-only logic
});
```

#### 1.1.5 Update frontend to use JWT
**File:** `figma/src/app/utils/api-client.ts`
```typescript
export async function apiFetch(endpoint: string, options: RequestOptions = {}) {
  const { params, ...fetchOptions } = options;
  
  // Get token from localStorage
  const token = localStorage.getItem('authToken');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}
```

**File:** `figma/src/app/pages/signin.tsx`
```typescript
// After successful 2FA verification
const verifyResponse = await apiFetch('/api/user/verify-2fa', {
  method: 'POST',
  body: { email, code: otpCode },
});

if (verifyResponse.success) {
  // Store JWT token
  localStorage.setItem('authToken', verifyResponse.token);
  localStorage.setItem('userLoggedIn', 'true');
  localStorage.setItem('userEmail', email);
  
  // Fetch user data
  await refreshUserData();
  navigate('/dashboard');
}
```

**Verification:**
```bash
# Test authentication
curl -X GET http://localhost:3001/api/user/me
# Should return 401 Unauthorized

curl -X GET http://localhost:3001/api/user/me \
  -H "Authorization: Bearer eyJhbGc..."
# Should return user data
```

**Commit:**
```bash
git add .
git commit -m "security: implement JWT authentication for all dashboard APIs

- Add authenticate middleware with JWT verification
- Replace query param auth with Bearer tokens
- Update all 24 dashboard endpoints to require auth
- Add admin role checking middleware
- Update frontend to send Authorization header
- Store/send JWT token from localStorage

BREAKING CHANGE: All dashboard APIs now require Bearer token"
```

---

### Task 1.2: Fix Prisma Schema Foreign Keys (1 day)

**Current Issue:** AdvisorySession and AmexCard missing company links.

#### 1.2.1 Update Prisma schema
**File:** `figma/server/prisma/schema.prisma`

```prisma
// Fix Company relations
model Company {
  id              String   @id @default(uuid())
  // ... existing fields ...
  
  // Relations
  employees       Employee[]
  subscriptions   Subscription[]
  payrollSchedule PayrollSchedule?
  billingHistory  BillingHistory[]
  notificationPreferences NotificationPreferences?
  advisorySessions AdvisorySession[]  // ADD THIS
  amexCard        AmexCard?          // ADD THIS
}

// Fix AdvisorySession
model AdvisorySession {
  id          String   @id @default(uuid())
  type        String
  date        DateTime
  time        String
  duration    Int
  advisor     String
  status      String
  meetingLink String?
  notes       String?
  
  // ADD THESE LINES:
  companyId   String
  company     Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([date])
  @@index([companyId])  // ADD THIS
}

// Fix AmexCard
model AmexCard {
  id         String   @id @default(uuid())
  last4      String
  cardName   String
  expiryMonth Int?
  expiryYear  Int?
  token      String?
  connected  Boolean  @default(false)
  
  // ADD THESE LINES:
  companyId  String   @unique
  company    Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  @@index([last4])
}

// Remove or fix ContactInfo (currently orphaned)
// Option 1: Remove it completely if not used
// Option 2: Link it to Company
model ContactInfo {
  id         String  @id @default(uuid())
  firstName  String
  lastName   String
  phone      String
  email      String
  
  // ADD IF KEEPING:
  companyId  String
  company    Company @relation(fields: [companyId], references: [id], onDelete: Cascade)
  
  @@index([email])
  @@index([companyId])
}
```

#### 1.2.2 Create migration
```bash
cd figma/server

# Generate migration
npx prisma migrate dev --name add_missing_foreign_keys

# This will:
# 1. Create migration file
# 2. Apply to database
# 3. Regenerate Prisma Client
```

#### 1.2.3 Update server code to use new relations
**File:** `figma/server/src/server.ts`

```typescript
// Update advisory endpoints to require companyId
app.post('/api/advisory', authenticate, async (req: AuthRequest, res) => {
  const { type, date, time, duration, advisor, notes } = req.body;
  
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: { company: true }
  });

  if (!user?.company) {
    return res.status(400).json({ error: 'No company found' });
  }

  const session = await prisma.advisorySession.create({
    data: {
      type,
      date: new Date(date),
      time,
      duration: duration || 60,
      advisor: advisor || 'TBD',
      status: 'scheduled',
      notes,
      companyId: user.company.id, // Use the foreign key
    }
  });

  res.json({ session });
});

// Update AMEX endpoints
app.put('/api/payments/amex', authenticate, async (req: AuthRequest, res) => {
  const { last4, cardName, expiryMonth, expiryYear } = req.body;
  
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: { company: true }
  });

  if (!user?.company) {
    return res.status(400).json({ error: 'No company found' });
  }

  const card = await prisma.amexCard.upsert({
    where: { companyId: user.company.id },
    update: { last4, cardName, expiryMonth, expiryYear, connected: true },
    create: {
      last4,
      cardName,
      expiryMonth,
      expiryYear,
      connected: true,
      companyId: user.company.id, // Use the foreign key
    }
  });

  res.json({ card });
});
```

**Verification:**
```bash
# Check migration applied
npx prisma migrate status

# Verify in Prisma Studio
npx prisma studio
# Check that AdvisorySession and AmexCard now show company relationship
```

**Commit:**
```bash
git add .
git commit -m "fix(schema): add missing foreign keys to AdvisorySession and AmexCard

- Add companyId to AdvisorySession model
- Add companyId to AmexCard model  
- Add indexes for new foreign keys
- Update Company model with new relations
- Update server code to use foreign keys
- Create and apply Prisma migration

Fixes data integrity issues identified in audit"
```

---

### Task 1.3: Add JWT_SECRET to Environment (30 min)

**File:** `figma/server/.env`
```bash
# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Add to .env
JWT_SECRET="your-generated-64-character-hex-string-here"
```

**File:** `figma/server/.env.example`
```bash
# Add example
JWT_SECRET="change-this-to-a-secure-random-string-in-production"
```

**Commit:**
```bash
git add figma/server/.env.example
git commit -m "config: add JWT_SECRET to environment variables

- Add JWT_SECRET configuration
- Update .env.example with placeholder
- Document requirement in DEPLOYMENT_GUIDE.md"
```

---

## PHASE 2: Quality Assurance (Testing)
**Duration:** 2-3 days  
**Priority:** ⚠️ HIGH (Blocks confidence in deployment)

### Task 2.1: Install Test Dependencies (15 min)

```bash
# Backend
cd figma/server
npm install --save-dev \
  jest@29 \
  ts-jest@29 \
  @types/jest@29 \
  supertest@6 \
  @types/supertest@6

# Frontend  
cd ../figma
npm install --save-dev \
  vitest@1 \
  @testing-library/react@14 \
  @testing-library/jest-dom@6 \
  @testing-library/user-event@14 \
  jsdom@23 \
  @vitest/ui@1
```

**Commit:**
```bash
git add package.json package-lock.json
git commit -m "test: install testing dependencies

Backend: jest, ts-jest, supertest
Frontend: vitest, @testing-library/react"
```

---

### Task 2.2: Fix Test Files (1-2 days)

#### 2.2.1 Export app from server.ts
**File:** `figma/server/src/server.ts` (at bottom)
```typescript
// At the end of the file, BEFORE app.listen()
export { app }; // Export for testing

// Only start server if not imported
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
```

#### 2.2.2 Fix Prisma model names in tests
**File:** `figma/server/src/__tests__/auth.test.ts`

Find and replace all instances:
- `prisma.otpCode` → `prisma.oTPCode`

```typescript
// OLD:
const otp = await prisma.otpCode.findFirst({...});

// NEW:
const otp = await prisma.oTPCode.findFirst({...});
```

#### 2.2.3 Update tests to use JWT auth
**File:** `figma/server/src/__tests__/dashboard.test.ts`
```typescript
import jwt from 'jsonwebtoken';

describe('Dashboard API', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Create test user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        passwordHash: await bcrypt.hash('password', 10),
        firstName: 'Test',
        lastName: 'User',
        verified: true,
      }
    });
    userId = user.id;

    // Generate test token
    authToken = jwt.sign(
      { id: user.id, email: user.email, role: 'user' },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
  });

  it('should get user data with valid token', async () => {
    const res = await request(app)
      .get('/api/user/me')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(res.body.email).toBe('test@example.com');
  });

  it('should reject request without token', async () => {
    const res = await request(app)
      .get('/api/user/me')
      .expect(401);

    expect(res.body.error).toMatch(/token/i);
  });
});
```

#### 2.2.4 Run tests and fix failures
```bash
# Backend tests
cd figma/server
npm test

# Fix any failures one by one
# Common issues:
# - Database not seeded
# - Async timing issues
# - Mock data inconsistencies
```

**Commit after each fix:**
```bash
git add .
git commit -m "test: fix backend auth tests to use JWT tokens"
git commit -m "test: fix Prisma model name from otpCode to oTPCode"
git commit -m "test: export app from server.ts for testing"
```

---

### Task 2.3: Manual QA Testing (1 day)

Create manual test checklist:

**File:** `figma/MANUAL_QA_CHECKLIST.md`
```markdown
# Manual QA Checklist

## Auth Flow
- [ ] Signup with valid email/password
- [ ] Receive OTP in console
- [ ] Verify OTP successfully
- [ ] Receive JWT token
- [ ] Redirect to dashboard
- [ ] Refresh page - still authenticated
- [ ] Logout - clears token
- [ ] Try accessing dashboard after logout - redirects to signin
- [ ] Login with wrong password - shows error
- [ ] Login with wrong OTP - shows error
- [ ] Resend OTP - works with cooldown
- [ ] Spam resend OTP - rate limited

## Dashboard - Overview
- [ ] Shows company name
- [ ] Shows team count
- [ ] Shows "action required" if team < 5
- [ ] Shows AMEX status
- [ ] Shows subscription status

## Dashboard - Employees
- [ ] Add employee form opens
- [ ] Add employee with required fields - saves
- [ ] Add employee with missing fields - shows validation
- [ ] List shows all employees
- [ ] Edit employee - saves changes
- [ ] Delete employee - removes from list
- [ ] Team count updates after add/delete

## Dashboard - Services
- [ ] Toggle payroll tier - persists
- [ ] Toggle tax tier - persists
- [ ] Toggle advisory tier - persists
- [ ] Total rate calculation correct
- [ ] Cannot disable payroll before 6 months
- [ ] Shows commitment end date

## Dashboard - Payroll
- [ ] Locked when team < 5
- [ ] Locked when AMEX not connected
- [ ] Locked when payroll tier off
- [ ] Unlocked when all requirements met
- [ ] Schedule changes save
- [ ] Run payroll creates billing entry

## Dashboard - Payments
- [ ] Connect AMEX form works
- [ ] Fee breakdown shows correct %
- [ ] Billing history displays entries
- [ ] After connecting AMEX - payroll unlocks

## Dashboard - Advisory
- [ ] Locked when team < 5
- [ ] Locked when no tax/advisory tier
- [ ] Unlocked when requirements met
- [ ] Schedule session saves
- [ ] Sessions list displays correctly

## Dashboard - Settings
- [ ] Company profile saves
- [ ] Contact info validates phone
- [ ] Notification toggles persist
- [ ] Change password works
- [ ] 2FA settings accessible
```

Run through checklist and document failures.

**Commit:**
```bash
git add MANUAL_QA_CHECKLIST.md
git commit -m "test: add manual QA checklist for dashboard features"
```

---

## PHASE 3: Type Safety (TypeScript Cleanup)
**Duration:** 3-5 days  
**Priority:** 🔵 MEDIUM (Improves maintainability)

### Task 3.1: Fix Prisma Include Types (2 days)

**Problem:** Queries use `include` but types don't reflect it.

**Solution:** Use `Prisma.UserGetPayload` with includes.

**File:** `figma/server/src/types/prisma.ts` (create new)
```typescript
import { Prisma } from '@prisma/client';

// User with company and all relations
export type UserWithCompany = Prisma.UserGetPayload<{
  include: {
    company: {
      include: {
        employees: true;
        subscriptions: true;
        payrollSchedule: true;
        notificationPreferences: true;
        billingHistory: true;
        advisorySessions: true;
        amexCard: true;
      };
    };
  };
}>;

// Company with all relations
export type CompanyWithRelations = Prisma.CompanyGetPayload<{
  include: {
    employees: true;
    subscriptions: true;
    payrollSchedule: true;
    notificationPreferences: true;
    billingHistory: true;
    advisorySessions: true;
    amexCard: true;
  };
}>;
```

**File:** `figma/server/src/server.ts`
```typescript
import { UserWithCompany, CompanyWithRelations } from './types/prisma';

app.get('/api/user/me', authenticate, async (req: AuthRequest, res) => {
  const user: UserWithCompany | null = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: {
      company: {
        include: {
          employees: true,
          subscriptions: true,
          payrollSchedule: true,
          notificationPreferences: true,
          billingHistory: {
            orderBy: { date: 'desc' },
            take: 10
          },
          advisorySessions: {
            where: { date: { gte: new Date() } },
            orderBy: { date: 'asc' }
          },
          amexCard: true,
        }
      }
    }
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Now user.company is properly typed
  res.json({
    user: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    company: user.company ? {
      id: user.company.id,
      name: user.company.name,
      employees: user.company.employees,
      subscriptions: user.company.subscriptions[0] || null,
      payrollSchedule: user.company.payrollSchedule,
      billingHistory: user.company.billingHistory,
      advisorySessions: user.company.advisorySessions,
      amexCard: user.company.amexCard,
    } : null
  });
});
```

**Commit:**
```bash
git add .
git commit -m "fix(types): add proper Prisma include types for user queries

- Create types/prisma.ts with UserWithCompany type
- Use Prisma.UserGetPayload for proper type inference
- Update /api/user/me with correct types
- Fixes TypeScript errors in server.ts"
```

---

### Task 3.2: Fix Express Request Types (1 day)

**Problem:** `req.query` is `ParsedQs | string | ...` not `string`.

**Solution:** Type assertion or validation.

```typescript
// Option 1: Type guard
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

app.get('/api/example', (req, res) => {
  const email = req.query.email;
  
  if (!isString(email)) {
    return res.status(400).json({ error: 'Email must be a string' });
  }
  
  // Now email is typed as string
});

// Option 2: Use AuthRequest (after middleware)
app.get('/api/example', authenticate, async (req: AuthRequest, res) => {
  // Don't use query params - use req.user from JWT
  const userId: string = req.user!.id;
});
```

**Commit:**
```bash
git add .
git commit -m "fix(types): add type guards for Express request query params

- Create isString type guard
- Validate query params before use
- Use AuthRequest type after authenticate middleware"
```

---

### Task 3.3: Fix Missing Return Types (1 day)

**Problem:** Many async handlers don't have explicit return types.

```typescript
// Before
app.get('/api/example', async (req, res) => {
  // ...
});

// After
app.get('/api/example', async (req: Request, res: Response): Promise<void> => {
  // ...
});
```

Run through all endpoints and add return types.

**Commit:**
```bash
git add .
git commit -m "fix(types): add explicit return types to all route handlers

- Add Promise<void> to async handlers
- Ensures all code paths return correctly
- Fixes TS7030 errors"
```

---

### Task 3.4: Fix Any Types (1 day)

**Problem:** Implicit `any` types throughout.

```typescript
// Find all 'any' types
grep -r "any" src/

// Fix with proper types
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

**Commit:**
```bash
git add .
git commit -m "fix(types): replace implicit any types with explicit types

- Add types to error handlers
- Type all function parameters
- Fixes all remaining TS7006 errors"
```

---

### Task 3.5: Verify TypeScript Build (30 min)

```bash
# Backend
cd figma/server
npm run typecheck  # Should pass with 0 errors
npm run build      # Should succeed

# Frontend  
cd ../figma
npm run typecheck  # Should pass with 0 errors
npm run build      # Should succeed
```

**If passes:**
```bash
git add .
git commit -m "chore: verify TypeScript builds pass cleanly

- Backend: 0 type errors, build succeeds
- Frontend: 0 type errors, build succeeds
- All type safety issues resolved"
```

---

## PHASE 4: Production Polish
**Duration:** 1-2 days  
**Priority:** 🟢 LOW (Improves quality)

### Task 4.1: Add Request Validation (1 day)

Install validation library:
```bash
cd figma/server
npm install zod
```

Create validation schemas:
```typescript
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  companyName: z.string().min(1),
});

app.post('/api/user/signup', async (req, res) => {
  try {
    const data = signupSchema.parse(req.body);
    // Use validated data
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
  }
});
```

**Commit:**
```bash
git add .
git commit -m "feat(validation): add Zod request validation to all endpoints

- Install zod for runtime type checking
- Add validation schemas for all POST/PUT endpoints
- Return detailed validation errors to client"
```

---

### Task 4.2: Add Comprehensive Logging (1 day)

```bash
npm install winston
```

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (isDev) {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Use throughout
logger.info('User logged in', { userId, email });
logger.error('Database error', { error: err.message, stack: err.stack });
```

**Commit:**
```bash
git add .
git commit -m "feat(logging): add Winston structured logging

- Replace console.log with Winston logger
- Log errors to file in production
- Add request correlation IDs"
```

---

### Task 4.3: Add API Rate Limiting (All Endpoints) (2 hours)

```typescript
const dashboardLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: 'Too many requests, please try again later'
});

// Apply to all dashboard routes
app.use('/api/user', dashboardLimiter);
app.use('/api/company', dashboardLimiter);
app.use('/api/team', dashboardLimiter);
// etc.
```

**Commit:**
```bash
git add .
git commit -m "security: add rate limiting to all dashboard APIs

- 60 requests per minute per IP
- Prevents abuse of dashboard endpoints
- Protects against DoS attacks"
```

---

## PHASE 5: Deployment & Verification
**Duration:** 1-2 days  
**Priority:** 🎯 FINAL STEP

### Task 5.1: Update Docker Configurations (2 hours)

Ensure TypeScript build works in Docker:

**File:** `figma/server/Dockerfile`
```dockerfile
# Verify TypeScript builds correctly
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build  # This must succeed now

# Production
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma
RUN npx prisma generate
CMD ["node", "dist/server.js"]
```

**Test:**
```bash
cd figma/server
docker build -t clevio-backend .
docker run -p 3001:3001 clevio-backend
```

**Commit:**
```bash
git add .
git commit -m "fix(docker): update Dockerfile to use TypeScript build

- Ensure npm run build succeeds in Docker
- Copy compiled dist/ folder to production image
- Verify Prisma client generation works"
```

---

### Task 5.2: Update Environment Documentation (1 hour)

**File:** `DEPLOYMENT_GUIDE.md`

Add section on JWT_SECRET requirement, updated auth flow, etc.

**Commit:**
```bash
git add .
git commit -m "docs: update deployment guide with JWT auth requirements

- Document JWT_SECRET environment variable
- Update API authentication section
- Add JWT token refresh strategy"
```

---

### Task 5.3: Run Full Integration Test (2 hours)

```bash
# Start both services
docker-compose up -d

# Run integration tests
cd figma/server
npm run test:integration  # If you create integration tests

# Manual verification
open http://localhost/
# Go through MANUAL_QA_CHECKLIST.md
```

**Commit:**
```bash
git add .
git commit -m "test: verify full stack integration with Docker

- All services start successfully
- Database migrations apply
- Frontend connects to backend
- JWT authentication works end-to-end"
```

---

### Task 5.4: Security Audit Checklist (1 hour)

Run final security checks:

```bash
# Backend
cd figma/server
npm audit fix
npm audit --audit-level=high  # Should have 0 high vulnerabilities

# Frontend
cd ../figma
npm audit fix
npm audit --audit-level=high
```

**File:** `SECURITY_CHECKLIST.md`
```markdown
# Security Checklist

- [x] JWT authentication on all dashboard APIs
- [x] JWT_SECRET is 64+ characters
- [x] Passwords hashed with bcrypt
- [x] Rate limiting on all endpoints
- [x] Helmet security headers enabled
- [x] CORS restricted to known origins
- [x] No secrets in git repository
- [x] All dependencies audited (0 high vulns)
- [x] SQL injection prevented (Prisma ORM)
- [x] XSS prevented (React auto-escaping)
- [x] CSRF tokens (if using cookies)
- [x] Database foreign keys enforced
- [x] Input validation on all endpoints
- [x] Error messages don't leak sensitive data
- [x] Logs don't contain passwords/tokens
```

**Commit:**
```bash
git add .
git commit -m "security: complete final security audit checklist

- All dependencies updated
- 0 high-severity vulnerabilities
- All authentication properly implemented
- Security best practices followed"
```

---

### Task 5.5: Create Release Tag (10 min)

```bash
# Tag the release
git tag -a v1.0.0-rc1 -m "Release Candidate 1 - Production Ready

- JWT authentication implemented
- Prisma schema fixed (foreign keys)
- All tests passing
- TypeScript builds cleanly
- Security audit completed
- Docker deployment verified
"

git push origin v1.0.0-rc1
```

---

## PHASE 6: Post-Deployment Monitoring
**Duration:** Ongoing  
**Priority:** 🔄 CONTINUOUS

### Task 6.1: Set Up Monitoring

1. **Application Performance Monitoring (APM)**
   - [ ] Sentry for error tracking
   - [ ] New Relic or Datadog for performance
   - [ ] Uptime monitoring (UptimeRobot, Pingdom)

2. **Logging**
   - [ ] Centralized log aggregation (Loki, ELK stack)
   - [ ] Log rotation configured
   - [ ] Alert on error spikes

3. **Metrics**
   - [ ] API response times
   - [ ] Database query performance
   - [ ] Error rates
   - [ ] User session length

---

## SUCCESS CRITERIA

### Definition of "Production-Ready"

- ✅ All APIs protected with JWT authentication
- ✅ Prisma schema has proper foreign keys
- ✅ TypeScript builds with 0 errors
- ✅ All tests pass (backend + frontend)
- ✅ Manual QA checklist 100% passing
- ✅ Docker build succeeds
- ✅ Security audit checklist complete
- ✅ 0 high-severity npm vulnerabilities
- ✅ Documentation updated
- ✅ Can deploy with `docker-compose up`

---

## TIMELINE SUMMARY

| Phase | Duration | Priority | Can Skip? |
|-------|----------|----------|-----------|
| Phase 1: Security & Schema | 3-4 days | 🚨 CRITICAL | ❌ NO |
| Phase 2: Testing | 2-3 days | ⚠️ HIGH | ⚠️ Risky |
| Phase 3: TypeScript | 3-5 days | 🔵 MEDIUM | ✅ Yes* |
| Phase 4: Polish | 1-2 days | 🟢 LOW | ✅ Yes |
| Phase 5: Deployment | 1-2 days | 🎯 REQUIRED | ❌ NO |
| **Total** | **10-16 days** | | |

*Can skip Phase 3 if willing to accept type safety issues (code still runs)

---

## RISK MITIGATION

### If Timeline is Too Long

**Minimum Viable Production:**
1. ✅ Phase 1 (Security + Schema) - MUST DO
2. ✅ Phase 5 (Deployment) - MUST DO
3. ⚠️ Phase 2 (Testing) - Manual QA only
4. ❌ Phase 3 (TypeScript) - Skip
5. ❌ Phase 4 (Polish) - Skip

**Total:** 4-6 days (minimum)

---

## NEXT STEPS

1. **Review this plan** with team
2. **Prioritize phases** based on launch timeline
3. **Start with Phase 1.1** (JWT auth) - most critical
4. **Commit after each task** - keep changes reversible
5. **Test continuously** - don't wait until the end

---

## APPENDIX: Quick Reference Commands

```bash
# Development
npm run dev          # Start dev server
npm run typecheck    # Check types
npm test            # Run tests

# Build
npm run build       # Build for production
npm run preview     # Preview production build

# Docker
docker-compose up -d              # Start all services
docker-compose logs -f backend    # View backend logs
docker-compose down              # Stop services

# Database
npx prisma migrate dev           # Create & apply migration
npx prisma studio               # Open database GUI
npx prisma generate             # Regenerate Prisma Client

# Git
git status                      # Check changes
git add .                       # Stage all changes
git commit -m "message"         # Commit changes
git push                        # Push to remote
```

---

**Plan Status:** Ready to execute  
**Estimated Completion:** 10-16 days  
**Success Rate:** High (if followed systematically)

