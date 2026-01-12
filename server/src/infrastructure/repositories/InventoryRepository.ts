import { IInventoryRepository } from '../../domain/repositories/IInventoryRepository';
import { Inventory, InventoryAdjustment } from '../../domain/entities/Inventory';
import { pool } from '../../db';

export class InventoryRepository implements IInventoryRepository {
  async findAll(): Promise<Inventory[]> {
    const result = await pool.query('SELECT * FROM inventory ORDER BY updated_at DESC');
    return result.rows.map(row => this.mapRowToInventory(row));
  }

  async findByProductId(productId: string): Promise<Inventory | null> {
    const result = await pool.query('SELECT * FROM inventory WHERE product_id = $1', [productId]);
    if (result.rows.length === 0) {
      return null;
    }
    return this.mapRowToInventory(result.rows[0]);
  }

  async create(inventory: Inventory): Promise<Inventory> {
    await pool.query(
      `INSERT INTO inventory (product_id, quantity, low_stock_threshold, last_adjustment, updated_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        inventory.productId,
        inventory.quantity,
        inventory.lowStockThreshold,
        inventory.lastAdjustment ? JSON.stringify(inventory.lastAdjustment) : null,
        inventory.updatedAt
      ]
    );
    return inventory;
  }

  async update(inventory: Inventory): Promise<Inventory> {
    const result = await pool.query(
      `UPDATE inventory 
       SET quantity = $1, low_stock_threshold = $2, last_adjustment = $3, updated_at = $4
       WHERE product_id = $5
       RETURNING *`,
      [
        inventory.quantity,
        inventory.lowStockThreshold,
        inventory.lastAdjustment ? JSON.stringify(inventory.lastAdjustment) : null,
        inventory.updatedAt,
        inventory.productId
      ]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Inventory not found');
    }
    
    return this.mapRowToInventory(result.rows[0]);
  }

  private mapRowToInventory(row: {
    product_id: string;
    quantity: number;
    low_stock_threshold: number;
    last_adjustment?: string | object | null;
    updated_at: Date | string;
  }): Inventory {
    let lastAdjustment: InventoryAdjustment | undefined;
    if (row.last_adjustment) {
      const adj = typeof row.last_adjustment === 'string' 
        ? JSON.parse(row.last_adjustment) 
        : row.last_adjustment;
      lastAdjustment = {
        type: adj.type,
        quantity: adj.quantity,
        reason: adj.reason,
        timestamp: new Date(adj.timestamp)
      };
    }

    return new Inventory(
      row.product_id,
      row.quantity,
      row.low_stock_threshold,
      lastAdjustment,
      new Date(row.updated_at)
    );
  }
}

