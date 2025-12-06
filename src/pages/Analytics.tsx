import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { analyticsService } from '../services/supabase-client.service';
import { TrendingUpIcon, TrendingDownIcon, DollarSignIcon, UsersIcon, ReceiptIcon, PercentIcon } from 'lucide-react';

export function Analytics() {
  const [stats, setStats] = useState<any>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user, period]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getStats(user!.id);
      setStats(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPaymentMethodPercentage = (method: string) => {
    if (!stats?.paymentMethods || !stats.paymentMethods[method]) return 0;
    const total = Object.values(stats.paymentMethods).reduce((sum: number, val: any) => sum + val, 0);
    return total > 0 ? ((stats.paymentMethods[method] / total) * 100).toFixed(0) : 0;
  };

  const formatGrowth = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const displayStats = [
    {
      label: 'Revenue',
      value: stats ? formatCurrency(stats.totalRevenue || 0) : formatCurrency(0),
      change: stats?.growth?.revenue !== undefined ? formatGrowth(stats.growth.revenue) : '0.0%',
      trend: stats?.growth?.revenue !== undefined && stats.growth.revenue >= 0 ? 'up' : 'down',
      icon: <DollarSignIcon className="w-6 h-6" />
    },
    {
      label: 'Total Clients',
      value: stats?.totalClients || 0,
      change: stats?.growth?.clients !== undefined ? formatGrowth(stats.growth.clients) : '0.0%',
      trend: stats?.growth?.clients !== undefined && stats.growth.clients >= 0 ? 'up' : 'down',
      icon: <UsersIcon className="w-6 h-6" />
    },
    {
      label: 'Invoices Sent',
      value: stats?.totalInvoices || 0,
      change: stats?.growth?.invoices !== undefined ? formatGrowth(stats.growth.invoices) : '0.0%',
      trend: stats?.growth?.invoices !== undefined && stats.growth.invoices >= 0 ? 'up' : 'down',
      icon: <ReceiptIcon className="w-6 h-6" />
    },
    {
      label: 'Collection Rate',
      value: stats?.collectionRate ? `${stats.collectionRate}%` : '0%',
      change: stats?.growth?.collectionRate !== undefined ? formatGrowth(stats.growth.collectionRate) : '0.0%',
      trend: stats?.growth?.collectionRate !== undefined && stats.growth.collectionRate >= 0 ? 'up' : 'down',
      icon: <PercentIcon className="w-6 h-6" />
    }
  ];

  const paymentMethods = [
    { name: 'Stripe', key: 'stripe', color: 'bg-primary-400' },
    { name: 'Paystack', key: 'paystack', color: 'bg-green-500' },
    { name: 'Bank Transfer', key: 'bank_transfer', color: 'bg-blue-500' },
    { name: 'Cash', key: 'cash', color: 'bg-gray-400' },
    { name: 'Other', key: 'other', color: 'bg-gray-400' }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
            <p className="text-gray-500 mt-1">Track performance and gain insights into your business</p>
          </div>
        </div>
        <div className="p-8 text-center">
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-500 mt-1">Track performance and gain insights into your business</p>
        </div>
        <Select
          options={[
            { value: 'week', label: 'Last 7 days' },
            { value: 'month', label: 'Last 30 days' },
            { value: 'quarter', label: 'Last 3 months' },
            { value: 'year', label: 'Last 12 months' }
          ]}
          value={period}
          onChange={e => setPeriod(e.target.value as any)}
          fullWidth={false}
          className="w-48"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, index) => (
          <Card key={index} padding="md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.trend === 'up' ? (
                    <TrendingUpIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDownIcon className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg text-primary-400">
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h2>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-400">Revenue chart visualization (coming soon)</p>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Status Distribution</h2>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-400">Pie chart visualization (coming soon)</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Clients by Revenue</h2>
          <div className="space-y-3">
            {stats?.topClients && stats.topClients.length > 0 ? (
              stats.topClients.map((client: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-400 font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{client.name}</p>
                      <p className="text-sm text-gray-500">{client.invoices} invoices</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(client.revenue)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No client data available</p>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h2>
          <div className="space-y-4">
            {paymentMethods.map((method) => {
              const percentage = getPaymentMethodPercentage(method.key);
              return (
                <div key={method.key}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{method.name}</span>
                    <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${method.color} h-2 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
            {(!stats?.paymentMethods || Object.keys(stats.paymentMethods).length === 0) && (
              <p className="text-gray-500 text-center py-4">No payment data available</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
