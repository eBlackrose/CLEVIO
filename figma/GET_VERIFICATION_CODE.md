# 🔐 How to Get Your Verification Code

## ⚡ **Quick Solution: Browser Console**

Your 6-digit verification code is shown in your browser's Developer Console.

---

### **Step-by-Step:**

1. **Open Developer Console:**
   - **Windows/Linux:** Press `F12` or `Ctrl + Shift + J`
   - **Mac:** Press `Cmd + Option + J`

2. **Sign in normally:**
   - Enter: `chadrobertson@telecom.team`
   - Enter your password
   - Click "Sign In"

3. **Look for this in the console:**
   ```
   🔐 ═══════════════════════════════════════
      2FA CODE FOR: chadrobertson@telecom.team
      CODE: 123456
      EXPIRES: 12/21/2025, 12:05:00 PM
   ═══════════════════════════════════════
   ```

4. **Copy the 6-digit number** (e.g., `123456`)

5. **Paste it into the "Verification Code" field**

6. **Click "Verify Code"**

7. **Done!** You're logged in.

---

## 📧 **Why No Email?**

The platform is currently using a **development/demo backend** that:
- ✅ Simulates full authentication flow
- ✅ Generates real 6-digit codes
- ❌ Doesn't send actual emails

The code is displayed in the browser console instead.

---

## 💡 **Want Real Emails?**

See **`ENABLE_EMAIL_SENDING.md`** for instructions on:
1. Setting up SendGrid (free)
2. Starting the real backend server
3. Receiving codes via email

It takes about 5-10 minutes to set up.

---

## 📸 **Visual Guide**

**Where to find the console:**

**Chrome/Edge:**
1. Click the 3-dot menu (⋮) in top-right
2. Click "More tools" → "Developer tools"
3. Click "Console" tab
4. Look for the code in a box with `═══` borders

**Firefox:**
1. Click the 3-line menu (≡) in top-right
2. Click "More tools" → "Web Developer Tools"
3. Click "Console" tab
4. Look for the code in a box with `═══` borders

---

## ❓ **FAQ**

**Q: Is this secure?**  
A: Yes! The code still expires after 5 minutes and is unique per login attempt. This is just a development feature for testing.

**Q: How long is the code valid?**  
A: 5 minutes from when you click "Sign In"

**Q: Can I use the same code twice?**  
A: No, each code is single-use and gets deleted after successful verification.

**Q: I don't see the code in console?**  
A: Make sure:
- You're on the "Console" tab (not "Elements" or other tabs)
- You clicked "Sign In" button
- You scroll up to find the boxed code output
- Try signing in again to generate a new code

---

## 🎯 **Current Test Account**

If you just created an account, the login flow is:
1. Sign in → Code appears in console
2. Check console → Copy code
3. Paste code → Verify
4. Access dashboard

Need to create a new account? Go to **Create Account** page.
