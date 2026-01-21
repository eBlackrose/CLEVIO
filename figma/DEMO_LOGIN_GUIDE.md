# 🔐 CLEVIO Demo Login Guide

## 📋 **Pre-Configured Demo Account**

I've created a demo account for you to test the client portal:

```
Email:    demo@clevio.online
Password: demo1234
```

---

## 🚀 **How to Sign In (2 Steps):**

### **Step 1: Enter Credentials**

1. Go to: **http://localhost:5173/signin** (or your CLEVIO sign-in page)
2. Enter:
   - **Email:** `demo@clevio.online`
   - **Password:** `demo1234`
3. Click **"Sign In"**

---

### **Step 2: Get 2FA Code from Console**

1. **Open Browser Developer Console:**
   - **Chrome/Edge:** Press `F12` or `Ctrl+Shift+J` (Windows) / `Cmd+Option+J` (Mac)
   - **Firefox:** Press `F12` or `Ctrl+Shift+K` (Windows) / `Cmd+Option+K` (Mac)
   - **Safari:** Press `Cmd+Option+C`

2. **Look for the 6-digit code** - it will appear like this:
   ```
   🔐 ═══════════════════════════════════════
      2FA CODE FOR: demo@clevio.online
      CODE: 123456
      EXPIRES: 1/7/2026, 2:30:00 PM
   ═══════════════════════════════════════
   ```

3. **Copy the 6-digit code** (e.g., `123456`)

4. **Paste it** into the verification field on the CLEVIO page

5. **Click "Verify"**

6. **✅ You're logged in!**

---

## 🎯 **Quick Visual Guide:**

### **What You'll See in Console:**

After clicking "Sign In", the browser console will show:

```javascript
🔧 Mock API: /api/user/login
  ✅ 2FA code generated: 385729

🔐 ═══════════════════════════════════════
   2FA CODE FOR: demo@clevio.online
   CODE: 385729    ← COPY THIS NUMBER
   EXPIRES: 1/7/2026, 2:35:00 PM
═══════════════════════════════════════
```

**That's your code!** Copy it and enter it on the page.

---

## 📱 **Alternative: Create Your Own Account**

You can also create a new account instead of using the demo:

1. Go to: **http://localhost:5173/signup**
2. Fill out the 3-step signup form:
   - **Step 1:** Company Name, Email, Password
   - **Step 2:** First Name, Last Name
   - **Step 3:** Review & Confirm
3. Click **"Complete Setup"**
4. Go to **Sign In** page
5. Use your new credentials to sign in
6. Get 2FA code from console (same process as above)

---

## 🔄 **Why Console Instead of Email?**

**Short answer:** You're using the **mock/demo backend** which simulates email sending but doesn't actually send emails.

**How to get real emails:**
- Deploy the backend server (see `/START_HERE.md`)
- Configure SendGrid properly
- Switch frontend to use real backend

**For now:** Console codes work perfectly for testing!

---

## 🎬 **Step-by-Step Video-Style Instructions:**

### **Complete Sign-In Flow:**

```
1. Open CLEVIO → Sign In page
   ↓
2. Enter: demo@clevio.online / demo1234
   ↓
3. Click "Sign In"
   ↓
4. Page shows: "Verification code sent to your email"
   ↓
5. Press F12 to open console
   ↓
6. Find the 6-digit code in console output
   ↓
7. Copy the code (e.g., 123456)
   ↓
8. Paste into verification field
   ↓
9. Click "Verify"
   ↓
10. ✅ Logged into dashboard!
```

---

## 💡 **Pro Tips:**

### **Keep Console Open While Testing:**
- Leave the Developer Console open during testing
- You'll see all the 2FA codes immediately
- Makes testing much faster!

### **Code Expires in 5 Minutes:**
- Each code is valid for 5 minutes
- If expired, click "Resend Code" to get a new one
- New code will appear in console

### **Console Tab Location:**
- When you press F12, you'll see multiple tabs: Elements, Console, Network, etc.
- Click on the **"Console"** tab
- That's where all the codes appear

---

## 📊 **What You'll See in the Dashboard:**

After logging in, you'll have access to:

✅ **Dashboard** - Overview of payroll and services
✅ **Payroll** - Run payroll through American Express
✅ **Tax Center** - Tax filing and compliance
✅ **Advisors** - Licensed professionals
✅ **Billing** - Subscription and payments
✅ **Settings** - Account configuration
✅ **Support** - Help and resources

---

## 🆘 **Troubleshooting:**

### **"Invalid email or password"**
- Make sure you typed: `demo@clevio.online` and `demo1234` exactly
- No spaces before/after
- Password is case-sensitive

### **"Invalid verification code"**
- Make sure you copied the full 6-digit code
- Check that the code hasn't expired (valid for 5 minutes)
- Get a fresh code by clicking "Resend Code"

### **Not seeing code in console?**
- Make sure you clicked the "Console" tab (not Elements or Network)
- Scroll up in the console - the code might be above
- Try signing in again to generate a new code

### **Console shows errors instead of code?**
- Refresh the page and try again
- Clear browser cache: `Ctrl+Shift+Delete` → Clear cache
- Try a different browser (Chrome works best)

---

## 🎯 **Quick Reference:**

| Item | Value |
|------|-------|
| **Demo Email** | `demo@clevio.online` |
| **Demo Password** | `demo1234` |
| **2FA Code Location** | Browser Developer Console (F12) |
| **Code Format** | 6 digits (e.g., 123456) |
| **Code Validity** | 5 minutes |

---

**Ready to test?** Open the console (F12) and sign in with the demo account! 🚀
