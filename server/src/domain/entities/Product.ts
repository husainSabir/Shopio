export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly category: string,
    public readonly sku: string,
    public readonly images: string[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(
    name: string,
    description: string,
    price: number,
    category: string,
    sku: string,
    images: string[] = []
  ): Product {
    const now = new Date();
    const id = Date.now().toString();
    
    return new Product(
      id,
      name,
      description,
      price,
      category,
      sku,
      images,
      now,
      now
    );
  }

  update(updates: Partial<Omit<Product, 'id' | 'createdAt'>>): Product {
    return new Product(
      this.id,
      updates.name ?? this.name,
      updates.description ?? this.description,
      updates.price ?? this.price,
      updates.category ?? this.category,
      updates.sku ?? this.sku,
      updates.images ?? this.images,
      this.createdAt,
      new Date()
    );
  }
}

