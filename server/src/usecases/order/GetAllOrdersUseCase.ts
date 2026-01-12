import { IOrderRepository, OrderFilters } from '../../domain/repositories/IOrderRepository';
import { Order } from '../../domain/entities/Order';

export class GetAllOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(filters?: OrderFilters): Promise<Order[]> {
    return await this.orderRepository.findAll(filters);
  }
}

