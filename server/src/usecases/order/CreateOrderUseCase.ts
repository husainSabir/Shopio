import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { Order, OrderItem, ShippingAddress } from '../../domain/entities/Order';

export interface CreateOrderRequest {
  items: OrderItem[];
  customerName: string;
  customerEmail: string;
  shippingAddress: ShippingAddress;
}

export class CreateOrderUseCase {
  private orderCounter = 1;

  constructor(private orderRepository: IOrderRepository) {}

  private generateOrderId(): string {
    return `ORD-${this.orderCounter++}`;
  }

  async execute(request: CreateOrderRequest): Promise<Order> {
    const order = Order.create(
      request.items,
      request.customerName || 'Guest',
      request.customerEmail || '',
      request.shippingAddress || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      () => this.generateOrderId()
    );

    return await this.orderRepository.create(order);
  }
}

