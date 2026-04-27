import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import './AdminProducts.css';
import AdminTopNav from './AdminTopNav';
import { getAdminPaths } from './adminPaths';
import { authFetch, API_URL } from '../../services/authFetch';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [adminPage, setAdminPage] = useState(1);
  const [specs, setSpecs] = useState([]);
  const [variants, setVariants] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    categorySlug: '',
    description: '',
    image: '',
    images: [],
    sku: '',
    brand: '',
    basePrice: '',
    featured: false,
    isActive: true,
  });
  const location = useLocation();
  const adminLoginPath = getAdminPaths(location.pathname.startsWith('/admin')).login;
  const handleUnauthorized = useCallback(() => {
    setError('Admin session expired. Please sign in again.');
    window.location.href = adminLoginPath;
  }, [adminLoginPath]);

  const handleAdminPrecondition = (message) => {
    setProducts([]);
    setError(message || 'Admin setup is required before using this section.');
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await authFetch('/products/admin/all', { scope: 'admin' });
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      const data = await response.json();
      if (response.status === 428) {
        handleAdminPrecondition(data.message);
        return;
      }
      if (!response.ok) {
        setProducts([]);
        setError(data.message || 'Failed to fetch products');
        return;
      }
      setProducts(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setProducts([]);
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  useEffect(() => {
    setAdminPage(1);
  }, [searchTerm, selectedCategoryId]);

  useEffect(() => {
    if (showForm) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = '';
    }
    return () => { document.body.style.overflowY = ''; };
  }, [showForm]);

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
  };

  const hasProductImage = (product) => Boolean(
    product?.image?.trim() ||
    product?.images?.some((image) => image?.trim()) ||
    product?.variants?.some((variant) => variant?.image?.trim())
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCategorySelect = (value) => {
    setSelectedCategoryId(value);
    setFormData(prev => ({
      ...prev,
      categorySlug: value,
    }));
    setError(null);
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
        if (response.status === 428) {
          handleAdminPrecondition(resData.message);
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

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setLoading(true);
    try {
      const uploaded = [];
      for (const file of files) {
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
          if (response.status === 428) {
            handleAdminPrecondition(resData.message);
            break;
          }
          setError(resData.message || 'Upload failed');
          break;
        }
        uploaded.push(resData.url);
      }
      if (uploaded.length) {
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), ...uploaded],
          image: prev.image || uploaded[0],
        }));
      }
      setError(null);
    } catch (err) {
      setError('Upload failed');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const removeGalleryImage = (url) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter(img => img !== url),
      image: prev.image === url ? '' : prev.image,
    }));
  };

  const handleVariantImageUpload = async (variantIndex, file) => {
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
      setVariants(prev => prev.map((variant, i) => (
        i === variantIndex ? { ...variant, image: resData.url } : variant
      )));
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
      if (!formData.categorySlug) {
        setError('Please choose a category.');
        setLoading(false);
        return;
      }
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/products/${editingId}` : `${API_URL}/products`;
      const normalizedVariants = variants.map(variant => ({
        ...variant,
        name: variant.name || variant.type,
        price: Number(variant.price || formData.basePrice || 0),
        sizes: (variant.sizes || [])
          .filter(entry => entry.size || entry.inches || entry.color)
          .map(entry => ({
            ...entry,
            price: entry.price === '' || entry.price === null || typeof entry.price === 'undefined'
              ? undefined
              : Number(entry.price),
            outOfStock: entry.outOfStock === true,
          })),
        isActive: variant.isActive !== false,
      }));
      const payload = {
        ...formData,
        basePrice: Number(formData.basePrice || 0),
        specs: specs.filter(spec => spec.label || spec.value),
        variants: normalizedVariants,
        images: formData.images || [],
      };
      const response = await authFetch(url.replace(API_URL, ''), {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        scope: 'admin',
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }
        if (response.status === 428) {
          handleAdminPrecondition(data.message);
          return;
        }
        setError(data.message || 'Operation failed');
        return;
      }

      setError(null);
      setFormData({
        name: '',
        categorySlug: '',
        description: '',
        image: '',
        images: [],
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
    const categoryId = product.categorySlug?._id || product.categorySlug || '';
    setFormData({
      name: product.name || '',
      categorySlug: categoryId,
      description: product.description || '',
      image: product.image || '',
      images: product.images || [],
      sku: product.sku || '',
      brand: product.brand || '',
      basePrice: product.basePrice ?? '',
      featured: product.featured ?? false,
      isActive: product.isActive ?? true,
    });
    setSpecs(product.specs || []);
    setVariants((product.variants || []).map(variant => ({
      ...variant,
      sizes: variant.sizes || [],
    })));
    setEditingId(product._id);
    setSelectedCategoryId(categoryId);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setLoading(true);
    try {
      const response = await authFetch(`/products/${id}`, {
        method: 'DELETE',
        scope: 'admin',
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }
        if (response.status === 428) {
          handleAdminPrecondition(data.message);
          return;
        }
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
      images: [],
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
    type: '',
    image: '',
    price: '',
    sizes: [{ size: '', inches: '', color: '', outOfStock: false }],
    isActive: true,
  }]);
  const updateVariant = (index, key, value) => {
    setVariants(prev => prev.map((variant, i) => (i === index ? { ...variant, [key]: value } : variant)));
  };
  const removeVariant = (index) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };
  const addVariantSize = (variantIndex) => {
    setVariants(prev => prev.map((variant, i) => (
      i === variantIndex
        ? { ...variant, sizes: [...(variant.sizes || []), { size: '', inches: '', color: '', price: '', outOfStock: false }] }
        : variant
    )));
  };
  const updateVariantSize = (variantIndex, sizeIndex, key, value) => {
    setVariants(prev => prev.map((variant, i) => (
      i === variantIndex
        ? {
            ...variant,
            sizes: (variant.sizes || []).map((entry, j) => (
              j === sizeIndex ? { ...entry, [key]: value } : entry
            )),
          }
        : variant
    )));
  };
  const removeVariantSize = (variantIndex, sizeIndex) => {
    setVariants(prev => prev.map((variant, i) => (
      i === variantIndex
        ? { ...variant, sizes: (variant.sizes || []).filter((_, j) => j !== sizeIndex) }
        : variant
    )));
  };

  const resolveCategoryName = (categoryValue) => {
    if (!categoryValue) return '';
    const byId = categories.find(cat => cat._id === categoryValue);
    if (byId) return byId.name || '';
    const bySlug = categories.find(cat => cat.slug === categoryValue);
    return bySlug?.name || '';
  };

  const leafCategories = categories.filter((category) =>
    !categories.some((candidate) => (candidate.parent?._id || candidate.parent) === category._id)
  );

  const parentCategories = categories.filter((category) => !category.parent);

  const groupedLeafCategories = parentCategories
    .map((parent) => ({
      parent,
      children: leafCategories.filter((category) => (category.parent?._id || category.parent) === parent._id),
    }))
    .filter((group) => group.children.length > 0);

  const ungroupedLeafCategories = leafCategories.filter((category) => !category.parent);

  const buildAutoDescription = () => {
    const name = formData.name.trim();
    if (!name) {
      setError('Add a product name before generating a description.');
      return '';
    }
    const brand = formData.brand.trim();
    const categoryName = resolveCategoryName(formData.categorySlug);
    const leadRange = categoryName ? `our ${categoryName}` : 'our medical supplies';
    const lead = `${name}${brand ? ` by ${brand}` : ''} is part of ${leadRange} range, built for reliable day-to-day use.`;
    const specPairs = specs
      .filter(spec => spec.label && spec.value)
      .slice(0, 3)
      .map(spec => `${spec.label}: ${spec.value}`);
    const specLine = specPairs.length ? `Key specs: ${specPairs.join(', ')}.` : '';
    const variantTypes = Array.from(new Set(variants.map(variant => variant.type).filter(Boolean)));
    const variantLine = variantTypes.length ? `Available options include ${variantTypes.join(', ')}.` : '';
    const skuLine = formData.sku.trim() ? `SKU: ${formData.sku.trim()}.` : '';
    return [lead, specLine, variantLine, skuLine].filter(Boolean).join(' ');
  };

  const handleAutoDescription = () => {
    const generated = buildAutoDescription();
    if (!generated) return;
    setFormData(prev => ({ ...prev, description: generated }));
    setError(null);
  };

  const ADMIN_PAGE_SIZE = 20;

  const visibleProducts = products
    .filter(product => !selectedCategoryId || product.categorySlug?._id === selectedCategoryId || product.categorySlug === selectedCategoryId)
    .filter(product => {
      const needle = searchTerm.trim().toLowerCase();
      if (!needle) return true;
      const haystack = [
        product.name,
        product.brand,
        product.sku,
      ].join(' ').toLowerCase();
      return haystack.includes(needle);
    });

  const totalAdminPages = Math.max(1, Math.ceil(visibleProducts.length / ADMIN_PAGE_SIZE));
  const pagedProducts = visibleProducts.slice((adminPage - 1) * ADMIN_PAGE_SIZE, adminPage * ADMIN_PAGE_SIZE);

  const activeProducts = products.filter((product) => product.isActive !== false).length;
  const featuredProducts = products.filter((product) => product.featured).length;
  const withImages = products.filter((product) => hasProductImage(product)).length;

  return (
    <div className="admin-products admin-surface">
      <AdminTopNav />
      <section className="admin-surface-hero">
        <div className="admin-surface-eyebrow">Product Catalog</div>
        <div className="admin-surface-hero-row">
          <div className="admin-surface-copy">
            <h1>Manage products with cleaner structure and faster editing.</h1>
            <p>
              Filter by category, keep media and descriptions complete, and update specifications or variants without losing track of the catalog quality.
            </p>
          </div>
          <div className="admin-surface-actions">
            {!showForm && (
              <button
                className="admin-add-btn"
                onClick={() => {
                  if (!selectedCategoryId) {
                    setError('Please choose a category before adding a product.');
                    return;
                  }
                  setFormData(prev => ({ ...prev, categorySlug: selectedCategoryId }));
                  setShowForm(true);
                }}
              >
                Add New Product
              </button>
            )}
          </div>
        </div>
        <div className="admin-surface-stats">
          <div className="admin-surface-stat">
            <strong>{products.length}</strong>
            <span>Total products</span>
          </div>
          <div className="admin-surface-stat">
            <strong>{activeProducts}</strong>
            <span>Active products</span>
          </div>
          <div className="admin-surface-stat">
            <strong>{featuredProducts}</strong>
            <span>Featured</span>
          </div>
          <div className="admin-surface-stat">
            <strong>{withImages}</strong>
            <span>With images</span>
          </div>
        </div>
      </section>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-surface-grid">
        <div className="admin-side-stack">
          <div className="admin-category-section admin-categories-list">
            <div className="admin-category-header">
              <h2>Categories</h2>
              <p>Pick a category folder to create products inside it.</p>
            </div>
            <div className="admin-category-grid">
              <button
                type="button"
                className={`admin-category-tile${selectedCategoryId ? '' : ' active'}`}
                onClick={() => {
                  setSelectedCategoryId('');
                  if (!editingId) {
                    setFormData(prev => ({ ...prev, categorySlug: '' }));
                  }
                }}
              >
                <span className="admin-category-icon">🗂️</span>
                <span className="admin-category-name">All Categories</span>
              </button>
              {leafCategories.map(cat => (
                <button
                  key={cat._id}
                  type="button"
                  className={`admin-category-tile${selectedCategoryId === cat._id ? ' active' : ''}`}
                  onClick={() => {
                    handleCategorySelect(cat._id);
                  }}
                >
                  <span className="admin-category-icon">📁</span>
                  <span className="admin-category-name">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="admin-products-list admin-categories-list">
            <div className="admin-panel-heading">
              <div>
                <h2>All Products ({visibleProducts.length})</h2>
                <p>Review the filtered catalog, fix missing media or descriptions, and open items for editing when details need cleanup.</p>
              </div>
              <div className="admin-summary-pills">
                <span className="admin-summary-pill"><strong>{activeProducts}</strong> active</span>
                <span className="admin-summary-pill"><strong>{featuredProducts}</strong> featured</span>
                <span className="admin-summary-pill"><strong>{withImages}</strong> with images</span>
              </div>
            </div>
            <div className="admin-products-toolbar">
              <label htmlFor="admin-product-search">Search products</label>
              <div className="admin-search-control">
                <span className="admin-search-icon" aria-hidden="true">⌕</span>
                <input
                  id="admin-product-search"
                  type="text"
                  placeholder="Search by name, brand, or SKU"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="admin-search-clear"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            
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
                      <th>Image</th>
                      <th>Desc?</th>
                      <th>Featured</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedProducts.map(product => (
                      <tr key={product._id}>
                        <td className="col-name" data-label="Name">{product.name}</td>
                        <td className="col-category" data-label="Category">{product.categorySlug?.name || '-'}</td>
                        <td className="col-brand" data-label="Brand">{product.brand || '-'}</td>
                        <td className="col-sku" data-label="SKU">{product.sku || '-'}</td>
                        <td className="col-image-flag" data-label="Image">
                          {hasProductImage(product) ? 'Yes' : 'No'}
                        </td>
                        <td className="col-desc-flag" data-label="Desc?">{product.description?.trim() ? 'Yes' : 'No'}</td>
                        <td data-label="Featured">{product.featured ? 'Yes' : 'No'}</td>
                        <td className="col-status" data-label="Status">
                          <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                            {product.isActive ? '✓ Active' : '○ Inactive'}
                          </span>
                        </td>
                        <td className="col-date" data-label="Created">
                          {formatDate(product.createdAt)}
                        </td>
                        <td className="col-actions" data-label="Actions">
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
            {totalAdminPages > 1 && (
              <div className="admin-products-pagination">
                <button className="admin-btn-secondary" disabled={adminPage === 1} onClick={() => setAdminPage(p => p - 1)}>← Prev</button>
                <span>Page {adminPage} of {totalAdminPages}</span>
                <button className="admin-btn-secondary" disabled={adminPage === totalAdminPages} onClick={() => setAdminPage(p => p + 1)}>Next →</button>
              </div>
            )}
          </div>
        </div>

        <aside className={`admin-side-stack admin-products-editor-rail${showForm ? ' has-editor' : ''}`}>
          {showForm ? (
            <>
              <button
                type="button"
                className="admin-products-editor-backdrop"
                aria-label="Close product editor"
                onClick={handleCancel}
              />
              <div className="admin-form-container admin-products-editor-panel">
              <div className="admin-panel-heading">
                <div>
                  <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                </div>
              </div>
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

                <div className="admin-form-group full-width">
                  <label>Category *</label>
                  <select
                    name="categorySlug"
                    value={formData.categorySlug}
                    onChange={(e) => handleCategorySelect(e.target.value)}
                    required
                  >
                    <option value="">Select a category</option>
                    {ungroupedLeafCategories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                    {groupedLeafCategories.map((group) => (
                      <optgroup key={group.parent._id} label={group.parent.name}>
                        {group.children.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </optgroup>
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

                <div className="admin-form-group">
                  <label>Gallery Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                  />
                  {formData.images?.length > 0 && (
                    <div className="admin-image-grid">
                      {formData.images.map(img => (
                        <div className="admin-image-thumb" key={img}>
                          <img src={img} alt="Gallery" />
                          <button
                            type="button"
                            className="admin-image-remove"
                            onClick={() => removeGalleryImage(img)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="admin-form-group full-width">
                  <div className="admin-section-header">
                    <label>Description</label>
                    <button type="button" className="admin-btn-secondary" onClick={handleAutoDescription}>
                      Auto-generate
                    </button>
                  </div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Product description..."
                    rows="2"
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
                  <p className="admin-helper-text">Variants are types. Add sizes/colors under each type. Size price overrides the variant/base price when set.</p>
                  {variants.map((variant, index) => (
                    <div key={`variant-${index}`} className="admin-variant-card">
                      <div className="admin-inline-row">
                        <input
                          type="text"
                          placeholder="Type (e.g., Adult / Kids)"
                          value={variant.type || ''}
                          onChange={(e) => updateVariant(index, 'type', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Type image URL"
                          value={variant.image || ''}
                          onChange={(e) => updateVariant(index, 'image', e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="Price (BHD)"
                          value={variant.price ?? ''}
                          step="0.001"
                          onChange={(e) => updateVariant(index, 'price', e.target.value)}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            handleVariantImageUpload(index, e.target.files?.[0]);
                            e.target.value = '';
                          }}
                        />
                      </div>
                      <div className="admin-variant-sizes">
                        <div className="admin-variant-sizes-header">
                          <span>Sizes</span>
                          <button
                            type="button"
                            className="admin-btn-secondary"
                            onClick={() => addVariantSize(index)}
                          >
                            + Add Size
                          </button>
                        </div>
                        {(variant.sizes || []).map((entry, sizeIndex) => (
                          <div key={`variant-${index}-size-${sizeIndex}`} className="admin-inline-row">
                            <input
                              type="text"
                              placeholder="Size"
                              value={entry.size || ''}
                              onChange={(e) => updateVariantSize(index, sizeIndex, 'size', e.target.value)}
                            />
                            <input
                              type="text"
                              placeholder="Inches"
                              value={entry.inches || ''}
                              onChange={(e) => updateVariantSize(index, sizeIndex, 'inches', e.target.value)}
                            />
                            <input
                              type="text"
                              placeholder="Color"
                              value={entry.color || ''}
                              onChange={(e) => updateVariantSize(index, sizeIndex, 'color', e.target.value)}
                            />
                            <input
                              type="number"
                              placeholder="Size Price (BHD)"
                              value={entry.price ?? ''}
                              step="0.001"
                              onChange={(e) => updateVariantSize(index, sizeIndex, 'price', e.target.value)}
                            />
                            <label className="admin-inline-checkbox">
                              <input
                                type="checkbox"
                                checked={entry.outOfStock === true}
                                onChange={(e) => updateVariantSize(index, sizeIndex, 'outOfStock', e.target.checked)}
                              />
                              Out of stock
                            </label>
                            <button
                              type="button"
                              className="btn-delete"
                              onClick={() => removeVariantSize(index, sizeIndex)}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="admin-inline-row">
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
            </>
          ) : null}

          <div className="admin-note-card admin-products-note-card">
            <h3>Product Maintenance Tips</h3>
            <ul>
              <li>Pick a category first so new products land in the right place.</li>
              <li>Fill media and description early because those gaps affect the public catalog immediately.</li>
              <li>Use variants only when they describe a real buyer choice like type, size, or color.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminProducts;
