import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { SearchIcon, CreditCardIcon, DollarSignIcon, TrendingUpIcon, CheckCircleIcon, SettingsIcon } from 'lucide-react';
import type { Payment } from '../types';
export function Payments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: true,
    stripePublicKey: 'pk_test_...',
    stripeSecretKey: '••••••••',
    paystackEnabled: true,
    paystackPublicKey: 'pk_test_...',
    paystackSecretKey: '••••••••',
    flutterwaveEnabled: false,
    flutterwavePublicKey: '',
    flutterwaveSecretKey: ''
  });
  const payments: Payment[] = [{
    id: '1',
    invoiceId: '1',
    invoiceNumber: 'INV-2024-001',
    clientId: '1',
    clientName: 'Acme Corp',
    amount: 5720,
    currency: 'NGN',
    method: 'stripe',
    status: 'completed',
    transactionId: 'ch_3Abc123',
    date: '2024-01-20',
    notes: 'Payment received via Stripe'
  }, {
    id: '2',
    invoiceId: '4',
    invoiceNumber: 'INV-2024-004',
    clientId: '4',
    clientName: 'StartUp Inc',
    amount: 2100,
    currency: 'NGN',
    method: 'paystack',
    status: 'completed',
    transactionId: 'ref_xyz789',
    date: '2024-01-18'
  }, {
    id: '3',
    invoiceId: '5',
    invoiceNumber: 'INV-2024-005',
    clientId: '5',
    clientName: 'Enterprise Ltd',
    amount: 8500,
    currency: 'NGN',
    method: 'bank_transfer',
    status: 'pending',
    date: '2024-01-19'
  }];
  const handleSaveSettings = () => {
    console.log('Saving payment settings:', paymentSettings);
    setIsSettingsModalOpen(false);
    alert('Payment settings saved successfully!');
  };
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'danger';
      default:
        return 'default';
    }
  };
  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      stripe: 'Stripe',
      paystack: 'Paystack',
      flutterwave: 'Flutterwave',
      bank_transfer: 'Bank Transfer',
      cash: 'Cash'
    };
    return labels[method] || method;
  };
  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      NGN: '₦'
    };
    return symbols[currency] || currency;
  };
  const columns = [{
    key: 'invoiceNumber',
    label: 'Invoice',
    render: (value: string, row: Payment) => <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{row.clientName}</p>
        </div>
  }, {
    key: 'date',
    label: 'Date',
    render: (value: string) => <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString()}
        </span>
  }, {
    key: 'amount',
    label: 'Amount',
    render: (value: number, row: Payment) => <span className="font-semibold text-gray-900">
          {getCurrencySymbol(row.currency)}
          {value.toLocaleString()}
        </span>
  }, {
    key: 'method',
    label: 'Method',
    render: (value: string) => <span className="text-sm text-gray-600">{getMethodLabel(value)}</span>
  }, {
    key: 'transactionId',
    label: 'Transaction ID',
    render: (value: string) => <span className="text-sm text-gray-500 font-mono">{value || '-'}</span>
  }, {
    key: 'status',
    label: 'Status',
    render: (value: string) => <Badge variant={getStatusVariant(value)}>{value}</Badge>
  }];
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500 mt-1">
            Track and manage payment transactions
          </p>
        </div>
        <Button icon={<SettingsIcon className="w-4 h-4" />} onClick={() => setIsSettingsModalOpen(true)}>
          Payment Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Received</p>
              <p className="text-2xl font-bold text-gray-900">₦96,100</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-green-500">
              <DollarSignIcon className="w-6 h-6" />
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">This Month</p>
              <p className="text-2xl font-bold text-gray-900">₦24,300</p>
            </div>
            <div className="p-3 bg-primary-50 rounded-lg text-primary-400">
              <TrendingUpIcon className="w-6 h-6" />
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Completed</p>
              <p className="text-2xl font-bold text-gray-900">142</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-500">
              <CheckCircleIcon className="w-6 h-6" />
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg text-yellow-500">
              <CreditCardIcon className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Payment Methods</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCardIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Stripe</p>
                  <p className="text-xs text-gray-500">Connected</p>
                </div>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCardIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Paystack</p>
                  <p className="text-xs text-gray-500">Connected</p>
                </div>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <CreditCardIcon className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Flutterwave</p>
                  <p className="text-xs text-gray-500">Not connected</p>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => setIsSettingsModalOpen(true)}>
                Connect
              </Button>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Payments</h3>
          <div className="space-y-3">
            {payments.slice(0, 5).map(payment => <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    {payment.invoiceNumber}
                  </p>
                  <p className="text-sm text-gray-500">{payment.clientName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {getCurrencySymbol(payment.currency)}
                    {payment.amount.toLocaleString()}
                  </p>
                  <Badge variant={getStatusVariant(payment.status)} size="sm">
                    {payment.status}
                  </Badge>
                </div>
              </div>)}
          </div>
        </Card>
      </div>

      <Card padding="none">
        <div className="p-4 border-b border-gray-200">
          <Input placeholder="Search payments by invoice, client, or transaction ID..." icon={<SearchIcon className="w-4 h-4" />} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>

        {payments.length === 0 ? <EmptyState icon={<CreditCardIcon className="w-8 h-8" />} title="No payments yet" description="Payment transactions will appear here once clients start paying invoices" /> : <Table columns={columns} data={payments} />}
      </Card>

      {/* Payment Settings Modal */}
      <Modal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} title="Payment Gateway Settings" size="lg" footer={<>
            <Button variant="ghost" onClick={() => setIsSettingsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </>}>
        <div className="space-y-6">
          {/* Stripe */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCardIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Stripe</h3>
                  <p className="text-sm text-gray-500">
                    Accept credit card payments
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={paymentSettings.stripeEnabled} onChange={e => setPaymentSettings({
                ...paymentSettings,
                stripeEnabled: e.target.checked
              })} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-400"></div>
              </label>
            </div>
            {paymentSettings.stripeEnabled && <div className="space-y-3">
                <Input label="Publishable Key" placeholder="pk_test_..." value={paymentSettings.stripePublicKey} onChange={e => setPaymentSettings({
              ...paymentSettings,
              stripePublicKey: e.target.value
            })} />
                <Input label="Secret Key" type="password" placeholder="sk_test_..." value={paymentSettings.stripeSecretKey} onChange={e => setPaymentSettings({
              ...paymentSettings,
              stripeSecretKey: e.target.value
            })} />
              </div>}
          </div>

          {/* Paystack */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCardIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Paystack</h3>
                  <p className="text-sm text-gray-500">
                    Accept payments in Africa
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={paymentSettings.paystackEnabled} onChange={e => setPaymentSettings({
                ...paymentSettings,
                paystackEnabled: e.target.checked
              })} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-400"></div>
              </label>
            </div>
            {paymentSettings.paystackEnabled && <div className="space-y-3">
                <Input label="Public Key" placeholder="pk_test_..." value={paymentSettings.paystackPublicKey} onChange={e => setPaymentSettings({
              ...paymentSettings,
              paystackPublicKey: e.target.value
            })} />
                <Input label="Secret Key" type="password" placeholder="sk_test_..." value={paymentSettings.paystackSecretKey} onChange={e => setPaymentSettings({
              ...paymentSettings,
              paystackSecretKey: e.target.value
            })} />
              </div>}
          </div>

          {/* Flutterwave */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <CreditCardIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Flutterwave</h3>
                  <p className="text-sm text-gray-500">
                    Accept payments globally
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={paymentSettings.flutterwaveEnabled} onChange={e => setPaymentSettings({
                ...paymentSettings,
                flutterwaveEnabled: e.target.checked
              })} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-400"></div>
              </label>
            </div>
            {paymentSettings.flutterwaveEnabled && <div className="space-y-3">
                <Input label="Public Key" placeholder="FLWPUBK_TEST-..." value={paymentSettings.flutterwavePublicKey} onChange={e => setPaymentSettings({
              ...paymentSettings,
              flutterwavePublicKey: e.target.value
            })} />
                <Input label="Secret Key" type="password" placeholder="FLWSECK_TEST-..." value={paymentSettings.flutterwaveSecretKey} onChange={e => setPaymentSettings({
              ...paymentSettings,
              flutterwaveSecretKey: e.target.value
            })} />
              </div>}
          </div>
        </div>
      </Modal>
    </div>;
}