import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { Order, OrderStatus } from '../../domain/entities/Order';

export class UpdateOrderStatusUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    
    if (!order) {
      throw new Error('Order not found');
    }

    const updatedOrder = order.updateStatus(status);
    return await this.orderRepository.update(updatedOrder);
  }
}

