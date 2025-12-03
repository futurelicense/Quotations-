# Supabase Quick Start - 5 Minutes Setup ⚡

Get InvoicePro running with Supabase in 5 minutes!

## Step 1: Create Supabase Project (2 min)

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Choose:
   - **Name**: InvoicePro
   - **Password**: (create a strong password)
   - **Region**: (closest to you)
4. Click "Create new project" and wait ~2 minutes

## Step 2: Run Database Setup (1 min)

1. In your Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy ALL contents from `supabase/schema.sql` in this project
4. Paste into the SQL editor
5. Click **"Run"** (or Ctrl/Cmd + Enter)
6. Wait for "Success. No rows returned"

✅ **Done!** Your database is ready.

## Step 3: Get API Credentials (1 min)

1. Go to **Settings** > **API** (left sidebar)
2. Copy these two values:

   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGci...
   ```

## Step 4: Configure Your App (1 min)

1. In your InvoicePro project, create `.env` file:
   ```bash
   cp .env.example.local .env
   ```

2. Edit `.env` and paste your credentials:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   ```

3. Install dependencies and start:
   ```bash
   pnpm install
   pnpm dev
   ```

## Step 5: Test It! (30 sec)

1. Open `http://localhost:5173/register`
2. Create an account:
   - Name: Your Name
   - Email: you@example.com
   - Password: Test12345678
3. Click "Create account"
4. You should be redirected to the dashboard!

## ✅ You're Done!

Your app is now running with:
- ✅ User authentication
- ✅ Database with all tables
- ✅ Row-level security
- ✅ Ready for development

## Next Steps

- Read [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for detailed documentation
- Check [README.md](README.md) for feature documentation
- Start building! 🚀

## Common Issues

### ❌ "Missing Supabase credentials"
- Check `.env` file exists in project root
- Verify both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set
- Restart dev server: `pnpm dev`

### ❌ "relation public.profiles does not exist"
- Run the SQL schema script in Supabase SQL Editor
- Check for errors in the SQL execution

### ❌ Can't create account
- Check email format is valid
- Password must be at least 8 characters
- Check browser console for specific errors

## Quick Commands

```bash
# Start development
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Check for errors
pnpm lint
pnpm type-check
```

---

**Need help?** Check [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for detailed troubleshooting.

