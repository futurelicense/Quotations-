# 🚨 URGENT: Run Database Migration

## Error: `Could not find the table 'public.settings'`

This error occurs because the `settings` and `automations` tables haven't been created yet.

## Quick Fix - Run This SQL in Supabase

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click on **"SQL Editor"** in the left sidebar
3. Click **"New query"**

### Step 2: Copy and Run This SQL

Copy the entire contents of `supabase/add-automation-settings-tables.sql` and paste it into the SQL Editor, then click **"Run"** (or press Cmd/Ctrl + Enter).

**OR** copy this SQL directly:

```sql
-- Create automation table for recurring invoices, reminders, and workflows
CREATE TABLE IF NOT EXISTS public.automations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('recurring_invoice', 'reminder', 'workflow')),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'paused')),
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create settings table for user/company settings
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT,
  company_email TEXT,
  company_phone TEXT,
  company_website TEXT,
  company_address TEXT,
  company_tax_id TEXT,
  company_registration_number TEXT,
  default_currency TEXT DEFAULT 'USD',
  currency_format TEXT DEFAULT 'symbol',
  tax_rates JSONB DEFAULT '[]',
  notification_preferences JSONB DEFAULT '{}',
  payment_gateways JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update templates table to include more fields
ALTER TABLE public.templates 
ADD COLUMN IF NOT EXISTS header_text TEXT DEFAULT 'INVOICE',
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS company_address TEXT,
ADD COLUMN IF NOT EXISTS company_phone TEXT,
ADD COLUMN IF NOT EXISTS company_email TEXT,
ADD COLUMN IF NOT EXISTS footer_text TEXT,
ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#41BAC4',
ADD COLUMN IF NOT EXISTS font_family TEXT DEFAULT 'Inter';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_automations_user_id ON public.automations(user_id);
CREATE INDEX IF NOT EXISTS idx_automations_type ON public.automations(type);
CREATE INDEX IF NOT EXISTS idx_automations_status ON public.automations(status);
CREATE INDEX IF NOT EXISTS idx_settings_user_id ON public.settings(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON public.templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_type ON public.templates(type);

-- Enable RLS
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for automations
DROP POLICY IF EXISTS "Users can view own automations" ON public.automations;
CREATE POLICY "Users can view own automations" ON public.automations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own automations" ON public.automations;
CREATE POLICY "Users can insert own automations" ON public.automations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own automations" ON public.automations;
CREATE POLICY "Users can update own automations" ON public.automations
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own automations" ON public.automations;
CREATE POLICY "Users can delete own automations" ON public.automations
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for settings
DROP POLICY IF EXISTS "Users can view own settings" ON public.settings;
CREATE POLICY "Users can view own settings" ON public.settings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own settings" ON public.settings;
CREATE POLICY "Users can insert own settings" ON public.settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own settings" ON public.settings;
CREATE POLICY "Users can update own settings" ON public.settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Create triggers for updated_at (if function exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_updated_at') THEN
    DROP TRIGGER IF EXISTS set_updated_at ON public.automations;
    CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.automations
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

    DROP TRIGGER IF EXISTS set_updated_at ON public.settings;
    CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.settings
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;
```

### Step 3: Verify Tables Were Created

Run this query to verify:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('settings', 'automations', 'templates');
```

You should see all three tables listed.

### Step 4: Refresh Your App

After running the migration:
1. Refresh your browser
2. The error should be gone
3. All pages (Templates, Analytics, Automation, Settings) should work

## ✅ Success Indicators

After running the migration, you should see:
- ✅ No errors in the console
- ✅ Settings page loads without errors
- ✅ Automation page loads without errors
- ✅ Templates page works with new fields
- ✅ You can create and save settings

## 🆘 If You Still Get Errors

1. **Check if tables exist**:
   ```sql
   SELECT * FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'settings';
   ```

2. **Check RLS policies**:
   ```sql
   SELECT * FROM pg_policies 
   WHERE tablename = 'settings';
   ```

3. **Verify user authentication** - Make sure you're logged in

4. **Clear browser cache** - Sometimes cached errors persist

## 📝 Notes

- The migration uses `IF NOT EXISTS` so it's safe to run multiple times
- All tables have Row Level Security (RLS) enabled
- Each user can only access their own data
- The migration is idempotent (safe to re-run)

