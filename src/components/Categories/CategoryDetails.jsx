import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Input from '../Common/Input';
import StatePanel from '../Common/StatePanel';
import { normalizeImageSrc } from '../../utils/normalizeImageSrc';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import './CategoryDetails.css';

const CategoryDetails = () => {
  const { slug } = useParams();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brokenImages, setBrokenImages] = useState({});
  const rootRef = useRef(null);

  const deferredQuery = useDeferredValue(q);

  useScrollReveal(rootRef);

  useEffect(() => {
    setQ('');
    setBrokenImages({});
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
      <section className="category-details-shell" ref={rootRef}>
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
              <div className="category-details-hero-copy animate-stagger" data-stagger-step="110ms">
                <span className="category-details-eyebrow animate-on-scroll">Category Focus</span>
                {category.parent ? (
                  <div className="category-details-breadcrumb animate-on-scroll">
                    <Link to={`/categories/${category.parent.slug || category.parent._id}`}>{category.parent.name}</Link>
                    <span>/</span>
                    <strong>{category.name}</strong>
                  </div>
                ) : null}
                <h1 className="category-details-title animate-on-scroll">{category.name}</h1>
                <p className="category-details-desc animate-on-scroll">
                  {category.description?.trim() || 'Browse the products available in this category and request support for matching specifications.'}
                </p>
              </div>

              <div className="category-details-hero-meta animate-stagger" data-stagger-step="120ms">
                <div className="category-details-meta-card animate-on-scroll">
                  <strong>{products.length}</strong>
                  <span>products currently listed</span>
                </div>
                <div className="category-details-meta-card animate-on-scroll">
                  <strong>{new Set(products.map((product) => product.brand).filter(Boolean)).size || 1}</strong>
                  <span>brands represented</span>
                </div>
                <Link className="btn primary animate-on-scroll" to="/contact">Request sourcing support</Link>
              </div>
            </section>

            {category.children?.length ? (
              <section className="category-details-subcategories">
                <div className="category-details-subcategories-head animate-stagger" data-stagger-step="110ms">
                  <h2 className="animate-on-scroll">Subcategories inside {category.name}</h2>
                  <p className="animate-on-scroll">Open a subcategory to narrow the catalog further, or keep scrolling to review products across the full group.</p>
                </div>
                <div className="category-details-subcategories-grid animate-stagger" data-stagger-step="90ms">
                  {category.children.map((child) => (
                    <Link key={child._id} to={`/categories/${child.slug || child._id}`} className="category-details-subcategory-card animate-on-scroll">
                      <span>Subcategory</span>
                      <strong>{child.name}</strong>
                      <p>{child.description?.trim() || 'Open this subcategory to review the dedicated product set.'}</p>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            <div className="category-details-products-header animate-stagger" data-stagger-step="110ms">
              <div className="animate-on-scroll">
                <h2 className="category-details-products-title">
                  {category.children?.length ? 'Products across this main category' : 'Products in this category'}
                </h2>
                <p className="category-details-products-copy">
                  Filter by name, brand, description, or SKU to narrow the category quickly.
                </p>
              </div>
              <div className="category-details-products-spacer" />
              <Input
                className="category-details-search animate-on-scroll"
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
              <ul className="category-details-products-list animate-stagger" data-stagger-step="100ms">
                {filteredProducts.map((p) => {
                  const productImage = p.image || p.images?.[0] || '';
                  const price = Number(p.basePrice || p.variants?.[0]?.price || 0);
                  const imageFailed = brokenImages[p._id] === true;

                  return (
                    <li key={p._id} className="category-details-product-item animate-on-scroll">
                      <Link to={`/product/${p._id}`} className="category-details-product-link">
                        {productImage && !imageFailed ? (
                          <div className="category-details-product-media">
                            <img
                              src={normalizeImageSrc(productImage)}
                              alt={p.name}
                              className="category-details-product-img"
                              loading="lazy"
                              onError={() => {
                                setBrokenImages((prev) => ({ ...prev, [p._id]: true }));
                              }}
                            />
                          </div>
                        ) : (
                          <div className="category-details-product-media category-details-product-media--empty">
                            <span>{p.name?.[0] || 'P'}</span>
                          </div>
                        )}

                        <div className="category-details-product-copy">
                          <span>
                            {p.categorySlug?.parent?.name
                              ? `${p.categorySlug.parent.name} / ${p.categorySlug?.name || ''}`
                              : (p.brand || 'Catalog item')}
                          </span>
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
