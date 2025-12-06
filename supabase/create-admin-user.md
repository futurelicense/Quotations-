# Create Admin User

## Admin Credentials
- **Email**: admin@demo.com
- **Password**: Abc123456

## Option 1: Using Supabase Dashboard (Recommended)

### Step 1: Create the User
1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/aopxodevyedrevvraogo
2. Click **Authentication** → **Users**
3. Click **"Add user"** → **"Create new user"**
4. Fill in:
   - **Email**: `admin@demo.com`
   - **Password**: `Abc123456`
   - **Auto Confirm User**: ✅ Check this box (important!)
5. Click **"Create user"**

### Step 2: Set Admin Role
1. Go to **SQL Editor**
2. Run this query:

```sql
UPDATE public.profiles 
SET role = 'admin', full_name = 'Admin User'
WHERE email = 'admin@demo.com';
```

3. Verify it worked:

```sql
SELECT id, email, full_name, role, created_at 
FROM public.profiles 
WHERE email = 'admin@demo.com';
```

You should see the user with `role = 'admin'`

---

## Option 2: Using the InvoicePro App

### Step 1: Sign Up Through the App
1. Make sure your app is running: `pnpm dev`
2. Go to: http://localhost:5173/signup
3. Register with:
   - **Name**: Admin User
   - **Email**: admin@demo.com
   - **Password**: Abc123456

### Step 2: Upgrade to Admin
1. Go to Supabase Dashboard → **SQL Editor**
2. Run this query:

```sql
UPDATE public.profiles 
SET role = 'admin'
WHERE email = 'admin@demo.com';
```

---

## Option 3: Using Supabase API (Advanced)

If you have Supabase service role key, you can use this Node.js script:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://aopxodevyedrevvraogo.supabase.co',
  'YOUR_SERVICE_ROLE_KEY' // Get this from Settings → API
)

// Create admin user
const { data, error } = await supabase.auth.admin.createUser({
  email: 'admin@demo.com',
  password: 'Abc123456',
  email_confirm: true,
  user_metadata: {
    full_name: 'Admin User'
  }
})

if (error) {
  console.error('Error creating user:', error)
} else {
  console.log('User created:', data)
  
  // Update role to admin
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('email', 'admin@demo.com')
  
  if (updateError) {
    console.error('Error updating role:', updateError)
  } else {
    console.log('User role updated to admin')
  }
}
```

---

## Verify Admin Access

After creating the admin user:

1. **Log out** if you're logged in
2. Go to: http://localhost:5173/login
3. Sign in with:
   - Email: `admin@demo.com`
   - Password: `Abc123456`
4. You should now have admin access! 🎉

---

## Security Note

⚠️ **Important**: 
- Change this password in production!
- This is a demo password for development only
- For production, use a strong, unique password

---

## Troubleshooting

**"User already exists"**
- The user is already created, just update the role using the SQL query above

**"Email not confirmed"**
- Make sure you checked "Auto Confirm User" when creating the user
- Or confirm the email manually in Authentication → Users

**"Cannot login"**
- Check that the email confirmation is enabled
- Verify the password is exactly: `Abc123456`
- Check browser console for errors


