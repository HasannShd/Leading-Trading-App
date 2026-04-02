import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Input from '../Common/Input';
import StatePanel from '../Common/StatePanel';
import './CategoryDetails.css';

const CategoryDetails = () => {
  const { slug } = useParams();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const deferredQuery = useDeferredValue(q);

  useEffect(() => {
    setQ('');
    const fetchCategoryAndProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const categoryRes = await fetch(`${API_URL}/categories/${slug}`);
        if (!categoryRes.ok) {
          setCategory(null);
          setProducts([]);
          setError('Category not found');
          return;
        }

        const categoryData = await categoryRes.json();
        setCategory(categoryData);

        const productsRes = await fetch(`${API_URL}/products?category=${categoryData._id}&limit=200`);
        const productsData = await productsRes.json();
        setProducts(Array.isArray(productsData) ? productsData : (productsData.items || []));
      } catch (err) {
        setError('Failed to load category details');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [API_URL, slug]);

  const filteredProducts = useMemo(() => {
    const s = deferredQuery.toLowerCase().trim();
    if (!s) return products;
    return products.filter((p) =>
      [p.name, p.description, p.brand, p.sku]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(s))
    );
  }, [products, deferredQuery]);

  if (!loading && !category) {
    return (
      <main>
        <section className="category-details-shell">
          <StatePanel
            eyebrow="Unavailable"
            title="Category not available"
            description={error || 'The category you requested could not be found.'}
            variant="error"
            action={<Link className="btn primary" to="/products">Browse All Categories</Link>}
          />
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="category-details-shell">
        {loading ? (
          <StatePanel
            eyebrow="Loading"
            title="Preparing the category catalog"
            description="We’re loading the category details and the related products."
            variant="loading"
          />
        ) : (
          <>
            <section className="category-details-hero">
              <div className="category-details-hero-copy">
                <span className="category-details-eyebrow">Category Focus</span>
                <h1 className="category-details-title">{category.name}</h1>
                <p className="category-details-desc">
                  {category.description?.trim() || 'Browse the products available in this sourcing category and request support for matching specifications.'}
                </p>
              </div>

              <div className="category-details-hero-meta">
                <div className="category-details-meta-card">
                  <strong>{products.length}</strong>
                  <span>products currently listed</span>
                </div>
                <div className="category-details-meta-card">
                  <strong>{new Set(products.map((product) => product.brand).filter(Boolean)).size || 1}</strong>
                  <span>brands represented</span>
                </div>
                <Link className="btn primary" to="/contact">Request sourcing support</Link>
              </div>
            </section>

            <div className="category-details-products-header">
              <div>
                <h2 className="category-details-products-title">Products in this category</h2>
                <p className="category-details-products-copy">
                  Filter by name, brand, description, or SKU to narrow the category quickly.
                </p>
              </div>
              <div className="category-details-products-spacer" />
              <Input
                className="category-details-search"
                placeholder="Search products in this category"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                disabled={products.length === 0}
              />
            </div>

            {products.length === 0 ? (
              <StatePanel
                eyebrow="Empty Category"
                title="No products in this category yet"
                description="This category is live, but the product catalog has not been populated yet."
              />
            ) : filteredProducts.length === 0 ? (
              <StatePanel
                eyebrow="No Match"
                title="No products match that search"
                description={`Nothing in ${category.name} matched "${q.trim()}". Try a broader keyword.`}
                action={<button className="btn" onClick={() => setQ('')}>Clear Search</button>}
              />
            ) : (
              <ul className="category-details-products-list">
                {filteredProducts.map((p) => {
                  const productImage = p.image || p.images?.[0] || '';
                  const price = Number(p.basePrice || p.variants?.[0]?.price || 0);

                  return (
                    <li key={p._id} className="category-details-product-item">
                      <Link to={`/product/${p._id}`} className="category-details-product-link">
                        {productImage ? (
                          <div className="category-details-product-media">
                            <img
                              src={
                                productImage.startsWith('http')
                                  ? productImage
                                  : `${import.meta.env.BASE_URL}${productImage.replace(/^\//, '')}`
                              }
                              alt={p.name}
                              className="category-details-product-img"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="category-details-product-media category-details-product-media--empty">
                            <span>{p.name?.[0] || 'P'}</span>
                          </div>
                        )}

                        <div className="category-details-product-copy">
                          <span>{p.brand || 'Sourcing item'}</span>
                          <strong>{p.name}</strong>
                          <p>{p.description?.trim() || 'Open the product to review specifications, variants, and request options.'}</p>
                        </div>

                        <div className="category-details-product-footer">
                          <span className="category-details-product-price">
                            {Number.isFinite(price) && price > 0 ? `${price.toFixed(3)} BHD` : 'Quote on request'}
                          </span>
                          <span className="category-details-product-cta">Open product</span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default CategoryDetails;
