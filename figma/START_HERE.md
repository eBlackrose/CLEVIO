# 🚀 START HERE - Get Email 2FA Working

You've configured SendGrid with `no-reply@clevio.online`! Follow these steps:

---

## ✅ **What's Already Done:**

- ✅ SendGrid API key configured in `/server/.env`
- ✅ Sender email set to `no-reply@clevio.online`
- ✅ Backend server ready with email integration
- ✅ Frontend ready to connect to backend
- ✅ Test script created to verify SendGrid

---

## 📋 **Next Steps (5 minutes):**

### **Step 1: Verify Sender Email** (2 minutes)

**IMPORTANT:** SendGrid requires you to verify `no-reply@clevio.online` before sending emails.

1. Go to: https://app.sendgrid.com/settings/sender_auth

2. Check if `no-reply@clevio.online` is already verified (look for green checkmark)

3. **If NOT verified:**
   - Click **"Verify a Single Sender"**
   - Add `no-reply@clevio.online`
   - Check the inbox for that email domain
   - Click the verification link

---

### **Step 2: Test SendGrid** (1 minute)

```bash
cd server
npm install
node test-sendgrid.js
```

**✅ Success looks like:**
```
✅ EMAIL SENT SUCCESSFULLY!
📬 Check your inbox at: no-reply@clevio.online
```

**❌ If you see errors, check:**
- `/server/SENDGRID_SETUP.md` for troubleshooting
- Make sure sender email is verified (Step 1)

---

### **Step 3: Start Backend Server** (30 seconds)

```bash
npm run dev
```

**✅ Should show:**
```
🚀 CLEVIO Backend Server Started
   SendGrid configured: Yes ← Must say "Yes"!
```

**Keep this terminal open!**

---

### **Step 4: Connect Frontend** (30 seconds)

**Open** `/src/app/config/api.ts`

**Change line 13:**
```typescript
// Before:
export const USE_REAL_BACKEND = false;

// After:
export const USE_REAL_BACKEND = true;
```

**Save the file.**

---

### **Step 5: Test Full Flow** (1 minute)

1. **Make sure both servers are running:**
   - Terminal 1: Backend (`cd server && npm run dev`)
   - Terminal 2: Frontend (`npm run dev`)

2. **Open CLEVIO:** http://localhost:5173/signin

3. **Sign in with your account**

4. **Backend console will show:**
   ```
   ✅ Generated OTP: 123456
   📧 Sending OTP email...
   ✅ OTP email sent successfully ✓
   ```

5. **Check your email inbox** for the 6-digit code

6. **Enter the code** → Logged in! 🎉

---

## 🎉 **Done!**

You now have real email-based 2FA authentication!

**Emails will be sent from:** `no-reply@clevio.online`  
**Subject:** "CLEVIO - Your Verification Code"

---

## 📚 **Helpful Files:**

- **`TEST_EMAIL_NOW.md`** - Quick test guide
- **`/server/SENDGRID_SETUP.md`** - Complete setup & troubleshooting
- **`/server/test-sendgrid.js`** - Email test script

---

## ❓ **Common Issues:**

**"Sender not verified" error?**
- Go to SendGrid dashboard
- Settings → Sender Authentication  
- Verify `no-reply@clevio.online`

**No email received?**
- Check spam/junk folder
- Make sure backend shows "✅ OTP email sent successfully"
- Verify sender email is verified in SendGrid

**Backend says "SendGrid configured: No"?**
- Check `/server/.env` exists
- Make sure `SENDGRID_API_KEY` is set correctly

---

## 🔄 **Switch Back to Console-Only Codes:**

If you want to disable emails and go back to console codes:

1. Open `/src/app/config/api.ts`
2. Change: `export const USE_REAL_BACKEND = false;`
3. Codes will appear in browser console again

---

**Start with Step 1 and verify your sender email!** 📧
