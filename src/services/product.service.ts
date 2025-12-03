import { api } from './api';
import { Product } from '../types';

export interface CreateProductData {
  name: string;
  description: string;
  type: 'product' | 'service';
  sku?: string;
  price: number;
  currency: string;
  taxRate: number;
  category: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  status?: 'active' | 'inactive';
}

class ProductService {
  async getProducts(params?: {
    page?: number;
    limit?: number;
    status?: 'active' | 'inactive';
    type?: 'product' | 'service';
    search?: string;
  }): Promise<{ products: Product[]; total: number; page: number; limit: number }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.search) queryParams.append('search', params.search);

    return api.get(`/products?${queryParams}`);
  }

  async getProduct(id: string): Promise<Product> {
    return api.get(`/products/${id}`);
  }

  async createProduct(data: CreateProductData): Promise<Product> {
    return api.post('/products', data);
  }

  async updateProduct(id: string, data: UpdateProductData): Promise<Product> {
    return api.patch(`/products/${id}`, data);
  }

  async deleteProduct(id: string): Promise<void> {
    return api.delete(`/products/${id}`);
  }
}

export const productService = new ProductService();

