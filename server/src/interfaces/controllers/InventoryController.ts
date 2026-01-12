import { Request, Response } from 'express';
import { GetInventoryUseCase } from '../../usecases/inventory/GetInventoryUseCase';
import { GetProductInventoryUseCase } from '../../usecases/inventory/GetProductInventoryUseCase';
import { AdjustInventoryUseCase } from '../../usecases/inventory/AdjustInventoryUseCase';
import { UpdateInventoryUseCase } from '../../usecases/inventory/UpdateInventoryUseCase';
import { AdjustmentType } from '../../domain/entities/Inventory';

export class InventoryController {
  constructor(
    private getInventoryUseCase: GetInventoryUseCase,
    private getProductInventoryUseCase: GetProductInventoryUseCase,
    private adjustInventoryUseCase: AdjustInventoryUseCase,
    private updateInventoryUseCase: UpdateInventoryUseCase
  ) {}

  getInventory = async (_req: Request, res: Response): Promise<void> => {
    try {
      const inventory = await this.getInventoryUseCase.execute();
      res.status(200).json({
        success: true,
        data: inventory,
        count: inventory.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch inventory'
      });
    }
  };

  getProductInventory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { productId } = req.params;
      const inventory = await this.getProductInventoryUseCase.execute(productId);
      res.status(200).json({
        success: true,
        data: inventory
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch product inventory'
      });
    }
  };

  adjustInventory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { productId, quantity, type, reason } = req.body;
      
      const adjustmentType = type ? (type as AdjustmentType) : AdjustmentType.SET;
      
      const inventory = await this.adjustInventoryUseCase.execute({
        productId,
        quantity,
        type: adjustmentType,
        reason
      });
      
      res.status(200).json({
        success: true,
        data: inventory
      });
    } catch (error) {
      const statusCode = error instanceof Error && 
        (error.message.includes('required') || error.message.includes('negative')) ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to adjust inventory'
      });
    }
  };

  updateInventory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { productId } = req.params;
      const inventory = await this.updateInventoryUseCase.execute(productId, req.body);
      res.status(200).json({
        success: true,
        data: inventory
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update inventory'
      });
    }
  };
}

