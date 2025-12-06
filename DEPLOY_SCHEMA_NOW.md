# 🚨 CRITICAL: Deploy Database Schema

## The 500 Error Means

Your Supabase database tables haven't been created yet. The auth system needs the `profiles` table to work.

## ✅ FIX IT NOW (2 Minutes)

### **Step 1: Open SQL Editor**

Direct link: https://supabase.com/dashboard/project/aopxodevyedrevvraogo/sql/new

### **Step 2: Copy Schema**

Run this in your terminal:
```bash
cd /Users/7thgroup/Desktop/Quotations--main
cat supabase/schema.sql | pbcopy
```

The schema is now in your clipboard!

### **Step 3: Paste and Run**

1. In SQL Editor, paste (Cmd+V)
2. You'll see 293 lines of SQL
3. Click the "Run" button (or Cmd+Enter)
4. Wait 2-3 seconds
5. You should see: ✅ **"Success. No rows returned"**

### **Step 4: Verify Tables Created**

1. Go to Table Editor: https://supabase.com/dashboard/project/aopxodevyedrevvraogo/editor
2. You should see 7 tables:
   - profiles ✅
   - clients ✅
   - products ✅
   - quotations ✅
   - invoices ✅
   - payments ✅
   - templates ✅

### **Step 5: Create Admin User**

1. Go to: https://supabase.com/dashboard/project/aopxodevyedrevvraogo/auth/users
2. Click "Add user" → "Create new user"
3. Fill in:
   - Email: admin@demo.com
   - Password: Abc123456
   - ✅ Check "Auto Confirm User"
4. Click "Create user"

Then in SQL Editor:
```sql
UPDATE profiles 
SET role = 'admin', full_name = 'Admin User'
WHERE email = 'admin@demo.com';
```

### **Step 6: Test Login**

1. Refresh: http://localhost:5174/login
2. Login with:
   - Email: admin@demo.com
   - Password: Abc123456
3. ✅ Should work now!

## Why the Error Happened

The Supabase auth system requires:
- ✅ Database schema deployed (profiles table)
- ✅ User account created
- ✅ RLS policies in place

Without the schema, you get a 500 error.

## After Schema Deployment

Everything will work:
- ✅ Login/Register
- ✅ All CRUD operations
- ✅ Data persistence
- ✅ Security policies

## Verification

After running schema, check in Supabase:
- Table Editor shows 7 tables ✅
- SQL Editor shows no errors ✅
- Auth users can be created ✅

Then your InvoicePro will be FULLY FUNCTIONAL! 🚀
