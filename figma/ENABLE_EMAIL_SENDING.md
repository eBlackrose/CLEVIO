# 📧 How to Enable Real Email Sending

Currently, the CLEVIO platform is using a **mock backend** that simulates authentication but doesn't send actual emails. The 6-digit verification code is only shown in your browser's Developer Console.

---

## 🚀 **Quick Fix: Get the Code from Console**

**Fastest way to test right now:**

1. **Open Browser Developer Console:**
   - **Chrome/Edge:** Press `F12` or `Ctrl+Shift+J` (Windows) / `Cmd+Option+J` (Mac)
   - **Firefox:** Press `F12` or `Ctrl+Shift+K` (Windows) / `Cmd+Option+K` (Mac)

2. **Sign in normally** through the CLEVIO app

3. **Look for this in the console:**
   ```
   🔐 ═══════════════════════════════════════
      2FA CODE FOR: your-email@example.com
      CODE: 123456
      EXPIRES: 12/21/2025, 12:05:00 PM
   ═══════════════════════════════════════
   ```

4. **Copy the 6-digit code** and paste it into the verification field

5. **Done!** You'll be logged in.

---

## 📧 **Enable Real Email Sending (Production-Ready)**

To actually send emails with 6-digit codes to your inbox:

### **Step 1: Get SendGrid API Key**

1. **Create free SendGrid account:**
   - Go to https://sendgrid.com/
   - Sign up (free tier includes 100 emails/day)

2. **Create API Key:**
   - Log in to SendGrid
   - Go to **Settings → API Keys**
   - Click **Create API Key**
   - Name: `CLEVIO Production`
   - Permissions: **Full Access** (or at minimum "Mail Send")
   - Click **Create & View**
   - **Copy the API key** (you won't see it again!)

3. **Verify Sender Email:**
   - Go to **Settings → Sender Authentication**
   - Choose **Single Sender Verification**
   - Add `noreply@clevio.com` (or your domain)
   - Check your email and verify

---

### **Step 2: Configure Backend Server**

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file:**
   ```env
   PORT=3001
   NODE_ENV=development
   SENDGRID_API_KEY=SG.paste_your_api_key_here
   SENDGRID_FROM_EMAIL=noreply@clevio.com
   FRONTEND_URL=http://localhost:5173
   ```

   **Replace:**
   - `SG.paste_your_api_key_here` → Your actual SendGrid API key
   - `noreply@clevio.com` → Your verified sender email

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

   **You should see:**
   ```
   🚀 ═══════════════════════════════════════════════════════
      CLEVIO Backend Server Started
      Port: 3001
      Environment: development
      SendGrid configured: Yes
      Debug logging: ENABLED
   ═══════════════════════════════════════════════════════
   
   👂 Server is listening for requests...
   ```

---

### **Step 3: Connect Frontend to Real Backend**

1. **Open `/src/app/config/api.ts`**

2. **Change this line:**
   ```typescript
   // Before:
   export const USE_REAL_BACKEND = false;
   
   // After:
   export const USE_REAL_BACKEND = true;
   ```

3. **Save the file**

4. **Restart your frontend dev server** (if needed):
   ```bash
   npm run dev
   ```

---

### **Step 4: Update Sign In Page to Use API Config**

The sign in page needs to be updated to use the new API configuration. This will be handled automatically.

---

### **Step 5: Test Email Sending**

1. **Start both servers:**
   - **Backend:** `cd server && npm run dev` (Terminal 1)
   - **Frontend:** `npm run dev` (Terminal 2)

2. **Sign in through the app:**
   - Go to http://localhost:5173/signin
   - Enter your email and password
   - Click "Sign In"

3. **Check backend console:**
   ```
   🔐 [abc123] User Login
     Login attempt: your-email@example.com
     User lookup: Found
     Password validation: Valid
     ✅ Generated OTP for your-email@example.com: 123456
     📧 Sending OTP email to your-email@example.com...
     ✅ OTP email sent successfully to your-email@example.com
   ```

4. **Check your email inbox:**
   - Subject: "CLEVIO - Your Verification Code"
   - Body: Shows 6-digit code in large font

5. **Enter the code from your email** in the verification field

6. **Success!** You're logged in with real email authentication.

---

## 🐛 **Troubleshooting**

### **"SendGrid API key not configured" Warning**

**Problem:** Backend server shows:
```
⚠️ SendGrid API key not configured - email sending will fail
```

**Solution:**
- Check `server/.env` file exists
- Verify `SENDGRID_API_KEY=SG.your_key_here` is set
- Restart backend server: `npm run dev`

---

### **"Failed to send verification code" Error**

**Problem:** Backend console shows SendGrid error.

**Check:**
1. ✅ SendGrid API key is correct (check for typos)
2. ✅ Sender email is verified in SendGrid dashboard
3. ✅ SendGrid account is active (not suspended)
4. ✅ You haven't exceeded free tier limits (100 emails/day)

**Backend console will show:**
```
❌ SendGrid failed: Unauthorized
SendGrid response: { errors: [...] }
```

Look at the error message for details.

---

### **Email Not Arriving in Inbox**

**Check:**
1. ✅ Spam/Junk folder
2. ✅ Sender email is verified in SendGrid
3. ✅ Backend console shows "✅ OTP email sent successfully"
4. ✅ Correct email address (check for typos)

**Test SendGrid directly:**
```bash
# In backend directory
node -e "
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('YOUR_API_KEY');
sgMail.send({
  to: 'your-email@example.com',
  from: 'noreply@clevio.com',
  subject: 'Test Email',
  text: 'If you receive this, SendGrid is working!'
});
"
```

---

### **Port 3001 Already in Use**

**Problem:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**
```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or change port in server/.env
PORT=3002
```

---

### **CORS Errors in Browser Console**

**Problem:**
```
Access to fetch at 'http://localhost:3001/api/user/login' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Solution:**
- Backend already has CORS enabled
- Make sure backend server is running
- Check `server/.env` has correct `FRONTEND_URL=http://localhost:5173`

---

## 🔄 **Switching Back to Mock Backend**

If you want to disable email sending and go back to console-only codes:

1. **Open `/src/app/config/api.ts`**
2. **Change:** `export const USE_REAL_BACKEND = false;`
3. **Save and reload**

The 6-digit code will appear in browser console again.

---

## 📊 **Backend Server Console Output**

When emails are successfully sent, you'll see:

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

🔐 ═══════════════════════════════════════
   DEV MODE: OTP CODE FOR user@example.com
   CODE: 123456
   EXPIRES: 12/21/2025, 12:05:00 PM
═══════════════════════════════════════
```

---

## ✅ **Summary**

**Current State:**
- ❌ No emails sent (mock backend only)
- ✅ Codes shown in browser console
- ✅ Full authentication flow works

**To Enable Email Sending:**
1. Get SendGrid API key (free)
2. Configure `server/.env`
3. Start backend server
4. Set `USE_REAL_BACKEND = true` in `/src/app/config/api.ts`
5. Sign in → Receive email → Enter code from email → Success!

**Need Help?**
- Check backend console for detailed error messages
- All authentication steps are logged with request IDs
- SendGrid errors show full response details
