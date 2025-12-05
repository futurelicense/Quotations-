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
import { PlusIcon, SearchIcon, FileTextIcon, EditIcon, TrashIcon, ArrowRightIcon } from 'lucide-react';

interface LineItem {
  product_id: string;
  product_name: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  discount: number;
  total: number;
}

interface QuotationFormData {
  client_id: string;
  date: string;
  expiry_date: string;
  notes: string;
  terms: string;
  currency: string;
  items: LineItem[];
}

const initialFormData: QuotationFormData = {
  client_id: '',
  date: new Date().toISOString().split('T')[0],
  expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  notes: '',
  terms: '',
  currency: 'USD',
  items: [],
};

export function Quotations() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<any>(null);
  const [formData, setFormData] = useState<QuotationFormData>(initialFormData);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<LineItem[]>([]);

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

  const calculateTotals = (items: LineItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = items.reduce((sum, item) => 
      sum + (item.unit_price * item.quantity * (item.tax_rate / 100)), 0
    );
    const discountAmount = items.reduce((sum, item) => 
      sum + (item.unit_price * item.quantity * (item.discount / 100)), 0
    );
    const total = subtotal + taxAmount - discountAmount;
    
    return { subtotal, taxAmount, discountAmount, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedItems.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    setSubmitting(true);

    try {
      const { subtotal, taxAmount, discountAmount, total } = calculateTotals(selectedItems);
      
      const quotationData = {
        ...formData,
        quotation_number: generateQuotationNumber(),
        status: 'draft',
        items: JSON.stringify(selectedItems),
        subtotal,
        tax_amount: taxAmount,
        discount_amount: discountAmount,
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
      setSelectedItems([]);
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
      toast.error(error.message || 'Failed to convert quotation');
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
    setSelectedItems([...selectedItems, {
      product_id: '',
      product_name: '',
      description: '',
      quantity: 1,
      unit_price: 0,
      tax_rate: 0,
      discount: 0,
      total: 0,
    }]);
  };

  const updateLineItem = (index: number, field: string, value: any) => {
    const updated = [...selectedItems];
    updated[index] = { ...updated[index], [field]: value };
    
    // Recalculate total for this item
    const item = updated[index];
    const subtotal = item.quantity * item.unit_price;
    const tax = subtotal * (item.tax_rate / 100);
    const discount = subtotal * (item.discount / 100);
    updated[index].total = subtotal + tax - discount;
    
    setSelectedItems(updated);
  };

  const removeLineItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const filteredQuotations = quotations.filter(q =>
    q.quotation_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (q.clients?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
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
          <p className="font-medium text-gray-900">{value?.name || 'Unknown'}</p>
          <p className="text-sm text-gray-500">{value?.company || ''}</p>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'total',
      label: 'Amount',
      render: (value: number, row: any) => (
        <span className="font-medium">${value.toLocaleString()}</span>
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
          rejected: 'error',
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
              title="Convert to Invoice"
            >
              <ArrowRightIcon className="w-4 h-4" />
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
            setSelectedItems([]);
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
            action={
              !searchQuery && (
                <Button onClick={() => setIsModalOpen(true)}>
                  Create First Quotation
                </Button>
              )
            }
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
          setSelectedItems([]);
        }}
        title={editingQuotation ? 'Edit Quotation' : 'Create New Quotation'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Client"
            required
            value={formData.client_id}
            onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
            options={[
              { value: '', label: 'Select client...' },
              ...clients.map(c => ({ value: c.id, label: `${c.name} - ${c.company}` })),
            ]}
          />

          <div className="grid grid-cols-3 gap-4">
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
                { value: 'USD', label: 'USD' },
                { value: 'EUR', label: 'EUR' },
                { value: 'GBP', label: 'GBP' },
                { value: 'NGN', label: 'NGN' },
              ]}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Line Items</label>
              <Button type="button" size="sm" onClick={addLineItem}>
                Add Item
              </Button>
            </div>
            
            {selectedItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    label="Product"
                    value={item.product_id}
                    onChange={(e) => {
                      const product = products.find(p => p.id === e.target.value);
                      if (product) {
                        updateLineItem(index, 'product_id', product.id);
                        updateLineItem(index, 'product_name', product.name);
                        updateLineItem(index, 'description', product.description);
                        updateLineItem(index, 'unit_price', product.price);
                        updateLineItem(index, 'tax_rate', product.tax_rate);
                      }
                    }}
                    options={[
                      { value: '', label: 'Select product...' },
                      ...products.map(p => ({ value: p.id, label: p.name })),
                    ]}
                  />
                  <Input
                    label="Quantity"
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(index, 'quantity', parseInt(e.target.value))}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    label="Unit Price"
                    type="number"
                    step="0.01"
                    value={item.unit_price}
                    onChange={(e) => updateLineItem(index, 'unit_price', parseFloat(e.target.value))}
                  />
                  <Input
                    label="Discount %"
                    type="number"
                    step="0.01"
                    value={item.discount}
                    onChange={(e) => updateLineItem(index, 'discount', parseFloat(e.target.value))}
                  />
                  <div>
                    <label className="text-sm font-medium">Total</label>
                    <p className="text-lg font-bold">${item.total.toFixed(2)}</p>
                  </div>
                </div>
                <Button type="button" size="sm" variant="outline" onClick={() => removeLineItem(index)}>
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span className="font-medium">
                ${selectedItems.reduce((sum, item) => sum + item.quantity * item.unit_price, 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>Tax:</span>
              <span className="font-medium">
                ${selectedItems.reduce((sum, item) => sum + (item.quantity * item.unit_price * item.tax_rate / 100), 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>Discount:</span>
              <span className="font-medium text-red-600">
                -${selectedItems.reduce((sum, item) => sum + (item.quantity * item.unit_price * item.discount / 100), 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t">
              <span>Total:</span>
              <span>${calculateTotals(selectedItems).total.toFixed(2)}</span>
            </div>
          </div>

          <Textarea
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional notes..."
            rows={2}
          />

          <Textarea
            label="Terms & Conditions"
            value={formData.terms}
            onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
            placeholder="Payment terms, conditions..."
            rows={2}
          />

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingQuotation(null);
                setFormData(initialFormData);
                setSelectedItems([]);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : editingQuotation ? 'Update Quotation' : 'Create Quotation'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

