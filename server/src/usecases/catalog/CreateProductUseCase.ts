import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { Product } from '../../domain/entities/Product';

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  images?: string[];
}

export class CreateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(request: CreateProductRequest): Promise<Product> {
    if (!request.name || !request.price) {
      throw new Error('Name and price are required');
    }

    if (request.price < 0) {
      throw new Error('Price cannot be negative');
    }

    const product = Product.create(
      request.name,
      request.description || '',
      request.price,
      request.category || 'uncategorized',
      request.sku || `SKU-${Date.now()}`,
      request.images || []
    );

    return await this.productRepository.create(product);
  }
}

