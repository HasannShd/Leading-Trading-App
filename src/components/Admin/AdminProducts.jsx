import { useState, useEffect, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import './AdminProducts.css';

const AdminProducts = () => {
  const { admin } = useContext(AdminContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    categorySlug: '',
    description: '',
    image: '',
    sku: '',
    brand: '',
    isActive: true,
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/products/${editingId}` : `${API_URL}/products`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Operation failed');
        return;
      }

      setError(null);
      setFormData({
        name: '',
        categorySlug: '',
        description: '',
        image: '',
        sku: '',
        brand: '',
        isActive: true,
      });
      setEditingId(null);
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      setError('Failed to save product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Failed to delete');
        return;
      }

      setError(null);
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      categorySlug: '',
      description: '',
      image: '',
      sku: '',
      brand: '',
      isActive: true,
    });
  };

  return (
    <div className="admin-products">
      <div className="admin-page-header">
        <h1>📦 Products Management</h1>
        {!showForm && (
          <button className="admin-add-btn" onClick={() => setShowForm(true)}>
            + Add New Product
          </button>
        )}
      </div>

      {error && <div className="admin-error">{error}</div>}

      {showForm && (
        <div className="admin-form-container">
          <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Surgical Gloves"
                required
              />
            </div>

            <div className="admin-form-group">
              <label>Category *</label>
              <select
                name="categorySlug"
                value={formData.categorySlug}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label>Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="e.g., MedStar"
              />
            </div>

            <div className="admin-form-group">
              <label>SKU</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="e.g., SKU-12345"
              />
            </div>

            <div className="admin-form-group">
              <label>Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="e.g., /Categories/gloves.webp"
              />
            </div>

            <div className="admin-form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Product description..."
                rows="4"
              />
            </div>

            <div className="admin-form-group checkbox">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
              />
              <label htmlFor="isActive">Active (visible to customers)</label>
            </div>

            <div className="admin-form-actions">
              <button type="submit" className="admin-btn-primary" disabled={loading}>
                {loading ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
              </button>
              <button type="button" className="admin-btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-products-list">
        <h2>All Products ({products.length})</h2>
        
        {loading && !showForm && <p className="loading">Loading...</p>}

        {products.length === 0 && !loading ? (
          <p className="empty-message">No products found. Create one to get started!</p>
        ) : (
          <div className="products-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>SKU</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id}>
                    <td className="col-name">{product.name}</td>
                    <td className="col-category">{product.categorySlug || '-'}</td>
                    <td className="col-brand">{product.brand || '-'}</td>
                    <td className="col-sku">{product.sku || '-'}</td>
                    <td className="col-status">
                      <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                        {product.isActive ? '✓ Active' : '○ Inactive'}
                      </span>
                    </td>
                    <td className="col-date">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="col-actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(product)}
                        disabled={loading}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(product._id)}
                        disabled={loading}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
