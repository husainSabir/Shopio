export enum AdjustmentType {
  ADD = 'add',
  SUBTRACT = 'subtract',
  SET = 'set'
}

export interface InventoryAdjustment {
  type: AdjustmentType;
  quantity: number;
  reason: string;
  timestamp: Date;
}

export class Inventory {
  constructor(
    public readonly productId: string,
    public readonly quantity: number,
    public readonly lowStockThreshold: number,
    public readonly lastAdjustment?: InventoryAdjustment,
    public readonly updatedAt: Date = new Date()
  ) {}

  static create(productId: string, lowStockThreshold: number = 10): Inventory {
    return new Inventory(
      productId,
      0,
      lowStockThreshold,
      undefined,
      new Date()
    );
  }

  adjust(adjustmentType: AdjustmentType, quantity: number, reason: string): Inventory {
    if (quantity < 0) {
      throw new Error('Adjustment quantity cannot be negative');
    }

    let newQuantity = this.quantity;

    switch (adjustmentType) {
      case AdjustmentType.ADD:
        newQuantity += quantity;
        break;
      case AdjustmentType.SUBTRACT:
        newQuantity -= quantity;
        break;
      case AdjustmentType.SET:
        newQuantity = quantity;
        break;
    }

    if (newQuantity < 0) {
      throw new Error('Inventory cannot be negative');
    }

    const adjustment: InventoryAdjustment = {
      type: adjustmentType,
      quantity,
      reason,
      timestamp: new Date()
    };

    return new Inventory(
      this.productId,
      newQuantity,
      this.lowStockThreshold,
      adjustment,
      new Date()
    );
  }

  updateQuantity(quantity: number): Inventory {
    if (quantity < 0) {
      throw new Error('Inventory cannot be negative');
    }

    return new Inventory(
      this.productId,
      quantity,
      this.lowStockThreshold,
      this.lastAdjustment,
      new Date()
    );
  }

  updateLowStockThreshold(threshold: number): Inventory {
    return new Inventory(
      this.productId,
      this.quantity,
      threshold,
      this.lastAdjustment,
      new Date()
    );
  }

  isLowStock(): boolean {
    return this.quantity <= this.lowStockThreshold;
  }
}

