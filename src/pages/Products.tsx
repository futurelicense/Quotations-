import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Textarea } from '../components/ui/Textarea';
import { PlusIcon, SearchIcon, PackageIcon, TagIcon, DollarSignIcon } from 'lucide-react';
import type { Product } from '../types';
export function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const products: Product[] = [{
    id: '1',
    name: 'Web Development Service',
    description: 'Custom website development and design',
    type: 'service',
    sku: 'SRV-001',
    price: 5000,
    currency: 'USD',
    taxRate: 10,
    category: 'Development',
    status: 'active'
  }, {
    id: '2',
    name: 'Monthly Maintenance',
    description: 'Website maintenance and support package',
    type: 'service',
    sku: 'SRV-002',
    price: 500,
    currency: 'USD',
    taxRate: 10,
    category: 'Support',
    status: 'active'
  }, {
    id: '3',
    name: 'Premium Hosting',
    description: 'High-performance cloud hosting',
    type: 'product',
    sku: 'PRD-001',
    price: 99,
    currency: 'USD',
    taxRate: 10,
    category: 'Hosting',
    status: 'active'
  }];
  const columns = [{
    key: 'name',
    label: 'Product/Service',
    render: (value: string, row: Product) => <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{row.sku}</p>
        </div>
  }, {
    key: 'description',
    label: 'Description',
    render: (value: string) => <p className="text-sm text-gray-600 max-w-xs truncate">{value}</p>
  }, {
    key: 'type',
    label: 'Type',
    render: (value: string) => <Badge variant={value === 'product' ? 'info' : 'default'}>
          {value}
        </Badge>
  }, {
    key: 'category',
    label: 'Category',
    render: (value: string) => <span className="text-sm text-gray-600">{value}</span>
  }, {
    key: 'price',
    label: 'Price',
    render: (value: number, row: Product) => <span className="font-semibold text-gray-900">
          ${value.toLocaleString()}
        </span>
  }, {
    key: 'status',
    label: 'Status',
    render: (value: string) => <Badge variant={value === 'active' ? 'success' : 'default'}>
          {value}
        </Badge>
  }];
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Products & Services
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your product catalog and service offerings
          </p>
        </div>
        <Button icon={<PlusIcon className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <div className="p-3 bg-primary-50 rounded-lg text-primary-400">
              <PackageIcon className="w-6 h-6" />
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Active Services</p>
              <p className="text-2xl font-bold text-gray-900">18</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-500">
              <TagIcon className="w-6 h-6" />
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Avg. Price</p>
              <p className="text-2xl font-bold text-gray-900">$1,850</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-green-500">
              <DollarSignIcon className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      <Card padding="none">
        <div className="p-4 border-b border-gray-200 flex items-center gap-4">
          <div className="flex-1">
            <Input placeholder="Search products by name, SKU, or category..." icon={<SearchIcon className="w-4 h-4" />} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <Select options={[{
          value: 'all',
          label: 'All Types'
        }, {
          value: 'product',
          label: 'Products'
        }, {
          value: 'service',
          label: 'Services'
        }]} fullWidth={false} className="w-40" />
        </div>

        {products.length === 0 ? <EmptyState icon={<PackageIcon className="w-8 h-8" />} title="No products yet" description="Start building your product catalog by adding your first product or service" action={{
        label: 'Add Product',
        onClick: () => setIsModalOpen(true)
      }} /> : <Table columns={columns} data={products} />}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Product/Service" size="lg" footer={<>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button>Save Product</Button>
          </>}>
        <div className="space-y-4">
          <Select label="Type" options={[{
          value: 'product',
          label: 'Product'
        }, {
          value: 'service',
          label: 'Service'
        }]} />
          <Input label="Name" placeholder="Web Development Service" />
          <Textarea label="Description" placeholder="Detailed description of the product or service" rows={3} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="SKU" placeholder="PRD-001" />
            <Input label="Category" placeholder="Development" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price" type="number" placeholder="0.00" icon={<DollarSignIcon className="w-4 h-4" />} />
            <Select label="Currency" options={[{
            value: 'USD',
            label: 'USD'
          }, {
            value: 'EUR',
            label: 'EUR'
          }, {
            value: 'GBP',
            label: 'GBP'
          }]} />
          </div>
          <Input label="Tax Rate (%)" type="number" placeholder="10" />
          <Select label="Status" options={[{
          value: 'active',
          label: 'Active'
        }, {
          value: 'inactive',
          label: 'Inactive'
        }]} />
        </div>
      </Modal>
    </div>;
}