import { supabase } from '../lib/supabase';
import type { Client, Product, Quotation, Invoice, Payment } from '../types';

// Clients Service
export class ClientsService {
  async getAll(userId: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async getById(id: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async create(userId: string, client: Omit<Client, 'id' | 'createdAt' | 'totalInvoiced' | 'totalPaid'>) {
    const { data, error } = await supabase
      .from('clients')
      .insert([{
        user_id: userId,
        ...client,
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Client>) {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(id: string) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}

// Products Service
export class ProductsService {
  async getAll(userId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async getById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async create(userId: string, product: Omit<Product, 'id'>) {
    const { data, error} = await supabase
      .from('products')
      .insert([{
        user_id: userId,
        ...product,
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}

// Quotations Service
export class QuotationsService {
  async getAll(userId: string) {
    const { data, error } = await supabase
      .from('quotations')
      .select(`
        *,
        clients:client_id (name, email, company)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async getById(id: string) {
    const { data, error } = await supabase
      .from('quotations')
      .select(`
        *,
        clients:client_id (name, email, company)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async create(userId: string, quotation: any) {
    const { data, error } = await supabase
      .from('quotations')
      .insert([{
        user_id: userId,
        ...quotation,
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('quotations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(id: string) {
    const { error } = await supabase
      .from('quotations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async convertToInvoice(quotationId: string, userId: string) {
    // Get quotation
    const quotation = await this.getById(quotationId);
    
    // Create invoice from quotation
    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert([{
        user_id: userId,
        client_id: quotation.client_id,
        invoice_number: `INV-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'draft',
        items: quotation.items,
        subtotal: quotation.subtotal,
        tax_amount: quotation.tax_amount,
        discount_amount: quotation.discount_amount,
        total: quotation.total,
        amount_paid: 0,
        amount_due: quotation.total,
        currency: quotation.currency,
        notes: quotation.notes,
        terms: quotation.terms,
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    // Update quotation status
    await this.update(quotationId, {
      status: 'converted',
      converted_to_invoice_id: invoice.id,
    });
    
    return invoice;
  }
}

// Invoices Service
export class InvoicesService {
  async getAll(userId: string) {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        clients:client_id (name, email, company)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async getById(id: string) {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        clients:client_id (name, email, company)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async create(userId: string, invoice: any) {
    const { data, error } = await supabase
      .from('invoices')
      .insert([{
        user_id: userId,
        ...invoice,
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(id: string) {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async markAsPaid(id: string, paymentAmount: number) {
    const invoice = await this.getById(id);
    const newAmountPaid = (invoice.amount_paid || 0) + paymentAmount;
    const newAmountDue = invoice.total - newAmountPaid;
    
    const { data, error } = await supabase
      .from('invoices')
      .update({
        amount_paid: newAmountPaid,
        amount_due: newAmountDue,
        status: newAmountDue <= 0 ? 'paid' : 'sent',
        paid_at: newAmountDue <= 0 ? new Date().toISOString() : null,
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

// Payments Service
export class PaymentsService {
  async getAll(userId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        invoices:invoice_id (invoice_number),
        clients:client_id (name, company)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async getById(id: string) {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        invoices:invoice_id (invoice_number),
        clients:client_id (name, company)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async create(userId: string, payment: any) {
    const { data, error } = await supabase
      .from('payments')
      .insert([{
        user_id: userId,
        ...payment,
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    // Update invoice amount
    if (payment.status === 'completed') {
      const invoicesService = new InvoicesService();
      await invoicesService.markAsPaid(payment.invoice_id, payment.amount);
    }
    
    return data;
  }

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(id: string) {
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}

// Dashboard Service
export class DashboardService {
  async getStats(userId: string) {
    // Get total revenue (sum of paid invoices)
    const { data: invoices } = await supabase
      .from('invoices')
      .select('total, amount_paid')
      .eq('user_id', userId);
    
    const totalRevenue = invoices?.reduce((sum, inv) => sum + (inv.amount_paid || 0), 0) || 0;
    const totalInvoices = invoices?.length || 0;
    const pendingPayments = invoices?.reduce((sum, inv) => sum + (inv.total - (inv.amount_paid || 0)), 0) || 0;
    
    // Get total clients
    const { count: clientCount } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'active');
    
    return {
      totalRevenue,
      totalInvoices,
      totalClients: clientCount || 0,
      pendingPayments,
      revenueGrowth: 0, // Calculate based on historical data
      invoiceGrowth: 0,
      clientGrowth: 0,
      paymentGrowth: 0,
    };
  }

  async getRecentInvoices(userId: string, limit: number = 5) {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        clients:client_id (name, company)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }

  async getRecentQuotations(userId: string, limit: number = 5) {
    const { data, error } = await supabase
      .from('quotations')
      .select(`
        *,
        clients:client_id (name, company)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
}

export const clientsService = new ClientsService();
export const productsService = new ProductsService();
export const quotationsService = new QuotationsService();
export const invoicesService = new InvoicesService();
export const paymentsService = new PaymentsService();
export const dashboardService = new DashboardService();

