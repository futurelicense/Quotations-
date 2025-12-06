import { api } from './api';
import { Client } from '../types';

export interface CreateClientData {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  country: string;
  taxId?: string;
}

export interface UpdateClientData extends Partial<CreateClientData> {
  status?: 'active' | 'inactive';
}

class ClientService {
  async getClients(params?: {
    page?: number;
    limit?: number;
    status?: 'active' | 'inactive';
    search?: string;
  }): Promise<{ clients: Client[]; total: number; page: number; limit: number }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);

    return api.get(`/clients?${queryParams}`);
  }

  async getClient(id: string): Promise<Client> {
    return api.get(`/clients/${id}`);
  }

  async createClient(data: CreateClientData): Promise<Client> {
    return api.post('/clients', data);
  }

  async updateClient(id: string, data: UpdateClientData): Promise<Client> {
    return api.patch(`/clients/${id}`, data);
  }

  async deleteClient(id: string): Promise<void> {
    return api.delete(`/clients/${id}`);
  }
}

export const clientService = new ClientService();



