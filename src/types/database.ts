export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          company: string | null
          role: 'admin' | 'manager' | 'staff'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          company?: string | null
          role?: 'admin' | 'manager' | 'staff'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          company?: string | null
          role?: 'admin' | 'manager' | 'staff'
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          phone: string
          company: string
          address: string
          city: string
          country: string
          tax_id: string | null
          status: 'active' | 'inactive'
          total_invoiced: number
          total_paid: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          phone: string
          company: string
          address: string
          city: string
          country: string
          tax_id?: string | null
          status?: 'active' | 'inactive'
          total_invoiced?: number
          total_paid?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          phone?: string
          company?: string
          address?: string
          city?: string
          country?: string
          tax_id?: string | null
          status?: 'active' | 'inactive'
          total_invoiced?: number
          total_paid?: number
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          type: 'product' | 'service'
          sku: string | null
          price: number
          currency: string
          tax_rate: number
          category: string
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description: string
          type: 'product' | 'service'
          sku?: string | null
          price: number
          currency?: string
          tax_rate?: number
          category: string
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          type?: 'product' | 'service'
          sku?: string | null
          price?: number
          currency?: string
          tax_rate?: number
          category?: string
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
      }
      quotations: {
        Row: {
          id: string
          user_id: string
          quotation_number: string
          client_id: string
          date: string
          expiry_date: string
          status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'converted'
          items: Json
          subtotal: number
          tax_amount: number
          discount_amount: number
          total: number
          currency: string
          notes: string | null
          terms: string | null
          converted_to_invoice_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          quotation_number: string
          client_id: string
          date: string
          expiry_date: string
          status?: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'converted'
          items: Json
          subtotal: number
          tax_amount: number
          discount_amount: number
          total: number
          currency?: string
          notes?: string | null
          terms?: string | null
          converted_to_invoice_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          quotation_number?: string
          client_id?: string
          date?: string
          expiry_date?: string
          status?: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'converted'
          items?: Json
          subtotal?: number
          tax_amount?: number
          discount_amount?: number
          total?: number
          currency?: string
          notes?: string | null
          terms?: string | null
          converted_to_invoice_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          user_id: string
          invoice_number: string
          client_id: string
          date: string
          due_date: string
          status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          items: Json
          subtotal: number
          tax_amount: number
          discount_amount: number
          total: number
          amount_paid: number
          amount_due: number
          currency: string
          notes: string | null
          terms: string | null
          payment_method: string | null
          recurring: Json | null
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          invoice_number: string
          client_id: string
          date: string
          due_date: string
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          items: Json
          subtotal: number
          tax_amount: number
          discount_amount: number
          total: number
          amount_paid?: number
          amount_due: number
          currency?: string
          notes?: string | null
          terms?: string | null
          payment_method?: string | null
          recurring?: Json | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          invoice_number?: string
          client_id?: string
          date?: string
          due_date?: string
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          items?: Json
          subtotal?: number
          tax_amount?: number
          discount_amount?: number
          total?: number
          amount_paid?: number
          amount_due?: number
          currency?: string
          notes?: string | null
          terms?: string | null
          payment_method?: string | null
          recurring?: Json | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          invoice_id: string
          amount: number
          currency: string
          method: 'paystack' | 'flutterwave' | 'stripe' | 'bank_transfer' | 'cash'
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id: string | null
          date: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          invoice_id: string
          amount: number
          currency?: string
          method: 'paystack' | 'flutterwave' | 'stripe' | 'bank_transfer' | 'cash'
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string | null
          date: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          invoice_id?: string
          amount?: number
          currency?: string
          method?: 'paystack' | 'flutterwave' | 'stripe' | 'bank_transfer' | 'cash'
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string | null
          date?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

