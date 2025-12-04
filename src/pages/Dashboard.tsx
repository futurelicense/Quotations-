import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { dashboardService } from '../services/supabase-client.service';
import { TrendingUpIcon, TrendingDownIcon, UsersIcon, FileTextIcon, ReceiptIcon, DollarSignIcon } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [recentQuotations, setRecentQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, invoicesData, quotationsData] = await Promise.all([
        dashboardService.getStats(user!.id),
        dashboardService.getRecentInvoices(user!.id, 4),
        dashboardService.getRecentQuotations(user!.id, 3),
      ]);
      setStats(statsData);
      setRecentInvoices(invoicesData || []);
      setRecentQuotations(quotationsData || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  const statsDisplay = [{
    label: 'Total Revenue',
    value: `$${stats.totalRevenue.toLocaleString()}`,
    change: '+12.5%',
    trend: 'up',
    icon: <DollarSignIcon className="w-6 h-6" />
  }, {
    label: 'Total Invoices',
    value: stats.totalInvoices.toString(),
    change: '+8.2%',
    trend: 'up',
    icon: <ReceiptIcon className="w-6 h-6" />
  }, {
    label: 'Active Clients',
    value: stats.totalClients.toString(),
    change: '+15.3%',
    trend: 'up',
    icon: <UsersIcon className="w-6 h-6" />
  }, {
    label: 'Pending Payments',
    value: `$${stats.pendingPayments.toLocaleString()}`,
    change: '-3.1%',
    trend: 'down',
    icon: <FileTextIcon className="w-6 h-6" />
  }];
  return <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back! Here's what's happening with your business.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsDisplay.map((stat, index) => <Card key={index} padding="md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.trend === 'up' ? <TrendingUpIcon className="w-4 h-4 text-green-500" /> : <TrendingDownIcon className="w-4 h-4 text-red-500" />}
                  <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg text-primary-400">
                {stat.icon}
              </div>
            </div>
          </Card>)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Invoices
            </h2>
            <a href="/invoices" className="text-sm text-primary-400 hover:text-primary-500 font-medium">
              View all
            </a>
          </div>
          <div className="space-y-3">
            {recentInvoices.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No invoices yet</p>
            ) : (
              recentInvoices.map(invoice => <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{invoice.invoice_number}</p>
                  <p className="text-sm text-gray-500">{invoice.clients?.name || 'Unknown'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${invoice.total.toLocaleString()}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${invoice.status === 'paid' ? 'bg-green-100 text-green-700' : invoice.status === 'sent' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {invoice.status}
                  </span>
                </div>
              </div>)
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Quotations
            </h2>
            <a href="/quotations" className="text-sm text-primary-400 hover:text-primary-500 font-medium">
              View all
            </a>
          </div>
          <div className="space-y-3">
            {recentQuotations.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No quotations yet</p>
            ) : (
              recentQuotations.map(quote => <div key={quote.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{quote.quotation_number}</p>
                  <p className="text-sm text-gray-500">{quote.clients?.name || 'Unknown'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${quote.total.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${quote.status === 'approved' ? 'bg-green-100 text-green-700' : quote.status === 'sent' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                    {quote.status}
                  </span>
                </div>
              </div>)
            )}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Revenue Overview
        </h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-400">Chart visualization would go here</p>
        </div>
      </Card>
    </div>;
}