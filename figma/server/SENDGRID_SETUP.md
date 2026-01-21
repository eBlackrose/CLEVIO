# 📧 SendGrid Setup Guide for CLEVIO

Your SendGrid API key is configured! Follow these steps to complete the integration.

---

## ✅ **Current Status**

- ✅ SendGrid account created
- ✅ API key generated: `SG.6AKPozpu...`
- ✅ API key added to `/server/.env`
- ✅ Backend server code ready with SendGrid integration
- ⏳ **Next:** Verify sender email & test

---

## 🚀 **Step 1: Verify Your Sender Email**

**SendGrid requires you to verify your sender email address before sending emails.**

### **Option A: Single Sender Verification (Recommended for Testing)**

1. **Go to SendGrid Dashboard:**
   - https://app.sendgrid.com/

2. **Navigate to Settings:**
   - Click **Settings** in left sidebar
   - Click **Sender Authentication**

3. **Choose Single Sender Verification:**
   - Click **Get Started** under "Single Sender Verification"
   - Click **Create New Sender**

4. **Fill out the form:**
   ```
   From Name: CLEVIO
   From Email Address: [YOUR EMAIL - e.g., chadrobertson@telecom.team]
   Reply To: [SAME EMAIL]
   Company Address: [Your address]
   City: [Your city]
   State/Province: [Your state]
   Zip Code: [Your zip]
   Country: [Your country]
   Nickname: CLEVIO Production
   ```

5. **Click "Create"**

6. **Check your email inbox:**
   - You'll receive a verification email from SendGrid
   - Click the verification link
   - You should see "Sender verified successfully!"

7. **Update `/server/.env`:**
   ```env
   SENDGRID_FROM_EMAIL=chadrobertson@telecom.team
   ```
   (Replace with the email you just verified)

---

### **Option B: Domain Authentication (Recommended for Production)**

If you own a domain (e.g., `clevio.com`):

1. **Settings → Sender Authentication**
2. **Click "Authenticate Your Domain"**
3. **Follow DNS configuration steps**
4. **Use:** `noreply@yourdomain.com` as sender email

---

## 🧪 **Step 2: Test SendGrid Integration**

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies (if not done):**
   ```bash
   npm install
   ```

3. **Make sure your .env file has the correct verified email:**
   ```bash
   cat .env
   ```
   
   Should show:
   ```env
   SENDGRID_API_KEY=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
   SENDGRID_FROM_EMAIL=your-verified-email@example.com
   ```

4. **Run the test script:**
   ```bash
   node test-sendgrid.js
   ```

5. **Expected output (SUCCESS):**
   ```
   🧪 ═══════════════════════════════════════════════════════
      SendGrid Integration Test
   ═══════════════════════════════════════════════════════

   ✅ Configuration found:
      API Key: SG.6AKPozpuQPO...
      From Email: your-verified-email@example.com

   📧 Sending test email...
      To: your-verified-email@example.com
      From: your-verified-email@example.com
      Subject: ✅ CLEVIO SendGrid Integration Test

   ✅ ═══════════════════════════════════════════════════════
      EMAIL SENT SUCCESSFULLY!
   ═══════════════════════════════════════════════════════

   📬 Check your inbox at: your-verified-email@example.com
   ```

6. **Check your email inbox:**
   - Look for "✅ CLEVIO SendGrid Integration Test"
   - Also check spam/junk folder if not in inbox
   - If you received it, **SendGrid is working!**

---

## 🐛 **Troubleshooting Test Script**

### **Error: "Unauthorized" or 401**

**Problem:** API key is invalid

**Fix:**
```bash
# 1. Go to SendGrid dashboard
# 2. Settings → API Keys
# 3. Delete old key and create new one
# 4. Copy the new key (you only see it once!)
# 5. Update /server/.env with new key:
SENDGRID_API_KEY=SG.new_key_here
# 6. Run test again: node test-sendgrid.js
```

---

### **Error: "Forbidden" or 403**

**Problem:** Sender email not verified

**Fix:**
```bash
# 1. Go to SendGrid → Settings → Sender Authentication
# 2. Verify your sender email (see Step 1 above)
# 3. Wait for verification email and click the link
# 4. Update /server/.env with verified email:
SENDGRID_FROM_EMAIL=verified-email@example.com
# 5. Run test again: node test-sendgrid.js
```

---

### **Error: "does not contain a valid address"**

**Problem:** Email format is invalid

**Fix:**
```bash
# Edit /server/.env and use a valid email:
SENDGRID_FROM_EMAIL=valid-email@example.com
```

---

### **No Email Received**

**Check:**
1. ✅ Spam/Junk folder
2. ✅ Correct email address (check for typos)
3. ✅ Test script showed "EMAIL SENT SUCCESSFULLY"
4. ✅ Wait 1-2 minutes (sometimes delayed)

---

## 🚀 **Step 3: Start the Backend Server**

Once the test email succeeds:

1. **Start the backend server:**
   ```bash
   npm run dev
   ```

2. **You should see:**
   ```
   🚀 ═══════════════════════════════════════════════════════
      CLEVIO Backend Server Started
      Port: 3001
      Environment: development
      SendGrid configured: Yes ← IMPORTANT!
      Debug logging: ENABLED
   ═══════════════════════════════════════════════════════

   📋 Available Endpoints:
      POST /api/user/signup - User registration
      POST /api/user/login - User login (sends 2FA code)
      POST /api/user/verify-2fa - Verify 2FA code
      POST /api/admin/login - Admin authentication
      GET  /api/health - Health check

   👂 Server is listening for requests...
   ```

3. **Keep this terminal open** - the server needs to run while you use the app

---

## 🔌 **Step 4: Connect Frontend to Backend**

1. **Open a new terminal** (keep backend running in first terminal)

2. **Navigate to project root:**
   ```bash
   cd ..  # Go back to main project directory
   ```

3. **Open `/src/app/config/api.ts`**

4. **Change this line:**
   ```typescript
   // Before:
   export const USE_REAL_BACKEND = false;
   
   // After:
   export const USE_REAL_BACKEND = true;
   ```

5. **Save the file**

6. **Start the frontend (if not running):**
   ```bash
   npm run dev
   ```

---

## 🎉 **Step 5: Test Full Email Flow**

1. **Make sure both servers are running:**
   - **Terminal 1:** Backend server (`cd server && npm run dev`)
   - **Terminal 2:** Frontend app (`npm run dev`)

2. **Open CLEVIO in browser:**
   - http://localhost:5173

3. **Create a new account:**
   - Go to Sign Up page
   - Fill in your details
   - Use your verified email address
   - Create account

4. **Sign in:**
   - Go to Sign In page
   - Enter your email and password
   - Click "Sign In"

5. **Watch the backend console:**
   ```
   🔐 [abc123] User Login
     Login attempt: your-email@example.com
     User lookup: Found
     Password validation: Valid
     ✅ Generated OTP for your-email@example.com: 123456
     📧 Sending OTP email to your-email@example.com...
     ✅ OTP email sent successfully to your-email@example.com ← SUCCESS!
   ```

6. **Check your email inbox:**
   - Subject: "CLEVIO - Your Verification Code"
   - Body: Large 6-digit code (e.g., `123456`)

7. **Enter the code from your email:**
   - Paste the 6-digit code into the verification field
   - Click "Verify Code"

8. **Success!** 🎉
   - You're logged into the CLEVIO dashboard
   - Authentication with real email delivery is working!

---

## 📊 **What to Expect**

### **Backend Console (When Email Sent Successfully):**

```
[2025-12-22T10:00:00.000Z] [abc123] POST /api/user/login from ::1
[abc123] Request body: { email: 'your@email.com', password: '[REDACTED]' }

🔐 [abc123] User Login
  Login attempt: your@email.com
  User lookup: Found
  Password validation: Valid
  ✅ Generated OTP for your@email.com: 123456
  OTP expires at: 2025-12-22T10:05:00.000Z
  📧 Sending OTP email to your@email.com...
  ✅ OTP email sent successfully to your@email.com

🔐 ═══════════════════════════════════════
   DEV MODE: OTP CODE FOR your@email.com
   CODE: 123456
   EXPIRES: 12/22/2025, 10:05:00 AM
═══════════════════════════════════════
```

### **Email You'll Receive:**

```
From: CLEVIO <your-verified-email@example.com>
To: your-email@example.com
Subject: CLEVIO - Your Verification Code

Your verification code is:

   123456

This code expires in 5 minutes.

If you didn't request this code, please ignore this email.
```

---

## 🔒 **Security Notes**

**Current Implementation (Development):**
- ✅ Passwords masked in logs: `[REDACTED]`
- ✅ OTP codes expire after 5 minutes
- ✅ Max 5 verification attempts per code
- ✅ Codes are single-use
- ⚠️ Passwords stored in plain text (in-memory)
- ⚠️ User data stored in memory (resets on server restart)

**Production Recommendations:**
- Use bcrypt to hash passwords
- Use PostgreSQL/MongoDB for data persistence
- Add JWT tokens for session management
- Add rate limiting middleware
- Use HTTPS only
- Store secrets in environment variables (not code)

---

## 📝 **Summary**

**Setup Checklist:**
- [x] SendGrid account created
- [x] API key generated and added to `.env`
- [ ] **Sender email verified in SendGrid** ← DO THIS NOW
- [ ] **Run test script:** `node test-sendgrid.js`
- [ ] **Start backend:** `npm run dev`
- [ ] **Update frontend:** `USE_REAL_BACKEND = true`
- [ ] **Test sign in and receive email!**

**Once complete:**
- ✅ Real email delivery via SendGrid
- ✅ 2FA codes sent to user's inbox
- ✅ Complete authentication flow
- ✅ Production-ready email integration

---

## 📞 **Need Help?**

**Common Issues:**

1. **"SendGrid configured: No"**
   - Check `/server/.env` exists and has `SENDGRID_API_KEY`

2. **"SendGrid failed: Unauthorized"**
   - API key is wrong - regenerate in SendGrid dashboard

3. **"SendGrid failed: Forbidden"**
   - Sender email not verified - verify in SendGrid dashboard

4. **Backend not starting:**
   - Make sure you're in `/server` directory
   - Run `npm install` first
   - Check for port conflicts (port 3001)

5. **Frontend can't connect:**
   - Make sure backend server is running
   - Check `USE_REAL_BACKEND = true` in `/src/app/config/api.ts`
   - Both servers should be running simultaneously

**Next Steps:**
1. Verify your sender email in SendGrid (most important!)
2. Run the test script
3. Follow the steps above

🎉 You're minutes away from a fully functional email-based 2FA system!
