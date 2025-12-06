import { api } from './api';
import { Invoice } from '../types';

export interface CreateInvoiceData {
  clientId: string;
  date: string;
  dueDate: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    discount: number;
  }>;
  notes?: string;
  terms?: string;
  recurring?: {
    enabled: boolean;
    frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    nextDate: string;
  };
}

export interface UpdateInvoiceData extends Partial<CreateInvoiceData> {
  status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
}

class InvoiceService {





























    
  async getInvoices(params?: {
    page?: number;
    limit?: number;
    status?: string;
    clientId?: string;
    search?: string;
  }): Promise<{ invoices: Invoice[]; total: number; page: number; limit: number }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.status) queryParams.append('status', params.status);
    if (params?.clientId) queryParams.append('clientId', params.clientId);
    if (params?.search) queryParams.append('search', params.search);

    return api.get(`/invoices?${queryParams}`);
  }

  async getInvoice(id: string): Promise<Invoice> {
    return api.get(`/invoices/${id}`);
  }

  async createInvoice(data: CreateInvoiceData): Promise<Invoice> {
    return api.post('/invoices', data);
  }

  async updateInvoice(id: string, data: UpdateInvoiceData): Promise<Invoice> {
    return api.patch(`/invoices/${id}`, data);
  }

  async deleteInvoice(id: string): Promise<void> {
    return api.delete(`/invoices/${id}`);
  }

  async sendInvoice(id: string, email?: string): Promise<void> {
    return api.post(`/invoices/${id}/send`, { email });
  }

  async markAsPaid(id: string, paymentDetails: {
    amount: number;
    method: string;
    transactionId?: string;
    date: string;
  }): Promise<Invoice> {
    return api.post(`/invoices/${id}/mark-paid`, paymentDetails);
  }

  async downloadPdf(id: string): Promise<Blob> {
    const response = await fetch(`${api['baseUrl']}/invoices/${id}/pdf`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('invoicepro_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download PDF');
    }

    return response.blob();
  }
}

export const invoiceService = new InvoiceService();



