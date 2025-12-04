# 🚀 Start Using InvoicePro - 5 Minute Guide

Get up and running with real data in 5 minutes!

## ✅ Quick Status Check

**Is everything set up?**
- [x] ✅ Environment configured (.env file)
- [x] ✅ Supabase connected
- [ ] ⏳ Database schema deployed
- [ ] ⏳ Admin user created
- [ ] ⏳ Dev server running

## 🎯 Complete Setup (If Not Done)

### 1. Deploy Database Schema (2 min)
```bash
# Copy schema to clipboard
cat supabase/schema.sql | pbcopy
```
Then:
1. Open: https://supabase.com/dashboard/project/aopxodevyedrevvraogo/sql/new
2. Paste (Cmd+V)
3. Click "Run"
4. ✅ Should see "Success. No rows returned"

### 2. Create Admin User (2 min)
Go to: https://supabase.com/dashboard/project/aopxodevyedrevvraogo/auth/users
- Click "Add user"
- Email: admin@demo.com
- Password: Abc123456
- ✅ Auto Confirm User
- Click "Create user"

Then make admin:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'admin@demo.com';
```

### 3. Start Server (1 min)
```bash
cd /Users/7thgroup/Desktop/Quotations--main
pnpm dev
```
Open: http://localhost:5173

## 🎉 Start Using with Real Data

### Login
1. Go to http://localhost:5173/login
2. Email: admin@demo.com
3. Password: Abc123456

### Add First Client
1. Click "Clients" → "Add New Client"
2. Fill in real client info
3. Save

### Add First Product
1. Click "Products" → "Add New Product"
2. Add your service/product
3. Set real price
4. Save

### Create First Quotation
1. Click "Quotations" → "New Quotation"
2. Select client
3. Add products/services
4. Save & Send

### Convert to Invoice
1. Open quotation
2. Click "Convert to Invoice"
3. Send to client

### Record Payment
1. Click "Payments" → "Record Payment"
2. Select invoice
3. Enter amount
4. Save

## 📊 Your Dashboard Will Show:
- Total revenue
- Invoice count
- Client count
- Pending payments

## 🚀 You're Ready!

Start adding your real business data and manage your invoices professionally!

Need help? Check REAL_DATA_SETUP.md for detailed guide.
