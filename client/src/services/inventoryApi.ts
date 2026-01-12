import api from './api';
import type { Inventory, AdjustInventoryDto, UpdateInventoryDto, ApiResponse } from '../types';

export const inventoryApi = {
  getInventory: async (): Promise<ApiResponse<Inventory[]>> => {
    return api.get<Inventory[]>('/inventory');
  },

  getProductInventory: async (productId: string): Promise<ApiResponse<Inventory>> => {
    return api.get<Inventory>(`/inventory/${productId}`);
  },

  adjustInventory: async (adjustment: AdjustInventoryDto): Promise<ApiResponse<Inventory>> => {
    return api.post<Inventory>('/inventory/adjust', adjustment);
  },

  updateInventory: async (productId: string, updates: UpdateInventoryDto): Promise<ApiResponse<Inventory>> => {
    return api.put<Inventory>(`/inventory/${productId}`, updates);
  },
};

export default inventoryApi;

