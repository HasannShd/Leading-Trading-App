import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import './AdminCategories.css';
import AdminTopNav from './AdminTopNav';
import { getAdminPaths } from './adminPaths';
import { authFetch, API_URL } from '../../services/authFetch';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    parent: '',
    sortOrder: 0,
  });
  const location = useLocation();
  const adminLoginPath = getAdminPaths(location.pathname.startsWith('/admin')).login;
  const handleUnauthorized = () => {
    setError('Admin session expired. Please sign in again.');
    window.location.href = adminLoginPath;
  };

  const fetchCategories = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
  };

  const slugify = (value) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'name' && !prev.slug ? { slug: slugify(value) } : {}),
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const data = new FormData();
      data.append('image', file);
      const response = await authFetch('/upload', {
        method: 'POST',
        scope: 'admin',
        body: data,
      });
      const resData = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }
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
      const url = editingId ? `${API_URL}/categories/${editingId}` : `${API_URL}/categories`;

      const response = await authFetch(url.replace(API_URL, ''), {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        scope: 'admin',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }
        setError(data.message || 'Operation failed');
        return;
      }

      setError(null);
      setFormData({ name: '', slug: '', description: '', image: '', parent: '', sortOrder: 0 });
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
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      image: category.image || '',
      parent: category.parent?._id || category.parent || '',
      sortOrder: Number(category.sortOrder || 0),
    });
    setEditingId(category._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    setLoading(true);
    try {
      const response = await authFetch(`/categories/${id}`, {
        method: 'DELETE',
        scope: 'admin',
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }
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
    setFormData({ name: '', slug: '', description: '', image: '', parent: '', sortOrder: 0 });
  };

  const parentOptions = categories.filter((category) => category._id !== editingId);
  const describedCount = categories.filter((category) => category.description?.trim()).length;
  const topLevelCount = categories.filter((category) => !category.parent).length;
  const childCount = categories.length - topLevelCount;

  return (
    <div className="admin-categories admin-surface">
      <AdminTopNav />
      <section className="admin-surface-hero">
        <div className="admin-surface-eyebrow">Catalog Structure</div>
        <div className="admin-surface-hero-row">
          <div className="admin-surface-copy">
            <h1>Organize categories clearly for admins and buyers.</h1>
            <p>
              Keep the catalog easy to scan by maintaining clean parent-child structure, stable slugs, and short descriptions that explain each category properly.
            </p>
          </div>
          <div className="admin-surface-actions">
            {!showForm && (
              <button className="admin-add-btn" onClick={() => setShowForm(true)}>
                Add New Category
              </button>
            )}
          </div>
        </div>
        <div className="admin-surface-stats">
          <div className="admin-surface-stat">
            <strong>{categories.length}</strong>
            <span>Total categories</span>
          </div>
          <div className="admin-surface-stat">
            <strong>{topLevelCount}</strong>
            <span>Top-level groups</span>
          </div>
          <div className="admin-surface-stat">
            <strong>{childCount}</strong>
            <span>Sub-categories</span>
          </div>
          <div className="admin-surface-stat">
            <strong>{describedCount}</strong>
            <span>With descriptions</span>
          </div>
        </div>
      </section>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-surface-grid">
        <div className="admin-side-stack">
          {showForm && (
        <div className="admin-form-container">
          <div className="admin-panel-heading">
            <div>
              <h2>{editingId ? 'Edit Category' : 'Add New Category'}</h2>
              <p>Use short names, clean slugs, and simple hierarchy so the public catalog stays easy to navigate.</p>
            </div>
          </div>
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
              <label>Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="e.g., surgical-instruments"
              />
              <small>Auto-generated from name, but you can edit it</small>
            </div>

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

            <div className="admin-form-group">
              <label>Parent Category</label>
              <select
                name="parent"
                value={formData.parent}
                onChange={handleInputChange}
              >
                <option value="">None (top-level category)</option>
                {parentOptions.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label>Sort Order</label>
              <input
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>

            <div className="admin-form-group">
              <label>Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="e.g., /Categories/dental.webp"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
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
        <div className="admin-panel-heading">
          <div>
            <h2>All Categories ({categories.length})</h2>
            <p>Review structure, fill missing descriptions, and fix naming before updating products.</p>
          </div>
          <div className="admin-summary-pills">
            <span className="admin-summary-pill"><strong>{topLevelCount}</strong> main groups</span>
            <span className="admin-summary-pill"><strong>{describedCount}</strong> described</span>
          </div>
        </div>
        
        {loading && !showForm && <p className="loading">Loading...</p>}

        {categories.length === 0 && !loading ? (
          <p className="empty-message">No categories found. Create one to get started!</p>
        ) : (
          <div className="categories-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Parent</th>
                  <th>Level</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Desc?</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat._id}>
                    <td className="col-name" data-label="Name">{cat.name}</td>
                    <td className="col-slug" data-label="Parent">{cat.parent?.name || '-'}</td>
                    <td className="col-desc-flag" data-label="Level">{cat.parent ? 'Sub' : 'Main'}</td>
                    <td className="col-slug" data-label="Slug">{cat.slug || '-'}</td>
                    <td className="col-desc" data-label="Description">{cat.description || '-'}</td>
                    <td className="col-desc-flag" data-label="Desc?">{cat.description?.trim() ? 'Yes' : 'No'}</td>
                    <td className="col-date" data-label="Created">
                      {formatDate(cat.createdAt)}
                    </td>
                    <td className="col-actions" data-label="Actions">
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

        <aside className="admin-side-stack">
          <div className="admin-note-card">
            <h3>Category Quality Checklist</h3>
            <ul>
              <li>Keep parent groups broad and sub-categories specific.</li>
              <li>Use readable slugs because product URLs and filters depend on them.</li>
              <li>Add descriptions to the most important categories first.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminCategories;
