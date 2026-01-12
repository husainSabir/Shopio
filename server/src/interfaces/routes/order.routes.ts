import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';

export const createOrderRoutes = (orderController: OrderController): Router => {
  const router = Router();

  router.get('/', orderController.getAllOrders);
  router.get('/:id', orderController.getOrderById);
  router.post('/', orderController.createOrder);
  router.put('/:id/status', orderController.updateOrderStatus);
  router.put('/:id', orderController.updateOrder);
  router.delete('/:id', orderController.deleteOrder);

  return router;
};

