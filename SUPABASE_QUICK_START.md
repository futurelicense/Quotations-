# 🚀 Quick Start with Supabase

Get InvoicePro running with Supabase in 10 minutes!

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account ([sign up free](https://supabase.com))

## ⚡ Quick Steps

### 1. Create Supabase Project (2 min)

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Enter:
   - Project name: `invoicepro`
   - Database password: (create & save it)
   - Region: (choose closest to you)
4. Click "Create new project"
5. ⏰ Wait 2-3 minutes for provisioning

### 2. Get Your API Keys (1 min)

1. In Supabase dashboard → **Settings** (⚙️) → **API**
2. Copy these values:
   ```
   Project URL: https://xxxxx.supabase.co
   Anon public key: eyJxxx...
   ```

### 3. Setup Database (2 min)

1. In Supabase → **SQL Editor**
2. Click "New query"
3. Open `supabase/schema.sql` from this project
4. Copy **ALL** content and paste into SQL Editor
5. Click "Run" or `Ctrl/Cmd + Enter`
6. ✅ You should see "Success. No rows returned"

### 4. Configure InvoicePro (2 min)

```bash
# Navigate to project
cd /Users/7thgroup/Desktop/Quotations--main

# Copy environment file
cp .env.local.example .env

# Edit .env file
nano .env  # or use your favorite editor
```

Add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...your-anon-key
VITE_APP_ENV=development
```

Save and close (`Ctrl+O`, `Enter`, `Ctrl+X` in nano).

### 5. Install & Run (3 min)

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

🎉 Open [http://localhost:5173](http://localhost:5173)

## ✨ First Login

1. Go to [http://localhost:5173/signup](http://localhost:5173/signup)
2. Create your account:
   - **Name**: Your name
   - **Email**: your@email.com
   - **Password**: min 6 characters
3. Click "Create account"
4. You're in! 🎊

## 📱 Try It Out

Now you can:

1. **Create a client** → Go to Clients → Add New Client
2. **Add products** → Go to Products → Add Product/Service
3. **Create quotation** → Go to Quotations → New Quotation
4. **Convert to invoice** → Open quotation → Convert to Invoice
5. **Track payments** → Go to Payments → Record Payment

## 🔒 Security Features

✅ **Email authentication** (username + password)  
✅ **Row-level security** (your data is private)  
✅ **Encrypted connections** (HTTPS)  
✅ **Secure tokens** (auto-managed by Supabase)

## 🎯 What Just Happened?

You've set up:
- ✅ PostgreSQL database with all tables
- ✅ User authentication with email/password
- ✅ Row-level security policies
- ✅ Automatic profile creation on signup
- ✅ Secure API connection
- ✅ Full-stack InvoicePro app

## 📚 Next Steps

- **Customize**: Edit colors in `tailwind.config.js`
- **Invite team**: Add more users via signup
- **Production**: See `SUPABASE_SETUP.md` for deployment
- **Features**: Explore payment gateways, templates, analytics

## 🐛 Troubleshooting

### Can't connect?
```bash
# Check environment variables
cat .env

# Ensure these are set:
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY
```

### "Invalid API key"?
- Double-check your `VITE_SUPABASE_ANON_KEY` in `.env`
- Make sure you copied the **Anon public** key, not the **Service role** key

### "Failed to fetch"?
- Check if your Supabase project is paused (free tier)
- Go to Supabase dashboard and wake it up

### Email not working?
- Supabase sends emails automatically
- Check spam folder
- For production, configure SMTP in Supabase settings

## 💡 Pro Tips

1. **Dev console**: Press `F12` to see any errors
2. **Database**: View data in Supabase → Table Editor
3. **Auth logs**: Check Supabase → Authentication → Logs
4. **Backup**: Supabase auto-backs up (Pro plan)

## 📞 Get Help

- **Full Setup Guide**: See `SUPABASE_SETUP.md`
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Discord**: [discord.supabase.com](https://discord.supabase.com)

---

**That's it! You're ready to invoice! 💰**

If everything works, you just:
1. ✅ Created a Supabase project
2. ✅ Set up the database
3. ✅ Connected InvoicePro
4. ✅ Created your first user

Welcome to InvoicePro! 🎉



