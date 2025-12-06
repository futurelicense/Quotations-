import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../contexts/AuthContext';
import { quotationsService, clientsService } from '../services/supabase-client.service';
import { generateQuotationNumber } from '../utils/generators';
import { PlusIcon, SearchIcon, FileTextIcon, TrashIcon, ArrowRightIcon, SaveIcon, XIcon } from 'lucide-react';

interface QuotationFormData {
  client_id: string;
  quotation_number: string;
  reference_number: string;
  date: string;
  expiry_date: string;
  currency: string;
  notes: string;
  terms: string;
  shipping_charges: number;
}

const initialFormData: QuotationFormData = {
  client_id: '',
  quotation_number: generateQuotationNumber(),
  reference_number: '',
  date: new Date().toISOString().split('T')[0],
  expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  currency: 'USD',
  notes: '',
  terms: '',
  shipping_charges: 0,
};

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  discount: number;
}

const initialLineItem: LineItem = {
  description: '',
  quantity: 1,
  unit_price: 0,
  tax_rate: 0,
  discount: 0,
};

export function Quotations() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<any>(null);
  const [formData, setFormData] = useState<QuotationFormData>(initialFormData);
  const [lineItems, setLineItems] = useState<LineItem[]>([initialLineItem]);
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
      const [quotationsData, clientsData] = await Promise.all([
        quotationsService.getAll(user!.id),
        clientsService.getAll(user!.id),
      ]);
      setQuotations(quotationsData || []);
      setClients(clientsData || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const calculateLineItemTotal = (item: LineItem) => {
    const baseAmount = item.quantity * item.unit_price;
    const afterDiscount = baseAmount * (1 - item.discount / 100);
    const withTax = afterDiscount * (1 + item.tax_rate / 100);
    return withTax;
  };

  const calculateTotals = () => {
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
    
    const total = subtotal + taxAmount + formData.shipping_charges;
    
    return { subtotal, discountAmount, taxAmount, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.client_id) {
      toast.error('Please select a client');
      return;
    }

    if (lineItems.length === 0 || !lineItems[0].description) {
      toast.error('Please add at least one line item');
      return;
    }

    setSubmitting(true);
    const { subtotal, discountAmount, taxAmount, total } = calculateTotals();

    try {
      const quotationData = {
        client_id: formData.client_id,
        quotation_number: formData.quotation_number,
        reference_number: formData.reference_number,
        date: formData.date,
        expiry_date: formData.expiry_date,
        status: 'draft',
        items: lineItems,
        subtotal,
        tax_amount: taxAmount,
        discount_amount: discountAmount,
        total,
        currency: formData.currency,
        notes: formData.notes,
        terms: formData.terms,
        shipping_charges: formData.shipping_charges,
      };

      if (editingQuotation) {
        await quotationsService.update(editingQuotation.id, quotationData);
        toast.success('Quotation updated successfully');
      } else {
        await quotationsService.create(user!.id, quotationData);
        toast.success('Quotation created successfully');
      }
      
      setShowForm(false);
      setEditingQuotation(null);
      setFormData({ ...initialFormData, quotation_number: generateQuotationNumber() });
      setLineItems([initialLineItem]);
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save quotation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConvertToInvoice = async (quotationId: string) => {
    if (!confirm('Convert this quotation to an invoice?')) return;

    try {
      await quotationsService.convertToInvoice(quotationId, user!.id);
      toast.success('Quotation converted to invoice successfully');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to convert to invoice');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quotation?')) return;

    try {
      await quotationsService.delete(id);
      toast.success('Quotation deleted successfully');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete quotation');
    }
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { ...initialLineItem }]);
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const filteredQuotations = quotations.filter(q =>
    q.quotation_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.reference_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.clients?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: 'quotation_number',
      label: 'Quotation #',
      render: (value: string, row: any) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          {row.reference_number && (
            <p className="text-xs text-gray-500">Ref: {row.reference_number}</p>
          )}
        </div>
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
      key: 'date',
      label: 'Date',
      render: (value: string) => (
        <span className="text-sm text-gray-600">{new Date(value).toLocaleDateString()}</span>
      ),
    },
    {
      key: 'total',
      label: 'Amount',
      render: (value: number, row: any) => (
        <span className="font-medium text-gray-900">
          {row.currency} {value?.toLocaleString() || '0'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variants: any = {
          draft: 'default',
          sent: 'primary',
          approved: 'success',
          rejected: 'danger',
          converted: 'success',
        };
        return <Badge variant={variants[value] || 'default'}>{value}</Badge>;
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          {row.status !== 'converted' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleConvertToInvoice(row.id)}
              icon={<ArrowRightIcon className="w-4 h-4" />}
            >
              Convert
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => handleDelete(row.id)}>
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotations</h1>
          <p className="text-gray-500 mt-1">Create and manage quotations</p>
        </div>
        {!showForm && (
          <Button
            onClick={() => {
              setShowForm(true);
              setEditingQuotation(null);
              setFormData({ ...initialFormData, quotation_number: generateQuotationNumber() });
              setLineItems([initialLineItem]);
            }}
            icon={<PlusIcon className="w-4 h-4" />}
          >
            New Quotation
          </Button>
        )}
      </div>

      {/* Inline Quotation Form */}
      {showForm && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingQuotation ? 'Edit Quotation' : 'Create New Quotation'}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowForm(false);
                  setEditingQuotation(null);
                  setFormData({ ...initialFormData, quotation_number: generateQuotationNumber() });
                  setLineItems([initialLineItem]);
                }}
                icon={<XIcon className="w-4 h-4" />}
              >
                Cancel
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Quotation Number"
                  required
                  value={formData.quotation_number}
                  onChange={(e) => setFormData({ ...formData, quotation_number: e.target.value })}
                  placeholder="QUO-2024-001"
                />
                <Input
                  label="Reference Number"
                  value={formData.reference_number}
                  onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                  placeholder="Your internal reference"
                />
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
                <Input
                  label="Expiry Date"
                  type="date"
                  required
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
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

              {/* Line Items */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Line Items</h3>
                  <Button type="button" size="sm" onClick={addLineItem} icon={<PlusIcon className="w-4 h-4" />}>
                    Add Line Item
                  </Button>
                </div>

                <div className="space-y-4">
                  {lineItems.map((item, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
                        {lineItems.length > 1 && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => removeLineItem(index)}
                          >
                            <TrashIcon className="w-3 h-3" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Textarea
                          label="Description"
                          required
                          value={item.description}
                          onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                          placeholder="Enter item description (e.g., Website Development)"
                          rows={2}
                        />

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Line Total</label>
                            <div className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-900">
                              {formData.currency} {calculateLineItemTotal(item).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Summary */}
              <div className="border-t pt-6">
                <div className="bg-primary-50 rounded-lg p-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-900">
                      {formData.currency} {totals.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium text-gray-900">
                      -{formData.currency} {totals.discountAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium text-gray-900">
                      {formData.currency} {totals.taxAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipping Charges:</span>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.shipping_charges}
                      onChange={(e) => setFormData({ ...formData, shipping_charges: parseFloat(e.target.value) || 0 })}
                      className="w-32"
                    />
                  </div>
                  <div className="border-t border-primary-200 pt-3 flex justify-between text-lg">
                    <span className="font-bold text-gray-900">Total:</span>
                    <span className="font-bold text-primary-600">
                      {formData.currency} {totals.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes and Terms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Textarea
                  label="Notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Add any notes for the client"
                />
                <Textarea
                  label="Terms & Conditions"
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  rows={3}
                  placeholder="Payment terms, delivery terms, etc."
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingQuotation(null);
                    setFormData({ ...initialFormData, quotation_number: generateQuotationNumber() });
                    setLineItems([initialLineItem]);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} icon={<SaveIcon className="w-4 h-4" />}>
                  {submitting ? 'Saving...' : editingQuotation ? 'Update Quotation' : 'Create Quotation'}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      )}

      {/* Quotations List */}
      {!showForm && (
        <Card>
          <div className="p-4 border-b border-gray-200">
            <Input
              placeholder="Search quotations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<SearchIcon className="w-4 h-4" />}
            />
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Loading quotations...</p>
            </div>
          ) : filteredQuotations.length === 0 ? (
            <EmptyState
              icon={<FileTextIcon className="w-12 h-12" />}
              title="No quotations found"
              description={searchQuery ? "No quotations match your search" : "Create your first quotation"}
              action={!searchQuery ? {
                label: 'Create Your First Quotation',
                onClick: () => setShowForm(true)
              } : undefined as { label: string; onClick: () => void } | undefined}
            />
          ) : (
            <Table columns={columns} data={filteredQuotations} />
          )}
        </Card>
      )}
    </div>
  );
}



