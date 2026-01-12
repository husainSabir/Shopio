import { IInventoryRepository } from '../../domain/repositories/IInventoryRepository';
import { Inventory } from '../../domain/entities/Inventory';

export class GetInventoryUseCase {
  constructor(private inventoryRepository: IInventoryRepository) {}

  async execute(): Promise<Inventory[]> {
    return await this.inventoryRepository.findAll();
  }
}

