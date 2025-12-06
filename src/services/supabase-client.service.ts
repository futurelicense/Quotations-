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

// Templates Service
export class TemplatesService {
  async getAll(userId: string) {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async getById(id: string) {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async create(userId: string, template: any) {
    const { data, error } = await supabase
      .from('templates')
      .insert([{
        user_id: userId,
        ...template,
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(id: string) {
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async setDefault(userId: string, templateId: string, type: string) {
    // First, unset all defaults of this type
    await supabase
      .from('templates')
      .update({ is_default: false })
      .eq('user_id', userId)
      .eq('type', type);
    
    // Then set the new default
    const { data, error } = await supabase
      .from('templates')
      .update({ is_default: true })
      .eq('id', templateId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

// Automations Service
export class AutomationsService {
  async getAll(userId: string) {
    const { data, error } = await supabase
      .from('automations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async getById(id: string) {
    const { data, error } = await supabase
      .from('automations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async create(userId: string, automation: any) {
    const { data, error } = await supabase
      .from('automations')
      .insert([{
        user_id: userId,
        ...automation,
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('automations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(id: string) {
    const { error } = await supabase
      .from('automations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async getByType(userId: string, type: string) {
    const { data, error } = await supabase
      .from('automations')
      .select('*')
      .eq('user_id', userId)
      .eq('type', type)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
}

// Settings Service
export class SettingsService {
  async get(userId: string) {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createOrUpdate(userId: string, settings: any) {
    // Check if settings exist
    const existing = await this.get(userId);
    
    if (existing) {
      const { data, error } = await supabase
        .from('settings')
        .update(settings)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('settings')
        .insert([{
          user_id: userId,
          ...settings,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  }
}

// Analytics Service (uses existing data)
export class AnalyticsService {
  async getStats(userId: string) {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get current month revenue from invoices
    const { data: currentInvoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('total, status, currency, date')
      .eq('user_id', userId)
      .gte('date', currentMonthStart.toISOString().split('T')[0]);
    
    if (invoicesError) throw invoicesError;

    // Get last month revenue
    const { data: lastMonthInvoices, error: lastMonthInvoicesError } = await supabase
      .from('invoices')
      .select('total, status, currency')
      .eq('user_id', userId)
      .gte('date', lastMonthStart.toISOString().split('T')[0])
      .lt('date', currentMonthStart.toISOString().split('T')[0]);
    
    if (lastMonthInvoicesError) throw lastMonthInvoicesError;

    // Calculate current month revenue
    const currentRevenue = currentInvoices?.reduce((sum, inv) => {
      if (inv.status === 'paid') {
        return sum + (parseFloat(inv.total) || 0);
      }
      return sum;
    }, 0) || 0;

    // Calculate last month revenue
    const lastMonthRevenue = lastMonthInvoices?.reduce((sum, inv) => {
      if (inv.status === 'paid') {
        return sum + (parseFloat(inv.total) || 0);
      }
      return sum;
    }, 0) || 0;

    // Calculate revenue growth
    const revenueGrowth = lastMonthRevenue > 0 
      ? (((currentRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1)
      : currentRevenue > 0 ? '100.0' : '0.0';

    // Get current month client count
    const { count: currentClientCount, error: clientsError } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', currentMonthStart.toISOString());
    
    if (clientsError) throw clientsError;

    // Get last month client count
    const { count: lastMonthClientCount } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', lastMonthStart.toISOString())
      .lt('created_at', currentMonthStart.toISOString());

    // Calculate client growth
    const clientGrowth = (lastMonthClientCount || 0) > 0
      ? ((((currentClientCount || 0) - (lastMonthClientCount || 0)) / (lastMonthClientCount || 0)) * 100).toFixed(1)
      : (currentClientCount || 0) > 0 ? '100.0' : '0.0';

    // Get total client count (all time)
    const { count: totalClientCount } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get current month invoice count
    const { count: currentInvoiceCount, error: invoiceCountError } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('date', currentMonthStart.toISOString().split('T')[0]);
    
    if (invoiceCountError) throw invoiceCountError;

    // Get last month invoice count
    const { count: lastMonthInvoiceCount } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('date', lastMonthStart.toISOString().split('T')[0])
      .lt('date', currentMonthStart.toISOString().split('T')[0]);

    // Calculate invoice growth
    const invoiceGrowth = (lastMonthInvoiceCount || 0) > 0
      ? ((((currentInvoiceCount || 0) - (lastMonthInvoiceCount || 0)) / (lastMonthInvoiceCount || 0)) * 100).toFixed(1)
      : (currentInvoiceCount || 0) > 0 ? '100.0' : '0.0';

    // Get total invoice count (all time)
    const { count: totalInvoiceCount } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get payment methods distribution
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('method, amount, created_at')
      .eq('user_id', userId)
      .eq('status', 'completed');
    
    if (paymentsError) throw paymentsError;

    const paymentMethods: Record<string, number> = {};
    const totalPaid = payments?.reduce((sum, p) => {
      paymentMethods[p.method] = (paymentMethods[p.method] || 0) + (parseFloat(p.amount) || 0);
      return sum + (parseFloat(p.amount) || 0);
    }, 0) || 0;

    // Calculate current month collection rate
    const currentMonthTotalPaid = payments?.filter(p => {
      const paymentDate = new Date(p.created_at || '');
      return paymentDate >= currentMonthStart;
    }).reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0) || 0;

    const currentMonthInvoiceAmount = currentInvoices?.reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0) || 0;
    const currentCollectionRate = currentMonthInvoiceAmount > 0 ? ((currentMonthTotalPaid / currentMonthInvoiceAmount) * 100) : 0;

    // Get last month payments
    const { data: lastMonthPayments, error: lastMonthPaymentsError } = await supabase
      .from('payments')
      .select('amount')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .gte('created_at', lastMonthStart.toISOString())
      .lt('created_at', currentMonthStart.toISOString());
    
    const lastMonthTotalPaid = lastMonthPayments?.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0) || 0;

    const lastMonthInvoiceAmount = lastMonthInvoices?.reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0) || 0;
    const lastMonthCollectionRate = lastMonthInvoiceAmount > 0 ? ((lastMonthTotalPaid / lastMonthInvoiceAmount) * 100) : 0;

    // Calculate collection rate growth
    const collectionRateGrowth = lastMonthCollectionRate > 0
      ? ((currentCollectionRate - lastMonthCollectionRate)).toFixed(1)
      : currentCollectionRate > 0 ? currentCollectionRate.toFixed(1) : '0.0';

    // Get top clients
    const { data: topClients, error: topClientsError } = await supabase
      .from('invoices')
      .select('client_id, total, clients:client_id(name)')
      .eq('user_id', userId)
      .eq('status', 'paid');
    
    if (topClientsError) throw topClientsError;

    const clientRevenue: Record<string, { name: string; revenue: number; invoices: number }> = {};
    topClients?.forEach((inv: any) => {
      const clientId = inv.client_id;
      if (!clientRevenue[clientId]) {
        clientRevenue[clientId] = {
          name: inv.clients?.name || 'Unknown',
          revenue: 0,
          invoices: 0,
        };
      }
      clientRevenue[clientId].revenue += parseFloat(inv.total) || 0;
      clientRevenue[clientId].invoices += 1;
    });

    const topClientsList = Object.values(clientRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      totalRevenue: currentRevenue,
      totalClients: totalClientCount || 0,
      totalInvoices: totalInvoiceCount || 0,
      collectionRate: currentCollectionRate.toFixed(1),
      paymentMethods,
      topClients: topClientsList,
      growth: {
        revenue: parseFloat(revenueGrowth),
        clients: parseFloat(clientGrowth),
        invoices: parseFloat(invoiceGrowth),
        collectionRate: parseFloat(collectionRateGrowth),
      }
    };
  }

  async getRevenueTrend(userId: string, period: 'week' | 'month' | 'quarter' | 'year' = 'month') {
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const { data, error } = await supabase
      .from('invoices')
      .select('date, total, status')
      .eq('user_id', userId)
      .eq('status', 'paid')
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }
}

export const clientsService = new ClientsService();
export const productsService = new ProductsService();
export const quotationsService = new QuotationsService();
export const invoicesService = new InvoicesService();
export const paymentsService = new PaymentsService();
export const dashboardService = new DashboardService();
export const templatesService = new TemplatesService();
export const automationsService = new AutomationsService();
export const settingsService = new SettingsService();
export const analyticsService = new AnalyticsService();


