# 🚀 InvoicePro - Real Data Setup Guide

Complete guide to setting up and using InvoicePro with real business data.

---

## ✅ Current Status

Your InvoicePro application is configured and ready:
- ✅ Environment variables configured
- ✅ Supabase connected
- ✅ Authentication working
- ✅ Code pushed to GitHub
- ✅ All fixes applied

---

## 📋 Pre-Launch Checklist

### 1. **Database Schema Setup** ✓

**Verify in Supabase**:
1. Go to: https://supabase.com/dashboard/project/aopxodevyedrevvraogo/editor
2. Check these 7 tables exist:
   - `profiles`
   - `clients`
   - `products`
   - `quotations`
   - `invoices`
   - `payments`
   - `templates`

**If tables don't exist**, run `supabase/schema.sql` in SQL Editor.

---

### 2. **Admin User Setup** ✓

**Create Admin Account**:

**Option A: Through Dashboard**
1. Go to: https://supabase.com/dashboard/project/aopxodevyedrevvraogo/auth/users
2. Add user:
   - Email: `admin@demo.com`
   - Password: `Abc123456`
   - ✅ Auto Confirm User

**Option B: Through App**
1. Go to: http://localhost:5173/signup
2. Register with your real email
3. Then promote to admin in SQL Editor:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
   ```

---

### 3. **Start Development Server** ✓

```bash
cd /Users/7thgroup/Desktop/Quotations--main
pnpm dev
```

Open: http://localhost:5173

---

## 🎯 Using InvoicePro with Real Data

### **Step 1: Login**

1. Go to http://localhost:5173/login
2. Enter your credentials
3. Click "Sign in"

---

### **Step 2: Add Your First Client**

1. **Navigate**: Click "Clients" in sidebar
2. **Add Client**: Click "Add New Client" button
3. **Fill in Real Data**:
   ```
   Name: John Smith
   Email: john@techcorp.com
   Phone: +1 (555) 123-4567
   Company: TechCorp Solutions
   Address: 123 Business Ave
   City: San Francisco
   Country: United States
   Tax ID: 12-3456789
   Status: Active
   ```
4. **Save**: Click "Create Client"

**Pro Tip**: Add 3-5 real clients to start with.

---

### **Step 3: Add Your Products/Services**

1. **Navigate**: Click "Products" in sidebar
2. **Add Product**: Click "Add New Product"
3. **Example Product**:
   ```
   Name: Website Development
   Description: Custom website design and development
   Type: Service
   SKU: WEB-DEV-001
   Price: $2,500.00
   Currency: USD
   Tax Rate: 8.5%
   Category: Development
   Status: Active
   ```
4. **Example Service**:
   ```
   Name: Monthly Maintenance
   Description: Website hosting and maintenance
   Type: Service
   SKU: MAINT-001
   Price: $150.00
   Currency: USD
   Tax Rate: 8.5%
   Category: Support
   Status: Active
   ```

**Pro Tip**: Add your actual products/services with real pricing.

---

### **Step 4: Create Your First Quotation**

1. **Navigate**: Click "Quotations" in sidebar
2. **New Quotation**: Click "New Quotation"
3. **Fill Details**:
   ```
   Client: Select from dropdown (e.g., John Smith - TechCorp Solutions)
   Quotation Number: QUO-2024-001 (auto-generated)
   Date: Today's date
   Expiry Date: 30 days from now
   ```
4. **Add Line Items**:
   - Click "Add Item"
   - Select Product: Website Development
   - Quantity: 1
   - Unit Price: $2,500.00
   - Discount: 10% (if applicable)
   - Click "Add"
   
   - Add another: Monthly Maintenance (6 months)
   - Quantity: 6
   - Unit Price: $150.00
   
5. **Add Notes**:
   ```
   Thank you for your interest in our services.
   This quotation is valid for 30 days.
   ```
6. **Add Terms**:
   ```
   - 50% deposit required to start
   - Balance due upon completion
   - Payment terms: Net 15
   ```
7. **Save**: Click "Save as Draft" or "Send to Client"

---

### **Step 5: Convert Quotation to Invoice**

1. **Open Quotation**: Click on a quotation
2. **Convert**: Click "Convert to Invoice" button
3. **Review Invoice**:
   - Invoice number auto-generated
   - Due date: Set payment terms (e.g., Net 30)
   - All line items copied from quotation
4. **Send**: Click "Send Invoice" to email client

---

### **Step 6: Record Payments**

1. **Navigate**: Click "Payments" in sidebar
2. **Record Payment**: Click "Record Payment"
3. **Fill Details**:
   ```
   Invoice: Select invoice
   Amount: $1,250.00 (50% deposit)
   Payment Method: Bank Transfer
   Transaction ID: TXN-123456
   Date: Today
   Status: Completed
   Notes: 50% deposit received
   ```
4. **Save**: Click "Record Payment"

The invoice will automatically update to show partial payment.

---

## 📊 Using the Dashboard

The dashboard automatically updates with real data:

### **Key Metrics**:
- **Total Revenue**: Sum of all paid invoices
- **Total Invoices**: Count of all invoices
- **Active Clients**: Number of active clients
- **Pending Payments**: Outstanding invoice amounts

### **Recent Activity**:
- Recent invoices
- Recent quotations
- Payment history

### **Analytics**:
- Revenue trends (coming soon)
- Client performance
- Product sales

---

## 🎨 Customization

### **1. Update Company Branding**

Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    400: '#41BAC4', // Change to your brand color
  }
}
```

### **2. Customize Templates**

1. Navigate to "Templates" in sidebar
2. Create custom invoice/quotation layouts
3. Set as default

### **3. Configure Payment Gateways**

Add to `.env`:
```env
VITE_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-xxxxx
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx
```

---

## 💼 Real Business Workflow

### **New Client Onboarding**:
1. Add client to database
2. Create quotation for services
3. Send quotation to client
4. Follow up via email
5. Convert approved quotation to invoice
6. Receive payment
7. Record payment in system
8. Mark invoice as paid

### **Monthly Billing**:
1. Set up recurring invoices
2. System auto-generates monthly
3. Auto-send on schedule
4. Track payment status
5. Send reminders for overdue

### **End of Month Reports**:
1. Check dashboard analytics
2. Review pending payments
3. Send payment reminders
4. Generate financial reports

---

## 🔐 Security Best Practices

### **For Production**:

1. **Change Admin Password**:
   ```sql
   -- In Supabase SQL Editor
   -- User must reset password through app
   ```

2. **Enable Email Confirmations**:
   - Supabase → Authentication → Settings
   - Enable "Confirm email"

3. **Set Up SMTP**:
   - Configure custom email sender
   - Use your domain

4. **Configure Domain**:
   - Add production URL to Supabase
   - Update redirect URLs

5. **Backup Data**:
   - Enable automatic backups in Supabase
   - Export data regularly

---

## 📈 Growth Features

### **Phase 1: Core Operations** ✅
- Client management
- Product catalog
- Quotations
- Invoices
- Payment tracking

### **Phase 2: Automation** (Next)
- Recurring invoices
- Payment reminders
- Email automation
- Report generation

### **Phase 3: Integration** (Future)
- Accounting software integration
- Payment gateway integration
- CRM integration
- API access

---

## 🐛 Common Issues & Solutions

### **Can't Login**
- Check email is confirmed in Supabase
- Verify password is correct
- Check browser console for errors

### **Data Not Showing**
- Verify database schema is set up
- Check RLS policies are enabled
- Ensure you're logged in as correct user

### **Payment Not Recording**
- Check invoice exists
- Verify amount is correct
- Check payment method is valid

### **Email Not Sending**
- Configure SMTP in Supabase
- Check email templates
- Verify recipient email is correct

---

## 📞 Support Resources

### **Documentation**:
- README.md - Main documentation
- SUPABASE_SETUP.md - Database setup
- DEPLOYMENT.md - Production deployment

### **Supabase Dashboard**:
- Database: https://supabase.com/dashboard/project/aopxodevyedrevvraogo/editor
- Authentication: https://supabase.com/dashboard/project/aopxodevyedrevvraogo/auth/users
- SQL Editor: https://supabase.com/dashboard/project/aopxodevyedrevvraogo/sql

### **GitHub**:
- Repository: https://github.com/futurelicense/Quotations-

---

## 🎯 Quick Start Commands

```bash
# Start development server
cd /Users/7thgroup/Desktop/Quotations--main
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Check for errors
pnpm lint
pnpm type-check

# Deploy with Docker
docker-compose up -d
```

---

## 📊 Sample Data vs Real Data

### **Development (Sample Data)**:
- Use test clients
- Test products
- Practice quotations
- Demo invoices

### **Production (Real Data)**:
- Real client information
- Actual pricing
- Live quotations
- Real invoices
- Real payments

**Switch to Production**:
1. Update `.env` with production Supabase
2. Run production build: `pnpm build`
3. Deploy to hosting
4. Start adding real data

---

## ✅ Ready to Go Live

### **Pre-Launch Checklist**:
- [ ] Database schema deployed
- [ ] Admin user created
- [ ] Test client added
- [ ] Test product added
- [ ] Test quotation created
- [ ] Test invoice generated
- [ ] Payment recorded successfully
- [ ] Email notifications working
- [ ] Dashboard showing data
- [ ] All features tested

### **Go Live**:
1. ✅ Complete pre-launch checklist
2. 🚀 Deploy to production
3. 📧 Configure production emails
4. 👥 Add real clients
5. 💰 Start invoicing!

---

## 🎉 Success!

You're now ready to manage your business with InvoicePro!

**Next Steps**:
1. Add your first real client
2. Create your first quotation
3. Send it to your client
4. Convert to invoice when approved
5. Record payment when received
6. Grow your business! 🚀

---

**For questions or issues, check the documentation or create an issue on GitHub.**

Good luck with your invoicing! 💼

