-- Quick Test Data for InvoicePro
-- Run this in Supabase SQL Editor AFTER schema.sql and creating your user

-- Note: Replace 'YOUR_USER_ID' with your actual user ID from auth.users
-- You can get your user ID by running: SELECT id FROM auth.users WHERE email = 'your@email.com';

-- Example Test Clients
INSERT INTO public.clients (user_id, name, email, phone, company, address, city, country, status) VALUES
  ('YOUR_USER_ID', 'Acme Corporation', 'contact@acme.com', '+1-555-0100', 'Acme Corp', '123 Business St', 'San Francisco', 'United States', 'active'),
  ('YOUR_USER_ID', 'TechStart Inc', 'hello@techstart.io', '+1-555-0101', 'TechStart Inc', '456 Startup Ave', 'New York', 'United States', 'active'),
  ('YOUR_USER_ID', 'Global Solutions', 'info@globalsol.com', '+1-555-0102', 'Global Solutions Ltd', '789 Enterprise Blvd', 'London', 'United Kingdom', 'active');

-- Example Products/Services
INSERT INTO public.products (user_id, name, description, type, sku, price, currency, tax_rate, category, status) VALUES
  ('YOUR_USER_ID', 'Website Development', 'Custom website design and development', 'service', 'WEB-DEV-001', 2500.00, 'USD', 8.50, 'Development', 'active'),
  ('YOUR_USER_ID', 'Mobile App Development', 'iOS and Android mobile application', 'service', 'MOB-DEV-001', 5000.00, 'USD', 8.50, 'Development', 'active'),
  ('YOUR_USER_ID', 'Monthly Maintenance', 'Website hosting and maintenance', 'service', 'MAINT-001', 150.00, 'USD', 8.50, 'Support', 'active'),
  ('YOUR_USER_ID', 'SEO Optimization', 'Search engine optimization service', 'service', 'SEO-001', 800.00, 'USD', 8.50, 'Marketing', 'active'),
  ('YOUR_USER_ID', 'Business Consulting', 'Strategic business consultation', 'service', 'CONSULT-001', 200.00, 'USD', 8.50, 'Consulting', 'active');

-- Get your user ID first by running this:
SELECT id, email FROM auth.users WHERE email = 'admin@demo.com';
-- Copy the ID and replace 'YOUR_USER_ID' above with it

-- After inserting, verify the data:
SELECT * FROM clients;
SELECT * FROM products;
