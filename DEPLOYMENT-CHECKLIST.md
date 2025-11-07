# 📋 DEPLOYMENT CHECKLIST

Use this checklist to ensure everything is set up correctly.

---

## ☑️ Database Setup

- [ ] Opened Supabase Dashboard
- [ ] Went to SQL Editor
- [ ] Copied contents of `SQL-COMMANDS.sql`
- [ ] Pasted and ran in SQL Editor
- [ ] Saw "Success. No rows returned" message
- [ ] Verified `orders` table exists in Table Editor
- [ ] Verified `order_items` table exists in Table Editor

---

## ☑️ Storage Setup

- [ ] Opened Storage in Supabase Dashboard
- [ ] See `order-images` bucket listed
- [ ] Bucket shows "Public" badge
- [ ] Can click into bucket (empty is fine)

---

## ☑️ Gmail App Password

- [ ] Went to Google Account Security settings
- [ ] 2-Step Verification is enabled
- [ ] Generated App Password for "Mail"
- [ ] Saved the 16-character password somewhere safe
- [ ] Have Gmail address ready

---

## ☑️ Supabase CLI Setup

- [ ] Ran `npm install -g supabase`
- [ ] Ran `supabase login` 
- [ ] Logged in successfully
- [ ] Ran `supabase link --project-ref ftlgxxntrqcxsagsymvw`
- [ ] Project linked successfully

---

## ☑️ Gmail Credentials Set

- [ ] Ran `supabase secrets set GMAIL_USER=youremail@gmail.com`
- [ ] Ran `supabase secrets set GMAIL_APP_PASSWORD=yourapppassword`
- [ ] Both commands succeeded

---

## ☑️ Edge Function Deployed

- [ ] Ran `supabase functions deploy send-order-email`
- [ ] Deployment succeeded
- [ ] Can see function in Supabase Dashboard → Edge Functions

---

## ☑️ Production Credentials Updated

- [ ] Opened `prime.js` file
- [ ] Found lines 4-5 with supabaseUrl and supabaseKey
- [ ] Went to Supabase Dashboard → Settings → API
- [ ] Copied real Project URL
- [ ] Copied real anon/public key  
- [ ] Replaced placeholder values in `prime.js`
- [ ] Saved file

---

## ☑️ Testing

### Test 1: File Upload
- [ ] Opened `index.html` in browser
- [ ] Selected a PNG file
- [ ] Image appeared in preview
- [ ] Width/Height auto-populated
- [ ] Price calculated

### Test 2: Add to Order
- [ ] Clicked "ADD IMAGE FOR REVIEW"
- [ ] Image appeared in order table
- [ ] Can remove image with ❌ button

### Test 3: Form Submission
- [ ] Filled out all form fields:
  - [ ] First Name
  - [ ] Last Name  
  - [ ] Email
  - [ ] Phone
  - [ ] Street
  - [ ] City
  - [ ] State
  - [ ] Zip
  - [ ] Delivery Method selected
- [ ] Clicked "SUBMIT ORDER FOR REVIEW"
- [ ] Saw "Submitting Please Wait..." popup
- [ ] Got "✅ Order submitted successfully!" message

### Test 4: Verify in Supabase
- [ ] Checked Table Editor → `orders` → New row exists
- [ ] Checked Table Editor → `order_items` → New row exists  
- [ ] Checked Storage → `order-images` → File uploaded
- [ ] File has timestamp prefix in name

### Test 5: Email Received
- [ ] Checked orders@sticknstitch.com inbox
- [ ] Received email with subject "New DTF Order #..."
- [ ] Email contains:
  - [ ] Customer name
  - [ ] Customer contact info
  - [ ] Customer address
  - [ ] Delivery method
  - [ ] Order items table
  - [ ] Download links for images
  - [ ] Estimated total
- [ ] Clicked download link
- [ ] Image downloaded successfully

---

## 🎉 ALL DONE!

If all boxes are checked, your system is fully operational and ready for production use!

---

## 🐛 If Something Failed

Go back to the section that failed and:
1. Double-check you followed each step
2. Look for error messages
3. Refer to `QUICK-START.md` for troubleshooting
4. Check Supabase logs for detailed errors

---

## 📊 Monitoring Your System

### Daily Checks:
- Check orders@sticknstitch.com for new orders
- Process orders from emails

### Weekly Checks:
- Supabase Dashboard → Table Editor → `orders` (see all orders)
- Supabase Dashboard → Storage → `order-images` (see all uploaded files)

### Monthly Checks:
- Review Edge Function logs for any errors
- Verify email delivery is working
- Clean up old test data if needed

---

**System Status:** [ ] Not Started  [ ] In Progress  [ ] ✅ Complete

**Last Updated:** _______________

**Tested By:** _______________
