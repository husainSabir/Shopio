import { IInventoryRepository } from '../../domain/repositories/IInventoryRepository';
import { Inventory } from '../../domain/entities/Inventory';

export class GetProductInventoryUseCase {
  constructor(private inventoryRepository: IInventoryRepository) {}

  async execute(productId: string): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findByProductId(productId);
    
    if (!inventory) {
      throw new Error('Inventory record not found for this product');
    }
    
    return inventory;
  }
}

