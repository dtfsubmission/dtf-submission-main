# 🚀 QUICK START GUIDE - DTF SUBMISSION SUPABASE MIGRATION

## ✅ What's Been Done

Your code has been completely migrated from Firebase to Supabase:

1. ✅ `prime.js` - Updated with Supabase client and storage
2. ✅ `index.html` - Already compatible (no changes needed)
3. ✅ `prime.css` - Already compatible (no changes needed)
4. ✅ Edge Function created at `/supabase/functions/send-order-email/`
5. ✅ SQL setup file created: `SUPABASE-SQL-SETUP.sql`

---

## 📋 YOUR TODO LIST (In Order)

### 1️⃣ Run SQL Setup (5 minutes)

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor" in left sidebar
4. Click "New query"
5. Open `SUPABASE-SQL-SETUP.sql` file
6. Copy ALL the contents
7. Paste into SQL Editor
8. Click "Run" or press Ctrl+Enter
9. Verify: Should say "Success. No rows returned"

---

### 2️⃣ Verify Storage Bucket (2 minutes)

1. In Supabase Dashboard, click "Storage" in left sidebar
2. You should see a bucket named `order-images`
3. Click on it
4. Verify it shows "Public bucket" badge
5. If not there, go back to SQL Editor and run just the storage commands again

---

### 3️⃣ Set Up Gmail for Notifications (10 minutes)

**A. Generate Gmail App Password:**

1. Go to: https://myaccount.google.com/security
2. Make sure "2-Step Verification" is ON (enable if not)
3. Search for "App passwords" or scroll down
4. Click "App passwords"
5. Select app: "Mail"
6. Select device: "Other" → type "DTF Orders"
7. Click "Generate"
8. **COPY THE 16-CHARACTER PASSWORD** (looks like: abcd efgh ijkl mnop)

**B. Install Supabase CLI:**

```bash
npm install -g supabase
```

**C. Login & Link Project:**

```bash
supabase login
cd /Users/tylermacpro/Desktop/dtf-submission-main
supabase link --project-ref ftlgxxntrqcxsagsymvw
```

**D. Set Gmail Credentials:**

Replace with your actual email and app password:

```bash
supabase secrets set GMAIL_USER=youremail@gmail.com
supabase secrets set GMAIL_APP_PASSWORD=abcdefghijklmnop
```

**E. Deploy Email Function:**

```bash
supabase functions deploy send-order-email
```

---

### 4️⃣ Update Real Credentials in Code (2 minutes)

When ready to go live, replace placeholder credentials in `prime.js`:

**Current (lines 4-5):**
```javascript
const supabaseUrl = 'https://ftlgxxntrqcxsagsymvw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

**Replace with your REAL credentials from Supabase Dashboard:**
- Go to Supabase Dashboard → Settings → API
- Copy "Project URL" → Replace `supabaseUrl`
- Copy "anon/public" key → Replace `supabaseKey`

---

### 5️⃣ Test Everything (5 minutes)

1. Open `index.html` in Chrome/Firefox
2. Upload a test PNG image
3. Fill in form with test data
4. Add image to order
5. Click "SUBMIT ORDER FOR REVIEW"
6. Verify success message appears

**Check These:**
- [ ] Supabase Dashboard → Table Editor → `orders` (new row appears)
- [ ] Supabase Dashboard → Table Editor → `order_items` (new row appears)
- [ ] Supabase Dashboard → Storage → `order-images` (file uploaded)
- [ ] Email arrives at orders@sticknstitch.com with download link

---

## 🐛 Common Issues & Solutions

### Issue: "Failed to upload image"
**Solution:** Make sure storage bucket `order-images` is PUBLIC

### Issue: "Policy violation" errors
**Solution:** Re-run the SQL setup commands, especially the policies section

### Issue: Email not sending
**Solutions:**
- Verify Gmail App Password is correct (no spaces)
- Make sure 2FA is enabled on Gmail
- Check Edge Function logs: Supabase Dashboard → Edge Functions → Logs
- Try generating a new App Password

### Issue: "relation does not exist"
**Solution:** Tables weren't created. Run SQL setup again

---

## 📁 File Structure

```
dtf-submission-main/
├── index.html                          # Form interface
├── prime.js                            # ✅ UPDATED - Supabase integration
├── prime.css                           # Styling
├── uploadhere.png                      # Upload icon
├── firebase.js                         # ⚠️ OLD - Can delete
├── SUPABASE-SQL-SETUP.sql             # SQL commands for database
├── README-SETUP.md                     # Detailed setup guide
├── QUICK-START.md                      # This file
└── supabase/
    └── functions/
        └── send-order-email/
            └── index.ts                # ✅ Email sending function
```

---

## 🎯 What Happens When User Submits Order?

1. **User uploads PNG** → Auto-calculates dimensions
2. **User adds to order** → Saved in browser temporarily
3. **User fills form** → Contact info captured
4. **User clicks SUBMIT** →
   - ✅ Images uploaded to Supabase Storage
   - ✅ Order data saved to `orders` table
   - ✅ Items saved to `order_items` table
   - ✅ Email sent to orders@sticknstitch.com with:
     - Customer info
     - Order details
     - Download links for images
5. **Success message** → Form resets for next order

---

## 📞 Need Help?

- Full docs: See `README-SETUP.md`
- Supabase docs: https://supabase.com/docs
- Edge Functions: https://supabase.com/docs/guides/functions

---

## ✨ You're All Set!

Once you complete steps 1-4, your system is production-ready! 🎉
