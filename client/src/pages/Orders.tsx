import { useEffect, useState } from 'react';
import orderApi from '../services/orderApi';
import type { Order, OrderStatus } from '../types';
import './Page.css';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    const filters = statusFilter !== 'all' ? { status: statusFilter } : undefined;
    const response = await orderApi.getAllOrders(filters);
    if (response.success && response.data) {
      setOrders(response.data);
    } else {
      setError(response.error || 'Failed to load orders');
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (id: string, newStatus: OrderStatus) => {
    setError(null);
    const response = await orderApi.updateOrderStatus(id, newStatus);
    if (response.success) {
      loadOrders();
    } else {
      setError(response.error || 'Failed to update order status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    setError(null);
    const response = await orderApi.deleteOrder(id);
    if (response.success) {
      loadOrders();
    } else {
      setError(response.error || 'Failed to delete order');
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
      pending: '#f59e0b',
      processing: '#3b82f6',
      shipped: '#8b5cf6',
      delivered: '#10b981',
      cancelled: '#ef4444',
    };
    return colors[status];
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Orders</h1>
          <p className="page-description">Manage and track all customer orders</p>
        </div>
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Orders</h1>
        <p className="page-description">Manage and track all customer orders</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="close-btn">×</button>
        </div>
      )}

      <div className="filters">
        <label>Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
          className="filter-select"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="page-content">
        {orders.length === 0 ? (
          <div className="card">
            <p>No orders found.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order.id.slice(-8)}</h3>
                    <p className="order-customer">{order.customerName} ({order.customerEmail})</p>
                  </div>
                  <div className="order-status-section">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status.toUpperCase()}
                    </span>
                    <button
                      className="btn-icon"
                      onClick={() => handleDelete(order.id)}
                      title="Delete order"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="order-items">
                  <h4>Items ({order.items.length}):</h4>
                  <ul>
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.name} - Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="order-details">
                  <div>
                    <strong>Shipping Address:</strong>
                    <p>
                      {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                      {order.shippingAddress.state} {order.shippingAddress.zipCode},{' '}
                      {order.shippingAddress.country}
                    </p>
                  </div>
                  <div className="order-total">
                    <strong>Total: ${order.total.toFixed(2)}</strong>
                  </div>
                </div>

                <div className="order-actions">
                  <label>Update Status:</label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                    className="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="order-footer">
                  <small>
                    Created: {new Date(order.createdAt).toLocaleString()} | Updated:{' '}
                    {new Date(order.updatedAt).toLocaleString()}
                  </small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
