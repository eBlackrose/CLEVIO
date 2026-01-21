# CLEVIO Backend API Server

## 🚀 Overview

Node.js/Express backend server for the CLEVIO Financial Services Platform with comprehensive debug logging, 2FA authentication, and email delivery via SendGrid.

---

## 📋 Features

✅ **User Authentication**
- User registration with validation
- Email/password login
- 2FA via 6-digit OTP codes
- Admin authentication

✅ **Comprehensive Debug Logging**
- Request ID tracking for every request
- Console groups for organized output
- Timestamps on all logs
- Development/production log levels
- Sensitive data masking (passwords, OTP codes)
- Network error tracking
- SendGrid integration logging

✅ **Email Delivery**
- SendGrid integration for OTP codes
- HTML email templates
- Error handling and fallbacks
- Development mode console output

✅ **Security Features**
- OTP expiration (5 minutes)
- Rate limiting on 2FA attempts (5 max)
- CORS configuration
- Environment-based configuration
- Password masking in logs

---

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- SendGrid account (for email delivery)

### Setup

1. **Navigate to server directory:**
```bash
cd server
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment:**
```bash
cp .env.example .env
```

4. **Edit `.env` with your settings:**
```env
PORT=3001
NODE_ENV=development
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@clevio.com
FRONTEND_URL=http://localhost:5173
```

5. **Start server:**
```bash
# Development (with auto-reload)
npm run dev

# Production
npm run prod
```

---

## 📡 API Endpoints

### **User Endpoints**

#### **POST /api/user/signup**
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "companyName": "Acme Corp"
}
```

**Response:**
```json
{
  "message": "Account created successfully",
  "email": "user@example.com"
}
```

**Console Output:**
```
🔧 [abc123] User Signup
  Signup attempt: user@example.com
  User data: { email: '...', firstName: 'John', lastName: 'Doe', companyName: 'Acme Corp' }
  ✅ User created successfully: user@example.com
  Total users in database: 1
```

---

#### **POST /api/user/login**
Authenticate user and send 2FA code via email.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "message": "Verification code sent to your email",
  "email": "user@example.com"
}
```

**Console Output (Development):**
```
🔐 [def456] User Login
  Login attempt: user@example.com
  User lookup: Found
  Password validation: Valid
  ✅ Generated OTP for user@example.com: 123456
  OTP expires at: 2025-12-21T12:05:00.000Z
  📧 Sending OTP email to user@example.com...
  ✅ OTP email sent successfully to user@example.com

🔐 ═══════════════════════════════════════
   DEV MODE: OTP CODE FOR user@example.com
   CODE: 123456
   EXPIRES: 12/21/2025, 12:05:00 PM
═══════════════════════════════════════
```

---

#### **POST /api/user/verify-2fa**
Verify 2FA code and complete authentication.

**Request:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response:**
```json
{
  "message": "Verification successful",
  "user": {
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "companyName": "Acme Corp"
  }
}
```

**Console Output:**
```
🔐 [ghi789] 2FA Verification
  2FA verification attempt: user@example.com
  Submitted code: 123456
  Stored OTP lookup: Found
  OTP expiry check: { now: '...', expires: '...', timeRemainingMs: 287000, isExpired: false }
  Code comparison: { expected: '123456', submitted: '123456', matches: true }
  ✅ 2FA verification successful for: user@example.com
  User authenticated: { email: '...', firstName: 'John', lastName: 'Doe' }
```

---

### **Admin Endpoints**

#### **POST /api/admin/login**
Authenticate admin users.

**Request:**
```json
{
  "email": "admin@clevio.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "message": "Admin authenticated successfully",
  "admin": {
    "email": "admin@clevio.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }
}
```

**Console Output:**
```
🔑 [jkl012] ADMIN Login
  ADMIN login attempt: admin@clevio.com
  ADMIN lookup: Found
  ADMIN password validation: Valid
  ✅ ADMIN login successful: admin@clevio.com
```

---

### **Utility Endpoints**

#### **GET /api/health**
Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-21T12:00:00.000Z",
  "environment": "development",
  "sendgridConfigured": true
}
```

---

## 🐛 Debug Logging

### **Console Output Structure**

All requests are logged with:
- **Timestamp:** ISO 8601 format
- **Request ID:** Unique identifier for tracing
- **HTTP Method & Path:** Request details
- **Client IP:** Source of request

### **Console Groups**

Organized logging for complex operations:
- `🔧 User Signup`
- `🔐 User Login`
- `🔐 2FA Verification`
- `🔑 ADMIN Login`

### **Log Levels**

**Development Mode:**
```javascript
console.log()    // General info
console.warn()   // Warnings (user exists, invalid attempts)
console.error()  // Errors (auth failures, network issues)
```

**Production Mode:**
- Less verbose
- Sensitive data always masked
- Critical errors still logged

### **Sensitive Data Masking**

Automatically masks:
- Passwords: `[REDACTED]`
- OTP codes (production): `[REDACTED]`
- OTP codes (development): Visible for debugging

### **Example Full Flow**

```
[2025-12-21T12:00:00.000Z] [abc123] POST /api/user/login from ::1
[abc123] Request body: { email: 'user@example.com', password: '[REDACTED]' }

🔐 [abc123] User Login
  Login attempt: user@example.com
  User lookup: Found
  Password validation: Valid
  ✅ Generated OTP for user@example.com: 123456
  OTP expires at: 2025-12-21T12:05:00.000Z
  📧 Sending OTP email to user@example.com...
  ✅ OTP email sent successfully to user@example.com

[2025-12-21T12:00:30.000Z] [def456] POST /api/user/verify-2fa from ::1
[def456] Request body: { email: 'user@example.com', code: '123456' }

🔐 [def456] 2FA Verification
  2FA verification attempt: user@example.com
  Submitted code: 123456
  Stored OTP lookup: Found
  OTP expiry check: { ... isExpired: false }
  Code comparison: { ... matches: true }
  ✅ 2FA verification successful for: user@example.com
```

---

## 🔧 Development

### **Running in Development Mode**

```bash
npm run dev
```

**Features:**
- Verbose logging enabled
- OTP codes visible in console
- Test admin account pre-configured
- Auto-reload on file changes (nodemon)
- SendGrid failures won't block requests

### **Test Credentials (Development)**

**Admin:**
- Email: `admin@clevio.com`
- Password: `admin123`

**Users:** Create via `/api/user/signup`

---

## 🚨 Error Handling

### **Validation Errors**

```
❌ Signup validation failed - missing fields
```

### **Authentication Errors**

```
❌ Login failed - user not found: user@example.com
❌ Login failed - invalid password for: user@example.com
```

### **2FA Errors**

```
❌ 2FA failed - code expired for: user@example.com
❌ 2FA failed - invalid code for: user@example.com (3 attempts remaining)
❌ 2FA failed - too many attempts for: user@example.com
```

### **SendGrid Errors**

```
❌ SendGrid failed: API key invalid
SendGrid response: { ... }
```

### **Unexpected Errors**

```
❌ [abc123] Unexpected error in login: Connection refused
Stack trace: Error: Connection refused
    at ...
```

---

## 📧 SendGrid Setup

### **Get API Key**

1. Create account at https://sendgrid.com
2. Navigate to Settings → API Keys
3. Create new API key with "Mail Send" permissions
4. Copy key to `.env` file

### **Verify Sender Email**

1. Go to Settings → Sender Authentication
2. Verify your sender email (e.g., noreply@clevio.com)
3. Add to `SENDGRID_FROM_EMAIL` in `.env`

### **Test Email Delivery**

```bash
# Start server
npm run dev

# Make login request
curl -X POST http://localhost:3001/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Check console for SendGrid status
# Check email inbox for OTP code
```

---

## 🔒 Security Recommendations

### **Production Checklist**

- [ ] Use bcrypt to hash passwords (not plain text)
- [ ] Implement JWT tokens for session management
- [ ] Add rate limiting middleware (express-rate-limit)
- [ ] Use HTTPS only
- [ ] Set secure CORS origins
- [ ] Add helmet.js for security headers
- [ ] Use environment-specific secrets
- [ ] Implement database instead of in-memory storage
- [ ] Add API authentication middleware
- [ ] Set up monitoring and alerts
- [ ] Configure log aggregation (e.g., Winston, Sentry)

### **Environment Variables Security**

Never commit `.env` files to git:
```bash
# Add to .gitignore
.env
.env.*
```

---

## 📊 Monitoring

### **Health Check**

```bash
curl http://localhost:3001/api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-21T12:00:00.000Z",
  "environment": "development",
  "sendgridConfigured": true
}
```

### **Server Startup Output**

```
🚀 ═══════════════════════════════════════════════════════
   CLEVIO Backend Server Started
   Port: 3001
   Environment: development
   SendGrid configured: Yes
   Debug logging: ENABLED
═══════════════════════════════════════════════════════

📝 Development Mode Active:
   - Verbose logging enabled
   - OTP codes visible in console
   - Test admin account available
   - Email sending warnings visible

📋 Available Endpoints:
   POST /api/user/signup - User registration
   POST /api/user/login - User login (sends 2FA code)
   POST /api/user/verify-2fa - Verify 2FA code
   POST /api/admin/login - Admin authentication
   GET  /api/health - Health check

👂 Server is listening for requests...
```

---

## 🧪 Testing

### **Manual Testing**

**1. User Signup:**
```bash
curl -X POST http://localhost:3001/api/user/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "companyName": "Test Corp"
  }'
```

**2. User Login (sends OTP):**
```bash
curl -X POST http://localhost:3001/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Check console for OTP code (development mode).

**3. Verify 2FA:**
```bash
curl -X POST http://localhost:3001/api/user/verify-2fa \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "123456"
  }'
```

**4. Admin Login:**
```bash
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@clevio.com",
    "password": "admin123"
  }'
```

---

## 🐛 Troubleshooting

### **"SendGrid API key not configured" Warning**

**Solution:** Add SendGrid API key to `.env`:
```env
SENDGRID_API_KEY=SG.your_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

### **"Failed to send verification code" Error**

**Check:**
1. SendGrid API key is valid
2. Sender email is verified in SendGrid
3. SendGrid account is not suspended
4. Check console for SendGrid error details

### **Port Already in Use**

**Solution:** Change port in `.env` or kill existing process:
```bash
# Find process on port 3001
lsof -i :3001

# Kill process
kill -9 <PID>
```

### **"User not found" Error**

**Solution:** Register user via `/api/user/signup` first, then login.

---

## 📝 License

UNLICENSED - Proprietary software for CLEVIO Financial Services Platform.

---

## 🤝 Support

For issues or questions:
- Check console logs for detailed error messages
- Review request ID for tracking specific requests
- Verify environment variables are set correctly
- Test endpoints with curl commands above
