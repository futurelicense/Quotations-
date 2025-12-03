# Supabase Setup Guide for InvoicePro

This guide will help you set up Supabase as the backend database and authentication provider for InvoicePro.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js >= 18.0.0
- pnpm or npm

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in the project details:
   - **Name**: `invoicepro` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Select Free or Pro based on your needs
4. Click "Create new project"
5. Wait for the project to be provisioned (2-3 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** (gear icon) → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

## Step 3: Configure Environment Variables

1. In your InvoicePro project root, create a `.env` file:

```bash
cd /Users/7thgroup/Desktop/Quotations--main
cp .env.example .env
```

2. Edit the `.env` file and add your Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# App Configuration
VITE_APP_NAME=InvoicePro
VITE_APP_ENV=development

# Features
VITE_ENABLE_DEBUG=true
VITE_ENABLE_ANALYTICS=false
```

## Step 4: Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase/schema.sql` from this project
4. Paste it into the SQL editor
5. Click "Run" or press `Ctrl/Cmd + Enter`
6. You should see "Success. No rows returned"

This will create:
- All necessary tables (profiles, clients, products, quotations, invoices, payments, templates)
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers for automatic timestamps
- Function to auto-create user profiles

## Step 5: Verify Database Setup

1. In Supabase dashboard, go to **Table Editor**
2. You should see all these tables:
   - `profiles`
   - `clients`
   - `products`
   - `quotations`
   - `invoices`
   - `payments`
   - `templates`

## Step 6: Configure Authentication

1. Go to **Authentication** → **Providers**
2. **Email provider is enabled by default** ✓
3. Optional: Enable additional providers:
   - Google OAuth
   - GitHub OAuth
   - etc.

### Email Settings (Recommended)

1. Go to **Authentication** → **Email Templates**
2. Customize the email templates:
   - Confirm signup
   - Invite user
   - Magic link
   - Change email address
   - Reset password

### Authentication Settings

1. Go to **Authentication** → **Settings**
2. Configure:
   - **Site URL**: `http://localhost:5173` (development)
   - **Redirect URLs**: 
     - `http://localhost:5173/**`
     - `http://localhost:5173/reset-password`
   - **Enable Email Confirmations**: Toggle based on preference
   - **Minimum Password Length**: 6 (default)

## Step 7: Install Dependencies

```bash
cd /Users/7thgroup/Desktop/Quotations--main
pnpm install
```

This will install `@supabase/supabase-js` which is already added to `package.json`.

## Step 8: Run the Application

```bash
pnpm dev
```

The application will start at `http://localhost:5173`

## Step 9: Test Authentication

1. Go to `http://localhost:5173/signup`
2. Register a new account:
   - Enter your name
   - Enter your email
   - Create a password (min 6 characters)
3. Check your email for confirmation (if enabled)
4. Try logging in at `http://localhost:5173/login`

## Database Structure

### Tables Overview

**profiles**
- User profile information
- Automatically created when user signs up
- Stores role (admin, manager, staff)

**clients**
- Customer/client information
- User-specific (RLS enabled)
- Tracks total invoiced and paid amounts

**products**
- Products and services catalog
- Support both product and service types
- Price, tax rate, and category information

**quotations**
- Quotation/quote management
- Items stored as JSONB
- Can be converted to invoices
- Status tracking (draft, sent, approved, etc.)

**invoices**
- Invoice management
- Items stored as JSONB
- Support for recurring invoices
- Payment tracking

**payments**
- Payment records
- Multiple payment methods supported
- Links to invoices and clients

**templates**
- Custom templates for quotations and invoices
- User-specific designs

## Row Level Security (RLS)

All tables have RLS enabled. Users can only:
- View their own data
- Create records for themselves
- Update their own records
- Delete their own records

This is enforced at the database level for maximum security.

## Troubleshooting

### Issue: "Invalid API key"

**Solution**: Double-check your `VITE_SUPABASE_ANON_KEY` in `.env`

### Issue: "Failed to fetch"

**Solution**: 
1. Check `VITE_SUPABASE_URL` is correct
2. Ensure project is not paused (free tier projects pause after inactivity)
3. Check network connection

### Issue: "Row Level Security policy violation"

**Solution**: Ensure you ran the complete schema.sql including RLS policies

### Issue: "User already registered"

**Solution**: This is expected. Try logging in instead of signing up.

### Issue: Email not sending

**Solution**: 
1. Check Supabase email settings
2. For production, configure SMTP
3. For development, check Supabase logs in Authentication → Logs

## Production Deployment

### Environment Variables

Create `.env.production`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-key
VITE_APP_ENV=production
VITE_ENABLE_DEBUG=false
VITE_ENABLE_ANALYTICS=true
```

### Security Checklist

- [ ] Update Site URL in Supabase settings to production URL
- [ ] Add production redirect URLs
- [ ] Enable email confirmations
- [ ] Configure custom SMTP (Settings → Authentication → SMTP Settings)
- [ ] Review and test all RLS policies
- [ ] Enable database backups (Settings → Database → Backups)
- [ ] Set up database replication (Pro plan)
- [ ] Configure rate limiting
- [ ] Review API usage and upgrade plan if needed

### Custom Domain (Optional)

1. Go to **Settings** → **Custom Domains**
2. Follow instructions to add your custom domain
3. Update `VITE_SUPABASE_URL` with your custom domain

## Useful Supabase Features

### Database Functions

Create custom functions in SQL Editor:

```sql
CREATE OR REPLACE FUNCTION get_dashboard_stats(user_id UUID)
RETURNS JSON AS $$
  -- Your custom SQL here
$$ LANGUAGE sql;
```

### Realtime Subscriptions

Listen to database changes in real-time:

```typescript
import { supabase } from './lib/supabase';

supabase
  .channel('invoices')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'invoices',
  }, (payload) => {
    console.log('Invoice changed:', payload);
  })
  .subscribe();
```

### Storage (for file uploads)

1. Go to **Storage** → **Create bucket**
2. Create buckets for:
   - `avatars` (user profile pictures)
   - `invoices` (PDF invoices)
   - `documents` (client documents)

### Edge Functions (serverless)

For complex backend logic, use Supabase Edge Functions.

## Monitoring and Logs

### Database Logs

Go to **Logs** → **Database Logs** to see:
- Query performance
- Errors
- Slow queries

### Auth Logs

Go to **Authentication** → **Logs** to see:
- Login attempts
- Registration events
- Password resets

### API Usage

Go to **Settings** → **Usage** to monitor:
- Database size
- Bandwidth
- API requests
- Storage usage

## Backup and Recovery

### Manual Backup

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Dump database
supabase db dump --project-ref your-project-ref > backup.sql
```

### Automated Backups

Pro plan includes daily automated backups.

## Support

- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **Supabase Discord**: [https://discord.supabase.com](https://discord.supabase.com)
- **GitHub Issues**: Report InvoicePro-specific issues

## Next Steps

1. ✅ Complete this setup
2. 📊 Explore the dashboard
3. 👥 Create some test clients
4. 📄 Generate a test quotation
5. 🧾 Convert quotation to invoice
6. 💰 Record a payment
7. 📈 View analytics

Congratulations! Your InvoicePro is now powered by Supabase! 🎉
