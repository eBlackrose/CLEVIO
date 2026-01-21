# ⚡ Quick Start: Enable Email Sending

Your SendGrid API key is configured! Follow these 4 quick steps:

---

## **Step 1: Verify Your Sender Email (2 minutes)**

1. Go to: https://app.sendgrid.com/settings/sender_auth
2. Click **"Verify a Single Sender"**
3. Fill out the form with your email (e.g., `chadrobertson@telecom.team`)
4. Click **"Create"**
5. **Check your email inbox** for verification link
6. **Click the verification link**

---

## **Step 2: Update Configuration (30 seconds)**

Edit `/server/.env` and change this line:

```env
SENDGRID_FROM_EMAIL=your-verified-email@example.com
```

Replace with the email you just verified (e.g., `chadrobertson@telecom.team`)

---

## **Step 3: Test SendGrid (1 minute)**

```bash
cd server
npm install
node test-sendgrid.js
```

**Expected output:**
```
✅ EMAIL SENT SUCCESSFULLY!
📬 Check your inbox...
```

**Check your email** - you should receive a test email from CLEVIO.

---

## **Step 4: Start Servers & Connect (2 minutes)**

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Update Frontend:**

Open `/src/app/config/api.ts` and change:
```typescript
export const USE_REAL_BACKEND = true;
```

**That's it!** Now when you sign in, you'll receive the 6-digit code via email instead of the console.

---

## 🎉 **Test It**

1. Go to http://localhost:5173/signin
2. Enter your email and password
3. Click "Sign In"
4. **Check your email inbox** for the 6-digit code
5. Enter the code and verify
6. **Success!** You're logged in with real email 2FA.

---

## ❓ **Troubleshooting**

**Test script fails?**
- Check `/server/SENDGRID_SETUP.md` for detailed troubleshooting

**No email received?**
- Check spam/junk folder
- Make sure backend console shows "✅ OTP email sent successfully"
- Verify sender email is verified in SendGrid

**Frontend can't connect?**
- Make sure backend server is running (`npm run dev` in `/server`)
- Check `USE_REAL_BACKEND = true` in `/src/app/config/api.ts`

---

## 📚 **Full Documentation**

- **`/server/SENDGRID_SETUP.md`** - Complete setup guide with troubleshooting
- **`/ENABLE_EMAIL_SENDING.md`** - General email configuration guide
- **`/server/README.md`** - Backend API documentation

**Total setup time: ~5 minutes** ⏱️
