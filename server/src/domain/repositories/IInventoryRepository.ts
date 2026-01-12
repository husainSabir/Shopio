import { Inventory } from '../entities/Inventory';

export interface IInventoryRepository {
  findAll(): Promise<Inventory[]>;
  findByProductId(productId: string): Promise<Inventory | null>;
  create(inventory: Inventory): Promise<Inventory>;
  update(inventory: Inventory): Promise<Inventory>;
}

