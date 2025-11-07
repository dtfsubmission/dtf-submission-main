# DTF Submission - Supabase Setup Guide

## Complete Migration from Firebase to Supabase

This guide will walk you through setting up your DTF order submission system with Supabase.

---

## Step 1: Database Setup (SQL Commands)

Go to your Supabase Dashboard → SQL Editor and run these commands:

### Create Tables

```sql
-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  delivery_method TEXT NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies to allow inserts from anon users
CREATE POLICY "Allow anonymous inserts to orders"
ON orders FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts to order_items"
ON order_items FOR INSERT
TO anon
WITH CHECK (true);

-- Create policy to allow service role to read everything
CREATE POLICY "Allow service role to read orders"
ON orders FOR SELECT
TO service_role
USING (true);

CREATE POLICY "Allow service role to read order_items"
ON order_items FOR SELECT
TO service_role
USING (true);
```

---

## Step 2: Storage Setup

### Option A: Via Dashboard (Recommended)
1. Go to Supabase Dashboard → Storage
2. Click "Create a new bucket"
3. Name it: `order-images`
4. Make sure "Public bucket" is **CHECKED**
5. Click "Create bucket"

### Option B: Via SQL
```sql
-- Create storage bucket for order images
INSERT INTO storage.buckets (id, name, public)
VALUES ('order-images', 'order-images', true);

-- Allow anonymous users to upload
CREATE POLICY "Allow anonymous uploads"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'order-images');

-- Allow public access to read files
CREATE POLICY "Allow public access to order images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'order-images');
```

---

## Step 3: Gmail Setup for Email Notifications

### Generate Gmail App Password:

1. Go to your Google Account: https://myaccount.google.com/
2. Click "Security" in the left sidebar
3. Enable "2-Step Verification" if not already enabled
4. After enabling 2FA, go back to Security
5. Search for "App passwords" or scroll down to find it
6. Click "App passwords"
7. Select "Mail" and "Other (Custom name)"
8. Enter name: "DTF Order System"
9. Click "Generate"
10. **SAVE THIS PASSWORD** - you'll need it in the next step

---

## Step 4: Deploy Supabase Edge Function

### Install Supabase CLI (if not installed)

```bash
npm install -g supabase
```

### Login to Supabase CLI

```bash
supabase login
```

### Link Your Project

```bash
cd /Users/tylermacpro/Desktop/dtf-submission-main
supabase link --project-ref ftlgxxntrqcxsagsymvw
```

### Set Environment Variables (Gmail Credentials)

Replace with your actual Gmail and App Password:

```bash
supabase secrets set GMAIL_USER=your-email@gmail.com
supabase secrets set GMAIL_APP_PASSWORD=your-app-password-here
```

### Deploy the Edge Function

```bash
supabase functions deploy send-order-email
```

---

## Step 5: Update Your Supabase Credentials in Code

The code is already updated with your placeholder credentials. When you're ready to use real credentials:

1. Open `prime.js`
2. Replace these lines (around line 5-6):
   ```javascript
   const supabaseUrl = 'https://ftlgxxntrqcxsagsymvw.supabase.co';
   const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
   ```
3. Replace with your REAL Supabase URL and ANON key

---

## Step 6: Test Your Setup

1. Open `index.html` in a web browser
2. Upload a PNG image
3. Fill out the form completely
4. Add the image to your order
5. Click "SUBMIT ORDER FOR REVIEW"
6. Check:
   - Supabase Dashboard → Table Editor → orders (should see new entry)
   - Supabase Dashboard → Table Editor → order_items (should see items)
   - Supabase Dashboard → Storage → order-images (should see uploaded files)
   - Email inbox at orders@sticknstitch.com (should receive email)

---

## Troubleshooting

### Email Not Sending?
- Verify Gmail App Password is correct
- Check Supabase Functions logs: Dashboard → Edge Functions → send-order-email → Logs
- Make sure 2FA is enabled on Gmail account
- Try regenerating the App Password

### Images Not Uploading?
- Verify storage bucket `order-images` exists and is PUBLIC
- Check browser console for errors
- Verify storage policies are set correctly

### Database Errors?
- Check that all SQL commands ran successfully
- Verify RLS policies are enabled
- Check Supabase logs in Dashboard

---

## File Structure

```
dtf-submission-main/
├── index.html              # Main form interface
├── prime.js                # Main JavaScript with Supabase integration
├── prime.css               # Styling
├── uploadhere.png          # Upload placeholder image
├── supabase/
│   └── functions/
│       └── send-order-email/
│           └── index.ts    # Email sending Edge Function
└── README-SETUP.md         # This file
```

---

## What Changed from Firebase?

1. ✅ Replaced Firebase Storage → Supabase Storage
2. ✅ Replaced Firestore → Supabase PostgreSQL
3. ✅ Added email notifications via Gmail
4. ✅ All customer data and images stored in Supabase
5. ✅ Automatic email with download links sent to orders@sticknstitch.com

---

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Edge Functions: https://supabase.com/docs/guides/functions
- Storage: https://supabase.com/docs/guides/storage

---

**Setup Complete!** 🎉

Your DTF order system is now fully integrated with Supabase and ready to accept orders.
