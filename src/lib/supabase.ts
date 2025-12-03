import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

// Initialize Supabase client
const supabaseUrl = env.supabaseUrl;
const supabaseAnonKey = env.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'invoicepro-auth',
  },
});

// Database types (you can generate these from Supabase CLI)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'admin' | 'manager' | 'staff';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'manager' | 'staff';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'manager' | 'staff';
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          company: string;
          address: string;
          city: string;
          country: string;
          tax_id: string | null;
          status: 'active' | 'inactive';
          total_invoiced: number;
          total_paid: number;
          created_at: string;
          updated_at: string;
          user_id: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          type: 'product' | 'service';
          sku: string | null;
          price: number;
          currency: string;
          tax_rate: number;
          category: string;
          status: 'active' | 'inactive';
          created_at: string;
          updated_at: string;
          user_id: string;
        };
      };
      quotations: {
        Row: {
          id: string;
          quotation_number: string;
          client_id: string;
          date: string;
          expiry_date: string;
          status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'converted';
          subtotal: number;
          tax_amount: number;
          discount_amount: number;
          total: number;
          currency: string;
          notes: string | null;
          terms: string | null;
          converted_to_invoice_id: string | null;
          created_at: string;
          updated_at: string;
          user_id: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          invoice_number: string;
          client_id: string;
          date: string;
          due_date: string;
          status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
          subtotal: number;
          tax_amount: number;
          discount_amount: number;
          total: number;
          amount_paid: number;
          amount_due: number;
          currency: string;
          notes: string | null;
          terms: string | null;
          payment_method: string | null;
          created_at: string;
          updated_at: string;
          paid_at: string | null;
          user_id: string;
        };
      };
    };
  };
}
