import { Router } from 'express';
import { InventoryController } from '../controllers/InventoryController';

export const createInventoryRoutes = (inventoryController: InventoryController): Router => {
  const router = Router();

  router.get('/', inventoryController.getInventory);
  router.get('/:productId', inventoryController.getProductInventory);
  router.post('/adjust', inventoryController.adjustInventory);
  router.put('/:productId', inventoryController.updateInventory);

  return router;
};

