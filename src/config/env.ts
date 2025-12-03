// Environment configuration
export const env = {
  // Supabase Configuration
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  
  // App Configuration
  appName: import.meta.env.VITE_APP_NAME || 'InvoicePro',
  appEnv: import.meta.env.VITE_APP_ENV || 'development',
  
  // Legacy API Configuration (kept for backwards compatibility)
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  authTokenKey: import.meta.env.VITE_AUTH_TOKEN_KEY || 'invoicepro_token',
  authRefreshTokenKey: import.meta.env.VITE_AUTH_REFRESH_TOKEN_KEY || 'invoicepro_refresh_token',
  
  // Features
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  
  // Payment Gateways
  paystackPublicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
  flutterwavePublicKey: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || '',
  stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
  
  // File Upload
  maxFileSize: Number(import.meta.env.VITE_MAX_FILE_SIZE) || 5242880,
  allowedFileTypes: import.meta.env.VITE_ALLOWED_FILE_TYPES?.split(',') || ['image/jpeg', 'image/png', 'application/pdf'],
} as const;

export const isDevelopment = env.appEnv === 'development';
export const isProduction = env.appEnv === 'production';

