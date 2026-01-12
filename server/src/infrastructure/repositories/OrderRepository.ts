import { IOrderRepository, OrderFilters } from '../../domain/repositories/IOrderRepository';
import { Order, OrderStatus, OrderItem, ShippingAddress } from '../../domain/entities/Order';
import { pool } from '../../db';

export class OrderRepository implements IOrderRepository {
  async findAll(filters?: OrderFilters): Promise<Order[]> {
    let query = 'SELECT * FROM orders';
    const params: any[] = [];
    const conditions: string[] = [];
    let paramIndex = 1;

    if (filters?.status) {
      conditions.push(`status = $${paramIndex}`);
      params.push(filters.status);
      paramIndex++;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    if (filters?.limit !== undefined) {
      query += ` LIMIT $${paramIndex}`;
      params.push(filters.limit);
      paramIndex++;
    }

    if (filters?.offset !== undefined) {
      query += ` OFFSET $${paramIndex}`;
      params.push(filters.offset);
      paramIndex++;
    }

    const result = await pool.query(query, params);
    return result.rows.map(row => this.mapRowToOrder(row));
  }

  async findById(id: string): Promise<Order | null> {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return null;
    }
    return this.mapRowToOrder(result.rows[0]);
  }

  async create(order: Order): Promise<Order> {
    await pool.query(
      `INSERT INTO orders (id, items, customer_name, customer_email, shipping_address, status, total, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        order.id,
        JSON.stringify(order.items),
        order.customerName,
        order.customerEmail,
        JSON.stringify(order.shippingAddress),
        order.status,
        order.total,
        order.createdAt,
        order.updatedAt
      ]
    );
    return order;
  }

  async update(order: Order): Promise<Order> {
    const result = await pool.query(
      `UPDATE orders 
       SET items = $1, customer_name = $2, customer_email = $3, shipping_address = $4, status = $5, total = $6, updated_at = $7
       WHERE id = $8
       RETURNING *`,
      [
        JSON.stringify(order.items),
        order.customerName,
        order.customerEmail,
        JSON.stringify(order.shippingAddress),
        order.status,
        order.total,
        order.updatedAt,
        order.id
      ]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Order not found');
    }
    
    return this.mapRowToOrder(result.rows[0]);
  }

  async delete(id: string): Promise<void> {
    const result = await pool.query('DELETE FROM orders WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw new Error('Order not found');
    }
  }

  private mapRowToOrder(row: any): Order {
    const items: OrderItem[] = typeof row.items === 'string' 
      ? JSON.parse(row.items) 
      : row.items;
    
    const shippingAddress: ShippingAddress = typeof row.shipping_address === 'string'
      ? JSON.parse(row.shipping_address)
      : row.shipping_address;

    return new Order(
      row.id,
      items,
      row.customer_name,
      row.customer_email,
      shippingAddress,
      row.status as OrderStatus,
      parseFloat(row.total),
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }
}

