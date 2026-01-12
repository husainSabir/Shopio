// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  images?: string[];
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  sku?: string;
  images?: string[];
}

// Order types
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customerName: string;
  customerEmail: string;
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  items: OrderItem[];
  customerName: string;
  customerEmail: string;
  shippingAddress: ShippingAddress;
}

export interface UpdateOrderDto {
  items?: OrderItem[];
  customerName?: string;
  customerEmail?: string;
  shippingAddress?: ShippingAddress;
  status?: OrderStatus;
}

// Inventory types
export enum AdjustmentType {
  ADD = 'add',
  SUBTRACT = 'subtract',
  SET = 'set'
}

export interface InventoryAdjustment {
  type: AdjustmentType;
  quantity: number;
  reason: string;
  timestamp: string;
}

export interface Inventory {
  productId: string;
  quantity: number;
  lowStockThreshold: number;
  lastAdjustment?: InventoryAdjustment;
  updatedAt: string;
}

export interface AdjustInventoryDto {
  productId: string;
  quantity: number;
  type?: AdjustmentType;
  reason?: string;
}

export interface UpdateInventoryDto {
  quantity?: number;
  lowStockThreshold?: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
  total?: number;
}

