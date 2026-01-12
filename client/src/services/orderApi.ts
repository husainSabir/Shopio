import api from './api';
import type { Order, CreateOrderDto, UpdateOrderDto, OrderStatus, ApiResponse } from '../types';

export interface GetOrdersFilters {
  status?: OrderStatus;
  limit?: number;
  offset?: number;
}

export const orderApi = {
  getAllOrders: async (filters?: GetOrdersFilters): Promise<ApiResponse<Order[]>> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    
    const queryString = params.toString();
    return api.get<Order[]>(`/orders${queryString ? `?${queryString}` : ''}`);
  },

  getOrderById: async (id: string): Promise<ApiResponse<Order>> => {
    return api.get<Order>(`/orders/${id}`);
  },

  createOrder: async (order: CreateOrderDto): Promise<ApiResponse<Order>> => {
    return api.post<Order>('/orders', order);
  },

  updateOrder: async (id: string, updates: UpdateOrderDto): Promise<ApiResponse<Order>> => {
    return api.put<Order>(`/orders/${id}`, updates);
  },

  updateOrderStatus: async (id: string, status: OrderStatus): Promise<ApiResponse<Order>> => {
    return api.put<Order>(`/orders/${id}/status`, { status });
  },

  deleteOrder: async (id: string): Promise<ApiResponse<void>> => {
    return api.delete<void>(`/orders/${id}`);
  },
};

export default orderApi;

