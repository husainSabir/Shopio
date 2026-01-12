import { Request, Response } from 'express';
import { GetAllProductsUseCase } from '../../usecases/catalog/GetAllProductsUseCase';
import { GetProductByIdUseCase } from '../../usecases/catalog/GetProductByIdUseCase';
import { CreateProductUseCase } from '../../usecases/catalog/CreateProductUseCase';
import { UpdateProductUseCase } from '../../usecases/catalog/UpdateProductUseCase';
import { DeleteProductUseCase } from '../../usecases/catalog/DeleteProductUseCase';

export class CatalogController {
  constructor(
    private getAllProductsUseCase: GetAllProductsUseCase,
    private getProductByIdUseCase: GetProductByIdUseCase,
    private createProductUseCase: CreateProductUseCase,
    private updateProductUseCase: UpdateProductUseCase,
    private deleteProductUseCase: DeleteProductUseCase
  ) {}

  getAllProducts = async (_req: Request, res: Response): Promise<void> => {
    try {
      const products = await this.getAllProductsUseCase.execute();
      res.status(200).json({
        success: true,
        data: products,
        count: products.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch products'
      });
    }
  };

  getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await this.getProductByIdUseCase.execute(id);
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Product not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch product'
      });
    }
  };

  createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.createProductUseCase.execute(req.body);
      res.status(201).json({
        success: true,
        data: product
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('required') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create product'
      });
    }
  };

  updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await this.updateProductUseCase.execute(id, req.body);
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Product not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update product'
      });
    }
  };

  deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.deleteProductUseCase.execute(id);
      res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Product not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete product'
      });
    }
  };
}

