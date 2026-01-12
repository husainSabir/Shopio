import { IProductRepository } from '../../domain/repositories/IProductRepository';

export class DeleteProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    
    if (!product) {
      throw new Error('Product not found');
    }

    await this.productRepository.delete(id);
  }
}

