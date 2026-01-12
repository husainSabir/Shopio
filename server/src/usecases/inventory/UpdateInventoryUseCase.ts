import { IInventoryRepository } from '../../domain/repositories/IInventoryRepository';
import { Inventory } from '../../domain/entities/Inventory';

export interface UpdateInventoryRequest {
  quantity?: number;
  lowStockThreshold?: number;
}

export class UpdateInventoryUseCase {
  constructor(private inventoryRepository: IInventoryRepository) {}

  async execute(productId: string, request: UpdateInventoryRequest): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findByProductId(productId);
    
    if (!inventory) {
      throw new Error('Inventory record not found');
    }

    let updatedInventory = inventory;

    if (request.quantity !== undefined) {
      updatedInventory = updatedInventory.updateQuantity(request.quantity);
    }

    if (request.lowStockThreshold !== undefined) {
      updatedInventory = updatedInventory.updateLowStockThreshold(request.lowStockThreshold);
    }

    return await this.inventoryRepository.update(updatedInventory);
  }
}

