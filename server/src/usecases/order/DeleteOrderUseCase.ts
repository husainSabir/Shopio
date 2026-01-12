import { IOrderRepository } from '../../domain/repositories/IOrderRepository';

export class DeleteOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(id: string): Promise<void> {
    const order = await this.orderRepository.findById(id);
    
    if (!order) {
      throw new Error('Order not found');
    }

    await this.orderRepository.delete(id);
  }
}

