import api from './api';
import type { Product, CreateProductDto, UpdateProductDto, ApiResponse } from '../types';

export const catalogApi = {
  getAllProducts: async (): Promise<ApiResponse<Product[]>> => {
    return api.get<Product[]>('/catalog');
  },

  getProductById: async (id: string): Promise<ApiResponse<Product>> => {
    return api.get<Product>(`/catalog/${id}`);
  },

  createProduct: async (product: CreateProductDto): Promise<ApiResponse<Product>> => {
    return api.post<Product>('/catalog', product);
  },

  updateProduct: async (id: string, updates: UpdateProductDto): Promise<ApiResponse<Product>> => {
    return api.put<Product>(`/catalog/${id}`, updates);
  },

  deleteProduct: async (id: string): Promise<ApiResponse<void>> => {
    return api.delete<void>(`/catalog/${id}`);
  },
};

export default catalogApi;

