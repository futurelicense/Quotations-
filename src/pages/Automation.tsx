import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Textarea } from '../components/ui/Textarea';
import { PlusIcon, ZapIcon, BellIcon, RepeatIcon, MailIcon, ClockIcon } from 'lucide-react';
export function Automation() {
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
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
  const recurringInvoices = [{
    id: '1',
    client: 'Acme Corp',
    amount: 500,
    frequency: 'monthly',
    nextDate: '2024-02-01',
    status: 'active'
  }, {
    id: '2',
    client: 'Tech Solutions',
    amount: 1200,
    frequency: 'quarterly',
    nextDate: '2024-03-15',
    status: 'active'
  }];
  const reminders = [{
    id: '1',
    type: 'Payment Due',
    trigger: '3 days before due date',
    status: 'active'
  }, {
    id: '2',
    type: 'Overdue Payment',
    trigger: '1 day after due date',
    status: 'active'
  }, {
    id: '3',
    type: 'Quote Follow-up',
    trigger: '7 days after sending',
    status: 'active'
  }];
  const workflows = [{
    id: '1',
    name: 'New Client Onboarding',
    trigger: 'Client created',
    actions: 'Send welcome email, Create folder',
    status: 'active'
  }, {
    id: '2',
    name: 'Invoice Payment Received',
    trigger: 'Payment completed',
    actions: 'Send receipt, Update records',
    status: 'active'
  }];
  const handleCreateRecurring = () => {
    console.log('Creating recurring invoice:', recurringForm);
    setIsRecurringModalOpen(false);
    alert('Recurring invoice created successfully!');
    setRecurringForm({
      clientId: '',
      amount: '',
      frequency: 'monthly',
      startDate: '',
      description: ''
    });
  };
  const handleCreateReminder = () => {
    console.log('Creating reminder:', reminderForm);
    setIsReminderModalOpen(false);
    alert('Reminder created successfully!');
    setReminderForm({
      type: 'payment_due',
      trigger: '3',
      triggerUnit: 'days',
      triggerTiming: 'before',
      emailSubject: '',
      emailBody: ''
    });
  };
  const handleCreateWorkflow = () => {
    console.log('Creating workflow:', workflowForm);
    setIsWorkflowModalOpen(false);
    alert('Workflow created successfully!');
    setWorkflowForm({
      name: '',
      trigger: 'client_created',
      actions: []
    });
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automation</h1>
          <p className="text-gray-500 mt-1">
            Automate recurring tasks and workflows
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Active Automations</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
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
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-500">
              <RepeatIcon className="w-6 h-6" />
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Reminders Sent</p>
              <p className="text-2xl font-bold text-gray-900">142</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-green-500">
              <BellIcon className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <Tabs tabs={[{
        id: 'recurring',
        label: 'Recurring Invoices',
        content: <div className="space-y-4">
                  {recurringInvoices.map(invoice => <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary-100 rounded-lg text-primary-400">
                          <RepeatIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {invoice.client}
                          </p>
                          <p className="text-sm text-gray-500">
                            ₦{invoice.amount} · {invoice.frequency}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Next invoice</p>
                          <p className="font-medium text-gray-900">
                            {invoice.nextDate}
                          </p>
                        </div>
                        <Badge variant="success">{invoice.status}</Badge>
                      </div>
                    </div>)}
                  <Button variant="outline" fullWidth icon={<PlusIcon className="w-4 h-4" />} onClick={() => setIsRecurringModalOpen(true)}>
                    Add Recurring Invoice
                  </Button>
                </div>
      }, {
        id: 'reminders',
        label: 'Reminders',
        content: <div className="space-y-4">
                  {reminders.map(reminder => <div key={reminder.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg text-blue-500">
                          <BellIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {reminder.type}
                          </p>
                          <p className="text-sm text-gray-500">
                            {reminder.trigger}
                          </p>
                        </div>
                      </div>
                      <Badge variant="success">{reminder.status}</Badge>
                    </div>)}
                  <Button variant="outline" fullWidth icon={<PlusIcon className="w-4 h-4" />} onClick={() => setIsReminderModalOpen(true)}>
                    Add Reminder
                  </Button>
                </div>
      }, {
        id: 'workflows',
        label: 'Workflows',
        content: <div className="space-y-4">
                  {workflows.map(workflow => <div key={workflow.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-lg text-green-500">
                          <ZapIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {workflow.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Trigger: {workflow.trigger}
                          </p>
                          <p className="text-sm text-gray-500">
                            Actions: {workflow.actions}
                          </p>
                        </div>
                      </div>
                      <Badge variant="success">{workflow.status}</Badge>
                    </div>)}
                  <Button variant="outline" fullWidth icon={<PlusIcon className="w-4 h-4" />} onClick={() => setIsWorkflowModalOpen(true)}>
                    Create Workflow
                  </Button>
                </div>
      }]} />
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Email Templates
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <MailIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Invoice Sent</p>
                <p className="text-sm text-gray-500">
                  Sent when invoice is created
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              Edit
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <MailIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Payment Reminder</p>
                <p className="text-sm text-gray-500">Sent before due date</p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              Edit
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <MailIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Payment Received</p>
                <p className="text-sm text-gray-500">
                  Sent when payment is completed
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              Edit
            </Button>
          </div>
        </div>
      </Card>

      {/* Recurring Invoice Modal */}
      <Modal isOpen={isRecurringModalOpen} onClose={() => setIsRecurringModalOpen(false)} title="Create Recurring Invoice" size="md" footer={<>
            <Button variant="ghost" onClick={() => setIsRecurringModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRecurring}>Create</Button>
          </>}>
        <div className="space-y-4">
          <Select label="Client" options={[{
          value: '',
          label: 'Select a client'
        }, {
          value: '1',
          label: 'Acme Corp'
        }, {
          value: '2',
          label: 'Tech Solutions'
        }]} value={recurringForm.clientId} onChange={e => setRecurringForm({
          ...recurringForm,
          clientId: e.target.value
        })} />
          <Input label="Amount (₦)" type="number" placeholder="5000" value={recurringForm.amount} onChange={e => setRecurringForm({
          ...recurringForm,
          amount: e.target.value
        })} />
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
        }]} value={recurringForm.frequency} onChange={e => setRecurringForm({
          ...recurringForm,
          frequency: e.target.value
        })} />
          <Input label="Start Date" type="date" value={recurringForm.startDate} onChange={e => setRecurringForm({
          ...recurringForm,
          startDate: e.target.value
        })} />
          <Textarea label="Description" placeholder="Monthly subscription fee..." rows={3} value={recurringForm.description} onChange={e => setRecurringForm({
          ...recurringForm,
          description: e.target.value
        })} />
        </div>
      </Modal>

      {/* Reminder Modal */}
      <Modal isOpen={isReminderModalOpen} onClose={() => setIsReminderModalOpen(false)} title="Create Reminder" size="md" footer={<>
            <Button variant="ghost" onClick={() => setIsReminderModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateReminder}>Create</Button>
          </>}>
        <div className="space-y-4">
          <Select label="Reminder Type" options={[{
          value: 'payment_due',
          label: 'Payment Due'
        }, {
          value: 'payment_overdue',
          label: 'Payment Overdue'
        }, {
          value: 'quote_followup',
          label: 'Quote Follow-up'
        }]} value={reminderForm.type} onChange={e => setReminderForm({
          ...reminderForm,
          type: e.target.value
        })} />
          <div className="grid grid-cols-3 gap-3">
            <Input label="Trigger" type="number" placeholder="3" value={reminderForm.trigger} onChange={e => setReminderForm({
            ...reminderForm,
            trigger: e.target.value
          })} />
            <Select label="Unit" options={[{
            value: 'days',
            label: 'Days'
          }, {
            value: 'weeks',
            label: 'Weeks'
          }, {
            value: 'months',
            label: 'Months'
          }]} value={reminderForm.triggerUnit} onChange={e => setReminderForm({
            ...reminderForm,
            triggerUnit: e.target.value
          })} />
            <Select label="Timing" options={[{
            value: 'before',
            label: 'Before'
          }, {
            value: 'after',
            label: 'After'
          }]} value={reminderForm.triggerTiming} onChange={e => setReminderForm({
            ...reminderForm,
            triggerTiming: e.target.value
          })} />
          </div>
          <Input label="Email Subject" placeholder="Payment reminder for Invoice #..." value={reminderForm.emailSubject} onChange={e => setReminderForm({
          ...reminderForm,
          emailSubject: e.target.value
        })} />
          <Textarea label="Email Body" placeholder="Dear client, this is a reminder..." rows={4} value={reminderForm.emailBody} onChange={e => setReminderForm({
          ...reminderForm,
          emailBody: e.target.value
        })} />
        </div>
      </Modal>

      {/* Workflow Modal */}
      <Modal isOpen={isWorkflowModalOpen} onClose={() => setIsWorkflowModalOpen(false)} title="Create Workflow" size="md" footer={<>
            <Button variant="ghost" onClick={() => setIsWorkflowModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWorkflow}>Create</Button>
          </>}>
        <div className="space-y-4">
          <Input label="Workflow Name" placeholder="New Client Onboarding" value={workflowForm.name} onChange={e => setWorkflowForm({
          ...workflowForm,
          name: e.target.value
        })} />
          <Select label="Trigger Event" options={[{
          value: 'client_created',
          label: 'Client Created'
        }, {
          value: 'invoice_sent',
          label: 'Invoice Sent'
        }, {
          value: 'payment_received',
          label: 'Payment Received'
        }, {
          value: 'quote_approved',
          label: 'Quote Approved'
        }]} value={workflowForm.trigger} onChange={e => setWorkflowForm({
          ...workflowForm,
          trigger: e.target.value
        })} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actions
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-primary-400 border-gray-300 rounded" />
                <span className="text-sm text-gray-700">
                  Send email notification
                </span>
              </label>
              <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-primary-400 border-gray-300 rounded" />
                <span className="text-sm text-gray-700">Create folder</span>
              </label>
              <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-primary-400 border-gray-300 rounded" />
                <span className="text-sm text-gray-700">Update CRM</span>
              </label>
              <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-primary-400 border-gray-300 rounded" />
                <span className="text-sm text-gray-700">Send SMS</span>
              </label>
            </div>
          </div>
        </div>
      </Modal>
    </div>;
}