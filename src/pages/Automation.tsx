import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Textarea } from '../components/ui/Textarea';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../contexts/AuthContext';
import { automationsService, clientsService } from '../services/supabase-client.service';
import { PlusIcon, ZapIcon, BellIcon, RepeatIcon, TrashIcon, SaveIcon } from 'lucide-react';

export function Automation() {
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [automations, setAutomations] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  // const [editingAutomation, setEditingAutomation] = useState<any>(null);
  const [recurringForm, setRecurringForm] = useState({
    clientId: '',
    amount: '',
    frequency: 'monthly',
    startDate: '',
    description: ''
  });
  const [reminderForm, setReminderForm] = useState({
    type: 'payment_due',
    trigger: '3',
    triggerUnit: 'days',
    triggerTiming: 'before',
    emailSubject: '',
    emailBody: ''
  });
  const [workflowForm, setWorkflowForm] = useState({
    name: '',
    trigger: 'client_created',
    actions: [] as string[]
  });

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
      const [automationsData, clientsData] = await Promise.all([
        automationsService.getAll(user!.id),
        clientsService.getAll(user!.id),
      ]);
      setAutomations(automationsData || []);
      setClients(clientsData || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const recurringInvoices = automations.filter(a => a.type === 'recurring_invoice');
  const reminders = automations.filter(a => a.type === 'reminder');
  const workflows = automations.filter(a => a.type === 'workflow');

  const handleCreateRecurring = async () => {
    if (!recurringForm.clientId || !recurringForm.amount || !recurringForm.startDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const config = {
        client_id: recurringForm.clientId,
        amount: parseFloat(recurringForm.amount),
        frequency: recurringForm.frequency,
        start_date: recurringForm.startDate,
        description: recurringForm.description,
      };

      const automationData = {
        type: 'recurring_invoice',
        name: `Recurring Invoice - ${clients.find(c => c.id === recurringForm.clientId)?.name || 'Client'}`,
        status: 'active',
        config,
      };

      await automationsService.create(user!.id, automationData);
      toast.success('Recurring invoice created successfully!');
      setIsRecurringModalOpen(false);
      resetRecurringForm();
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create recurring invoice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateReminder = async () => {
    if (!reminderForm.emailSubject || !reminderForm.emailBody) {
      toast.error('Please fill in email subject and body');
      return;
    }

    setSubmitting(true);
    try {
      const config = {
        type: reminderForm.type,
        trigger: parseInt(reminderForm.trigger),
        trigger_unit: reminderForm.triggerUnit,
        trigger_timing: reminderForm.triggerTiming,
        email_subject: reminderForm.emailSubject,
        email_body: reminderForm.emailBody,
      };

      const automationData = {
        type: 'reminder',
        name: `${reminderForm.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Reminder`,
        status: 'active',
        config,
      };

      await automationsService.create(user!.id, automationData);
      toast.success('Reminder created successfully!');
      setIsReminderModalOpen(false);
      resetReminderForm();
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create reminder');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateWorkflow = async () => {
    if (!workflowForm.name || workflowForm.actions.length === 0) {
      toast.error('Please enter workflow name and select at least one action');
      return;
    }

    setSubmitting(true);
    try {
      const config = {
        trigger: workflowForm.trigger,
        actions: workflowForm.actions,
      };

      const automationData = {
        type: 'workflow',
        name: workflowForm.name,
        status: 'active',
        config,
      };

      await automationsService.create(user!.id, automationData);
      toast.success('Workflow created successfully!');
      setIsWorkflowModalOpen(false);
      resetWorkflowForm();
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create workflow');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this automation?')) return;

    try {
      await automationsService.delete(id);
      toast.success('Automation deleted successfully');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete automation');
    }
  };

  const handleToggleStatus = async (automation: any) => {
    try {
      const newStatus = automation.status === 'active' ? 'inactive' : 'active';
      await automationsService.update(automation.id, { status: newStatus });
      toast.success(`Automation ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update automation');
    }
  };

  const resetRecurringForm = () => {
    setRecurringForm({
      clientId: '',
      amount: '',
      frequency: 'monthly',
      startDate: '',
      description: ''
    });
  };

  const resetReminderForm = () => {
    setReminderForm({
      type: 'payment_due',
      trigger: '3',
      triggerUnit: 'days',
      triggerTiming: 'before',
      emailSubject: '',
      emailBody: ''
    });
  };

  const resetWorkflowForm = () => {
    setWorkflowForm({
      name: '',
      trigger: 'client_created',
      actions: []
    });
  };

  const formatTrigger = (automation: any) => {
    if (automation.type === 'reminder') {
      const config = automation.config || {};
      return `${config.trigger || 3} ${config.trigger_unit || 'days'} ${config.trigger_timing || 'before'}`;
    }
    return 'N/A';
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Unknown Client';
  };

  const toggleWorkflowAction = (action: string) => {
    setWorkflowForm(prev => ({
      ...prev,
      actions: prev.actions.includes(action)
        ? prev.actions.filter(a => a !== action)
        : [...prev.actions, action]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automation</h1>
          <p className="text-gray-500 mt-1">Automate recurring tasks and workflows</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Active Automations</p>
              <p className="text-2xl font-bold text-gray-900">{automations.filter(a => a.status === 'active').length}</p>
            </div>
            <div className="p-3 bg-primary-50 rounded-lg text-primary-400">
              <ZapIcon className="w-6 h-6" />
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Recurring Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{recurringInvoices.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-500">
              <RepeatIcon className="w-6 h-6" />
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Reminders</p>
              <p className="text-2xl font-bold text-gray-900">{reminders.length}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-green-500">
              <BellIcon className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <Tabs tabs={[
          {
            id: 'recurring',
            label: 'Recurring Invoices',
            content: (
              <div className="space-y-4">
                {loading ? (
                  <p className="text-gray-500 text-center py-8">Loading...</p>
                ) : recurringInvoices.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No recurring invoices yet</p>
                ) : (
                  recurringInvoices.map(automation => {
                    const config = automation.config || {};
                    return (
                      <div key={automation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-primary-100 rounded-lg text-primary-400">
                            <RepeatIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{getClientName(config.client_id)}</p>
                            <p className="text-sm text-gray-500">
                              ₦{config.amount?.toLocaleString() || 0} · {config.frequency || 'monthly'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Next invoice</p>
                            <p className="font-medium text-gray-900">{config.start_date || 'N/A'}</p>
                          </div>
                          <Badge variant={automation.status === 'active' ? 'success' : 'default'}>
                            {automation.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleStatus(automation)}
                          >
                            {automation.status === 'active' ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(automation.id)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
                <Button
                  variant="outline"
                  fullWidth
                  icon={<PlusIcon className="w-4 h-4" />}
                  onClick={() => {
                    resetRecurringForm();
                    setIsRecurringModalOpen(true);
                  }}
                >
                  Add Recurring Invoice
                </Button>
              </div>
            )
          },
          {
            id: 'reminders',
            label: 'Reminders',
            content: (
              <div className="space-y-4">
                {loading ? (
                  <p className="text-gray-500 text-center py-8">Loading...</p>
                ) : reminders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No reminders yet</p>
                ) : (
                  reminders.map(automation => {
                    const config = automation.config || {};
                    return (
                      <div key={automation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-100 rounded-lg text-blue-500">
                            <BellIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {config.type?.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Reminder'}
                            </p>
                            <p className="text-sm text-gray-500">{formatTrigger(automation)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={automation.status === 'active' ? 'success' : 'default'}>
                            {automation.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleStatus(automation)}
                          >
                            {automation.status === 'active' ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(automation.id)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
                <Button
                  variant="outline"
                  fullWidth
                  icon={<PlusIcon className="w-4 h-4" />}
                  onClick={() => {
                    resetReminderForm();
                    setIsReminderModalOpen(true);
                  }}
                >
                  Add Reminder
                </Button>
              </div>
            )
          },
          {
            id: 'workflows',
            label: 'Workflows',
            content: (
              <div className="space-y-4">
                {loading ? (
                  <p className="text-gray-500 text-center py-8">Loading...</p>
                ) : workflows.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No workflows yet</p>
                ) : (
                  workflows.map(automation => {
                    const config = automation.config || {};
                    return (
                      <div key={automation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-green-100 rounded-lg text-green-500">
                            <ZapIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{automation.name}</p>
                            <p className="text-sm text-gray-500">Trigger: {config.trigger?.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'N/A'}</p>
                            <p className="text-sm text-gray-500">Actions: {Array.isArray(config.actions) ? config.actions.join(', ') : 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={automation.status === 'active' ? 'success' : 'default'}>
                            {automation.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleStatus(automation)}
                          >
                            {automation.status === 'active' ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(automation.id)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
                <Button
                  variant="outline"
                  fullWidth
                  icon={<PlusIcon className="w-4 h-4" />}
                  onClick={() => {
                    resetWorkflowForm();
                    setIsWorkflowModalOpen(true);
                  }}
                >
                  Create Workflow
                </Button>
              </div>
            )
          }
        ]} />
      </Card>

      {/* Recurring Invoice Modal */}
      <Modal
        isOpen={isRecurringModalOpen}
        onClose={() => {
          setIsRecurringModalOpen(false);
          resetRecurringForm();
        }}
        title="Create Recurring Invoice"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => {
              setIsRecurringModalOpen(false);
              resetRecurringForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleCreateRecurring} disabled={submitting} icon={<SaveIcon className="w-4 h-4" />}>
              {submitting ? 'Creating...' : 'Create'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Client"
            required
            value={recurringForm.clientId}
            onChange={e => setRecurringForm({ ...recurringForm, clientId: e.target.value })}
            options={[
              { value: '', label: 'Select a client' },
              ...clients.map(c => ({ value: c.id, label: `${c.name} - ${c.company}` }))
            ]}
          />
          <Input
            label="Amount (₦)"
            type="number"
            placeholder="5000"
            required
            value={recurringForm.amount}
            onChange={e => setRecurringForm({ ...recurringForm, amount: e.target.value })}
          />
          <Select
            label="Frequency"
            value={recurringForm.frequency}
            onChange={e => setRecurringForm({ ...recurringForm, frequency: e.target.value })}
            options={[
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'quarterly', label: 'Quarterly' },
              { value: 'yearly', label: 'Yearly' }
            ]}
          />
          <Input
            label="Start Date"
            type="date"
            required
            value={recurringForm.startDate}
            onChange={e => setRecurringForm({ ...recurringForm, startDate: e.target.value })}
          />
          <Textarea
            label="Description"
            placeholder="Monthly subscription fee..."
            rows={3}
            value={recurringForm.description}
            onChange={e => setRecurringForm({ ...recurringForm, description: e.target.value })}
          />
        </div>
      </Modal>

      {/* Reminder Modal */}
      <Modal
        isOpen={isReminderModalOpen}
        onClose={() => {
          setIsReminderModalOpen(false);
          resetReminderForm();
        }}
        title="Create Reminder"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => {
              setIsReminderModalOpen(false);
              resetReminderForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleCreateReminder} disabled={submitting} icon={<SaveIcon className="w-4 h-4" />}>
              {submitting ? 'Creating...' : 'Create'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Reminder Type"
            value={reminderForm.type}
            onChange={e => setReminderForm({ ...reminderForm, type: e.target.value })}
            options={[
              { value: 'payment_due', label: 'Payment Due' },
              { value: 'payment_overdue', label: 'Payment Overdue' },
              { value: 'quote_followup', label: 'Quote Follow-up' }
            ]}
          />
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Trigger"
              type="number"
              placeholder="3"
              value={reminderForm.trigger}
              onChange={e => setReminderForm({ ...reminderForm, trigger: e.target.value })}
            />
            <Select
              label="Unit"
              value={reminderForm.triggerUnit}
              onChange={e => setReminderForm({ ...reminderForm, triggerUnit: e.target.value })}
              options={[
                { value: 'days', label: 'Days' },
                { value: 'weeks', label: 'Weeks' },
                { value: 'months', label: 'Months' }
              ]}
            />
            <Select
              label="Timing"
              value={reminderForm.triggerTiming}
              onChange={e => setReminderForm({ ...reminderForm, triggerTiming: e.target.value })}
              options={[
                { value: 'before', label: 'Before' },
                { value: 'after', label: 'After' }
              ]}
            />
          </div>
          <Input
            label="Email Subject"
            placeholder="Payment reminder for Invoice #..."
            required
            value={reminderForm.emailSubject}
            onChange={e => setReminderForm({ ...reminderForm, emailSubject: e.target.value })}
          />
          <Textarea
            label="Email Body"
            placeholder="Dear client, this is a reminder..."
            rows={4}
            required
            value={reminderForm.emailBody}
            onChange={e => setReminderForm({ ...reminderForm, emailBody: e.target.value })}
          />
        </div>
      </Modal>

      {/* Workflow Modal */}
      <Modal
        isOpen={isWorkflowModalOpen}
        onClose={() => {
          setIsWorkflowModalOpen(false);
          resetWorkflowForm();
        }}
        title="Create Workflow"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => {
              setIsWorkflowModalOpen(false);
              resetWorkflowForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleCreateWorkflow} disabled={submitting} icon={<SaveIcon className="w-4 h-4" />}>
              {submitting ? 'Creating...' : 'Create'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Workflow Name"
            placeholder="New Client Onboarding"
            required
            value={workflowForm.name}
            onChange={e => setWorkflowForm({ ...workflowForm, name: e.target.value })}
          />
          <Select
            label="Trigger Event"
            value={workflowForm.trigger}
            onChange={e => setWorkflowForm({ ...workflowForm, trigger: e.target.value })}
            options={[
              { value: 'client_created', label: 'Client Created' },
              { value: 'invoice_sent', label: 'Invoice Sent' },
              { value: 'payment_received', label: 'Payment Received' },
              { value: 'quote_approved', label: 'Quote Approved' }
            ]}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Actions</label>
            <div className="space-y-2">
              {['send_email', 'create_folder', 'update_crm', 'send_sms'].map(action => (
                <label key={action} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary-400 border-gray-300 rounded"
                    checked={workflowForm.actions.includes(action)}
                    onChange={() => toggleWorkflowAction(action)}
                  />
                  <span className="text-sm text-gray-700">
                    {action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
