-- Seed Admin User for InvoicePro
-- Run this AFTER running schema.sql

-- Note: In Supabase, you cannot directly insert into auth.users
-- This script creates the profile entry that will be linked once the user signs up

-- First, you need to create the user through Supabase Dashboard or API
-- Email: admin@demo.com
-- Password: Abc123456

-- Once the user is created, their profile will be automatically created by the trigger
-- Then update their role to admin with this query:

-- Update the user's role to admin (run this after the user signs up)
UPDATE public.profiles 
SET role = 'admin'
WHERE email = 'admin@demo.com';

-- Verify the admin user
SELECT id, email, full_name, role, created_at 
FROM public.profiles 
WHERE email = 'admin@demo.com';



