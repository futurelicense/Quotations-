import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { Textarea } from '../components/ui/Textarea';
import { Dropdown } from '../components/ui/Dropdown';
import { PlusIcon, SearchIcon, ReceiptIcon, DollarSignIcon, AlertCircleIcon, CheckCircleIcon, DownloadIcon, SendIcon, EyeIcon, EditIcon, TrashIcon } from 'lucide-react';
import type { Invoice } from '../types';
export function Invoices() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    currency: 'NGN',
    notes: '',
    terms: '',
    recurring: false,
    frequency: 'monthly'
  });
  const [lineItems, setLineItems] = useState([{
    productName: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    taxRate: 0,
    discount: 0
  }]);
  const invoices: Invoice[] = [{
    id: '1',
    invoiceNumber: 'INV-2024-001',
    clientId: '1',
    clientName: 'Acme Corp',
    date: '2024-01-15',
    dueDate: '2024-02-15',
    status: 'paid',
    items: [],
    subtotal: 5200,
    taxAmount: 520,
    discountAmount: 0,
    total: 5720,
    amountPaid: 5720,
    amountDue: 0,
    currency: 'NGN',
    createdAt: '2024-01-15',
    paidAt: '2024-01-20'
  }, {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    clientId: '2',
    clientName: 'Tech Solutions',
    date: '2024-01-14',
    dueDate: '2024-02-14',
    status: 'sent',
    items: [],
    subtotal: 3800,
    taxAmount: 380,
    discountAmount: 0,
    total: 4180,
    amountPaid: 0,
    amountDue: 4180,
    currency: 'NGN',
    createdAt: '2024-01-14'
  }, {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    clientId: '3',
    clientName: 'Global Industries',
    date: '2024-01-10',
    dueDate: '2024-01-25',
    status: 'overdue',
    items: [],
    subtotal: 12500,
    taxAmount: 1250,
    discountAmount: 500,
    total: 13250,
    amountPaid: 0,
    amountDue: 13250,
    currency: 'USD',
    createdAt: '2024-01-10'
  }];
  const addLineItem = () => {
    setLineItems([...lineItems, {
      productName: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 0,
      discount: 0
    }]);
  };
  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };
  const calculateTotal = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const taxAmount = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice * item.taxRate / 100, 0);
    const discountAmount = lineItems.reduce((sum, item) => sum + item.discount, 0);
    return {
      subtotal,
      taxAmount,
      discountAmount,
      total: subtotal + taxAmount - discountAmount
    };
  };
  const handleCreateInvoice = () => {
    const totals = calculateTotal();
    console.log('Creating invoice:', {
      ...formData,
      lineItems,
      ...totals
    });
    setIsCreateModalOpen(false);
    // Reset form
    setFormData({
      clientId: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      currency: 'NGN',
      notes: '',
      terms: '',
      recurring: false,
      frequency: 'monthly'
    });
    setLineItems([{
      productName: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 0,
      discount: 0
    }]);
  };
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'sent':
        return 'info';
      case 'overdue':
        return 'danger';
      case 'draft':
        return 'default';
      default:
        return 'default';
    }
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
    label: 'Invoice #',
    render: (value: string, row: Invoice) => <div>
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
    key: 'dueDate',
    label: 'Due Date',
    render: (value: string) => <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString()}
        </span>
  }, {
    key: 'total',
    label: 'Amount',
    render: (value: number, row: Invoice) => <span className="font-semibold text-gray-900">
          {getCurrencySymbol(row.currency)}
          {value.toLocaleString()}
        </span>
  }, {
    key: 'amountDue',
    label: 'Amount Due',
    render: (value: number, row: Invoice) => <span className={`font-semibold ${value > 0 ? 'text-red-600' : 'text-green-600'}`}>
          {getCurrencySymbol(row.currency)}
          {value.toLocaleString()}
        </span>
  }, {
    key: 'status',
    label: 'Status',
    render: (value: string) => <Badge variant={getStatusVariant(value)}>{value}</Badge>
  }, {
    key: 'actions',
    label: 'Actions',
    render: (_value: any, row: Invoice) => <Dropdown items={[{
      label: 'View',
      icon: <EyeIcon className="w-4 h-4" />,
      onClick: () => alert(`Viewing ${row.invoiceNumber}`)
    }, {
      label: 'Edit',
      icon: <EditIcon className="w-4 h-4" />,
      onClick: () => alert(`Editing ${row.invoiceNumber}`)
    }, {
      label: 'Send',
      icon: <SendIcon className="w-4 h-4" />,
      onClick: () => alert(`Sending ${row.invoiceNumber}`)
    }, {
      label: 'Download PDF',
      icon: <DownloadIcon className="w-4 h-4" />,
      onClick: () => alert(`Downloading ${row.invoiceNumber}`)
    }, {
      label: 'Record Payment',
      icon: <DollarSignIcon className="w-4 h-4" />,
      onClick: () => alert(`Recording payment for ${row.invoiceNumber}`)
    }, {
      label: 'Delete',
      icon: <TrashIcon className="w-4 h-4" />,
      onClick: () => alert(`Deleting ${row.invoiceNumber}`),
      variant: 'danger'
    }]} />
  }];
  const totals = calculateTotal();
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-500 mt-1">Create, send, and track invoices</p>
        </div>
        <Button icon={<PlusIcon className="w-4 h-4" />} onClick={() => setIsCreateModalOpen(true)}>
          Create Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Invoiced</p>
              <p className="text-2xl font-bold text-gray-900">₦124,500</p>
            </div>
            <div className="p-3 bg-primary-50 rounded-lg text-primary-400">
              <ReceiptIcon className="w-6 h-6" />
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Paid</p>
              <p className="text-2xl font-bold text-gray-900">₦96,100</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-green-500">
              <CheckCircleIcon className="w-6 h-6" />
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">₦28,400</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-500">
              <DollarSignIcon className="w-6 h-6" />
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">₦13,250</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg text-red-500">
              <AlertCircleIcon className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      <Card padding="none">
        <div className="p-4 border-b border-gray-200">
          <Input placeholder="Search invoices by number, client, or amount..." icon={<SearchIcon className="w-4 h-4" />} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>

        {invoices.length === 0 ? <EmptyState icon={<ReceiptIcon className="w-8 h-8" />} title="No invoices yet" description="Create your first invoice to start billing your clients" action={{
        label: 'Create Invoice',
        onClick: () => setIsCreateModalOpen(true)
      }} /> : <Table columns={columns} data={invoices} />}
      </Card>

      {/* Create Invoice Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Invoice" size="xl" footer={<>
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateInvoice}>Create Invoice</Button>
          </>}>
        <div className="space-y-6">
          {/* Client and Date Info */}
          <div className="grid grid-cols-2 gap-4">
            <Select label="Client" options={[{
            value: '',
            label: 'Select a client'
          }, {
            value: '1',
            label: 'Acme Corp'
          }, {
            value: '2',
            label: 'Tech Solutions'
          }, {
            value: '3',
            label: 'Global Industries'
          }]} value={formData.clientId} onChange={e => setFormData({
            ...formData,
            clientId: e.target.value
          })} />
            <Select label="Currency" options={[{
            value: 'NGN',
            label: 'NGN - Nigerian Naira'
          }, {
            value: 'USD',
            label: 'USD - US Dollar'
          }, {
            value: 'EUR',
            label: 'EUR - Euro'
          }, {
            value: 'GBP',
            label: 'GBP - British Pound'
          }]} value={formData.currency} onChange={e => setFormData({
            ...formData,
            currency: e.target.value
          })} />
            <Input label="Invoice Date" type="date" value={formData.date} onChange={e => setFormData({
            ...formData,
            date: e.target.value
          })} />
            <Input label="Due Date" type="date" value={formData.dueDate} onChange={e => setFormData({
            ...formData,
            dueDate: e.target.value
          })} />
          </div>

          {/* Recurring Invoice Option */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={formData.recurring} onChange={e => setFormData({
              ...formData,
              recurring: e.target.checked
            })} className="w-4 h-4 text-primary-400 border-gray-300 rounded focus:ring-primary-400" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  Make this a recurring invoice
                </p>
                <p className="text-sm text-gray-500">
                  Automatically generate this invoice on a schedule
                </p>
              </div>
            </label>
            {formData.recurring && <div className="mt-3">
                <Select label="Frequency" options={[{
              value: 'weekly',
              label: 'Weekly'
            }, {
              value: 'monthly',
              label: 'Monthly'
            }, {
              value: 'quarterly',
              label: 'Quarterly'
            }, {
              value: 'yearly',
              label: 'Yearly'
            }]} value={formData.frequency} onChange={e => setFormData({
              ...formData,
              frequency: e.target.value
            })} />
              </div>}
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Line Items</h3>
              <Button size="sm" variant="outline" icon={<PlusIcon className="w-3 h-3" />} onClick={addLineItem}>
                Add Item
              </Button>
            </div>
            <div className="space-y-3">
              {lineItems.map((item, index) => <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Product/Service" placeholder="Web Development" value={item.productName} onChange={e => {
                  const newItems = [...lineItems];
                  newItems[index].productName = e.target.value;
                  setLineItems(newItems);
                }} />
                    <Input label="Description" placeholder="Custom website design" value={item.description} onChange={e => {
                  const newItems = [...lineItems];
                  newItems[index].description = e.target.value;
                  setLineItems(newItems);
                }} />
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    <Input label="Quantity" type="number" value={item.quantity} onChange={e => {
                  const newItems = [...lineItems];
                  newItems[index].quantity = Number(e.target.value);
                  setLineItems(newItems);
                }} />
                    <Input label="Unit Price" type="number" value={item.unitPrice} onChange={e => {
                  const newItems = [...lineItems];
                  newItems[index].unitPrice = Number(e.target.value);
                  setLineItems(newItems);
                }} />
                    <Input label="Tax Rate (%)" type="number" value={item.taxRate} onChange={e => {
                  const newItems = [...lineItems];
                  newItems[index].taxRate = Number(e.target.value);
                  setLineItems(newItems);
                }} />
                    <Input label="Discount" type="number" value={item.discount} onChange={e => {
                  const newItems = [...lineItems];
                  newItems[index].discount = Number(e.target.value);
                  setLineItems(newItems);
                }} />
                    <div className="flex items-end">
                      <Button size="sm" variant="ghost" icon={<TrashIcon className="w-3 h-3" />} onClick={() => removeLineItem(index)} fullWidth>
                        Remove
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">Total: </span>
                    <span className="font-semibold text-gray-900">
                      {getCurrencySymbol(formData.currency)}
                      {(item.quantity * item.unitPrice).toLocaleString()}
                    </span>
                  </div>
                </div>)}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium text-gray-900">
                {getCurrencySymbol(formData.currency)}
                {totals.subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium text-gray-900">
                {getCurrencySymbol(formData.currency)}
                {totals.taxAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount:</span>
              <span className="font-medium text-gray-900">
                -{getCurrencySymbol(formData.currency)}
                {totals.discountAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
              <span className="text-gray-900">Total:</span>
              <span className="text-primary-400">
                {getCurrencySymbol(formData.currency)}
                {totals.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Notes and Terms */}
          <div className="grid grid-cols-2 gap-4">
            <Textarea label="Notes" placeholder="Additional notes for the client..." rows={3} value={formData.notes} onChange={e => setFormData({
            ...formData,
            notes: e.target.value
          })} />
            <Textarea label="Payment Terms" placeholder="Payment terms and conditions..." rows={3} value={formData.terms} onChange={e => setFormData({
            ...formData,
            terms: e.target.value
          })} />
          </div>
        </div>
      </Modal>
    </div>;
}