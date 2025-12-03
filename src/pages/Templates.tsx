import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { Textarea } from '../components/ui/Textarea';
import { PlusIcon, SearchIcon, FileIcon, EyeIcon, CopyIcon, TrashIcon } from 'lucide-react';
export function Templates() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'invoice',
    headerText: 'INVOICE',
    companyName: 'Your Company Name',
    companyAddress: '123 Business Street',
    companyPhone: '+1 234 567 8900',
    companyEmail: 'contact@company.com',
    footerText: 'Thank you for your business!',
    primaryColor: '#41BAC4',
    fontFamily: 'Inter'
  });
  const templates = [{
    id: '1',
    name: 'Modern Professional',
    type: 'invoice',
    isDefault: true,
    preview: 'Clean and professional design with company branding',
    createdAt: '2024-01-10'
  }, {
    id: '2',
    name: 'Minimal Quote',
    type: 'quotation',
    isDefault: true,
    preview: 'Simple quotation template with essential details',
    createdAt: '2024-01-10'
  }, {
    id: '3',
    name: 'Detailed Invoice',
    type: 'invoice',
    isDefault: false,
    preview: 'Comprehensive invoice with itemized breakdown',
    createdAt: '2024-01-12'
  }];
  const handleCreateTemplate = () => {
    console.log('Creating template:', formData);
    setIsCreateModalOpen(false);
    alert('Template created successfully!');
    // Reset form
    setFormData({
      name: '',
      type: 'invoice',
      headerText: 'INVOICE',
      companyName: 'Your Company Name',
      companyAddress: '123 Business Street',
      companyPhone: '+1 234 567 8900',
      companyEmail: 'contact@company.com',
      footerText: 'Thank you for your business!',
      primaryColor: '#41BAC4',
      fontFamily: 'Inter'
    });
  };
  const handlePreview = (template: any) => {
    setSelectedTemplate(template);
    setIsPreviewModalOpen(true);
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Document Templates
          </h1>
          <p className="text-gray-500 mt-1">
            Manage templates for quotations and invoices
          </p>
        </div>
        <Button icon={<PlusIcon className="w-4 h-4" />} onClick={() => setIsCreateModalOpen(true)}>
          Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Templates</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="p-3 bg-primary-50 rounded-lg text-primary-400">
              <FileIcon className="w-6 h-6" />
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Active Templates</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-green-500">
              <FileIcon className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      <Card padding="none">
        <div className="p-4 border-b border-gray-200">
          <Input placeholder="Search templates by name or type..." icon={<SearchIcon className="w-4 h-4" />} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>

        {templates.length === 0 ? <EmptyState icon={<FileIcon className="w-8 h-8" />} title="No templates yet" description="Create your first document template for quotations or invoices" action={{
        label: 'Create Template',
        onClick: () => setIsCreateModalOpen(true)
      }} /> : <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(template => <Card key={template.id} padding="none" className="overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                    <FileIcon className="w-16 h-16 text-gray-400" />
                    <div className="absolute top-3 right-3">
                      {template.isDefault && <Badge variant="success" size="sm">
                          Default
                        </Badge>}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {template.preview}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <Badge variant="info" size="sm">
                        {template.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <Button size="sm" variant="outline" icon={<EyeIcon className="w-3 h-3" />} fullWidth onClick={() => handlePreview(template)}>
                        Preview
                      </Button>
                      <Button size="sm" variant="ghost" icon={<CopyIcon className="w-3 h-3" />}>
                        Duplicate
                      </Button>
                      <Button size="sm" variant="ghost" icon={<TrashIcon className="w-3 h-3" />}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>)}
            </div>
          </div>}
      </Card>

      {/* Create Template Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Template" size="lg" footer={<>
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate}>Create Template</Button>
          </>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Template Name" placeholder="Modern Professional" value={formData.name} onChange={e => setFormData({
            ...formData,
            name: e.target.value
          })} />
            <Select label="Type" options={[{
            value: 'invoice',
            label: 'Invoice'
          }, {
            value: 'quotation',
            label: 'Quotation'
          }]} value={formData.type} onChange={e => setFormData({
            ...formData,
            type: e.target.value
          })} />
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Company Information
            </h3>
            <div className="space-y-3">
              <Input label="Company Name" placeholder="Your Company Inc" value={formData.companyName} onChange={e => setFormData({
              ...formData,
              companyName: e.target.value
            })} />
              <Textarea label="Company Address" placeholder="123 Business Street, City, Country" rows={2} value={formData.companyAddress} onChange={e => setFormData({
              ...formData,
              companyAddress: e.target.value
            })} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Phone" placeholder="+1 234 567 8900" value={formData.companyPhone} onChange={e => setFormData({
                ...formData,
                companyPhone: e.target.value
              })} />
                <Input label="Email" type="email" placeholder="contact@company.com" value={formData.companyEmail} onChange={e => setFormData({
                ...formData,
                companyEmail: e.target.value
              })} />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Design Settings
            </h3>
            <div className="space-y-3">
              <Input label="Header Text" placeholder="INVOICE" value={formData.headerText} onChange={e => setFormData({
              ...formData,
              headerText: e.target.value
            })} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Primary Color
                  </label>
                  <input type="color" value={formData.primaryColor} onChange={e => setFormData({
                  ...formData,
                  primaryColor: e.target.value
                })} className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer" />
                </div>
                <Select label="Font Family" options={[{
                value: 'Inter',
                label: 'Inter'
              }, {
                value: 'Arial',
                label: 'Arial'
              }, {
                value: 'Helvetica',
                label: 'Helvetica'
              }, {
                value: 'Times New Roman',
                label: 'Times New Roman'
              }]} value={formData.fontFamily} onChange={e => setFormData({
                ...formData,
                fontFamily: e.target.value
              })} />
              </div>
              <Textarea label="Footer Text" placeholder="Thank you for your business!" rows={2} value={formData.footerText} onChange={e => setFormData({
              ...formData,
              footerText: e.target.value
            })} />
            </div>
          </div>
        </div>
      </Modal>

      {/* Preview Template Modal */}
      <Modal isOpen={isPreviewModalOpen} onClose={() => setIsPreviewModalOpen(false)} title={`Preview: ${selectedTemplate?.name}`} size="xl" footer={<>
            <Button variant="ghost" onClick={() => setIsPreviewModalOpen(false)}>
              Close
            </Button>
            <Button>Use This Template</Button>
          </>}>
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-400 mb-2">
              INVOICE
            </h1>
            <p className="text-gray-600">Invoice #INV-2024-001</p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">From:</h3>
              <p className="text-gray-700 font-medium">Your Company Inc</p>
              <p className="text-sm text-gray-600">123 Business Street</p>
              <p className="text-sm text-gray-600">City, Country</p>
              <p className="text-sm text-gray-600">+1 234 567 8900</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">To:</h3>
              <p className="text-gray-700 font-medium">Client Name</p>
              <p className="text-sm text-gray-600">456 Client Ave</p>
              <p className="text-sm text-gray-600">City, Country</p>
            </div>
          </div>

          <table className="w-full mb-8">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                  Description
                </th>
                <th className="px-4 py-2 text-right text-sm font-semibold text-gray-900">
                  Qty
                </th>
                <th className="px-4 py-2 text-right text-sm font-semibold text-gray-900">
                  Price
                </th>
                <th className="px-4 py-2 text-right text-sm font-semibold text-gray-900">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="px-4 py-3 text-sm text-gray-700">
                  Web Development Service
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 text-right">
                  1
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 text-right">
                  ₦5,000
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium text-right">
                  ₦5,000
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-end mb-8">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900 font-medium">₦5,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (10%):</span>
                <span className="text-gray-900 font-medium">₦500</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                <span className="text-gray-900">Total:</span>
                <span className="text-primary-400">₦5,500</span>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 pt-8 border-t border-gray-200">
            Thank you for your business!
          </div>
        </div>
      </Modal>
    </div>;
}