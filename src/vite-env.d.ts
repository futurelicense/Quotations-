/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_APP_NAME?: string
  readonly VITE_APP_ENV?: string
  readonly VITE_API_URL?: string
  readonly VITE_API_TIMEOUT?: string
  readonly VITE_AUTH_TOKEN_KEY?: string
  readonly VITE_AUTH_REFRESH_TOKEN_KEY?: string
  readonly VITE_ENABLE_ANALYTICS?: string
  readonly VITE_ENABLE_DEBUG?: string
  readonly VITE_PAYSTACK_PUBLIC_KEY?: string
  readonly VITE_FLUTTERWAVE_PUBLIC_KEY?: string
  readonly VITE_STRIPE_PUBLIC_KEY?: string
  readonly VITE_MAX_FILE_SIZE?: string
  readonly VITE_ALLOWED_FILE_TYPES?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

