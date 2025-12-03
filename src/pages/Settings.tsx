import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { BuildingIcon, DollarSignIcon, UsersIcon, BellIcon, CreditCardIcon, ShieldIcon } from 'lucide-react';
export function Settings() {
  // Company Settings State
  const [companySettings, setCompanySettings] = useState({
    name: 'Your Company Inc',
    email: 'contact@company.com',
    phone: '+1 234 567 8900',
    website: 'www.company.com',
    address: '123 Business Street, City, Country',
    taxId: '123-45-6789',
    registrationNumber: 'REG-123456'
  });
  // Currency & Tax Settings State
  const [currencySettings, setCurrencySettings] = useState({
    defaultCurrency: 'NGN',
    currencyFormat: 'symbol'
  });
  const [taxRates, setTaxRates] = useState([{
    id: '1',
    name: 'VAT',
    rate: 10,
    isDefault: true
  }, {
    id: '2',
    name: 'Sales Tax',
    rate: 5,
    isDefault: false
  }]);
  // Notification Settings State
  const [notifications, setNotifications] = useState({
    newInvoice: true,
    paymentReceived: true,
    overdueInvoices: true,
    newClient: false,
    quoteApproved: true
  });
  const handleSaveCompany = () => {
    console.log('Saving company settings:', companySettings);
    alert('Company settings saved successfully!');
  };
  const handleSaveCurrency = () => {
    console.log('Saving currency settings:', currencySettings, taxRates);
    alert('Currency and tax settings saved successfully!');
  };
  const handleSaveNotifications = () => {
    console.log('Saving notification settings:', notifications);
    alert('Notification preferences saved successfully!');
  };
  return <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your account and application preferences
        </p>
      </div>

      <Card>
        <Tabs tabs={[{
        id: 'company',
        label: 'Company',
        content: <div className="space-y-6">
                  <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                    <div className="w-20 h-20 bg-primary-100 rounded-lg flex items-center justify-center text-primary-400">
                      <BuildingIcon className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Company Logo
                      </h3>
                      <p className="text-sm text-gray-500">
                        Upload your company logo
                      </p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Upload Logo
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Company Name" placeholder="Your Company Inc" value={companySettings.name} onChange={e => setCompanySettings({
              ...companySettings,
              name: e.target.value
            })} />
                    <Input label="Email" type="email" placeholder="contact@company.com" value={companySettings.email} onChange={e => setCompanySettings({
              ...companySettings,
              email: e.target.value
            })} />
                    <Input label="Phone" placeholder="+1 234 567 8900" value={companySettings.phone} onChange={e => setCompanySettings({
              ...companySettings,
              phone: e.target.value
            })} />
                    <Input label="Website" placeholder="www.company.com" value={companySettings.website} onChange={e => setCompanySettings({
              ...companySettings,
              website: e.target.value
            })} />
                  </div>
                  <Textarea label="Address" placeholder="123 Business Street, City, Country" rows={3} value={companySettings.address} onChange={e => setCompanySettings({
            ...companySettings,
            address: e.target.value
          })} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Tax ID" placeholder="123-45-6789" value={companySettings.taxId} onChange={e => setCompanySettings({
              ...companySettings,
              taxId: e.target.value
            })} />
                    <Input label="Registration Number" placeholder="REG-123456" value={companySettings.registrationNumber} onChange={e => setCompanySettings({
              ...companySettings,
              registrationNumber: e.target.value
            })} />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSaveCompany}>Save Changes</Button>
                  </div>
                </div>
      }, {
        id: 'currency',
        label: 'Currency & Tax',
        content: <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Currency Settings
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Select label="Default Currency" options={[{
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
              }]} value={currencySettings.defaultCurrency} onChange={e => setCurrencySettings({
                ...currencySettings,
                defaultCurrency: e.target.value
              })} />
                      <Select label="Currency Format" options={[{
                value: 'symbol',
                label: '₦1,234.56'
              }, {
                value: 'code',
                label: 'NGN 1,234.56'
              }]} value={currencySettings.currencyFormat} onChange={e => setCurrencySettings({
                ...currencySettings,
                currencyFormat: e.target.value
              })} />
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Tax Settings
                    </h3>
                    <div className="space-y-4">
                      {taxRates.map(tax => <div key={tax.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">
                              {tax.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Standard rate: {tax.rate}%
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            {tax.isDefault && <Badge variant="success" size="sm">
                                Default
                              </Badge>}
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </div>
                        </div>)}
                      <Button variant="outline" fullWidth>
                        Add Tax Rate
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSaveCurrency}>Save Changes</Button>
                  </div>
                </div>
      }, {
        id: 'team',
        label: 'Team',
        content: <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Team Members
                      </h3>
                      <p className="text-sm text-gray-500">
                        Manage users and their permissions
                      </p>
                    </div>
                    <Button>Invite Member</Button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-400">
                          <UsersIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Admin User
                          </p>
                          <p className="text-sm text-gray-500">
                            admin@company.com
                          </p>
                        </div>
                      </div>
                      <Badge variant="success">Admin</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                          <UsersIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Manager User
                          </p>
                          <p className="text-sm text-gray-500">
                            manager@company.com
                          </p>
                        </div>
                      </div>
                      <Badge variant="info">Manager</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                          <UsersIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Staff User
                          </p>
                          <p className="text-sm text-gray-500">
                            staff@company.com
                          </p>
                        </div>
                      </div>
                      <Badge>Staff</Badge>
                    </div>
                  </div>
                </div>
      }, {
        id: 'integrations',
        label: 'Integrations',
        content: <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Payment Gateways
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <CreditCardIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Stripe</p>
                            <p className="text-sm text-gray-500">
                              Accept payments via Stripe
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="success">Connected</Badge>
                          <Button size="sm" variant="outline">
                            Configure
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <CreditCardIcon className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Paystack
                            </p>
                            <p className="text-sm text-gray-500">
                              Accept payments via Paystack
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="success">Connected</Badge>
                          <Button size="sm" variant="outline">
                            Configure
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <CreditCardIcon className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Flutterwave
                            </p>
                            <p className="text-sm text-gray-500">
                              Accept payments via Flutterwave
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Connect
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
      }, {
        id: 'notifications',
        label: 'Notifications',
        content: <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Email Notifications
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                        <div className="flex items-center gap-3">
                          <BellIcon className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">
                              New Invoice Created
                            </p>
                            <p className="text-sm text-gray-500">
                              Get notified when a new invoice is created
                            </p>
                          </div>
                        </div>
                        <input type="checkbox" className="w-5 h-5 text-primary-400 border-gray-300 rounded" checked={notifications.newInvoice} onChange={e => setNotifications({
                  ...notifications,
                  newInvoice: e.target.checked
                })} />
                      </label>
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                        <div className="flex items-center gap-3">
                          <BellIcon className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Payment Received
                            </p>
                            <p className="text-sm text-gray-500">
                              Get notified when a payment is received
                            </p>
                          </div>
                        </div>
                        <input type="checkbox" className="w-5 h-5 text-primary-400 border-gray-300 rounded" checked={notifications.paymentReceived} onChange={e => setNotifications({
                  ...notifications,
                  paymentReceived: e.target.checked
                })} />
                      </label>
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                        <div className="flex items-center gap-3">
                          <BellIcon className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Overdue Invoices
                            </p>
                            <p className="text-sm text-gray-500">
                              Get notified about overdue invoices
                            </p>
                          </div>
                        </div>
                        <input type="checkbox" className="w-5 h-5 text-primary-400 border-gray-300 rounded" checked={notifications.overdueInvoices} onChange={e => setNotifications({
                  ...notifications,
                  overdueInvoices: e.target.checked
                })} />
                      </label>
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                        <div className="flex items-center gap-3">
                          <BellIcon className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">
                              New Client Added
                            </p>
                            <p className="text-sm text-gray-500">
                              Get notified when a new client is added
                            </p>
                          </div>
                        </div>
                        <input type="checkbox" className="w-5 h-5 text-primary-400 border-gray-300 rounded" checked={notifications.newClient} onChange={e => setNotifications({
                  ...notifications,
                  newClient: e.target.checked
                })} />
                      </label>
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                        <div className="flex items-center gap-3">
                          <BellIcon className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Quote Approved
                            </p>
                            <p className="text-sm text-gray-500">
                              Get notified when a quotation is approved
                            </p>
                          </div>
                        </div>
                        <input type="checkbox" className="w-5 h-5 text-primary-400 border-gray-300 rounded" checked={notifications.quoteApproved} onChange={e => setNotifications({
                  ...notifications,
                  quoteApproved: e.target.checked
                })} />
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSaveNotifications}>
                      Save Preferences
                    </Button>
                  </div>
                </div>
      }]} />
      </Card>
    </div>;
}