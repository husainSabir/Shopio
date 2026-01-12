import { Router } from 'express';
import { CatalogController } from '../controllers/CatalogController';

export const createCatalogRoutes = (catalogController: CatalogController): Router => {
  const router = Router();

  router.get('/', catalogController.getAllProducts);
  router.get('/:id', catalogController.getProductById);
  router.post('/', catalogController.createProduct);
  router.put('/:id', catalogController.updateProduct);
  router.delete('/:id', catalogController.deleteProduct);

  return router;
};

