# SendGrid Email Setup for CLEVIO

## Current Status
- ✅ Backend configured for email sending
- ⚠️ EMAIL_MODE set to 'log' (console only)
- ⚠️ No SendGrid API key configured

---

## How to Enable Real Email Delivery

### Step 1: Create SendGrid Account
1. Go to https://sendgrid.com/
2. Sign up for a free account (100 emails/day free tier)
3. Verify your email address

### Step 2: Create API Key
1. Log in to SendGrid dashboard
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Name it: `CLEVIO Development`
5. Set permissions: **Full Access** (or at minimum: **Mail Send**)
6. Click **Create & View**
7. **COPY THE API KEY** (you can only see it once!)

### Step 3: Verify Sender Email (REQUIRED)
SendGrid requires sender verification:

1. Go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill in your details:
   - **From Email**: `noreply@clevio.com` (or your verified domain)
   - **From Name**: `CLEVIO`
   - **Reply To**: Your actual email
4. SendGrid will send verification email
5. Click the verification link

### Step 4: Update Backend `.env` File

Edit `figma/server/.env` and add:

```env
# Email Configuration
EMAIL_MODE=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@clevio.com  # Must match verified sender!
```

### Step 5: Restart Backend

```bash
cd figma/server
npm run dev
```

You should see:
```
✅ SendGrid API key configured
📧 Email mode: SENDGRID
```

---

## Testing Email Delivery

1. Try logging in at `http://localhost:5173`
2. Check your actual email inbox (wesley@clevio.com)
3. Look for subject: **"CLEVIO - Your Verification Code"**
4. If you don't receive it:
   - Check spam/junk folder
   - Verify sender email is verified in SendGrid
   - Check SendGrid dashboard → Activity for delivery status

---

## Troubleshooting

### Error: "Unauthorized"
- ❌ API key is wrong or expired
- ✅ Regenerate API key in SendGrid dashboard

### Error: "From email not verified"
- ❌ Sender email not verified
- ✅ Complete Single Sender Verification in SendGrid

### Emails going to spam
- Use a verified custom domain (instead of sendgrid.net)
- Set up SPF/DKIM records in your DNS

---

## Development vs Production

### Development (Current)
```env
EMAIL_MODE=log
# No SendGrid needed
# OTP codes in terminal
```

### Production
```env
EMAIL_MODE=sendgrid
SENDGRID_API_KEY=SG.real_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

---

## Security Notes

1. **NEVER commit `.env` file to git** (already in `.gitignore` ✅)
2. **Use environment variables in production** (don't hardcode API keys)
3. **Rotate API keys regularly**
4. **Use restricted API keys** (Mail Send only) for production

---

## Cost Estimate

- **Free Tier**: 100 emails/day forever
- **Essentials**: $19.95/mo for 50,000 emails/month
- **Pro**: $89.95/mo for 100,000 emails/month

For a typical startup with 1,000 users logging in once/week:
- ~1,000 OTP emails/week = ~4,000/month
- **Free tier is sufficient!** ✅
