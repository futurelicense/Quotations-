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
import { invoicesService, clientsService } from '../services/supabase-client.service';
import { generateInvoiceNumber } from '../utils/generators';
import { PlusIcon, SearchIcon, ReceiptIcon, TrashIcon, CheckCircleIcon } from 'lucide-react';

interface InvoiceFormData {
  client_id: string;
  date: string;
  due_date: string;
  currency: string;
  notes: string;
  terms: string;
}

const initialFormData: InvoiceFormData = {
  client_id: '',
  date: new Date().toISOString().split('T')[0],
  due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  currency: 'USD',
  notes: '',
  terms: '',
};

export function Invoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  const [formData, setFormData] = useState<InvoiceFormData>(initialFormData);
  const [lineItems, setLineItems] = useState<any[]>([{
    description: '',
    quantity: 1,
    unit_price: 0,
    tax_rate: 0,
    discount: 0,
  }]);
  const [paymentAmount, setPaymentAmount] = useState(0);
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
      const [invoicesData, clientsData] = await Promise.all([
        invoicesService.getAll(user!.id),
        clientsService.getAll(user!.id),
      ]);
      setInvoices(invoicesData || []);
      setClients(clientsData || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // const calculateLineItemTotal = (item: any) => {
  //   const baseAmount = item.quantity * item.unit_price;
  //   const afterDiscount = baseAmount * (1 - item.discount / 100);
  //   const withTax = afterDiscount * (1 + item.tax_rate / 100);
  //   return withTax;
  // };

  const calculateTotal = () => {
    const subtotal = lineItems.reduce((sum, item) => {
      return sum + (item.quantity * item.unit_price * (1 - item.discount / 100));
    }, 0);
    
    const discountAmount = lineItems.reduce((sum, item) => {
      return sum + (item.quantity * item.unit_price * (item.discount / 100));
    }, 0);
    
    const taxAmount = lineItems.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unit_price * (1 - item.discount / 100);
      return sum + (itemTotal * item.tax_rate / 100);
    }, 0);
    
    return { subtotal, discountAmount, taxAmount, total: subtotal + taxAmount };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (lineItems.length === 0 || !lineItems[0].description) {
      toast.error('Please add at least one line item with description');
      return;
    }

    setSubmitting(true);
    const { subtotal, taxAmount, total } = calculateTotal();

    try {
      const invoiceData = {
        ...formData,
        invoice_number: editingInvoice?.invoice_number || generateInvoiceNumber(),
        status: 'draft',
        items: lineItems,
        subtotal,
        tax_amount: taxAmount,
        discount_amount: 0,
        total,
        amount_paid: 0,
        amount_due: total,
      };

      if (editingInvoice) {
        await invoicesService.update(editingInvoice.id, invoiceData);
        toast.success('Invoice updated successfully');
      } else {
        await invoicesService.create(user!.id, invoiceData);
        toast.success('Invoice created successfully');
      }
      
      setIsModalOpen(false);
      setEditingInvoice(null);
      setFormData(initialFormData);
      setLineItems([{
        description: '',
        quantity: 1,
        unit_price: 0,
        tax_rate: 0,
        discount: 0,
      }]);
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save invoice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkAsPaid = async () => {
    if (!selectedInvoice) return;
    
    if (paymentAmount <= 0 || paymentAmount > selectedInvoice.amount_due) {
      toast.error('Invalid payment amount');
      return;
    }

    try {
      await invoicesService.markAsPaid(selectedInvoice.id, paymentAmount);
      toast.success('Payment recorded successfully');
      setIsPaymentModalOpen(false);
      setSelectedInvoice(null);
      setPaymentAmount(0);
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to record payment');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;

    try {
      await invoicesService.delete(id);
      toast.success('Invoice deleted successfully');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete invoice');
    }
  };

  const addLineItem = () => {
    setLineItems([...lineItems, {
      description: '',
      quantity: 1,
      unit_price: 0,
      tax_rate: 0,
      discount: 0,
    }]);
  };

  const updateLineItem = (index: number, field: string, value: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const filteredInvoices = invoices.filter(inv =>
    inv.invoice_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.clients?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: 'invoice_number',
      label: 'Invoice #',
      render: (value: string) => (
        <span className="font-medium text-gray-900">{value}</span>
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
      key: 'due_date',
      label: 'Due Date',
      render: (value: string) => (
        <span className="text-sm text-gray-600">{new Date(value).toLocaleDateString()}</span>
      ),
    },
    {
      key: 'total',
      label: 'Amount',
      render: (value: number, row: any) => (
        <div>
          <p className="font-medium text-gray-900">
            {row.currency} {value?.toLocaleString() || '0'}
          </p>
          <p className="text-xs text-gray-500">
            Paid: {row.currency} {(row.amount_paid || 0).toLocaleString()}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variants: any = {
          draft: 'default',
          sent: 'primary',
          paid: 'success',
          overdue: 'danger',
          cancelled: 'default',
        };
        return <Badge variant={variants[value] || 'default'}>{value}</Badge>;
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          {row.status !== 'paid' && row.amount_due > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedInvoice(row);
                setPaymentAmount(row.amount_due);
                setIsPaymentModalOpen(true);
              }}
              icon={<CheckCircleIcon className="w-4 h-4" />}
            >
              Record Payment
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => handleDelete(row.id)}>
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-500 mt-1">Manage your invoices and payments</p>
        </div>
        <Button
          onClick={() => {
            setEditingInvoice(null);
            setFormData(initialFormData);
            setLineItems([{
              description: '',
              quantity: 1,
              unit_price: 0,
              tax_rate: 0,
              discount: 0,
            }]);
            setIsModalOpen(true);
          }}
          icon={<PlusIcon className="w-4 h-4" />}
        >
          New Invoice
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-200">
          <Input
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<SearchIcon className="w-4 h-4" />}
          />
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Loading invoices...</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <EmptyState
            icon={<ReceiptIcon className="w-12 h-12" />}
            title="No invoices found"
            description={searchQuery ? "No invoices match your search" : "Create your first invoice"}
            action={!searchQuery ? {
              label: 'Create Your First Invoice',
              onClick: () => setIsModalOpen(true)
            } : undefined}
          />
        ) : (
          <Table columns={columns} data={filteredInvoices} />
        )}
      </Card>

      {/* Create/Edit Invoice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingInvoice(null);
          setFormData(initialFormData);
          setLineItems([{
            description: '',
            quantity: 1,
            unit_price: 0,
            tax_rate: 0,
            discount: 0,
          }]);
        }}
        title={editingInvoice ? 'Edit Invoice' : 'New Invoice'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Client"
            required
            value={formData.client_id}
            onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
            options={[
              { value: '', label: 'Select a client' },
              ...clients.map(c => ({ value: c.id, label: `${c.name} - ${c.company}` }))
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Invoice Date"
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            <Input
              label="Due Date"
              type="date"
              required
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            />
          </div>

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

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Line Items</h3>
              <Button type="button" size="sm" onClick={addLineItem}>
                <PlusIcon className="w-4 h-4" /> Add Line Item
              </Button>
            </div>

            {lineItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium text-gray-700">Item {index + 1}</h4>
                  {lineItems.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => removeLineItem(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>

                <Textarea
                  label="Description"
                  required
                  value={item.description}
                  onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                  placeholder="Enter item description (e.g., Website Development)"
                  rows={2}
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Input
                    label="Quantity"
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={item.quantity}
                    onChange={(e) => updateLineItem(index, 'quantity', parseInt(e.target.value) || 1)}
                  />
                  <Input
                    label="Unit Price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={item.unit_price}
                    onChange={(e) => updateLineItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                  />
                  <Input
                    label="Tax %"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={item.tax_rate}
                    onChange={(e) => updateLineItem(index, 'tax_rate', parseFloat(e.target.value) || 0)}
                  />
                  <Input
                    label="Discount %"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={item.discount}
                    onChange={(e) => updateLineItem(index, 'discount', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            ))}
          </div>

          {lineItems.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-900">
                  {formData.currency} {calculateTotal().subtotal.toFixed(2)}
                </span>
              </div>
              {calculateTotal().discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-gray-900">
                    -{formData.currency} {calculateTotal().discountAmount.toFixed(2)}
                  </span>
                </div>
              )}
              {calculateTotal().taxAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium text-gray-900">
                    {formData.currency} {calculateTotal().taxAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                <span className="text-gray-900">Total:</span>
                <span className="text-primary-400">
                  {formData.currency} {calculateTotal().total.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <Textarea
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={2}
          />

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : editingInvoice ? 'Update' : 'Create Invoice'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Record Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedInvoice(null);
          setPaymentAmount(0);
        }}
        title="Record Payment"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Invoice: {selectedInvoice?.invoice_number}</p>
            <p className="text-sm text-gray-600">Client: {selectedInvoice?.clients?.name}</p>
            <p className="text-lg font-bold text-gray-900 mt-2">
              Amount Due: {selectedInvoice?.currency} {selectedInvoice?.amount_due?.toLocaleString()}
            </p>
          </div>

          <Input
            label="Payment Amount"
            type="number"
            step="0.01"
            min="0"
            max={selectedInvoice?.amount_due || 0}
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
            required
          />

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsPaymentModalOpen(false);
                setSelectedInvoice(null);
                setPaymentAmount(0);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleMarkAsPaid} disabled={submitting}>
              {submitting ? 'Recording...' : 'Record Payment'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


