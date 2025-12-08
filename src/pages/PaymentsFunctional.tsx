import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../contexts/AuthContext';
import { paymentsService, invoicesService } from '../services/supabase-client.service';
import { PlusIcon, SearchIcon, DollarSignIcon, TrashIcon } from 'lucide-react';

interface PaymentFormData {
  invoice_id: string;
  client_id: string;
  amount: number;
  currency: string;
  method: 'paystack' | 'flutterwave' | 'stripe' | 'bank_transfer' | 'cash';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id: string;
  notes: string;
}

const initialFormData: PaymentFormData = {
  invoice_id: '',
  client_id: '',
  amount: 0,
  currency: 'USD',
  method: 'bank_transfer',
  status: 'completed',
  transaction_id: '',
  notes: '',
};

export function Payments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<PaymentFormData>(initialFormData);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [paymentsData, invoicesData] = await Promise.all([
        paymentsService.getAll(user!.id),
        invoicesService.getAll(user!.id),
      ]);
      setPayments(paymentsData || []);
      setInvoices(invoicesData || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInvoiceSelect = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      setFormData({
        ...formData,
        invoice_id: invoiceId,
        client_id: invoice.client_id,
        amount: invoice.amount_due || invoice.total,
        currency: invoice.currency,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.invoice_id) {
      toast.error('Please select an invoice');
      return;
    }

    if (formData.amount <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }

    setSubmitting(true);

    try {
      const paymentData = {
        ...formData,
        date: new Date().toISOString().split('T')[0],
      };

      await paymentsService.create(user!.id, paymentData);
      toast.success('Payment recorded successfully');
      
      setIsModalOpen(false);
      setFormData(initialFormData);
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to record payment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment record?')) return;

    try {
      await paymentsService.delete(id);
      toast.success('Payment deleted successfully');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete payment');
    }
  };

  const filteredPayments = payments.filter(payment =>
    payment.invoices?.invoice_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.clients?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.transaction_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: 'invoices',
      label: 'Invoice',
      render: (value: any) => (
        <span className="font-medium text-gray-900">{value?.invoice_number || 'N/A'}</span>
      ),
    },
    {
      key: 'clients',
      label: 'Client',
      render: (value: any) => (
        <div>
          <p className="font-medium text-gray-900">{value?.name || 'N/A'}</p>
          <p className="text-sm text-gray-500">{value?.company || ''}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value: number, row: any) => (
        <span className="font-medium text-gray-900">
          {row.currency} {value?.toLocaleString() || '0'}
        </span>
      ),
    },
    {
      key: 'method',
      label: 'Method',
      render: (value: string) => (
        <span className="text-sm text-gray-600 capitalize">{value?.replace('_', ' ')}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variants: any = {
          pending: 'default',
          completed: 'success',
          failed: 'danger',
          refunded: 'default',
        };
        return <Badge variant={variants[value] || 'default'}>{value}</Badge>;
      },
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (value: string) => (
        <span className="text-sm text-gray-600">{new Date(value).toLocaleDateString()}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleDelete(row.id)}>
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Filter only unpaid/partially paid invoices
  const unpaidInvoices = invoices.filter(inv => 
    inv.status !== 'paid' && (inv.amount_due || inv.total) > 0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500 mt-1">Track all payment transactions</p>
        </div>
        <Button
          onClick={() => {
            setFormData(initialFormData);
            setIsModalOpen(true);
          }}
          icon={<PlusIcon className="w-4 h-4" />}
        >
          Record Payment
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-200">
          <Input
            placeholder="Search payments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<SearchIcon className="w-4 h-4" />}
          />
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Loading payments...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <EmptyState
            icon={<DollarSignIcon className="w-12 h-12" />}
            title="No payments found"
            description={searchQuery ? "No payments match your search" : "Record your first payment"}
            action={!searchQuery ? {
              label: 'Record Your First Payment',
              onClick: () => setIsModalOpen(true)
            } : undefined as { label: string; onClick: () => void } | undefined}
          />
        ) : (
          <Table columns={columns} data={filteredPayments} />
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFormData(initialFormData);
        }}
        title="Record Payment"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Invoice"
            required
            value={formData.invoice_id}
            onChange={(e) => handleInvoiceSelect(e.target.value)}
            options={[
              { value: '', label: 'Select an invoice' },
              ...unpaidInvoices.map(inv => ({
                value: inv.id,
                label: `${inv.invoice_number} - ${inv.clients?.name} (${inv.currency} ${inv.amount_due?.toLocaleString() || inv.total?.toLocaleString()})`
              }))
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Payment Amount"
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
            />
            <Select
              label="Currency"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              options={[
                { value: 'USD', label: 'USD ($)' },
                { value: 'EUR', label: 'EUR (€)' },
                { value: 'GBP', label: 'GBP (£)' },
                { value: 'NGN', label: 'NGN (₦)' },
              ]}
            />
          </div>

          <Select
            label="Payment Method"
            value={formData.method}
            onChange={(e) => setFormData({ ...formData, method: e.target.value as any })}
            options={[
              { value: 'bank_transfer', label: 'Bank Transfer' },
              { value: 'cash', label: 'Cash' },
              { value: 'paystack', label: 'Paystack' },
              { value: 'flutterwave', label: 'Flutterwave' },
              { value: 'stripe', label: 'Stripe' },
            ]}
          />

          <Input
            label="Transaction ID (Optional)"
            value={formData.transaction_id}
            onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
            placeholder="e.g., TXN-123456"
          />

          <Select
            label="Payment Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            options={[
              { value: 'completed', label: 'Completed' },
              { value: 'pending', label: 'Pending' },
              { value: 'failed', label: 'Failed' },
            ]}
          />

          <Textarea
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={2}
            placeholder="Add any notes about this payment"
          />

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setFormData(initialFormData);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Recording...' : 'Record Payment'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}



