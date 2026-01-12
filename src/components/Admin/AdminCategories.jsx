import { useState, useEffect, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import './AdminCategories.css';

const AdminCategories = () => {
  const { admin } = useContext(AdminContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Auto-generate slug from name
      // ...(name === 'name' && { slug: value.toLowerCase().replace(/\s+/g, '-') })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/categories/${editingId}` : `${API_URL}/categories`;

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
      setFormData({ name: '', description: '' });
      setEditingId(null);
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      setError('Failed to save category');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setFormData(category);
    setEditingId(category._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Failed to delete');
        return;
      }

      setError(null);
      fetchCategories();
    } catch (err) {
      setError('Failed to delete category');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', description: '' });
  };

  return (
    <div className="admin-categories">
      <div className="admin-page-header">
        <h1>📁 Categories Management</h1>
        {!showForm && (
          <button className="admin-add-btn" onClick={() => setShowForm(true)}>
            + Add New Category
          </button>
        )}
      </div>

      {error && <div className="admin-error">{error}</div>}

      {showForm && (
        <div className="admin-form-container">
          <h2>{editingId ? 'Edit Category' : 'Add New Category'}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-group">
              <label>Category Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Surgical Instruments"
                required
              />
            </div>

            {/* <div className="admin-form-group">
              <label>Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="e.g., surgical-instruments"
                required
              />
              <small>Auto-generated from name, but you can edit it</small>
            </div> */}

            <div className="admin-form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Category description..."
                rows="4"
              />
            </div>

            <div className="admin-form-actions">
              <button type="submit" className="admin-btn-primary" disabled={loading}>
                {loading ? 'Saving...' : editingId ? 'Update Category' : 'Create Category'}
              </button>
              <button type="button" className="admin-btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-categories-list">
        <h2>All Categories ({categories.length})</h2>
        
        {loading && !showForm && <p className="loading">Loading...</p>}

        {categories.length === 0 && !loading ? (
          <p className="empty-message">No categories found. Create one to get started!</p>
        ) : (
          <div className="categories-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  {/* <th>Slug</th> */}
                  <th>Description</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat._id}>
                    <td className="col-name">{cat.name}</td>
                    {/* <td className="col-slug">{cat.slug}</td> */}
                    <td className="col-desc">{cat.description || '-'}</td>
                    <td className="col-date">
                      {new Date(cat.createdAt).toLocaleDateString()}
                    </td>
                    <td className="col-actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(cat)}
                        disabled={loading}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(cat._id)}
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

export default AdminCategories;
