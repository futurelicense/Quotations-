import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../contexts/AuthContext';
import { settingsService } from '../services/supabase-client.service';
import { BuildingIcon, DollarSignIcon, UsersIcon, BellIcon, CreditCardIcon, SaveIcon } from 'lucide-react';

export function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companySettings, setCompanySettings] = useState({
    company_name: '',
    company_email: '',
    company_phone: '',
    company_website: '',
    company_address: '',
    company_tax_id: '',
    company_registration_number: ''
  });
  const [currencySettings, setCurrencySettings] = useState({
    default_currency: 'USD',
    currency_format: 'symbol'
  });
  const [taxRates, setTaxRates] = useState<any[]>([]);
  const [notifications, setNotifications] = useState({
    newInvoice: true,
    paymentReceived: true,
    overdueInvoices: true,
    newClient: false,
    quoteApproved: true
  });

  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settings = await settingsService.get(user!.id);
      
      if (settings) {
        setCompanySettings({
          company_name: settings.company_name || '',
          company_email: settings.company_email || '',
          company_phone: settings.company_phone || '',
          company_website: settings.company_website || '',
          company_address: settings.company_address || '',
          company_tax_id: settings.company_tax_id || '',
          company_registration_number: settings.company_registration_number || ''
        });
        setCurrencySettings({
          default_currency: settings.default_currency || 'USD',
          currency_format: settings.currency_format || 'symbol'
        });
        setTaxRates(Array.isArray(settings.tax_rates) ? settings.tax_rates : []);
        setNotifications(
          settings.notification_preferences
            ? { ...notifications, ...settings.notification_preferences }
            : notifications
        );
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCompany = async () => {
    setSaving(true);
    try {
      await settingsService.createOrUpdate(user!.id, {
        ...companySettings,
        ...currencySettings,
        tax_rates: taxRates,
        notification_preferences: notifications
      });
      toast.success('Company settings saved successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCurrency = async () => {
    setSaving(true);
    try {
      await settingsService.createOrUpdate(user!.id, {
        ...companySettings,
        ...currencySettings,
        tax_rates: taxRates,
        notification_preferences: notifications
      });
      toast.success('Currency and tax settings saved successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      await settingsService.createOrUpdate(user!.id, {
        ...companySettings,
        ...currencySettings,
        tax_rates: taxRates,
        notification_preferences: notifications
      });
      toast.success('Notification preferences saved successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddTaxRate = () => {
    setTaxRates([...taxRates, {
      id: Date.now().toString(),
      name: 'New Tax',
      rate: 0,
      isDefault: taxRates.length === 0
    }]);
  };

  const handleUpdateTaxRate = (id: string, field: string, value: any) => {
    setTaxRates(taxRates.map(tax =>
      tax.id === id ? { ...tax, [field]: value } : tax
    ));
  };

  const handleDeleteTaxRate = (id: string) => {
    setTaxRates(taxRates.filter(tax => tax.id !== id));
  };

  const handleSetDefaultTax = (id: string) => {
    setTaxRates(taxRates.map(tax => ({
      ...tax,
      isDefault: tax.id === id
    })));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account and application preferences</p>
        </div>
        <div className="p-8 text-center">
          <p className="text-gray-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and application preferences</p>
      </div>

      <Card>
        <Tabs tabs={[
          {
            id: 'company',
            label: 'Company',
            content: (
              <div className="space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                  <div className="w-20 h-20 bg-primary-100 rounded-lg flex items-center justify-center text-primary-400">
                    <BuildingIcon className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Company Logo</h3>
                    <p className="text-sm text-gray-500">Upload your company logo</p>
                    <Button size="sm" variant="outline" className="mt-2">
                      Upload Logo
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Company Name"
                    placeholder="Your Company Inc"
                    value={companySettings.company_name}
                    onChange={e => setCompanySettings({ ...companySettings, company_name: e.target.value })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="contact@company.com"
                    value={companySettings.company_email}
                    onChange={e => setCompanySettings({ ...companySettings, company_email: e.target.value })}
                  />
                  <Input
                    label="Phone"
                    placeholder="+1 234 567 8900"
                    value={companySettings.company_phone}
                    onChange={e => setCompanySettings({ ...companySettings, company_phone: e.target.value })}
                  />
                  <Input
                    label="Website"
                    placeholder="www.company.com"
                    value={companySettings.company_website}
                    onChange={e => setCompanySettings({ ...companySettings, company_website: e.target.value })}
                  />
                </div>
                <Textarea
                  label="Address"
                  placeholder="123 Business Street, City, Country"
                  rows={3}
                  value={companySettings.company_address}
                  onChange={e => setCompanySettings({ ...companySettings, company_address: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Tax ID"
                    placeholder="123-45-6789"
                    value={companySettings.company_tax_id}
                    onChange={e => setCompanySettings({ ...companySettings, company_tax_id: e.target.value })}
                  />
                  <Input
                    label="Registration Number"
                    placeholder="REG-123456"
                    value={companySettings.company_registration_number}
                    onChange={e => setCompanySettings({ ...companySettings, company_registration_number: e.target.value })}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveCompany} disabled={saving} icon={<SaveIcon className="w-4 h-4" />}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            )
          },
          {
            id: 'currency',
            label: 'Currency & Tax',
            content: (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Currency Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="Default Currency"
                      value={currencySettings.default_currency}
                      onChange={e => setCurrencySettings({ ...currencySettings, default_currency: e.target.value })}
                      options={[
                        { value: 'NGN', label: 'NGN - Nigerian Naira' },
                        { value: 'USD', label: 'USD - US Dollar' },
                        { value: 'EUR', label: 'EUR - Euro' },
                        { value: 'GBP', label: 'GBP - British Pound' }
                      ]}
                    />
                    <Select
                      label="Currency Format"
                      value={currencySettings.currency_format}
                      onChange={e => setCurrencySettings({ ...currencySettings, currency_format: e.target.value })}
                      options={[
                        { value: 'symbol', label: '₦1,234.56' },
                        { value: 'code', label: 'NGN 1,234.56' }
                      ]}
                    />
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Tax Settings</h3>
                  <div className="space-y-4">
                    {taxRates.map(tax => (
                      <div key={tax.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <Input
                            label="Tax Name"
                            value={tax.name}
                            onChange={e => handleUpdateTaxRate(tax.id, 'name', e.target.value)}
                          />
                          <Input
                            label="Rate (%)"
                            type="number"
                            value={tax.rate}
                            onChange={e => handleUpdateTaxRate(tax.id, 'rate', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          {tax.isDefault && (
                            <Badge variant="success" size="sm">Default</Badge>
                          )}
                          {!tax.isDefault && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSetDefaultTax(tax.id)}
                            >
                              Set Default
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteTaxRate(tax.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" fullWidth onClick={handleAddTaxRate}>
                      Add Tax Rate
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveCurrency} disabled={saving} icon={<SaveIcon className="w-4 h-4" />}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            )
          },
          {
            id: 'notifications',
            label: 'Notifications',
            content: (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Email Notifications</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'newInvoice', label: 'New Invoice Created', desc: 'Get notified when a new invoice is created' },
                      { key: 'paymentReceived', label: 'Payment Received', desc: 'Get notified when a payment is received' },
                      { key: 'overdueInvoices', label: 'Overdue Invoices', desc: 'Get notified about overdue invoices' },
                      { key: 'newClient', label: 'New Client Added', desc: 'Get notified when a new client is added' },
                      { key: 'quoteApproved', label: 'Quote Approved', desc: 'Get notified when a quotation is approved' }
                    ].map(notif => (
                      <label
                        key={notif.key}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <BellIcon className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{notif.label}</p>
                            <p className="text-sm text-gray-500">{notif.desc}</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-primary-400 border-gray-300 rounded"
                          checked={notifications[notif.key as keyof typeof notifications]}
                          onChange={e => setNotifications({
                            ...notifications,
                            [notif.key]: e.target.checked
                          })}
                        />
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveNotifications} disabled={saving} icon={<SaveIcon className="w-4 h-4" />}>
                    {saving ? 'Saving...' : 'Save Preferences'}
                  </Button>
                </div>
              </div>
            )
          }
        ]} />
      </Card>
    </div>
  );
}
