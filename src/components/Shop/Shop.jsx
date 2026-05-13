import { useDeferredValue, useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Input from '../Common/Input';
import Card from '../Common/Card';
import StatePanel from '../Common/StatePanel';
import SkeletonGrid from '../Common/SkeletonGrid';
import Seo from '../Common/Seo';
import { buildBreadcrumbSchema, buildCollectionSchema, buildFaqSchema } from '../../utils/seoSchemas';
import { buildSeoFaqs, buildSeoKeywords } from '../../utils/searchSeo';
import { useLanguage } from '../../context/LanguageContext';
import { normalizeImageSrc } from '../../utils/normalizeImageSrc';
import { buildProductPath } from '../../utils/productUrls';
import { asCategoryArray, buildCategoryTree, getCategoryId } from '../../utils/categoryTree';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import './Shop.css';

const PRODUCT_PAGE_SIZE = 12;
const SHOP_CACHE_TTL_MS = 5 * 60 * 1000;
const memoryCache = {
  categories: null,
};

const asProductArray = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);

const getProductId = (product, index) => String(product?._id || product?.id || `catalog-item-${index}`);

const getSessionCache = (key) => {
  if (typeof window === 'undefined') return null;
  try {
    const cached = JSON.parse(window.sessionStorage.getItem(key) || 'null');
    if (!cached || Date.now() - cached.savedAt > SHOP_CACHE_TTL_MS) return null;
    return cached.value;
  } catch (error) {
    return null;
  }
};

const setSessionCache = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), value }));
  } catch (error) {
    // Ignore storage limits/private mode.
  }
};

const getProductPrice = (product) => {
  const firstVariantPrice = Number(product.variants?.[0]?.price);
  const basePrice = Number(product.basePrice || 0);
  if (Number.isFinite(firstVariantPrice) && firstVariantPrice > 0) return firstVariantPrice;
  if (Number.isFinite(basePrice) && basePrice > 0) return basePrice;
  return 0;
};

const suggestionText = (value) => String(value || '').trim();

const productDescription = (product, t) => {
  const description = product?.description?.trim();
  if (description) return description;
  const categoryLabel = product?.categorySlug?.name || product?.categorySlug?.parent?.name;
  if (categoryLabel) {
    return `${t('Product details, variants, and quotation support for')} ${categoryLabel}.`;
  }
  return t('Contact LTE for specifications, availability, and quotation support for this catalog item.');
};

const Shop = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const { t, categoryName } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || searchParams.get('search') || '';
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState(initialQuery);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(initialQuery.trim());
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [brokenImages, setBrokenImages] = useState({});
  const rootRef = useRef(null);

  const deferredQuery = useDeferredValue(q);

  useScrollReveal(rootRef);

  const fetchCategories = useCallback(async () => {
    const cacheKey = `${API_URL}:shop-categories`;
    const cached = memoryCache.categories || getSessionCache(cacheKey);
    if (cached) {
      memoryCache.categories = cached;
      setCategories(cached);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/categories`);
      if (!response.ok) return;
      const data = await response.json();
      const nextCategories = asCategoryArray(data);
      memoryCache.categories = nextCategories;
      setSessionCache(cacheKey, nextCategories);
      setCategories(nextCategories);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }, [API_URL]);

  const fetchProducts = useCallback(async () => {
    const params = new URLSearchParams({ page, limit: PRODUCT_PAGE_SIZE });
    if (searchQuery) params.set('search', searchQuery);
    if (category) params.set('category', category);

    setLoading(true);
    setError('');
    setBrokenImages({});
    try {
      const response = await fetch(`${API_URL}/products?${params.toString()}`, { cache: 'no-store' });
      const data = await response.json();
      const items = Array.isArray(data) ? data : asProductArray(data.items);
      const nextPayload = {
        items,
        total: Array.isArray(data) ? data.length : (data.total || 0),
      };
      setProducts(nextPayload.items);
      setTotal(nextPayload.total);
    } catch (err) {
      setError('We could not load the product catalog right now.');
    } finally {
      setLoading(false);
    }
  }, [API_URL, page, searchQuery, category]);

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

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams);
    if (searchQuery) {
      nextParams.set('q', searchQuery);
    } else {
      nextParams.delete('q');
      nextParams.delete('search');
    }

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [searchParams, searchQuery, setSearchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchQuery(q.trim());
  };

  const totalPages = Math.max(1, Math.ceil(total / PRODUCT_PAGE_SIZE));

  // 3D tilt — only fires on pointer:fine (desktop); CSS handles the transform
  const handleTiltMove = useCallback((e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    card.style.setProperty('--tilt-x', `${y * 6}deg`);
    card.style.setProperty('--tilt-y', `${x * 6}deg`);
  }, []);

  const handleTiltReset = useCallback((e) => {
    e.currentTarget.style.setProperty('--tilt-x', '0deg');
    e.currentTarget.style.setProperty('--tilt-y', '0deg');
  }, []);

  const featuredCount = useMemo(
    () => products.filter((product) => product.featured === true).length,
    [products]
  );

  const categoryTree = useMemo(() => buildCategoryTree(categories), [categories]);
  const flatCategories = useMemo(() => asCategoryArray(categories), [categories]);
  const selectedCategory = useMemo(
    () => flatCategories.find((item) => getCategoryId(item) === category),
    [category, flatCategories]
  );
  const seoSearchLabel = searchQuery || selectedCategory?.name || '';
  const shopSeoTitle = searchQuery
    ? `${searchQuery} Products Bahrain | Leading Trading Est Catalog`
    : 'Product Catalog | Medical, Dental & Industrial Supplies Bahrain | LTE';
  const shopSeoDescription = searchQuery
    ? `Find ${searchQuery} products and request quotation support from Leading Trading Est, a Bahrain supplier for medical, dental, laboratory, safety, and industrial buyers.`
    : 'Browse Leading Trading Est products for Bahrain healthcare, dental, laboratory, CSSD, safety, and industrial procurement with quotation support.';
  const sortedProducts = useMemo(() => {
    const next = asProductArray(products);
    if (sort === 'price') {
      next.sort((a, b) => getProductPrice(a) - getProductPrice(b));
    } else if (sort === 'name') {
      next.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
    } else if (sort === 'featured') {
      next.sort((a, b) => Number(b.featured === true) - Number(a.featured === true));
    }
    return next;
  }, [products, sort]);
  const searchSuggestions = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];

    const suggestions = [];
    const seen = new Set();
    const addSuggestion = (label, meta, value = label) => {
      const cleanLabel = suggestionText(label);
      const cleanValue = suggestionText(value);
      if (!cleanLabel || !cleanValue) return;
      const key = `${cleanLabel.toLowerCase()}|${meta}`;
      if (seen.has(key)) return;
      seen.add(key);
      suggestions.push({ label: cleanLabel, meta, value: cleanValue });
    };

    flatCategories.forEach((item) => {
      const label = categoryName(item.name);
      if (label?.toLowerCase().includes(term) || item.name?.toLowerCase().includes(term)) {
        addSuggestion(label, t('Category'), item.name);
      }
    });

    products.forEach((product) => {
      if (
        [product.name, product.brand, product.sku, product.description]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(term))
      ) {
        addSuggestion(product.name, product.brand || product.sku || t('Product'));
      }
    });

    return suggestions.slice(0, 6);
  }, [categoryName, flatCategories, products, q, t]);
  const showInitialLoading = loading && products.length === 0;

  return (
    <main>
      <Seo
        title={shopSeoTitle}
        description={shopSeoDescription}
        canonicalPath="/shop"
        keywords={buildSeoKeywords(
          seoSearchLabel,
          'medical product catalog Bahrain',
          'dental supplies catalog Bahrain',
          'laboratory supplies Bahrain',
          'CSSD supplies Bahrain',
          'industrial safety products Bahrain',
          'surgical instruments Bahrain',
          'LTE product catalog'
        )}
        structuredData={[
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Products', path: '/shop' },
          ]),
          buildCollectionSchema({
            name: 'Leading Trading Est Product Catalog',
            description: 'Medical, dental, laboratory, CSSD, safety, and industrial procurement catalog for Bahrain buyers.',
            path: '/shop',
            items: sortedProducts.map((product) => ({
              name: product.name,
              path: buildProductPath(product),
            })),
          }),
          buildFaqSchema([
            ...buildSeoFaqs(seoSearchLabel),
            {
              question: 'Can Bahrain buyers request quotations from the LTE product catalog?',
              answer:
                'Leading Trading Est supports Bahrain healthcare, dental, laboratory, safety, and industrial buyers with product browsing, sourcing support, and quotation handling.',
            },
          ]),
        ]}
      />
      <section className="shop-shell" ref={rootRef}>
        <nav className="shop-breadcrumb animate-on-scroll" aria-label="Breadcrumb">
          <Link to="/">{t('Home')}</Link>
          <span aria-hidden="true">›</span>
          <strong>{t('Products')}</strong>
          {selectedCategory?.name && (
            <>
              <span aria-hidden="true">›</span>
              <strong>{categoryName(selectedCategory.name)}</strong>
            </>
          )}
        </nav>

        <Link className="shop-floating-quote" to="/contact?source=shop" aria-label={t('Request Quotation')}>
          {t('Request Quote')}
        </Link>

        <section className="shop-hero">
          <div className="shop-hero-copy animate-stagger" data-stagger-step="110ms">
            <span className="shop-eyebrow animate-on-scroll">{t('Product Catalog')}</span>
            <h1 className="animate-on-scroll">{t('A structured catalog for medical, dental, and industrial sourcing.')}</h1>
            <p className="animate-on-scroll">
              {t('Review the active catalog, narrow by category, and move directly into product pages designed for quotations, repeat procurement, and operational decision-making.')}
            </p>
          </div>

          <div className="shop-hero-stats animate-stagger" data-stagger-step="120ms">
            <div className="shop-hero-stat animate-on-scroll">
              <strong>{total || products.length}</strong>
              <span>{t('products available')}</span>
            </div>
            <div className="shop-hero-stat animate-on-scroll">
              <strong>{categoryTree.length}</strong>
              <span>{t('main categories')}</span>
            </div>
            <div className="shop-hero-stat animate-on-scroll">
              <strong>{featuredCount}</strong>
              <span>{t('featured selections')}</span>
            </div>
          </div>
        </section>

        <section className="shop-guidance animate-stagger" data-stagger-step="100ms">
          <article className="shop-guidance-card animate-on-scroll">
            <span>{t('Catalog approach')}</span>
            <strong>{t('Review products by category first when the requirement is operational rather than brand-specific.')}</strong>
            <p>{t('For most procurement teams, category-led browsing is the fastest way to move from requirement to shortlist.')}</p>
          </article>
          <article className="shop-guidance-card animate-on-scroll">
            <span>{t('Quotation workflow')}</span>
            <strong>{t('Use the product pages to confirm specifications, variant structure, and quotation support.')}</strong>
            <p>{t('Where sizing, type selection, or documentation matters, the product detail page provides the clearer next step.')}</p>
          </article>
          <article className="shop-guidance-card animate-on-scroll">
            <span>{t('Repeat procurement')}</span>
            <strong>{t('Built for recurring demand across healthcare, dental, safety, and facility support categories.')}</strong>
            <p>{t('The LTE catalog is organized to support both one-time sourcing needs and repeat account purchasing.')}</p>
          </article>
        </section>

        <section className="shop-trust-strip animate-stagger" data-stagger-step="80ms" aria-label="Trust and procurement support">
          <div className="shop-trust-item animate-on-scroll">
            <span>{t('Compliance support')}</span>
            <strong>{t('Documentation and specification checks before quotation.')}</strong>
          </div>
          <div className="shop-trust-item animate-on-scroll">
            <span>{t('Local response')}</span>
            <strong>{t('Bahrain-based team for healthcare and industrial sourcing.')}</strong>
          </div>
          <div className="shop-trust-item animate-on-scroll">
            <span>{t('Repeat buying')}</span>
            <strong>{t('Catalog structure built for recurring procurement workflows.')}</strong>
          </div>
        </section>

        <section className="shop-toolbar animate-stagger" data-stagger-step="100ms">
          <form onSubmit={handleSearch} className="shop-search">
            <div className="shop-search-field animate-on-scroll">
              <Input
                placeholder={t('Search products by name, brand, or SKU')}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                autoComplete="off"
                aria-label={t('Search products by name, brand, or SKU')}
              />
              {searchSuggestions.length ? (
                <div className="shop-search-suggestions">
                  {searchSuggestions.map((suggestion) => (
                    <button
                      key={`${suggestion.meta}-${suggestion.label}`}
                      type="button"
                      onClick={() => {
                        setQ(suggestion.value);
                        setPage(1);
                        setSearchQuery(suggestion.value);
                      }}
                    >
                      <span>{suggestion.label}</span>
                      <small>{suggestion.meta}</small>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <select className="animate-on-scroll" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
              <option value="">{t('All Categories')}</option>
              {categoryTree.map((parent) => (
                parent.children?.length ? (
                  <optgroup key={parent._id} label={categoryName(parent.name)}>
                    <option value={parent._id}>{categoryName(parent.name)} ({t('All Categories')})</option>
                    {parent.children.map((child) => (
                      <option key={child._id} value={child._id}>{categoryName(child.name)}</option>
                    ))}
                  </optgroup>
                ) : (
                  <option key={parent._id} value={parent._id}>{categoryName(parent.name)}</option>
                )
              ))}
            </select>
            <select className="animate-on-scroll" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="featured">{t('Sort: Featured')}</option>
              <option value="name">{t('Sort: Name')}</option>
              <option value="price">{t('Sort: Price')}</option>
            </select>
            <button className="btn primary animate-on-scroll" type="submit">{t('Apply')}</button>
          </form>

          <div className="shop-toolbar-meta animate-on-scroll">
            <span>{loading ? t('Updating catalog...') : `${sortedProducts.length} ${t('shown on this page')}`}</span>
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
                {t('Reset Filters')}
              </button>
            )}
          </div>
        </section>

        {showInitialLoading ? (
          <SkeletonGrid count={12} />
        ) : error ? (
          <StatePanel
            eyebrow={t('Unavailable')}
            title={t('Product catalog unavailable')}
            description={t(error)}
            variant="error"
            action={<button className="btn primary" onClick={fetchProducts}>{t('Try Again')}</button>}
          />
        ) : sortedProducts.length === 0 ? (
          <StatePanel
            eyebrow={t('No Results')}
            title={t('No products found')}
            description={t('The current filters returned no products. Broaden the search or reset filters.')}
          />
        ) : (
          <div className="shop-grid animate-stagger" data-stagger-step="90ms">
            {sortedProducts.map((product, index) => {
              const productImage = product.image || product.images?.[0] || '';
              const price = getProductPrice(product);
              const productId = getProductId(product, index);
              const productName = product.name || 'Catalog product';
              const imageFailed = brokenImages[productId] === true;

              return (
                <Link key={productId} to={buildProductPath(product)} className="shop-card-link animate-on-scroll" onMouseMove={handleTiltMove} onMouseLeave={handleTiltReset}>
                  <Card className="shop-card">
                    <div className="shop-card-media">
                      {product.featured && (
                        <span className="shop-card-badge">{t('Featured')}</span>
                      )}
                      {productImage && !imageFailed ? (
                        <img
                          src={normalizeImageSrc(productImage, { width: 480 })}
                          alt={productName}
                          loading="lazy"
                          decoding="async"
                          onError={() => {
                            setBrokenImages((prev) => ({ ...prev, [productId]: true }));
                          }}
                        />
                      ) : (
                        <div className="shop-card-placeholder">
                          <span>{productName[0] || 'P'}</span>
                        </div>
                      )}
                    </div>
                    <div className="shop-card-body">
                      <div className="shop-card-kicker">
                        <span>{product.brand || t('Sourcing item')}</span>
                      </div>
                      <h3>{productName}</h3>
                      <p>{productDescription(product, t)}</p>
                      <div className="shop-card-footer">
                        <span className="shop-card-price">
                          {price > 0 ? `${price.toFixed(3)} BHD` : t('Quote on request')}
                        </span>
                        <span className="shop-card-cta">{t('View details')}</span>
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
            <button className="btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>{t('Prev')}</button>
            <span>{t('Page')} {page} {t('of')} {totalPages}</span>
            <button className="btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>{t('Next')}</button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Shop;
