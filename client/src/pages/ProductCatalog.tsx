import { useEffect, useState } from 'react';
import catalogApi from '../services/catalogApi';
import type { Product, CreateProductDto } from '../types';
import './Page.css';

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<CreateProductDto>({
    name: '',
    description: '',
    price: 0,
    category: '',
    sku: '',
    images: [],
  });
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    const response = await catalogApi.getAllProducts();
    if (response.success && response.data) {
      setProducts(response.data);
    } else {
      setError(response.error || 'Failed to load products');
    }
    setLoading(false);
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...(formData.images || []), imageUrl.trim()],
      });
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = formData.images?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const response = await catalogApi.createProduct(formData);
    if (response.success) {
      setShowAddForm(false);
      setFormData({ name: '', description: '', price: 0, category: '', sku: '', images: [] });
      setImageUrl('');
      loadProducts();
    } else {
      setError(response.error || 'Failed to create product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    setError(null);
    const response = await catalogApi.deleteProduct(id);
    if (response.success) {
      loadProducts();
    } else {
      setError(response.error || 'Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Product Catalog</h1>
          <p className="page-description">Browse and manage your product catalog</p>
        </div>
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Product Catalog</h1>
        <p className="page-description">Browse and manage your product catalog</p>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="close-btn">×</button>
        </div>
      )}

      {showAddForm && (
        <div className="card">
          <h2>Add New Product</h2>
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>SKU *</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Price *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Product Images</label>
              <div className="image-input-group">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddImage();
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-small btn-secondary"
                  onClick={handleAddImage}
                >
                  Add
                </button>
              </div>
              {formData.images && formData.images.length > 0 && (
                <div className="image-preview-list">
                  {formData.images.map((img, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={img} alt={`Preview ${index + 1}`} onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23e2e8f0"/%3E%3Ctext x="50" y="50" text-anchor="middle" fill="%2394a3b8"%3EImage%3C/text%3E%3C/svg%3E';
                      }} />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => handleRemoveImage(index)}
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <small className="form-hint">Add image URLs one at a time. Click Add or press Enter to add each URL.</small>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Create Product</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="page-content">
        {products.length === 0 ? (
          <div className="card">
            <p>No products found. Add your first product to get started!</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                {product.images && product.images.length > 0 && (
                  <div className="product-image-container">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect width="300" height="200" fill="%23e2e8f0"/%3E%3Ctext x="150" y="100" text-anchor="middle" fill="%2394a3b8"%3EImage not found%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    {product.images.length > 1 && (
                      <div className="image-count-badge">{product.images.length}</div>
                    )}
                  </div>
                )}
                <div className="product-header">
                  <h3>{product.name}</h3>
                  <button
                    className="btn-icon"
                    onClick={() => handleDelete(product.id)}
                    title="Delete product"
                  >
                    ×
                  </button>
                </div>
                <div className="product-info">
                  <p className="product-sku">SKU: {product.sku}</p>
                  <p className="product-category">Category: {product.category}</p>
                  <p className="product-description">{product.description || 'No description'}</p>
                  <p className="product-price">${product.price.toFixed(2)}</p>
                </div>
                <div className="product-footer">
                  <small>Created: {new Date(product.createdAt).toLocaleDateString()}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
