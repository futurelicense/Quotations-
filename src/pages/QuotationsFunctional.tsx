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
import { quotationsService, clientsService, productsService } from '../services/supabase-client.service';
import { generateQuotationNumber } from '../utils/generators';
import { PlusIcon, SearchIcon, FileTextIcon, TrashIcon, ArrowRightIcon } from 'lucide-react';

interface QuotationFormData {
  client_id: string;
  date: string;
  expiry_date: string;
  currency: string;
  notes: string;
  terms: string;
}

const initialFormData: QuotationFormData = {
  client_id: '',
  date: new Date().toISOString().split('T')[0],
  expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  currency: 'USD',
  notes: '',
  terms: '',
};

interface LineItem {
  product_id: string;
  product_name: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  discount: number;
}

export function Quotations() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<any>(null);
  const [formData, setFormData] = useState<QuotationFormData>(initialFormData);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
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
      const [quotationsData, clientsData, productsData] = await Promise.all([
        quotationsService.getAll(user!.id),
        clientsService.getAll(user!.id),
        productsService.getAll(user!.id),
      ]);
      setQuotations(quotationsData || []);
      setClients(clientsData || []);
      setProducts(productsData || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const subtotal = lineItems.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unit_price * (1 - item.discount / 100);
      return sum + itemTotal;
    }, 0);
    
    const taxAmount = lineItems.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unit_price * (1 - item.discount / 100);
      return sum + (itemTotal * item.tax_rate / 100);
    }, 0);
    
    return { subtotal, taxAmount, total: subtotal + taxAmount };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (lineItems.length === 0) {
      toast.error('Please add at least one line item');
      return;
    }

    setSubmitting(true);
    const { subtotal, taxAmount, total } = calculateTotal();

    try {
      const quotationData = {
        ...formData,
        quotation_number: editingQuotation?.quotation_number || generateQuotationNumber(),
        status: 'draft',
        items: lineItems,
        subtotal,
        tax_amount: taxAmount,
        discount_amount: 0,
        total,
      };

      if (editingQuotation) {
        await quotationsService.update(editingQuotation.id, quotationData);
        toast.success('Quotation updated successfully');
      } else {
        await quotationsService.create(user!.id, quotationData);
        toast.success('Quotation created successfully');
      }
      
      setIsModalOpen(false);
      setEditingQuotation(null);
      setFormData(initialFormData);
      setLineItems([]);
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
    setLineItems([...lineItems, {
      product_id: '',
      product_name: '',
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
    
    // Auto-fill from product selection
    if (field === 'product_id' && value) {
      const product = products.find(p => p.id === value);
      if (product) {
        updated[index].product_name = product.name;
        updated[index].description = product.description;
        updated[index].unit_price = product.price;
        updated[index].tax_rate = product.tax_rate;
      }
    }
    
    setLineItems(updated);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const filteredQuotations = quotations.filter(q =>
    q.quotation_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.clients?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: 'quotation_number',
      label: 'Quotation #',
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotations</h1>
          <p className="text-gray-500 mt-1">Create and manage quotations</p>
        </div>
        <Button
          onClick={() => {
            setEditingQuotation(null);
            setFormData(initialFormData);
            setLineItems([]);
            setIsModalOpen(true);
          }}
          icon={<PlusIcon className="w-4 h-4" />}
        >
          New Quotation
        </Button>
      </div>

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
              onClick: () => setIsModalOpen(true)
            } : undefined as { label: string; onClick: () => void } | undefined}
          />
        ) : (
          <Table columns={columns} data={filteredQuotations} />
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingQuotation(null);
          setFormData(initialFormData);
          setLineItems([]);
        }}
        title={editingQuotation ? 'Edit Quotation' : 'New Quotation'}
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
                <PlusIcon className="w-4 h-4" /> Add Item
              </Button>
            </div>

            {lineItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium text-gray-700">Item {index + 1}</h4>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => removeLineItem(index)}
                  >
                    Remove
                  </Button>
                </div>

                <Select
                  label="Product/Service"
                  value={item.product_id}
                  onChange={(e) => updateLineItem(index, 'product_id', e.target.value)}
                  options={[
                    { value: '', label: 'Select product' },
                    ...products.map(p => ({ value: p.id, label: p.name }))
                  ]}
                />

                <Textarea
                  label="Description"
                  value={item.description}
                  onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                  rows={2}
                />

                <div className="grid grid-cols-4 gap-2">
                  <Input
                    label="Quantity"
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(index, 'quantity', parseInt(e.target.value) || 1)}
                  />
                  <Input
                    label="Unit Price"
                    type="number"
                    step="0.01"
                    value={item.unit_price}
                    onChange={(e) => updateLineItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                  />
                  <Input
                    label="Tax %"
                    type="number"
                    step="0.01"
                    value={item.tax_rate}
                    onChange={(e) => updateLineItem(index, 'tax_rate', parseFloat(e.target.value) || 0)}
                  />
                  <Input
                    label="Discount %"
                    type="number"
                    step="0.01"
                    value={item.discount}
                    onChange={(e) => updateLineItem(index, 'discount', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="text-sm text-gray-600">
                  Total: {formData.currency} {(item.quantity * item.unit_price * (1 - item.discount / 100) * (1 + item.tax_rate / 100)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {lineItems.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-right space-y-1">
                <p className="text-sm text-gray-600">
                  Subtotal: {formData.currency} {calculateTotal().subtotal.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  Tax: {formData.currency} {calculateTotal().taxAmount.toFixed(2)}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  Total: {formData.currency} {calculateTotal().total.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          <Textarea
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={2}
            placeholder="Add any notes for the client"
          />

          <Textarea
            label="Terms & Conditions"
            value={formData.terms}
            onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
            rows={2}
            placeholder="Payment terms, conditions, etc."
          />

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingQuotation(null);
                setFormData(initialFormData);
                setLineItems([]);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : editingQuotation ? 'Update' : 'Create Quotation'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}



