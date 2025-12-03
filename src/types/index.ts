export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  avatar?: string;
  createdAt: string;
}
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  country: string;
  taxId?: string;
  status: 'active' | 'inactive';
  totalInvoiced: number;
  totalPaid: number;
  createdAt: string;
}
export interface Product {
  id: string;
  name: string;
  description: string;
  type: 'product' | 'service';
  sku?: string;
  price: number;
  currency: string;
  taxRate: number;
  category: string;
  status: 'active' | 'inactive';
}
export interface QuotationItem {
  id: string;
  productId: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discount: number;
  total: number;
}
export interface Quotation {
  id: string;
  quotationNumber: string;
  clientId: string;
  clientName: string;
  date: string;
  expiryDate: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'converted';
  items: QuotationItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
  notes?: string;
  terms?: string;
  createdAt: string;
  convertedToInvoiceId?: string;
}
export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  date: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: QuotationItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  currency: string;
  notes?: string;
  terms?: string;
  paymentMethod?: string;
  recurring?: {
    enabled: boolean;
    frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    nextDate: string;
  };
  createdAt: string;
  paidAt?: string;
}
export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  amount: number;
  currency: string;
  method: 'paystack' | 'flutterwave' | 'stripe' | 'bank_transfer' | 'cash';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  date: string;
  notes?: string;
}
export interface Template {
  id: string;
  name: string;
  type: 'quotation' | 'invoice';
  isDefault: boolean;
  layout: string;
  createdAt: string;
}
export interface DashboardStats {
  totalRevenue: number;
  totalInvoices: number;
  totalClients: number;
  pendingPayments: number;
  revenueGrowth: number;
  invoiceGrowth: number;
  clientGrowth: number;
  paymentGrowth: number;
}