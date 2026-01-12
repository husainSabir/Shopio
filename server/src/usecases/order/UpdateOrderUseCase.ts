import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { Order, OrderItem, ShippingAddress, OrderStatus } from '../../domain/entities/Order';

export interface UpdateOrderRequest {
  items?: OrderItem[];
  customerName?: string;
  customerEmail?: string;
  shippingAddress?: ShippingAddress;
  status?: OrderStatus;
}

export class UpdateOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(id: string, request: UpdateOrderRequest): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    
    if (!order) {
      throw new Error('Order not found');
    }

    const updatedOrder = order.update(request);
    return await this.orderRepository.update(updatedOrder);
  }
}

