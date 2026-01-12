import { useEffect, useState } from 'react';
import inventoryApi from '../services/inventoryApi';
import catalogApi from '../services/catalogApi';
import { type Inventory, type Product, AdjustmentType } from '../types';
import './Page.css';

interface ProductWithInventory extends Product {
  inventory?: Inventory;
}

export default function Inventory() {
  const [products, setProducts] = useState<ProductWithInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<string | null>(null);
  const [showAdjustForm, setShowAdjustForm] = useState<string | null>(null);
  const [createData, setCreateData] = useState({
    quantity: 0,
    lowStockThreshold: 10,
    reason: '',
  });
  const [adjustData, setAdjustData] = useState({
    quantity: 0,
    type: 'set' as AdjustmentType,
    reason: '',
  });

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setLoading(true);
    setError(null);
    const [inventoryResponse, productsResponse] = await Promise.all([
      inventoryApi.getInventory(),
      catalogApi.getAllProducts(),
    ]);

    if (productsResponse.success && productsResponse.data) {
      const inventoryMap = new Map<string, Inventory>();
      if (inventoryResponse.success && inventoryResponse.data) {
        inventoryResponse.data.forEach((inv) => {
          inventoryMap.set(inv.productId, inv);
        });
      }

      const productsWithInventory = productsResponse.data.map((product) => ({
        ...product,
        inventory: inventoryMap.get(product.id),
      }));

      setProducts(productsWithInventory);
    } else {
      setError(
        inventoryResponse.error || productsResponse.error || 'Failed to load inventory'
      );
    }
    setLoading(false);
  };

  const handleCreateInventory = async (productId: string) => {
    setError(null);
    // Use adjust inventory API with SET type to create new inventory
    const adjustResponse = await inventoryApi.adjustInventory({
      productId,
      quantity: createData.quantity,
      type: AdjustmentType.SET,
      reason: createData.reason || 'Initial inventory creation',
    });

    if (adjustResponse.success) {
      // Update the low stock threshold if it's different from default
      if (createData.lowStockThreshold !== 10) {
        const updateResponse = await inventoryApi.updateInventory(productId, {
          lowStockThreshold: createData.lowStockThreshold,
        });
        if (!updateResponse.success) {
          setError(updateResponse.error || 'Inventory created but failed to update threshold');
          loadInventory();
          return;
        }
      }

      setShowCreateForm(null);
      setCreateData({ quantity: 0, lowStockThreshold: 10, reason: '' });
      loadInventory();
    } else {
      setError(adjustResponse.error || 'Failed to create inventory');
    }
  };

  const handleAdjust = async (productId: string) => {
    setError(null);
    const response = await inventoryApi.adjustInventory({
      productId,
      quantity: adjustData.quantity,
      type: adjustData.type,
      reason: adjustData.reason,
    });

    if (response.success) {
      setShowAdjustForm(null);
      setAdjustData({ quantity: 0, type: AdjustmentType.SET, reason: '' });
      loadInventory();
    } else {
      setError(response.error || 'Failed to adjust inventory');
    }
  };

  const handleUpdateThreshold = async (productId: string, threshold: number) => {
    setError(null);
    const response = await inventoryApi.updateInventory(productId, {
      lowStockThreshold: threshold,
    });

    if (response.success) {
      loadInventory();
    } else {
      setError(response.error || 'Failed to update threshold');
    }
  };

  const isLowStock = (inventory?: Inventory) => {
    if (!inventory) return false;
    return inventory.quantity <= inventory.lowStockThreshold;
  };

  const hasInventory = (product: ProductWithInventory) => !!product.inventory;

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Inventory</h1>
          <p className="page-description">Monitor and manage your stock levels</p>
        </div>
        <div className="loading">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Inventory</h1>
        <p className="page-description">Monitor and manage your stock levels</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="close-btn">×</button>
        </div>
      )}

      <div className="page-content">
        {products.length === 0 ? (
          <div className="card">
            <p>No products found. Create products in the Product Catalog first.</p>
          </div>
        ) : (
          <div className="inventory-table-container">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Quantity</th>
                  <th>Low Stock Threshold</th>
                  <th>Status</th>
                  <th>Last Adjustment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const inventory = product.inventory;
                  const hasInv = hasInventory(product);
                  const lowStock = isLowStock(inventory);

                  return (
                    <tr
                      key={product.id}
                      className={!hasInv ? 'no-inventory' : lowStock ? 'low-stock' : ''}
                    >
                      <td>
                        <strong>{product.name}</strong>
                      </td>
                      <td>{product.sku}</td>
                      <td>
                        {hasInv ? (
                          <span className={`quantity ${lowStock ? 'low' : ''}`}>
                            {inventory!.quantity}
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        {hasInv ? (
                          <div className="threshold-control">
                            <input
                              type="number"
                              min="0"
                              value={inventory!.lowStockThreshold}
                              onChange={(e) =>
                                handleUpdateThreshold(product.id, parseInt(e.target.value) || 0)
                              }
                              className="threshold-input"
                              onBlur={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                if (value !== inventory!.lowStockThreshold) {
                                  handleUpdateThreshold(product.id, value);
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        {hasInv ? (
                          lowStock ? (
                            <span className="status-badge low-stock-badge">LOW STOCK</span>
                          ) : (
                            <span className="status-badge in-stock-badge">IN STOCK</span>
                          )
                        ) : (
                          <span className="status-badge no-inventory-badge">NO INVENTORY</span>
                        )}
                      </td>
                      <td>
                        {hasInv && inventory!.lastAdjustment ? (
                          <div className="adjustment-info">
                            <small>
                              {inventory!.lastAdjustment.type.toUpperCase()}:{' '}
                              {inventory!.lastAdjustment.quantity}
                            </small>
                            <br />
                            <small className="text-muted">
                              {new Date(inventory!.lastAdjustment.timestamp).toLocaleString()}
                            </small>
                            {inventory!.lastAdjustment.reason && (
                              <>
                                <br />
                                <small className="text-muted">
                                  Reason: {inventory!.lastAdjustment.reason}
                                </small>
                              </>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted">
                            {hasInv ? 'No adjustments' : '—'}
                          </span>
                        )}
                      </td>
                      <td>
                        {hasInv ? (
                          <button
                            className="btn btn-small"
                            onClick={() =>
                              setShowAdjustForm(
                                showAdjustForm === product.id ? null : product.id
                              )
                            }
                          >
                            {showAdjustForm === product.id ? 'Cancel' : 'Adjust'}
                          </button>
                        ) : (
                          <button
                            className="btn btn-small btn-primary"
                            onClick={() =>
                              setShowCreateForm(
                                showCreateForm === product.id ? null : product.id
                              )
                            }
                          >
                            {showCreateForm === product.id ? 'Cancel' : 'Create'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {showCreateForm && (
          <div className="card adjust-form">
            <h2>Create Inventory for Product</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateInventory(showCreateForm);
              }}
              className="adjust-form-content"
            >
              <div className="form-group">
                <label>Product</label>
                <input
                  type="text"
                  value={products.find((p) => p.id === showCreateForm)?.name || ''}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Product ID</label>
                <input type="text" value={showCreateForm} disabled />
              </div>
              <div className="form-group">
                <label>Initial Quantity *</label>
                <input
                  type="number"
                  min="0"
                  value={createData.quantity}
                  onChange={(e) =>
                    setCreateData({ ...createData, quantity: parseInt(e.target.value) || 0 })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Low Stock Threshold *</label>
                <input
                  type="number"
                  min="0"
                  value={createData.lowStockThreshold}
                  onChange={(e) =>
                    setCreateData({
                      ...createData,
                      lowStockThreshold: parseInt(e.target.value) || 10,
                    })
                  }
                  required
                />
                <small className="form-hint">
                  Alert will trigger when quantity falls below this threshold
                </small>
              </div>
              <div className="form-group">
                <label>Reason</label>
                <textarea
                  value={createData.reason}
                  onChange={(e) => setCreateData({ ...createData, reason: e.target.value })}
                  rows={2}
                  placeholder="Optional reason for inventory creation"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Create Inventory
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowCreateForm(null);
                    setCreateData({ quantity: 0, lowStockThreshold: 10, reason: '' });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {showAdjustForm && (
          <div className="card adjust-form">
            <h2>Adjust Inventory</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAdjust(showAdjustForm);
              }}
              className="adjust-form-content"
            >
              <div className="form-group">
                <label>Product</label>
                <input
                  type="text"
                  value={products.find((p) => p.id === showAdjustForm)?.name || ''}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Product ID</label>
                <input type="text" value={showAdjustForm} disabled />
              </div>
              <div className="form-group">
                <label>Current Quantity</label>
                <input
                  type="text"
                  value={
                    products.find((p) => p.id === showAdjustForm)?.inventory?.quantity || 0
                  }
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Adjustment Type *</label>
                <select
                  value={adjustData.type}
                  onChange={(e) =>
                    setAdjustData({ ...adjustData, type: e.target.value as AdjustmentType })
                  }
                  required
                >
                  <option value="set">Set Quantity</option>
                  <option value="add">Add Quantity</option>
                  <option value="subtract">Subtract Quantity</option>
                </select>
              </div>
              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  min="0"
                  value={adjustData.quantity}
                  onChange={(e) =>
                    setAdjustData({ ...adjustData, quantity: parseInt(e.target.value) || 0 })
                  }
                  required
                />
                <small className="form-hint">
                  {adjustData.type === 'set' && 'This will set the quantity to this value'}
                  {adjustData.type === 'add' && 'This will add this amount to current quantity'}
                  {adjustData.type === 'subtract' &&
                    'This will subtract this amount from current quantity'}
                </small>
              </div>
              <div className="form-group">
                <label>Reason</label>
                <textarea
                  value={adjustData.reason}
                  onChange={(e) => setAdjustData({ ...adjustData, reason: e.target.value })}
                  rows={2}
                  placeholder="Optional reason for adjustment"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Apply Adjustment
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAdjustForm(null);
                    setAdjustData({ quantity: 0, type: AdjustmentType.SET, reason: '' });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
