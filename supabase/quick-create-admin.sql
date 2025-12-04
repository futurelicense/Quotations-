-- Quick Admin User Setup
-- Run this in Supabase SQL Editor AFTER creating the user through Dashboard

-- Step 1: Create user through Supabase Dashboard:
--   Authentication → Users → Add user
--   Email: admin@demo.com
--   Password: Abc123456
--   ✅ Auto Confirm User

-- Step 2: Run this query to make them admin:
UPDATE public.profiles 
SET role = 'admin', 
    full_name = 'Admin User'
WHERE email = 'admin@demo.com';

-- Step 3: Verify:
SELECT 
  id, 
  email, 
  full_name, 
  role, 
  created_at 
FROM public.profiles 
WHERE email = 'admin@demo.com';
