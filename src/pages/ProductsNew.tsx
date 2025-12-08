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
import { productsService } from '../services/supabase-client.service';
import { PlusIcon, SearchIcon, PackageIcon, EditIcon, TrashIcon } from 'lucide-react';

interface ProductFormData {
  name: string;
  description: string;
  type: 'product' | 'service';
  sku: string;
  price: number;
  currency: string;
  tax_rate: number;
  category: string;
  status: 'active' | 'inactive';
}

const initialFormData: ProductFormData = {
  name: '',
  description: '',
  type: 'service',
  sku: '',
  price: 0,
  currency: 'USD',
  tax_rate: 0,
  category: '',
  status: 'active',
};

export function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (user) {
      loadProducts();
    }
  }, [user]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsService.getAll(user!.id);
      setProducts(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingProduct) {
        await productsService.update(editingProduct.id, {
          ...formData,
          taxRate: formData.tax_rate
        });
        toast.success('Product updated successfully');
      } else {
        await productsService.create(user!.id, {
          ...formData,
          taxRate: formData.tax_rate
        });
        toast.success('Product created successfully');
      }
      
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData(initialFormData);
      loadProducts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      type: product.type,
      sku: product.sku || '',
      price: product.price,
      currency: product.currency,
      tax_rate: product.tax_rate,
      category: product.category,
      status: product.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productsService.delete(id);
      toast.success('Product deleted successfully');
      loadProducts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const columns = [
    {
      key: 'name',
      label: 'Product/Service',
      render: (value: string, row: any) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{row.description}</p>
        </div>
      ),
    },
    {
      key: 'sku',
      label: 'SKU',
      render: (value: string) => (
        <span className="text-sm text-gray-900">{value || 'N/A'}</span>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: string) => (
        <Badge variant={value === 'product' ? 'default' : 'info'}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      render: (value: number, row: any) => (
        <span className="text-sm font-medium text-gray-900">
          {row.currency} {value.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (value: string) => (
        <span className="text-sm text-gray-600">{value}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'success' : 'default'}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleEdit(row)}>
            <EditIcon className="w-4 h-4" />
          </Button>
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
          <h1 className="text-2xl font-bold text-gray-900">Products & Services</h1>
          <p className="text-gray-500 mt-1">Manage your product and service catalog</p>
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setFormData(initialFormData);
            setIsModalOpen(true);
          }}
          icon={<PlusIcon className="w-4 h-4" />}
        >
          Add Product
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-200">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<SearchIcon className="w-4 h-4" />}
          />
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            icon={<PackageIcon className="w-12 h-12" />}
            title="No products found"
            description={searchQuery ? "No products match your search" : "Add your first product or service to get started"}
            action={!searchQuery ? {
              label: 'Add Your First Product',
              onClick: () => setIsModalOpen(true)
            } : undefined as { label: string; onClick: () => void } | undefined}
          />
        ) : (
          <Table columns={columns} data={filteredProducts} />
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
          setFormData(initialFormData);
        }}
        title={editingProduct ? 'Edit Product/Service' : 'Add New Product/Service'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Web Development"
            />
            <Select
              label="Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'product' | 'service' })}
              options={[
                { value: 'product', label: 'Product' },
                { value: 'service', label: 'Service' },
              ]}
            />
          </div>

          <Textarea
            label="Description"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your product or service"
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="SKU (Optional)"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="e.g., WEB-001"
            />
            <Input
              label="Category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Development"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Price"
              type="number"
              required
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label="Tax Rate (%)"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.tax_rate}
              onChange={(e) => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) || 0 })}
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
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingProduct(null);
                setFormData(initialFormData);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
