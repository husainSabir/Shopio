// Dependency Injection Container
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { IInventoryRepository } from '../../domain/repositories/IInventoryRepository';
import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { ProductRepository } from '../repositories/ProductRepository';
import { InventoryRepository } from '../repositories/InventoryRepository';
import { OrderRepository } from '../repositories/OrderRepository';

// Use Cases
import { GetAllProductsUseCase } from '../../usecases/catalog/GetAllProductsUseCase';
import { GetProductByIdUseCase } from '../../usecases/catalog/GetProductByIdUseCase';
import { CreateProductUseCase } from '../../usecases/catalog/CreateProductUseCase';
import { UpdateProductUseCase } from '../../usecases/catalog/UpdateProductUseCase';
import { DeleteProductUseCase } from '../../usecases/catalog/DeleteProductUseCase';

import { GetInventoryUseCase } from '../../usecases/inventory/GetInventoryUseCase';
import { GetProductInventoryUseCase } from '../../usecases/inventory/GetProductInventoryUseCase';
import { AdjustInventoryUseCase } from '../../usecases/inventory/AdjustInventoryUseCase';
import { UpdateInventoryUseCase } from '../../usecases/inventory/UpdateInventoryUseCase';

import { GetAllOrdersUseCase } from '../../usecases/order/GetAllOrdersUseCase';
import { GetOrderByIdUseCase } from '../../usecases/order/GetOrderByIdUseCase';
import { CreateOrderUseCase } from '../../usecases/order/CreateOrderUseCase';
import { UpdateOrderStatusUseCase } from '../../usecases/order/UpdateOrderStatusUseCase';
import { UpdateOrderUseCase } from '../../usecases/order/UpdateOrderUseCase';
import { DeleteOrderUseCase } from '../../usecases/order/DeleteOrderUseCase';

// Controllers
import { CatalogController } from '../../interfaces/controllers/CatalogController';
import { InventoryController } from '../../interfaces/controllers/InventoryController';
import { OrderController } from '../../interfaces/controllers/OrderController';

export class Container {
  // Repositories
  private productRepository: IProductRepository;
  private inventoryRepository: IInventoryRepository;
  private orderRepository: IOrderRepository;

  // Use Cases
  private getAllProductsUseCase: GetAllProductsUseCase;
  private getProductByIdUseCase: GetProductByIdUseCase;
  private createProductUseCase: CreateProductUseCase;
  private updateProductUseCase: UpdateProductUseCase;
  private deleteProductUseCase: DeleteProductUseCase;

  private getInventoryUseCase: GetInventoryUseCase;
  private getProductInventoryUseCase: GetProductInventoryUseCase;
  private adjustInventoryUseCase: AdjustInventoryUseCase;
  private updateInventoryUseCase: UpdateInventoryUseCase;

  private getAllOrdersUseCase: GetAllOrdersUseCase;
  private getOrderByIdUseCase: GetOrderByIdUseCase;
  private createOrderUseCase: CreateOrderUseCase;
  private updateOrderStatusUseCase: UpdateOrderStatusUseCase;
  private updateOrderUseCase: UpdateOrderUseCase;
  private deleteOrderUseCase: DeleteOrderUseCase;

  // Controllers
  public catalogController: CatalogController;
  public inventoryController: InventoryController;
  public orderController: OrderController;

  constructor() {
    // Initialize repositories
    this.productRepository = new ProductRepository();
    this.inventoryRepository = new InventoryRepository();
    this.orderRepository = new OrderRepository();

    // Initialize use cases
    this.getAllProductsUseCase = new GetAllProductsUseCase(this.productRepository);
    this.getProductByIdUseCase = new GetProductByIdUseCase(this.productRepository);
    this.createProductUseCase = new CreateProductUseCase(this.productRepository);
    this.updateProductUseCase = new UpdateProductUseCase(this.productRepository);
    this.deleteProductUseCase = new DeleteProductUseCase(this.productRepository);

    this.getInventoryUseCase = new GetInventoryUseCase(this.inventoryRepository);
    this.getProductInventoryUseCase = new GetProductInventoryUseCase(this.inventoryRepository);
    this.adjustInventoryUseCase = new AdjustInventoryUseCase(this.inventoryRepository);
    this.updateInventoryUseCase = new UpdateInventoryUseCase(this.inventoryRepository);

    this.getAllOrdersUseCase = new GetAllOrdersUseCase(this.orderRepository);
    this.getOrderByIdUseCase = new GetOrderByIdUseCase(this.orderRepository);
    this.createOrderUseCase = new CreateOrderUseCase(this.orderRepository);
    this.updateOrderStatusUseCase = new UpdateOrderStatusUseCase(this.orderRepository);
    this.updateOrderUseCase = new UpdateOrderUseCase(this.orderRepository);
    this.deleteOrderUseCase = new DeleteOrderUseCase(this.orderRepository);

    // Initialize controllers
    this.catalogController = new CatalogController(
      this.getAllProductsUseCase,
      this.getProductByIdUseCase,
      this.createProductUseCase,
      this.updateProductUseCase,
      this.deleteProductUseCase
    );

    this.inventoryController = new InventoryController(
      this.getInventoryUseCase,
      this.getProductInventoryUseCase,
      this.adjustInventoryUseCase,
      this.updateInventoryUseCase
    );

    this.orderController = new OrderController(
      this.getAllOrdersUseCase,
      this.getOrderByIdUseCase,
      this.createOrderUseCase,
      this.updateOrderStatusUseCase,
      this.updateOrderUseCase,
      this.deleteOrderUseCase
    );
  }
}

