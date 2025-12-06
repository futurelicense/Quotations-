import { api } from './api';
import { Quotation } from '../types';

export interface CreateQuotationData {
  clientId: string;
  date: string;
  expiryDate: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    discount: number;
  }>;
  notes?: string;
  terms?: string;
}

export interface UpdateQuotationData extends Partial<CreateQuotationData> {
  status?: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
}

class QuotationService {
  async getQuotations(params?: {
    page?: number;
    limit?: number;
    status?: string;
    clientId?: string;
    search?: string;
  }): Promise<{ quotations: Quotation[]; total: number; page: number; limit: number }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.status) queryParams.append('status', params.status);
    if (params?.clientId) queryParams.append('clientId', params.clientId);
    if (params?.search) queryParams.append('search', params.search);

    return api.get(`/quotations?${queryParams}`);
  }

  async getQuotation(id: string): Promise<Quotation> {
    return api.get(`/quotations/${id}`);
  }

  async createQuotation(data: CreateQuotationData): Promise<Quotation> {
    return api.post('/quotations', data);
  }

  async updateQuotation(id: string, data: UpdateQuotationData): Promise<Quotation> {
    return api.patch(`/quotations/${id}`, data);
  }

  async deleteQuotation(id: string): Promise<void> {
    return api.delete(`/quotations/${id}`);
  }

  async convertToInvoice(id: string): Promise<{ invoiceId: string }> {
    return api.post(`/quotations/${id}/convert-to-invoice`);
  }

  async sendQuotation(id: string, email?: string): Promise<void> {
    return api.post(`/quotations/${id}/send`, { email });
  }

  async downloadPdf(id: string): Promise<Blob> {
    const response = await fetch(`${api['baseUrl']}/quotations/${id}/pdf`, {
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

export const quotationService = new QuotationService();



