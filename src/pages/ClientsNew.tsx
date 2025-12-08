import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../contexts/AuthContext';
import { clientsService } from '../services/supabase-client.service';
import { PlusIcon, SearchIcon, UsersIcon, EditIcon, TrashIcon, MailIcon, PhoneIcon } from 'lucide-react';

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  country: string;
  tax_id?: string;
  status: 'active' | 'inactive';
}

const initialFormData: ClientFormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  address: '',
  city: '',
  country: '',
  tax_id: '',
  status: 'active',
};

export function ClientsNew() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (user) {
      loadClients();
    }
  }, [user]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientsService.getAll(user!.id);
      setClients(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingClient) {
        await clientsService.update(editingClient.id, formData);
        toast.success('Client updated successfully');
      } else {
        await clientsService.create(user!.id, formData);
        toast.success('Client created successfully');
      }
      
      setIsModalOpen(false);
      setEditingClient(null);
      setFormData(initialFormData);
      loadClients();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save client');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (client: any) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      address: client.address,
      city: client.city,
      country: client.country,
      tax_id: client.tax_id || '',
      status: client.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;

    try {
      await clientsService.delete(id);
      toast.success('Client deleted successfully');
      loadClients();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete client');
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: 'name',
      label: 'Client',
      render: (value: string, row: any) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{row.company}</p>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Contact',
      render: (value: string, row: any) => (
        <div>
          <p className="text-sm text-gray-900 flex items-center gap-1">
            <MailIcon className="w-3 h-3" />
            {value}
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <PhoneIcon className="w-3 h-3" />
            {row.phone}
          </p>
        </div>
      ),
    },
    {
      key: 'city',
      label: 'Location',
      render: (value: string, row: any) => (
        <span className="text-sm text-gray-900">
          {value}, {row.country}
        </span>
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
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 mt-1">Manage your client database</p>
        </div>
        <Button
          onClick={() => {
            setEditingClient(null);
            setFormData(initialFormData);
            setIsModalOpen(true);
          }}
          icon={<PlusIcon className="w-4 h-4" />}
        >
          Add Client
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-200">
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<SearchIcon className="w-4 h-4" />}
          />
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Loading clients...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <EmptyState
            icon={<UsersIcon className="w-12 h-12" />}
            title="No clients found"
            description={searchQuery ? "No clients match your search" : "Add your first client to get started"}
            action={!searchQuery ? {
              label: 'Add Your First Client',
              onClick: () => setIsModalOpen(true)
            } : undefined}
          />
        ) : (
          <Table columns={columns} data={filteredClients} />
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClient(null);
          setFormData(initialFormData);
        }}
        title={editingClient ? 'Edit Client' : 'Add New Client'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Company"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Phone"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <Input
            label="Address"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            <Input
              label="Country"
              required
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Tax ID (Optional)"
              value={formData.tax_id}
              onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingClient(null);
                setFormData(initialFormData);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : editingClient ? 'Update Client' : 'Create Client'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}



