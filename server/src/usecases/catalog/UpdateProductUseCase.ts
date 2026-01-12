import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { Product } from '../../domain/entities/Product';

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  sku?: string;
  images?: string[];
}

export class UpdateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string, request: UpdateProductRequest): Promise<Product> {
    const existingProduct = await this.productRepository.findById(id);
    
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    if (request.price !== undefined && request.price < 0) {
      throw new Error('Price cannot be negative');
    }

    const updatedProduct = existingProduct.update(request);
    return await this.productRepository.update(updatedProduct);
  }
}

