import { IInventoryRepository } from '../../domain/repositories/IInventoryRepository';
import { Inventory, AdjustmentType } from '../../domain/entities/Inventory';

export interface AdjustInventoryRequest {
  productId: string;
  quantity: number;
  type: AdjustmentType;
  reason: string;
}

export class AdjustInventoryUseCase {
  constructor(private inventoryRepository: IInventoryRepository) {}

  async execute(request: AdjustInventoryRequest): Promise<Inventory> {
    if (!request.productId || request.quantity === undefined) {
      throw new Error('Product ID and quantity are required');
    }

    let inventory = await this.inventoryRepository.findByProductId(request.productId);

    if (!inventory) {
      inventory = Inventory.create(request.productId);
      await this.inventoryRepository.create(inventory);
    }

    const adjustedInventory = inventory.adjust(
      request.type,
      request.quantity,
      request.reason || 'Manual adjustment'
    );

    return await this.inventoryRepository.update(adjustedInventory);
  }
}

