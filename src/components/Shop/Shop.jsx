import { useDeferredValue, useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Input from '../Common/Input';
import Card from '../Common/Card';
import StatePanel from '../Common/StatePanel';
import { normalizeImageSrc } from '../../utils/normalizeImageSrc';
import './Shop.css';

const getProductPrice = (product) => {
  const firstVariantPrice = Number(product.variants?.[0]?.price);
  const basePrice = Number(product.basePrice || 0);
  if (Number.isFinite(firstVariantPrice) && firstVariantPrice > 0) return firstVariantPrice;
  if (Number.isFinite(basePrice) && basePrice > 0) return basePrice;
  return 0;
};

const Shop = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [brokenImages, setBrokenImages] = useState({});

  const deferredQuery = useDeferredValue(q);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }, [API_URL]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    setBrokenImages({});
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (searchQuery) params.set('search', searchQuery);
      if (category) params.set('category', category);
      const response = await fetch(`${API_URL}/products?${params.toString()}`);
      const data = await response.json();
      const items = Array.isArray(data) ? data : (data.items || []);
      let next = [...items];

      if (sort === 'price') {
        next.sort((a, b) => getProductPrice(a) - getProductPrice(b));
      } else if (sort === 'name') {
        next.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sort === 'featured') {
        next.sort((a, b) => Number(b.featured === true) - Number(a.featured === true));
      }

      setProducts(next);
      setTotal(Array.isArray(data) ? data.length : (data.total || 0));
    } catch (err) {
      setError('We could not load the product catalog right now.');
    } finally {
      setLoading(false);
    }
  }, [API_URL, page, searchQuery, category, sort]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (deferredQuery.trim() === searchQuery) return;
    const id = setTimeout(() => {
      setPage(1);
      setSearchQuery(deferredQuery.trim());
    }, 180);

    return () => clearTimeout(id);
  }, [deferredQuery, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchQuery(q.trim());
  };

  const totalPages = Math.max(1, Math.ceil(total / 12));

  const featuredCount = useMemo(
    () => products.filter((product) => product.featured === true).length,
    [products]
  );

  return (
    <main>
      <section className="shop-shell">
        <section className="shop-hero">
          <div className="shop-hero-copy">
            <span className="shop-eyebrow">Product Catalog</span>
            <h1>Browse products with clearer structure, faster filtering, and stronger purchase intent.</h1>
            <p>
              Review the active catalog, narrow by category, and move straight into product detail pages built
              for quotes, repeat orders, and operational sourcing.
            </p>
          </div>

          <div className="shop-hero-stats">
            <div className="shop-hero-stat">
              <strong>{total || products.length}</strong>
              <span>products available</span>
            </div>
            <div className="shop-hero-stat">
              <strong>{categories.length}</strong>
              <span>catalog categories</span>
            </div>
            <div className="shop-hero-stat">
              <strong>{featuredCount}</strong>
              <span>featured right now</span>
            </div>
          </div>
        </section>

        <section className="shop-toolbar">
          <form onSubmit={handleSearch} className="shop-search">
            <Input
              placeholder="Search products by name, brand, or SKU"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="featured">Sort: Featured</option>
              <option value="name">Sort: Name</option>
              <option value="price">Sort: Price</option>
            </select>
            <button className="btn primary" type="submit">Apply</button>
          </form>

          <div className="shop-toolbar-meta">
            <span>{products.length} shown on this page</span>
            {(searchQuery || category) && (
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setQ('');
                  setSearchQuery('');
                  setCategory('');
                  setPage(1);
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        </section>

        {loading ? (
          <StatePanel
            eyebrow="Loading"
            title="Preparing the product catalog"
            description="We’re collecting the latest products, categories, and current catalog filters."
            variant="loading"
          />
        ) : error ? (
          <StatePanel
            eyebrow="Unavailable"
            title="Product catalog unavailable"
            description={error}
            variant="error"
            action={<button className="btn primary" onClick={fetchProducts}>Try Again</button>}
          />
        ) : products.length === 0 ? (
          <StatePanel
            eyebrow="No Results"
            title="No products found"
            description="The current filters returned no products. Broaden the search or reset filters."
          />
        ) : (
          <div className="shop-grid">
            {products.map((product) => {
              const productImage = product.image || product.images?.[0] || '';
              const price = getProductPrice(product);
              const imageFailed = brokenImages[product._id] === true;

              return (
                <Link key={product._id} to={`/product/${product._id}`} className="shop-card-link">
                  <Card className="shop-card">
                    <div className="shop-card-media">
                      {productImage && !imageFailed ? (
                        <img
                          src={normalizeImageSrc(productImage)}
                          alt={product.name}
                          loading="lazy"
                          onError={() => {
                            setBrokenImages((prev) => ({ ...prev, [product._id]: true }));
                          }}
                        />
                      ) : (
                        <div className="shop-card-placeholder">
                          <span>{product.name?.[0] || 'P'}</span>
                        </div>
                      )}
                    </div>
                    <div className="shop-card-body">
                      <div className="shop-card-kicker">
                        <span>{product.brand || 'Sourcing item'}</span>
                        {product.featured ? <strong>Featured</strong> : null}
                      </div>
                      <h3>{product.name}</h3>
                      <p>{product.description?.trim() || 'Open the product to review variants, specifications, and request options.'}</p>
                      <div className="shop-card-footer">
                        <span className="shop-card-price">
                          {price > 0 ? `${price.toFixed(3)} BHD` : 'Quote on request'}
                        </span>
                        <span className="shop-card-cta">View details</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="shop-pagination">
            <button className="btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
            <span>Page {page} of {totalPages}</span>
            <button className="btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Shop;
