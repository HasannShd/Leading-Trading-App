import { useState, useEffect, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import './AdminProducts.css';
import AdminTopNav from './AdminTopNav';

const AdminProducts = () => {
  const { admin } = useContext(AdminContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [specs, setSpecs] = useState([]);
  const [variants, setVariants] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    categorySlug: '',
    description: '',
    image: '',
    sku: '',
    brand: '',
    basePrice: '',
    featured: false,
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
      const response = await fetch(`${API_URL}/products/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setProducts(data);
      // console.log('Products:', data);
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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const data = new FormData();
      data.append('image', file);
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      const resData = await response.json();
      if (!response.ok) {
        setError(resData.message || 'Upload failed');
        return;
      }
      setFormData(prev => ({ ...prev, image: resData.url }));
      setError(null);
    } catch (err) {
      setError('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/products/${editingId}` : `${API_URL}/products`;
      const normalizedVariants = variants.map(variant => ({
        ...variant,
        price: Number(variant.price || 0),
        stock: Number(variant.stock || 0),
        isActive: variant.isActive !== false,
      }));
      const payload = {
        ...formData,
        basePrice: Number(formData.basePrice || 0),
        specs: specs.filter(spec => spec.label || spec.value),
        variants: normalizedVariants,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
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
        basePrice: '',
        featured: false,
        isActive: true,
      });
      setSpecs([]);
      setVariants([]);
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
    setFormData({
      name: product.name || '',
      categorySlug: product.categorySlug?._id || product.categorySlug || '',
      description: product.description || '',
      image: product.image || '',
      sku: product.sku || '',
      brand: product.brand || '',
      basePrice: product.basePrice ?? '',
      featured: product.featured ?? false,
      isActive: product.isActive ?? true,
    });
    setSpecs(product.specs || []);
    setVariants(product.variants || []);
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
      basePrice: '',
      featured: false,
      isActive: true,
    });
    setSpecs([]);
    setVariants([]);
  };

  const addSpec = () => setSpecs(prev => [...prev, { label: '', value: '' }]);
  const updateSpec = (index, key, value) => {
    setSpecs(prev => prev.map((spec, i) => (i === index ? { ...spec, [key]: value } : spec)));
  };
  const removeSpec = (index) => {
    setSpecs(prev => prev.filter((_, i) => i !== index));
  };

  const addVariant = () => setVariants(prev => [...prev, {
    name: '',
    size: '',
    sku: '',
    price: '',
    stock: '',
    isActive: true,
    specs: [],
  }]);
  const updateVariant = (index, key, value) => {
    setVariants(prev => prev.map((variant, i) => (i === index ? { ...variant, [key]: value } : variant)));
  };
  const removeVariant = (index) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="admin-products">
      <AdminTopNav />
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
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
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
              <label>Base Price (BHD)</label>
              <input
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleInputChange}
                placeholder="e.g., 1.250"
                step="0.001"
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
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
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

            <div className="admin-form-group full-width">
              <div className="admin-section-header">
                <label>Specifications</label>
                <button type="button" className="admin-btn-secondary" onClick={addSpec}>
                  + Add Spec
                </button>
              </div>
              <div className="admin-inline-grid">
                {specs.map((spec, index) => (
                  <div key={`spec-${index}`} className="admin-inline-row">
                    <input
                      type="text"
                      placeholder="Label"
                      value={spec.label || ''}
                      onChange={(e) => updateSpec(index, 'label', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={spec.value || ''}
                      onChange={(e) => updateSpec(index, 'value', e.target.value)}
                    />
                    <button type="button" className="btn-delete" onClick={() => removeSpec(index)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-form-group full-width">
              <div className="admin-section-header">
                <label>Variants</label>
                <button type="button" className="admin-btn-secondary" onClick={addVariant}>
                  + Add Variant
                </button>
              </div>
              {variants.map((variant, index) => (
                <div key={`variant-${index}`} className="admin-variant-card">
                  <div className="admin-inline-row">
                    <input
                      type="text"
                      placeholder="Name"
                      value={variant.name || ''}
                      onChange={(e) => updateVariant(index, 'name', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Size"
                      value={variant.size || ''}
                      onChange={(e) => updateVariant(index, 'size', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="SKU"
                      value={variant.sku || ''}
                      onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                    />
                  </div>
                  <div className="admin-inline-row">
                    <input
                      type="number"
                      placeholder="Price (BHD)"
                      value={variant.price ?? ''}
                      step="0.001"
                      onChange={(e) => updateVariant(index, 'price', e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={variant.stock ?? ''}
                      onChange={(e) => updateVariant(index, 'stock', e.target.value)}
                    />
                    <label className="admin-inline-checkbox">
                      <input
                        type="checkbox"
                        checked={variant.isActive !== false}
                        onChange={(e) => updateVariant(index, 'isActive', e.target.checked)}
                      />
                      Active
                    </label>
                  </div>
                  <button type="button" className="btn-delete" onClick={() => removeVariant(index)}>
                    Remove Variant
                  </button>
                </div>
              ))}
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

            <div className="admin-form-group checkbox">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
              />
              <label htmlFor="featured">Featured on Shop</label>
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
                  <th>Featured</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id}>
                    <td className="col-name">{product.name}</td>
                    <td className="col-category">{product.categorySlug?.name || '-'}</td>
                    <td className="col-brand">{product.brand || '-'}</td>
                    <td className="col-sku">{product.sku || '-'}</td>
                    <td>{product.featured ? 'Yes' : 'No'}</td>
                    <td className="col-status">
                      <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                        {product.isActive ? '✓ Active' : '○ Inactive'}
                      </span>
                    </td>
                    <td className="col-date">
                      {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : '-'}
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
