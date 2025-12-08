import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { PlusIcon, SearchIcon, UsersIcon, MailIcon, PhoneIcon, BuildingIcon } from 'lucide-react';
import type { Client } from '../types';
export function Clients() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const clients: Client[] = [{
    id: '1',
    name: 'John Smith',
    email: 'john@acmecorp.com',
    phone: '+1 234 567 8900',
    company: 'Acme Corp',
    address: '123 Business St',
    city: 'New York',
    country: 'USA',
    status: 'active',
    totalInvoiced: 45200,
    totalPaid: 42000,
    createdAt: '2024-01-10'
  }, {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@techsolutions.com',
    phone: '+1 234 567 8901',
    company: 'Tech Solutions',
    address: '456 Tech Ave',
    city: 'San Francisco',
    country: 'USA',
    status: 'active',
    totalInvoiced: 28400,
    totalPaid: 28400,
    createdAt: '2024-01-08'
  }];
  const columns = [{
    key: 'name',
    label: 'Client',
    render: (value: string, row: Client) => <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{row.company}</p>
        </div>
  }, {
    key: 'email',
    label: 'Contact',
    render: (value: string, row: Client) => <div>
          <p className="text-sm text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{row.phone}</p>
        </div>
  }, {
    key: 'city',
    label: 'Location',
    render: (value: string, row: Client) => <div>
          <p className="text-sm text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{row.country}</p>
        </div>
  }, {
    key: 'totalInvoiced',
    label: 'Total Invoiced',
    render: (value: number) => <span className="font-medium text-gray-900">
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
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 mt-1">Manage your client database</p>
        </div>
        <Button icon={<PlusIcon className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
          Add Client
        </Button>
      </div>

      <Card padding="none">
        <div className="p-4 border-b border-gray-200">
          <Input placeholder="Search clients by name, email, or company..." icon={<SearchIcon className="w-4 h-4" />} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>

        {clients.length === 0 ? <EmptyState icon={<UsersIcon className="w-8 h-8" />} title="No clients yet" description="Get started by adding your first client to the system" action={{
        label: 'Add Client',
        onClick: () => setIsModalOpen(true)
      }} /> : <Table columns={columns} data={clients} />}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Client" size="lg" footer={<>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button>Save Client</Button>
          </>}>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Full Name" placeholder="John Smith" icon={<UsersIcon className="w-4 h-4" />} />
          <Input label="Email" type="email" placeholder="john@company.com" icon={<MailIcon className="w-4 h-4" />} />
          <Input label="Phone" placeholder="+1 234 567 8900" icon={<PhoneIcon className="w-4 h-4" />} />
          <Input label="Company" placeholder="Acme Corp" icon={<BuildingIcon className="w-4 h-4" />} />
          <Input label="Address" placeholder="123 Business St" className="col-span-2" />
          <Input label="City" placeholder="New York" />
          <Input label="Country" placeholder="USA" />
          <Input label="Tax ID" placeholder="Optional" className="col-span-2" />
        </div>
      </Modal>
    </div>;
}