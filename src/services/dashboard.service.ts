import { api } from './api';
import { DashboardStats } from '../types';

export interface RevenueData {
  date: string;
  amount: number;
}

export interface TopClient {
  id: string;
  name: string;
  totalRevenue: number;
  invoiceCount: number;
}

class DashboardService {
  async getStats(): Promise<DashboardStats> {
    return api.get('/dashboard/stats');
  }

  async getRevenueChart(params?: {
    period?: 'week' | 'month' | 'quarter' | 'year';
  }): Promise<RevenueData[]> {
    const queryParams = new URLSearchParams();
    if (params?.period) queryParams.append('period', params.period);
    return api.get(`/dashboard/revenue-chart?${queryParams}`);
  }

  async getTopClients(limit: number = 5): Promise<TopClient[]> {
    return api.get(`/dashboard/top-clients?limit=${limit}`);
  }

  async getRecentActivity(): Promise<any[]> {
    return api.get('/dashboard/recent-activity');
  }
}

export const dashboardService = new DashboardService();



