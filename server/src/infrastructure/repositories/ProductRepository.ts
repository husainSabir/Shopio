import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { Product } from '../../domain/entities/Product';
import { pool } from '../../db';

export class ProductRepository implements IProductRepository {
  async findAll(): Promise<Product[]> {
    const result = await pool.query(
      'SELECT * FROM products ORDER BY created_at DESC'
    );
    return result.rows.map(row => this.mapRowToProduct(row));
  }

  async findById(id: string): Promise<Product | null> {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return null;
    }
    return this.mapRowToProduct(result.rows[0]);
  }

  async create(product: Product): Promise<Product> {
    await pool.query(
      `INSERT INTO products (id, name, description, price, category, sku, images, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        product.id,
        product.name,
        product.description,
        product.price,
        product.category,
        product.sku,
        JSON.stringify(product.images),
        product.createdAt,
        product.updatedAt
      ]
    );
    return product;
  }

  async update(product: Product): Promise<Product> {
    const result = await pool.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, category = $4, sku = $5, images = $6, updated_at = $7
       WHERE id = $8
       RETURNING *`,
      [
        product.name,
        product.description,
        product.price,
        product.category,
        product.sku,
        JSON.stringify(product.images),
        product.updatedAt,
        product.id
      ]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Product not found');
    }
    
    return this.mapRowToProduct(result.rows[0]);
  }

  async delete(id: string): Promise<void> {
    const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw new Error('Product not found');
    }
  }

  private mapRowToProduct(row: {
    id: string;
    name: string;
    description: string;
    price: number | string;
    category: string;
    sku: string;
    images?: string | string[] | null;
    created_at: Date | string;
    updated_at: Date | string;
  }): Product {
    let images: string[] = [];
    if (row.images) {
      try {
        images = Array.isArray(row.images) ? row.images : JSON.parse(row.images);
      } catch {
        images = [];
      }
    }
    
    return new Product(
      row.id,
      row.name,
      row.description,
      parseFloat(row.price),
      row.category,
      row.sku,
      images,
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }
}

