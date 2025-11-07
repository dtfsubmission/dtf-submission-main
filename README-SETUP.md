# DTF Submission - Supabase Setup Guide

## ✅ Completed Steps

1. **SQL Schema**: Copy and paste the SQL from below into your Supabase SQL Editor
2. **JavaScript Updated**: All Firebase code has been replaced with Supabase
3. **Edge Function Created**: Email sending function is ready to deploy

---

## 📋 Step-by-Step Setup Instructions

### 1. Run SQL in Supabase

Go to your Supabase Dashboard → SQL Editor → New Query, then paste and run the SQL code provided separately.

### 2. Set Up Gmail App Password

To send emails from your Gmail account:

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to **Security**
3. Enable **2-Step Verification** (if not already enabled)
4. Under "2-Step Verification", find **App passwords**
5. Generate a new app password for "Mail"
6. Copy the 16-character password (it will look like: `xxxx xxxx xxxx xxxx`)

### 3. Deploy the Edge Function

You'll need the Supabase CLI installed. If you don't have it:

```bash
# Install Supabase CLI (macOS)
brew install supabase/tap/supabase

# Or using npm
npm install -g supabase
```

Then deploy the function:

```bash
# Navigate to your project folder
cd /Users/tylermacpro/Desktop/dtf-submission-main

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref ftlgxxntrqcxsagsymvw

# Set your Gmail credentials as secrets
supabase secrets set GMAIL_USER=your-email@gmail.com
supabase secrets set GMAIL_APP_PASSWORD=your-16-char-app-password

# Deploy the function
supabase functions deploy send-order-email
```

### 4. Update CORS Settings (if needed)

If you're hosting this on a domain, you may need to add it to Supabase's allowed origins:

1. Go to Supabase Dashboard → Project Settings → API
2. Under "URL Configuration", add your domain to the allowed origins

---

## 🔧 Alternative: Simple Email Solution (No Edge Function)

If you want to skip the Edge Function deployment, I can create a simpler solution using a third-party email service like:
- **Resend** (easiest, 100 free emails/day)
- **SendGrid** (free tier available)
- **Mailgun** (free tier available)

Let me know if you'd prefer this approach!

---

## 📁 File Structure

```
dtf-submission-main/
├── index.html                          # Main HTML file (unchanged)
├── prime.css                           # CSS file (unchanged)
├── prime.js                            # Updated with Supabase
├── package.json                        # Dependencies
├── supabase/
│   └── functions/
│       └── send-order-email/
│           └── index.ts                # Email sending function
└── README-SETUP.md                     # This file
```

---

## 🧪 Testing

Once everything is set up:

1. Open `index.html` in your browser
2. Upload a PNG image
3. Fill out the form
4. Submit the order

You should receive an email at orders@sticknstitch.com with:
- Customer information
- Order details
- Download links for all images

---

## 🐛 Troubleshooting

**Images not uploading?**
- Check that the storage bucket was created successfully
- Verify the storage policies are in place

**Email not sending?**
- Verify your Gmail App Password is correct
- Check the Supabase function logs: `supabase functions logs send-order-email`
- Make sure Gmail credentials are set as secrets

**CORS errors?**
- Add your domain to allowed origins in Supabase settings
- If testing locally, use a local server (not file://)

---

## 📞 Need Help?

If you run into any issues, let me know and I'll help you troubleshoot!
