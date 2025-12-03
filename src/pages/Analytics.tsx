import React from 'react';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { TrendingUpIcon, TrendingDownIcon, DollarSignIcon, UsersIcon, ReceiptIcon, PercentIcon } from 'lucide-react';
export function Analytics() {
  const stats = [{
    label: 'Revenue',
    value: '$124,500',
    change: '+12.5%',
    trend: 'up',
    icon: <DollarSignIcon className="w-6 h-6" />
  }, {
    label: 'New Clients',
    value: '24',
    change: '+18.2%',
    trend: 'up',
    icon: <UsersIcon className="w-6 h-6" />
  }, {
    label: 'Invoices Sent',
    value: '156',
    change: '+8.3%',
    trend: 'up',
    icon: <ReceiptIcon className="w-6 h-6" />
  }, {
    label: 'Collection Rate',
    value: '94%',
    change: '-2.1%',
    trend: 'down',
    icon: <PercentIcon className="w-6 h-6" />
  }];
  const topClients = [{
    name: 'Acme Corp',
    revenue: 45200,
    invoices: 12
  }, {
    name: 'Tech Solutions',
    revenue: 38400,
    invoices: 10
  }, {
    name: 'Global Industries',
    revenue: 32100,
    invoices: 8
  }, {
    name: 'StartUp Inc',
    revenue: 28900,
    invoices: 15
  }, {
    name: 'Enterprise Ltd',
    revenue: 24500,
    invoices: 7
  }];
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics & Reports
          </h1>
          <p className="text-gray-500 mt-1">
            Track performance and gain insights into your business
          </p>
        </div>
        <Select options={[{
        value: 'last7days',
        label: 'Last 7 days'
      }, {
        value: 'last30days',
        label: 'Last 30 days'
      }, {
        value: 'last3months',
        label: 'Last 3 months'
      }, {
        value: 'last12months',
        label: 'Last 12 months'
      }]} fullWidth={false} className="w-48" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => <Card key={index} padding="md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.trend === 'up' ? <TrendingUpIcon className="w-4 h-4 text-green-500" /> : <TrendingDownIcon className="w-4 h-4 text-red-500" />}
                  <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Revenue Trend
          </h2>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-400">Revenue chart visualization</p>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Invoice Status Distribution
          </h2>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-400">Pie chart visualization</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top Clients by Revenue
          </h2>
          <div className="space-y-3">
            {topClients.map((client, index) => <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-400 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-500">
                      {client.invoices} invoices
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">
                  ${client.revenue.toLocaleString()}
                </p>
              </div>)}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Payment Methods
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Stripe</span>
                <span className="text-sm font-semibold text-gray-900">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary-400 h-2 rounded-full" style={{
                width: '45%'
              }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Paystack</span>
                <span className="text-sm font-semibold text-gray-900">30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{
                width: '30%'
              }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Bank Transfer</span>
                <span className="text-sm font-semibold text-gray-900">20%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{
                width: '20%'
              }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Other</span>
                <span className="text-sm font-semibold text-gray-900">5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-400 h-2 rounded-full" style={{
                width: '5%'
              }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>;
}