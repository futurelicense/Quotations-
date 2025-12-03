import React from 'react';
import { LayoutDashboardIcon, UsersIcon, PackageIcon, FileTextIcon, ReceiptIcon, CreditCardIcon, FileIcon, SettingsIcon, BarChart3Icon, ZapIcon, LogOutIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}
const navItems: NavItem[] = [{
  label: 'Dashboard',
  icon: <LayoutDashboardIcon className="w-5 h-5" />,
  path: '/'
}, {
  label: 'Clients',
  icon: <UsersIcon className="w-5 h-5" />,
  path: '/clients'
}, {
  label: 'Products',
  icon: <PackageIcon className="w-5 h-5" />,
  path: '/products'
}, {
  label: 'Quotations',
  icon: <FileTextIcon className="w-5 h-5" />,
  path: '/quotations'
}, {
  label: 'Invoices',
  icon: <ReceiptIcon className="w-5 h-5" />,
  path: '/invoices'
}, {
  label: 'Payments',
  icon: <CreditCardIcon className="w-5 h-5" />,
  path: '/payments'
}, {
  label: 'Templates',
  icon: <FileIcon className="w-5 h-5" />,
  path: '/templates'
}, {
  label: 'Analytics',
  icon: <BarChart3Icon className="w-5 h-5" />,
  path: '/analytics'
}, {
  label: 'Automation',
  icon: <ZapIcon className="w-5 h-5" />,
  path: '/automation'
}, {
  label: 'Settings',
  icon: <SettingsIcon className="w-5 h-5" />,
  path: '/settings'
}];
export function Sidebar() {
  const location = useLocation();
  return <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary-400">InvoicePro</h1>
        <p className="text-xs text-gray-500 mt-1">Quotation & Invoicing</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navItems.map(item => {
        const isActive = location.pathname === item.path;
        return <Link key={item.path} to={item.path} className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors
                ${isActive ? 'bg-primary-50 text-primary-400 font-medium' : 'text-gray-700 hover:bg-gray-50'}
              `}>
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </Link>;
      })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors w-full">
          <LogOutIcon className="w-5 h-5" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>;
}