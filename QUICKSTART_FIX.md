# 🚀 Quick Start: Fix Critical Issues NOW

**Priority:** Get to deployable state FAST  
**Time:** 4-6 days (minimum viable)  
**Goal:** Working, secure application

---

## 🚨 START HERE

If you only have 1 week, do this in order:

### Day 1: Security Foundation

```bash
# 1. Install JWT
cd figma/server
npm install jsonwebtoken @types/jsonwebtoken

# 2. Create auth middleware
mkdir -p src/middleware
touch src/middleware/authenticate.ts
```

Copy this exact code into `src/middleware/authenticate.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

**3. Update server.ts** - Import at top:
```typescript
import jwt from 'jsonwebtoken';
import { authenticate, AuthRequest } from './middleware/authenticate';
```

**4. Update verify-2fa** to return JWT (around line 420):
```typescript
// After successful OTP verification, add this:
const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET!,
  { expiresIn: '7d' }
);

res.status(200).json({ 
  success: true,
  token,  // Add this
  user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
});
```

**5. Protect ALL dashboard endpoints** - Add `authenticate` middleware:
```typescript
app.get('/api/user/me', authenticate, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },  // Use req.user.id instead of query param
    // ... rest of code
  });
});

// Repeat for EVERY dashboard endpoint (24 total):
// /api/company (GET, PUT)
// /api/team (GET, POST, PUT, DELETE)
// /api/subscriptions (GET, PUT)
// /api/payroll/* (all)
// /api/advisory (GET, POST)
// /api/payments/amex (GET, PUT)
// /api/billing/history (GET)
// /api/notifications (GET, PUT)
```

**6. Update frontend API client** - `figma/src/app/utils/api-client.ts`:
```typescript
export async function apiFetch(endpoint: string, options: RequestOptions = {}) {
  const token = localStorage.getItem('authToken');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // ... rest of code
}
```

**7. Store token after login** - `figma/src/app/pages/signin.tsx`:
```typescript
// After successful 2FA verification:
if (verifyResponse.success) {
  localStorage.setItem('authToken', verifyResponse.token);  // Add this
  localStorage.setItem('userLoggedIn', 'true');
  localStorage.setItem('userEmail', email);
  // ... rest of code
}
```

**8. Add JWT_SECRET to .env:**
```bash
# Generate secure secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Add to figma/server/.env
JWT_SECRET="paste-generated-secret-here"
```

**Commit:**
```bash
git add .
git commit -m "security: implement JWT authentication (DAY 1 CRITICAL FIX)"
```

**Test:**
```bash
# Start backend
cd figma/server && npm run dev

# In another terminal, test:
curl http://localhost:3001/api/user/me
# Should return 401 Unauthorized

# After logging in through UI, should work
```

---

### Day 2: Fix Database Schema

**1. Update schema** - `figma/server/prisma/schema.prisma`:

```prisma
// Add to Company model:
model Company {
  // ... existing fields ...
  
  advisorySessions AdvisorySession[]  // ADD
  amexCard        AmexCard?          // ADD
}

// Update AdvisorySession:
model AdvisorySession {
  // ... existing fields ...
  
  companyId   String                    // ADD
  company     Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)  // ADD
  
  @@index([companyId])  // ADD
}

// Update AmexCard:
model AmexCard {
  // ... existing fields ...
  
  companyId  String   @unique          // ADD
  company    Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)  // ADD
}
```

**2. Create migration:**
```bash
cd figma/server
npx prisma migrate dev --name add_missing_foreign_keys
```

**3. Update server code** to use new foreign keys:

```typescript
// Advisory endpoint
app.post('/api/advisory', authenticate, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: { company: true }
  });

  const session = await prisma.advisorySession.create({
    data: {
      // ... other fields ...
      companyId: user!.company!.id,  // ADD THIS
    }
  });
});

// AMEX endpoint
app.put('/api/payments/amex', authenticate, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: { company: true }
  });

  const card = await prisma.amexCard.upsert({
    where: { companyId: user!.company!.id },
    update: { /* ... */ },
    create: {
      // ... other fields ...
      companyId: user!.company!.id,  // ADD THIS
    }
  });
});
```

**Commit:**
```bash
git add .
git commit -m "fix: add missing foreign keys to schema (DAY 2 CRITICAL FIX)"
```

---

### Day 3: Manual Testing

**1. Create test user:**
```bash
# Start both services
cd figma/server && npm run dev  # Terminal 1
cd figma && npm run dev         # Terminal 2
```

**2. Open browser:** http://localhost:5173

**3. Test checklist:**
```markdown
- [ ] Signup with email/password
- [ ] Get OTP from backend console logs
- [ ] Verify OTP
- [ ] Should redirect to dashboard
- [ ] Dashboard loads (not black page)
- [ ] Add company info - saves
- [ ] Add 5 employees - saves
- [ ] Enable payroll tier - saves
- [ ] Connect AMEX - saves
- [ ] Run payroll - creates billing entry
- [ ] Logout - clears session
- [ ] Try accessing /dashboard - redirects to signin
```

**4. Fix any issues found**
- Document in `BUGS_FOUND.md`
- Fix one by one
- Commit each fix

---

### Day 4-5: Install & Run Tests

```bash
# Backend
cd figma/server
npm install --save-dev jest ts-jest @types/jest supertest @types/supertest

# Export app for testing - add to server.ts bottom:
export { app };

# Fix test model names: otpCode → oTPCode
find src/__tests__ -name "*.ts" -exec sed -i 's/prisma\.otpCode/prisma.oTPCode/g' {} +

# Run tests
npm test

# Fix failures one by one
```

```bash
# Frontend
cd figma
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom

# Run tests
npm test

# Fix failures one by one
```

**Commit each fix:**
```bash
git commit -m "test: fix auth tests"
git commit -m "test: fix dashboard tests"
```

---

### Day 6: Deploy

**1. Verify builds work:**
```bash
cd figma && npm run build        # Should succeed
cd figma/server && npm run build # Should succeed now
```

**2. Test Docker:**
```bash
docker-compose up -d
docker-compose logs -f

# Should see:
# - postgres: healthy
# - backend: running on 3001
# - frontend: serving on 80
```

**3. Run migrations:**
```bash
docker-compose exec backend npx prisma migrate deploy
```

**4. Test app:**
```bash
open http://localhost
# Go through test checklist again
```

**5. If all works:**
```bash
git tag v1.0.0-rc1
git push origin v1.0.0-rc1
```

---

## ✅ Minimum Success Criteria

Before calling it "done":

- [x] Can signup/login with JWT tokens
- [x] All dashboard APIs require authentication
- [x] Schema has foreign keys (no orphaned data)
- [x] Tests run and pass (at least auth tests)
- [x] Docker build succeeds
- [x] Can deploy with docker-compose
- [x] Manual QA checklist passes
- [x] No critical npm vulnerabilities

---

## 🆘 If You Get Stuck

### Problem: "npm run build still fails"
**Solution:** Check if you added types to ALL endpoints. Every `async (req, res)` needs `async (req: AuthRequest, res: Response): Promise<void>`.

### Problem: "Tests fail with 'Cannot find module'"
**Solution:** 
```bash
# Make sure app is exported
echo "export { app };" >> figma/server/src/server.ts
```

### Problem: "Frontend gets 401 errors"
**Solution:** Check that token is being sent:
```typescript
// In browser console:
localStorage.getItem('authToken')  // Should see a token
```

### Problem: "Migration fails"
**Solution:**
```bash
# Reset database and rerun
rm figma/server/prisma/dev.db
npx prisma migrate dev
```

---

## 📊 Progress Tracking

Use this to track your progress:

```markdown
## Day 1: Security ✅
- [x] Install JWT
- [x] Create authenticate middleware
- [x] Update verify-2fa to return token
- [x] Protect all dashboard endpoints (24 total)
- [x] Update frontend API client
- [x] Store token in localStorage
- [x] Test: curl returns 401 without token

## Day 2: Schema ✅
- [x] Add foreign keys to schema
- [x] Run migration
- [x] Update advisory endpoint
- [x] Update AMEX endpoint
- [x] Test: relationships work in Prisma Studio

## Day 3: Manual QA ⏳
- [ ] Signup/Login flow
- [ ] Dashboard loads
- [ ] Company profile saves
- [ ] Employees CRUD
- [ ] Subscriptions toggle
- [ ] Payroll runs
- [ ] Advisory schedules

## Day 4-5: Tests ⏳
- [ ] Install test dependencies
- [ ] Export app from server
- [ ] Fix model names in tests
- [ ] Run backend tests
- [ ] Run frontend tests
- [ ] All tests passing

## Day 6: Deploy ⏳
- [ ] npm run build (both)
- [ ] docker-compose up
- [ ] Migrations apply
- [ ] App works in Docker
- [ ] Tag release
```

---

## 🎯 Your Goal This Week

By end of week, you should be able to say:

> "I have a working application with:
> - JWT authentication on all APIs
> - Proper database relationships
> - Passing tests
> - Docker deployment that works
> - No critical security issues"

That's it. That's production-ready enough to deploy to staging.

The TypeScript cleanup (Phase 3) can come later - it's type safety, not functionality.

---

**Ready? Start with Day 1. You've got this! 💪**
