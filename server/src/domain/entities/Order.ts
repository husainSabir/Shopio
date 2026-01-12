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

export class Order {
  constructor(
    public readonly id: string,
    public readonly items: OrderItem[],
    public readonly customerName: string,
    public readonly customerEmail: string,
    public readonly shippingAddress: ShippingAddress,
    public readonly status: OrderStatus,
    public readonly total: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(
    items: OrderItem[],
    customerName: string,
    customerEmail: string,
    shippingAddress: ShippingAddress,
    idGenerator: () => string
  ): Order {
    if (!items || items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const now = new Date();

    return new Order(
      idGenerator(),
      items,
      customerName,
      customerEmail,
      shippingAddress,
      OrderStatus.PENDING,
      total,
      now,
      now
    );
  }

  updateStatus(status: OrderStatus): Order {
    if (!Object.values(OrderStatus).includes(status)) {
      throw new Error(`Invalid order status: ${status}`);
    }

    return new Order(
      this.id,
      this.items,
      this.customerName,
      this.customerEmail,
      this.shippingAddress,
      status,
      this.total,
      this.createdAt,
      new Date()
    );
  }

  update(updates: Partial<Omit<Order, 'id' | 'createdAt' | 'total'>>): Order {
    const recalculatedTotal = updates.items
      ? updates.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      : this.total;

    return new Order(
      this.id,
      updates.items ?? this.items,
      updates.customerName ?? this.customerName,
      updates.customerEmail ?? this.customerEmail,
      updates.shippingAddress ?? this.shippingAddress,
      updates.status ?? this.status,
      recalculatedTotal,
      this.createdAt,
      new Date()
    );
  }
}

