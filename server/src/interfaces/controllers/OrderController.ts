import { Request, Response } from 'express';
import { GetAllOrdersUseCase } from '../../usecases/order/GetAllOrdersUseCase';
import { GetOrderByIdUseCase } from '../../usecases/order/GetOrderByIdUseCase';
import { CreateOrderUseCase } from '../../usecases/order/CreateOrderUseCase';
import { UpdateOrderStatusUseCase } from '../../usecases/order/UpdateOrderStatusUseCase';
import { UpdateOrderUseCase } from '../../usecases/order/UpdateOrderUseCase';
import { DeleteOrderUseCase } from '../../usecases/order/DeleteOrderUseCase';
import { OrderStatus } from '../../domain/entities/Order';

export class OrderController {
  constructor(
    private getAllOrdersUseCase: GetAllOrdersUseCase,
    private getOrderByIdUseCase: GetOrderByIdUseCase,
    private createOrderUseCase: CreateOrderUseCase,
    private updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private updateOrderUseCase: UpdateOrderUseCase,
    private deleteOrderUseCase: DeleteOrderUseCase
  ) {}

  getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const { status, limit, offset } = req.query;
      
      const filters = {
        ...(status && { status: status as OrderStatus }),
        ...(limit && { limit: parseInt(limit as string) }),
        ...(offset && { offset: parseInt(offset as string) })
      };

      const orders = await this.getAllOrdersUseCase.execute(Object.keys(filters).length > 0 ? filters : undefined);
      
      res.status(200).json({
        success: true,
        data: orders,
        count: orders.length,
        total: orders.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch orders'
      });
    }
  };

  getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const order = await this.getOrderByIdUseCase.execute(id);
      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Order not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch order'
      });
    }
  };

  createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const order = await this.createOrderUseCase.execute(req.body);
      res.status(201).json({
        success: true,
        data: order
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('must contain') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create order'
      });
    }
  };

  updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status || !Object.values(OrderStatus).includes(status)) {
        res.status(400).json({
          success: false,
          error: `Invalid status. Must be one of: ${Object.values(OrderStatus).join(', ')}`
        });
        return;
      }

      const order = await this.updateOrderStatusUseCase.execute(id, status as OrderStatus);
      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      const statusCode = error instanceof Error && 
        (error.message === 'Order not found' || error.message.includes('Invalid')) ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update order status'
      });
    }
  };

  updateOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const order = await this.updateOrderUseCase.execute(id, req.body);
      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Order not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update order'
      });
    }
  };

  deleteOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.deleteOrderUseCase.execute(id);
      res.status(200).json({
        success: true,
        message: 'Order deleted successfully'
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Order not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete order'
      });
    }
  };
}

