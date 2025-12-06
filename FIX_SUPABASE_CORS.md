# 🔧 Fix Supabase CORS Error

## The Problem

You're seeing:
```
CORS Missing Allow Origin
Status code: 500
NetworkError when attempting to fetch resource
```

## Common Causes

### 1. **Supabase Project is Paused** ⏸️ (Most Common)

Free tier Supabase projects automatically pause after 1 week of inactivity.

**Solution:**
1. Go to: https://supabase.com/dashboard/project/aopxodevyedrevvraogo
2. If you see "Project Paused" message
3. Click "Resume Project" or "Restore Project"
4. Wait 1-2 minutes for project to restart
5. Try logging in again

### 2. **Database Schema Not Deployed**

The auth might fail if tables don't exist.

**Solution:**
1. Go to: https://supabase.com/dashboard/project/aopxodevyedrevvraogo/sql/new
2. Copy and paste content from `supabase/schema.sql`
3. Click "Run"
4. Wait for "Success" message

### 3. **Incorrect Project URL**

**Verify:**
```bash
cat .env | grep SUPABASE_URL
```

Should show:
```
VITE_SUPABASE_URL=https://aopxodevyedrevvraogo.supabase.co
```

## Quick Fix Steps

### Step 1: Check Project Status
1. Open: https://supabase.com/dashboard
2. Find project: aopxodevyedrevvraogo
3. Check if it says "Paused" or "Active"

### Step 2: Resume if Paused
- Click the project
- Click "Resume" button
- Wait for green "Active" status

### Step 3: Verify Database
1. Go to Table Editor
2. Check if these tables exist:
   - profiles
   - clients
   - products
   - quotations
   - invoices
   - payments

### Step 4: Test Connection
Refresh browser and try login again

## Alternative: Check Supabase Service Status

Sometimes Supabase itself has issues:
https://status.supabase.com

## Need Help?

If project won't resume or you see other errors:
1. Check Supabase dashboard for messages
2. Verify your account is active
3. Check billing (if applicable)
4. Contact Supabase support

## Quick Test

After resuming, test with:
```bash
# In browser console (F12)
fetch('https://aopxodevyedrevvraogo.supabase.co/rest/v1/')
  .then(r => r.text())
  .then(console.log)
```

If this works, your project is active!
