import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../Common/Input';
import Card from '../Common/Card';
import './Shop.css';

const Shop = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12, featured: 'true' });
      if (q) params.set('search', q);
      if (category) params.set('category', category);
      const response = await fetch(`${API_URL}/products?${params.toString()}`);
      const data = await response.json();
      const items = Array.isArray(data) ? data : (data.items || []);
      const sorted = [...items].sort((a, b) => {
        if (sort === 'price') {
          const priceA = Number(a.basePrice || a.variants?.[0]?.price || 0);
          const priceB = Number(b.basePrice || b.variants?.[0]?.price || 0);
          return priceA - priceB;
        }
        return a.name.localeCompare(b.name);
      });
      setProducts(sorted);
      setTotal(Array.isArray(data) ? data.length : (data.total || 0));
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [page, sort, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const totalPages = Math.ceil(total / 12);

  return (
    <main>
      <section className="shop-section">
        <div className="shop-header">
          <h1>Shop</h1>
          <form onSubmit={handleSearch} className="shop-search">
            <Input
              placeholder="Search products..."
              value={q}
              onChange={e => setQ(e.target.value)}
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="name">Sort: Name</option>
              <option value="price">Sort: Price</option>
            </select>
            <button className="btn" type="submit">Search</button>
          </form>
        </div>

        {loading ? (
          <p className="shop-empty">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="shop-empty">No products found.</p>
        ) : (
          <div className="shop-grid">
            {products.map(product => (
              <Link key={product._id} to={`/product/${product._id}`} className="shop-card-link">
                <Card>
                  <div className="shop-card-media">
                    {product.image || product.images?.[0] ? (
                      <img
                        src={
                          (product.image || product.images?.[0]).startsWith('http')
                            ? (product.image || product.images?.[0])
                            : `${import.meta.env.BASE_URL}${(product.image || product.images?.[0]).replace(/^\//, '')}`
                        }
                        alt={product.name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="shop-card-placeholder">No image</div>
                    )}
                  </div>
                  <div className="shop-card-body">
                    <h3>{product.name}</h3>
                    <p>{product.brand || '—'}</p>
                    <p className="shop-card-price">
                      {Number(
                        product.variants?.length
                          ? (Number(product.variants[0].price) > 0 ? product.variants[0].price : product.basePrice || 0)
                          : product.basePrice || 0
                      ).toFixed(3)} BHD
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="shop-pagination">
            <button className="btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
            <span>Page {page} of {totalPages}</span>
            <button className="btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Shop;
