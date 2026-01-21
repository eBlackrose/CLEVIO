# 🚀 Test Email Sending NOW

You've configured `no-reply@clevio.online` - let's test it!

---

## **Run These Commands:**

### **1. Test SendGrid (30 seconds)**

```bash
cd server
npm install
node test-sendgrid.js
```

**Expected Output:**
```
✅ Configuration found:
   API Key: SG.6AKPozpuQPO...
   From Email: no-reply@clevio.online

📧 Sending test email...

✅ EMAIL SENT SUCCESSFULLY!
📬 Check your inbox at: no-reply@clevio.online
```

**✅ Check your email!** You should receive a test email from CLEVIO.

---

### **2. Start Backend Server**

```bash
npm run dev
```

**Expected Output:**
```
🚀 ═══════════════════════════════════════════════════════
   CLEVIO Backend Server Started
   Port: 3001
   Environment: development
   SendGrid configured: Yes ← IMPORTANT!
   Debug logging: ENABLED
═══════════════════════════════════════════════════════

👂 Server is listening for requests...
```

**✅ Keep this terminal open** - server needs to run while you use the app.

---

### **3. Update Frontend Config**

Open `/src/app/config/api.ts` and change **line 10**:

```typescript
// Change from:
export const USE_REAL_BACKEND = false;

// To:
export const USE_REAL_BACKEND = true;
```

Save the file.

---

### **4. Test Full Email Flow**

1. **Open CLEVIO:** http://localhost:5173/signin
2. **Sign in** with your credentials
3. **Watch backend console** - should show:
   ```
   ✅ Generated OTP for your-email@example.com: 123456
   📧 Sending OTP email to your-email@example.com...
   ✅ OTP email sent successfully ← SUCCESS!
   ```
4. **Check your email inbox** for 6-digit code
5. **Enter the code** and verify
6. **Done!** 🎉

---

## ❌ **If Test Fails:**

### **"Forbidden" or "Sender not verified"**

You need to verify `no-reply@clevio.online` in SendGrid:

1. Go to: https://app.sendgrid.com/settings/sender_auth
2. Make sure `no-reply@clevio.online` shows **"Verified"** status
3. If not verified, click the verification link in your email
4. Run test again: `node test-sendgrid.js`

---

### **"Unauthorized" or "Invalid API Key"**

Check your API key in `/server/.env`:

```bash
cat .env
```

Should show:
```
SENDGRID_API_KEY=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
```

If different, regenerate API key in SendGrid dashboard.

---

### **No Email Received**

1. ✅ Check spam/junk folder
2. ✅ Wait 1-2 minutes (can be delayed)
3. ✅ Test script showed "EMAIL SENT SUCCESSFULLY"?
4. ✅ Sender email is verified in SendGrid?

---

## 📊 **What You'll See:**

**Backend Console (when email sent):**
```
🔐 [abc123] User Login
  Login attempt: chad@example.com
  ✅ Generated OTP for chad@example.com: 123456
  📧 Sending OTP email to chad@example.com...
  ✅ OTP email sent successfully to chad@example.com
```

**Email in Your Inbox:**
```
From: CLEVIO <no-reply@clevio.online>
Subject: CLEVIO - Your Verification Code

Your verification code is:

   123456

This code expires in 5 minutes.
```

---

## ⚡ **Quick Checklist:**

- [x] SendGrid account created
- [x] API key configured in `.env`
- [x] Sender email `no-reply@clevio.online` created
- [ ] **Sender email verified** ← Check SendGrid dashboard!
- [ ] **Test script passed** ← Run `node test-sendgrid.js`
- [ ] **Backend server started** ← Run `npm run dev`
- [ ] **Frontend connected** ← `USE_REAL_BACKEND = true`
- [ ] **Received test email!** 🎉

**Start with Step 1 above** and test SendGrid now!
