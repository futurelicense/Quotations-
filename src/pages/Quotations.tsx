import React, { useState } from 'react';
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
import { PlusIcon, SearchIcon, FileTextIcon, CheckCircleIcon, XCircleIcon, ClockIcon, ArrowRightIcon, EyeIcon, SendIcon, DownloadIcon, TrashIcon, EditIcon } from 'lucide-react';
import type { Quotation } from '../types';
export function Quotations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  // Form state for creating quotation
  const [formData, setFormData] = useState({
    clientId: '',
    date: new Date().toISOString().split('T')[0],
    expiryDate: '',
    currency: 'NGN',
    notes: '',
    terms: ''
  });
  // Send email form state
  const [sendForm, setSendForm] = useState({
    to: '',
    cc: '',
    subject: '',
    message: ''
  });
  const [lineItems, setLineItems] = useState([{
    productName: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    taxRate: 0,
    discount: 0
  }]);
  const quotations: Quotation[] = [{
    id: '1',
    quotationNumber: 'QUO-2024-001',
    clientId: '1',
    clientName: 'Acme Corp',
    date: '2024-01-15',
    expiryDate: '2024-02-15',
    status: 'sent',
    items: [{
      id: '1',
      productId: '1',
      productName: 'Web Development',
      description: 'Custom website design and development',
      quantity: 1,
      unitPrice: 8000,
      taxRate: 10,
      discount: 0,
      total: 8800
    }, {
      id: '2',
      productId: '2',
      productName: 'SEO Optimization',
      description: 'Search engine optimization package',
      quantity: 1,
      unitPrice: 400,
      taxRate: 10,
      discount: 0,
      total: 440
    }],
    subtotal: 8400,
    taxAmount: 840,
    discountAmount: 0,
    total: 9240,
    currency: 'NGN',
    notes: 'Payment terms: 50% upfront, 50% on completion',
    terms: 'Valid for 30 days from issue date',
    createdAt: '2024-01-15'
  }, {
    id: '2',
    quotationNumber: 'QUO-2024-002',
    clientId: '2',
    clientName: 'Tech Solutions',
    date: '2024-01-14',
    expiryDate: '2024-02-14',
    status: 'approved',
    items: [],
    subtotal: 15200,
    taxAmount: 1520,
    discountAmount: 500,
    total: 16220,
    currency: 'NGN',
    createdAt: '2024-01-14'
  }, {
    id: '3',
    quotationNumber: 'QUO-2024-003',
    clientId: '3',
    clientName: 'Global Industries',
    date: '2024-01-10',
    expiryDate: '2024-01-25',
    status: 'expired',
    items: [],
    subtotal: 5600,
    taxAmount: 560,
    discountAmount: 0,
    total: 6160,
    currency: 'USD',
    createdAt: '2024-01-10'
  }, {
    id: '4',
    quotationNumber: 'QUO-2024-004',
    clientId: '4',
    clientName: 'StartUp Inc',
    date: '2024-01-16',
    expiryDate: '2024-02-16',
    status: 'draft',
    items: [],
    subtotal: 3200,
    taxAmount: 320,
    discountAmount: 0,
    total: 3520,
    currency: 'NGN',
    createdAt: '2024-01-16'
  }];
  const handleConvertToInvoice = (quotation: Quotation) => {
    alert(`Converting ${quotation.quotationNumber} to invoice...`);
    // Logic to convert quotation to invoice would go here
  };
  const handleView = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setIsViewModalOpen(true);
  };
  const handleEdit = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setFormData({
      clientId: quotation.clientId,
      date: quotation.date,
      expiryDate: quotation.expiryDate,
      currency: quotation.currency,
      notes: quotation.notes || '',
      terms: quotation.terms || ''
    });
    setLineItems(quotation.items.length > 0 ? quotation.items.map(item => ({
      productName: item.productName,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      taxRate: item.taxRate,
      discount: item.discount
    })) : [{
      productName: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 0,
      discount: 0
    }]);
    setIsEditModalOpen(true);
  };
  const handleSend = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setSendForm({
      to: 'client@example.com',
      cc: '',
      subject: `Quotation ${quotation.quotationNumber} from InvoicePro`,
      message: `Dear ${quotation.clientName},\n\nPlease find attached quotation ${quotation.quotationNumber} for your review.\n\nBest regards,\nYour Company`
    });
    setIsSendModalOpen(true);
  };
  const handleDownload = (quotation: Quotation) => {
    // Simulate PDF download
    alert(`Downloading PDF for ${quotation.quotationNumber}...`);
    console.log('Generating PDF for:', quotation);
    // In production, this would generate and download a PDF
  };
  const handleDelete = (quotation: Quotation) => {
    if (confirm(`Are you sure you want to delete ${quotation.quotationNumber}?`)) {
      alert(`Deleting ${quotation.quotationNumber}...`);
      // Delete logic would go here
    }
  };
  const handleSendEmail = () => {
    console.log('Sending email:', sendForm, 'for quotation:', selectedQuotation);
    alert(`Quotation ${selectedQuotation?.quotationNumber} sent successfully!`);
    setIsSendModalOpen(false);
  };
  const handleSaveEdit = () => {
    const totals = calculateTotal();
    console.log('Updating quotation:', selectedQuotation?.quotationNumber, {
      ...formData,
      lineItems,
      ...totals
    });
    alert(`Quotation ${selectedQuotation?.quotationNumber} updated successfully!`);
    setIsEditModalOpen(false);
  };
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
  const handleCreateQuotation = () => {
    const totals = calculateTotal();
    console.log('Creating quotation:', {
      ...formData,
      lineItems,
      ...totals
    });
    setIsCreateModalOpen(false);
    alert('Quotation created successfully!');
    // Reset form
    setFormData({
      clientId: '',
      date: new Date().toISOString().split('T')[0],
      expiryDate: '',
      currency: 'NGN',
      notes: '',
      terms: ''
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
      case 'approved':
        return 'success';
      case 'sent':
        return 'info';
      case 'rejected':
        return 'danger';
      case 'expired':
        return 'warning';
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
    key: 'quotationNumber',
    label: 'Quotation #',
    render: (value: string, row: Quotation) => <div>
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
    key: 'expiryDate',
    label: 'Expires',
    render: (value: string) => <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString()}
        </span>
  }, {
    key: 'total',
    label: 'Amount',
    render: (value: number, row: Quotation) => <span className="font-semibold text-gray-900">
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
    render: (value: any, row: Quotation) => <div className="flex items-center gap-2">
          {row.status === 'approved' && <Button size="sm" variant="primary" icon={<ArrowRightIcon className="w-3 h-3" />} onClick={() => handleConvertToInvoice(row)}>
              Convert to Invoice
            </Button>}
          <Dropdown items={[{
        label: 'View',
        icon: <EyeIcon className="w-4 h-4" />,
        onClick: () => handleView(row)
      }, {
        label: 'Edit',
        icon: <EditIcon className="w-4 h-4" />,
        onClick: () => handleEdit(row)
      }, {
        label: 'Send',
        icon: <SendIcon className="w-4 h-4" />,
        onClick: () => handleSend(row)
      }, {
        label: 'Download PDF',
        icon: <DownloadIcon className="w-4 h-4" />,
        onClick: () => handleDownload(row)
      }, {
        label: 'Delete',
        icon: <TrashIcon className="w-4 h-4" />,
        onClick: () => handleDelete(row),
        variant: 'danger'
      }]} />
        </div>
  }];
  const totals = calculateTotal();
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotations</h1>
          <p className="text-gray-500 mt-1">
            Create and manage quotations for your clients
          </p>
        </div>
        <Button icon={<PlusIcon className="w-4 h-4" />} onClick={() => setIsCreateModalOpen(true)}>
          Create Quotation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Quotations</p>
              <p className="text-2xl font-bold text-gray-900">48</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg text-gray-600">
              <FileTextIcon className="w-6 h-6" />
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Approved</p>
              <p className="text-2xl font-bold text-gray-900">28</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-green-500">
              <CheckCircleIcon className="w-6 h-6" />
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-500">
              <ClockIcon className="w-6 h-6" />
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg text-red-500">
              <XCircleIcon className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      <Card padding="none">
        <div className="p-4 border-b border-gray-200">
          <Input placeholder="Search quotations by number, client, or amount..." icon={<SearchIcon className="w-4 h-4" />} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>

        {quotations.length === 0 ? <EmptyState icon={<FileTextIcon className="w-8 h-8" />} title="No quotations yet" description="Create your first quotation to send to clients for approval" action={{
        label: 'Create Quotation',
        onClick: () => setIsCreateModalOpen(true)
      }} /> : <Table columns={columns} data={quotations} />}
      </Card>

      {/* View Quotation Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title={`Quotation Details - ${selectedQuotation?.quotationNumber}`} size="xl" footer={<>
            <Button variant="ghost" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            <Button variant="outline" icon={<DownloadIcon className="w-4 h-4" />} onClick={() => selectedQuotation && handleDownload(selectedQuotation)}>
              Download PDF
            </Button>
            <Button icon={<SendIcon className="w-4 h-4" />} onClick={() => {
        setIsViewModalOpen(false);
        selectedQuotation && handleSend(selectedQuotation);
      }}>
              Send to Client
            </Button>
          </>}>
        {selectedQuotation && <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between pb-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-primary-400 mb-2">
                  QUOTATION
                </h2>
                <p className="text-gray-600">
                  {selectedQuotation.quotationNumber}
                </p>
              </div>
              <Badge variant={getStatusVariant(selectedQuotation.status)} size="md">
                {selectedQuotation.status}
              </Badge>
            </div>

            {/* Client and Date Info */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  From:
                </h3>
                <p className="text-gray-900 font-medium">InvoicePro</p>
                <p className="text-sm text-gray-600">123 Business Street</p>
                <p className="text-sm text-gray-600">Lagos, Nigeria</p>
                <p className="text-sm text-gray-600">contact@invoicepro.com</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  To:
                </h3>
                <p className="text-gray-900 font-medium">
                  {selectedQuotation.clientName}
                </p>
                <div className="mt-4 space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Date:</span>{' '}
                    {new Date(selectedQuotation.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Valid Until:</span>{' '}
                    {new Date(selectedQuotation.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Line Items */}
            {selectedQuotation.items.length > 0 && <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  Items
                </h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Description
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          Qty
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          Price
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          Tax
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedQuotation.items.map((item, index) => <tr key={index}>
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-900">
                              {item.productName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.description}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-right text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-900">
                            {getCurrencySymbol(selectedQuotation.currency)}
                            {item.unitPrice.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-600">
                            {item.taxRate}%
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-gray-900">
                            {getCurrencySymbol(selectedQuotation.currency)}
                            {item.total.toLocaleString()}
                          </td>
                        </tr>)}
                    </tbody>
                  </table>
                </div>
              </div>}

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-80 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-900">
                    {getCurrencySymbol(selectedQuotation.currency)}
                    {selectedQuotation.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium text-gray-900">
                    {getCurrencySymbol(selectedQuotation.currency)}
                    {selectedQuotation.taxAmount.toLocaleString()}
                  </span>
                </div>
                {selectedQuotation.discountAmount > 0 && <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium text-gray-900">
                      -{getCurrencySymbol(selectedQuotation.currency)}
                      {selectedQuotation.discountAmount.toLocaleString()}
                    </span>
                  </div>}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-primary-400">
                    {getCurrencySymbol(selectedQuotation.currency)}
                    {selectedQuotation.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes and Terms */}
            {(selectedQuotation.notes || selectedQuotation.terms) && <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                {selectedQuotation.notes && <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Notes
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedQuotation.notes}
                    </p>
                  </div>}
                {selectedQuotation.terms && <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Terms & Conditions
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedQuotation.terms}
                    </p>
                  </div>}
              </div>}
          </div>}
      </Modal>

      {/* Send Quotation Modal */}
      <Modal isOpen={isSendModalOpen} onClose={() => setIsSendModalOpen(false)} title={`Send ${selectedQuotation?.quotationNumber}`} size="md" footer={<>
            <Button variant="ghost" onClick={() => setIsSendModalOpen(false)}>
              Cancel
            </Button>
            <Button icon={<SendIcon className="w-4 h-4" />} onClick={handleSendEmail}>
              Send Quotation
            </Button>
          </>}>
        <div className="space-y-4">
          <Input label="To" type="email" placeholder="client@example.com" value={sendForm.to} onChange={e => setSendForm({
          ...sendForm,
          to: e.target.value
        })} />
          <Input label="CC (Optional)" type="email" placeholder="manager@example.com" value={sendForm.cc} onChange={e => setSendForm({
          ...sendForm,
          cc: e.target.value
        })} />
          <Input label="Subject" placeholder="Quotation from InvoicePro" value={sendForm.subject} onChange={e => setSendForm({
          ...sendForm,
          subject: e.target.value
        })} />
          <Textarea label="Message" placeholder="Dear client, please find attached..." rows={6} value={sendForm.message} onChange={e => setSendForm({
          ...sendForm,
          message: e.target.value
        })} />
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> The quotation PDF will be automatically
              attached to this email.
            </p>
          </div>
        </div>
      </Modal>

      {/* Edit Quotation Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit ${selectedQuotation?.quotationNumber}`} size="xl" footer={<>
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
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
            <Input label="Date" type="date" value={formData.date} onChange={e => setFormData({
            ...formData,
            date: e.target.value
          })} />
            <Input label="Expiry Date" type="date" value={formData.expiryDate} onChange={e => setFormData({
            ...formData,
            expiryDate: e.target.value
          })} />
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
            <Textarea label="Terms & Conditions" placeholder="Payment terms and conditions..." rows={3} value={formData.terms} onChange={e => setFormData({
            ...formData,
            terms: e.target.value
          })} />
          </div>
        </div>
      </Modal>

      {/* Create Quotation Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Quotation" size="xl" footer={<>
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateQuotation}>Create Quotation</Button>
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
            <Input label="Date" type="date" value={formData.date} onChange={e => setFormData({
            ...formData,
            date: e.target.value
          })} />
            <Input label="Expiry Date" type="date" value={formData.expiryDate} onChange={e => setFormData({
            ...formData,
            expiryDate: e.target.value
          })} />
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
            <Textarea label="Terms & Conditions" placeholder="Payment terms and conditions..." rows={3} value={formData.terms} onChange={e => setFormData({
            ...formData,
            terms: e.target.value
          })} />
          </div>
        </div>
      </Modal>
    </div>;
}