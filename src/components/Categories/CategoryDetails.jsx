import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Input from '../Common/Input';
import StatePanel from '../Common/StatePanel';
import SkeletonGrid from '../Common/SkeletonGrid';
import Seo from '../Common/Seo';
import { useLanguage } from '../../context/LanguageContext';
import { normalizeImageSrc } from '../../utils/normalizeImageSrc';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useCountUp } from '../../hooks/useCountUp';
import './CategoryDetails.css';

// Inline animated stat number
const StatCount = ({ value }) => {
  const ref = useCountUp(value, { duration: 1.3 });
  return <strong ref={ref}>{value}</strong>;
};

const legacyCategorySlugMap = {
  'lab-devices-consumables': 'laboratory',
  'medical-furniture': 'hospital-furniture-utilities',
  'industrial-supplies': 'industrial-safety',
  orthopedic: 'orthopedic-rehabilitation',
  'medical-dressing-first-aid': 'wound-care-dressing-first-aid',
  'hypodermic-disposable': 'injection-iv-disposable',
  'non-woven-surgical-disposables': 'ppe-non-woven-disposable',
  'examination-disposable': 'examination-general-disposable',
};

const productDescription = (product, category, categoryName, t) => {
  const description = product?.description?.trim();
  if (description) return description;

  const productCategory = product?.categorySlug?.name || category?.name;
  if (productCategory) {
    return `${t('Product details, variants, and quotation support for')} ${categoryName(productCategory)}.`;
  }

  return t('Contact LTE for specifications, availability, and quotation support for this catalog item.');
};

const CategoryDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const { t, categoryName, categoryDescription } = useLanguage();
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
        const requestedSlug = legacyCategorySlugMap[slug] || slug;
        let categoryData = null;

        const categoryRes = await fetch(`${API_URL}/categories/${requestedSlug}`);
        if (categoryRes.ok) {
          categoryData = await categoryRes.json();
        } else {
          const categoriesRes = await fetch(`${API_URL}/categories`);
          const allCategories = await categoriesRes.json();
          const categoryList = Array.isArray(allCategories) ? allCategories : [];
          categoryData = categoryList.find(
            (item) =>
              item.slug === requestedSlug ||
              item.slug === slug ||
              item.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') === requestedSlug
          );
        }

        if (!categoryData?._id) {
          setCategory(null);
          setProducts([]);
          setError('Category not found');
          return;
        }
        setCategory(categoryData);

        if (categoryData.slug && categoryData.slug !== slug) {
          navigate(`/categories/${categoryData.slug}`, { replace: true });
        }

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
  }, [API_URL, navigate, slug]);

  const filteredProducts = useMemo(() => {
    const s = deferredQuery.toLowerCase().trim();
    if (!s) return products;
    return products.filter((p) =>
      [p.name, p.description, p.brand, p.sku]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(s))
      );
  }, [products, deferredQuery]);
  const searchSuggestions = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];

    const seen = new Set();
    return products
      .filter((product) =>
        [product.name, product.description, product.brand, product.sku]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(term))
      )
      .map((product) => ({
        label: product.name,
        meta: product.brand || product.sku || t('Product'),
      }))
      .filter((suggestion) => {
        const key = String(suggestion.label || '').toLowerCase();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 6);
  }, [products, q, t]);

  const quoteHref = useMemo(() => {
    if (!category?._id) return '/contact?source=category';
    const params = new URLSearchParams({
      source: 'category',
      category: category._id,
      categoryName: category.name || '',
      pageUrl: typeof window !== 'undefined' ? `${window.location.origin}/categories/${category.slug || category._id}` : `/categories/${category.slug || category._id}`,
    });
    return `/contact?${params.toString()}`;
  }, [category]);

  if (!loading && !category) {
    return (
      <main>
        <section className="category-details-shell">
          <StatePanel
            eyebrow={t('Unavailable')}
            title={t('Category not available')}
            description={t(error || 'The category you requested could not be found.')}
            variant="error"
            action={<Link className="btn primary" to="/categories">{t('Browse All Categories')}</Link>}
          />
        </section>
      </main>
    );
  }

  return (
    <main>
      <Seo
        title={
          category?.name
            ? `${categoryName(category.name)} Products | Leading Trading Est Bahrain`
            : 'Category Products | Leading Trading Est Bahrain'
        }
        description={
          category?.description?.trim()
            ? categoryDescription(category.description.trim())
            : `Browse ${category?.name ? categoryName(category.name) : 'category'} products from Leading Trading Est with quotation and sourcing support in Bahrain.`
        }
        canonicalPath={`/categories/${category?.slug || slug || ''}`}
        image={category?.image || undefined}
      />
      <section className="category-details-shell" ref={rootRef}>
        {loading ? (
          <>
            <div className="category-details-hero category-details-hero--skeleton">
              <div className="category-details-hero-skeleton-left">
                <div className="cat-skel cat-skel--eyebrow skeleton-shimmer" />
                <div className="cat-skel cat-skel--title skeleton-shimmer" />
                <div className="cat-skel cat-skel--title cat-skel--short skeleton-shimmer" />
                <div className="cat-skel cat-skel--body skeleton-shimmer" />
                <div className="cat-skel cat-skel--body cat-skel--shorter skeleton-shimmer" />
              </div>
              <div className="category-details-hero-skeleton-right">
                <div className="cat-skel cat-skel--stat skeleton-shimmer" />
                <div className="cat-skel cat-skel--stat skeleton-shimmer" />
                <div className="cat-skel cat-skel--btn skeleton-shimmer" />
              </div>
            </div>
            <SkeletonGrid count={9} />
          </>
        ) : (
          <>
            <section className="category-details-hero">
              <div className="category-details-hero-copy animate-stagger" data-stagger-step="110ms">
                <span className="category-details-eyebrow animate-on-scroll">{t('Category Focus')}</span>
                {category.parent ? (
                  <div className="category-details-breadcrumb animate-on-scroll">
                    <Link to={`/categories/${category.parent.slug || category.parent._id}`}>{categoryName(category.parent.name)}</Link>
                    <span className="category-details-breadcrumb-sep">›</span>
                    <strong>{categoryName(category.name)}</strong>
                  </div>
                ) : null}
                <h1 className="category-details-title animate-on-scroll">{categoryName(category.name)}</h1>
                <p className="category-details-desc animate-on-scroll">
                  {categoryDescription(category.description?.trim()) || t('Review the products listed in this category and contact our team for specification guidance, availability, and quotation support.')}
                </p>
              </div>

              <div className="category-details-hero-meta animate-stagger" data-stagger-step="120ms">
                <div className="category-details-meta-card animate-on-scroll">
                  <StatCount value={products.length} />
                  <span>{t('products currently listed')}</span>
                </div>
                <div className="category-details-meta-card animate-on-scroll">
                  <StatCount value={new Set(products.map((product) => product.brand).filter(Boolean)).size || 1} />
                  <span>{t('brands represented')}</span>
                </div>
                <Link className="btn primary animate-on-scroll" to={quoteHref}>{t('Request sourcing support')}</Link>
              </div>
            </section>

            {category.children?.length ? (
              <section className="category-details-subcategories">
                <div className="category-details-subcategories-head animate-stagger" data-stagger-step="110ms">
                  <h2 className="animate-on-scroll">{t('Subcategories inside')} {categoryName(category.name)}</h2>
                  <p className="animate-on-scroll">{t('Open a subcategory to narrow the catalog further, or keep scrolling to review products across the full group.')}</p>
                </div>
                <div className="category-details-subcategories-grid animate-stagger" data-stagger-step="90ms">
                  {category.children.map((child) => (
                    <Link key={child._id} to={`/categories/${child.slug || child._id}`} className="category-details-subcategory-card animate-on-scroll">
                      <span>{t('Subcategory')}</span>
                      <strong>{categoryName(child.name)}</strong>
                      <p>{categoryDescription(child.description?.trim()) || t('Open this subcategory to review the dedicated product set.')}</p>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            <div className="category-details-products-header animate-stagger" data-stagger-step="110ms">
              <div className="animate-on-scroll">
                <h2 className="category-details-products-title">
                  {category.children?.length ? t('Products across this main category') : t('Products in this category')}
                </h2>
                <p className="category-details-products-copy">
                  {t('Filter by name, brand, description, or SKU to narrow the relevant products quickly.')}
                </p>
              </div>
              <div className="category-details-products-spacer" />
              <div className="category-details-search-wrap animate-on-scroll">
                <Input
                  className="category-details-search"
                  placeholder={t('Search products in this category')}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  disabled={products.length === 0}
                  autoComplete="off"
                  aria-label={t('Search products in this category')}
                />
                {searchSuggestions.length ? (
                  <div className="category-details-search-suggestions">
                    {searchSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.label}
                        type="button"
                        onClick={() => setQ(suggestion.label)}
                      >
                        <span>{suggestion.label}</span>
                        <small>{suggestion.meta}</small>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            {products.length === 0 ? (
              <StatePanel
                eyebrow={t('Empty Category')}
                title={t('No products in this category yet')}
                description={t('This category is live, but the product catalog has not been populated yet.')}
              />
            ) : filteredProducts.length === 0 ? (
              <StatePanel
                eyebrow={t('No Match')}
                title={t('No products match that search')}
                description={`${t('Nothing in')} ${categoryName(category.name)} ${t('matched')} "${q.trim()}". ${t('Try a broader keyword.')}`}
                action={<button className="btn" onClick={() => setQ('')}>{t('Clear Search')}</button>}
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
                              src={normalizeImageSrc(productImage, { width: 480 })}
                              alt={p.name}
                              className="category-details-product-img"
                              loading="lazy"
                              decoding="async"
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
                              ? `${categoryName(p.categorySlug.parent.name)} / ${categoryName(p.categorySlug?.name || '')}`
                              : (p.brand || t('Catalog item'))}
                          </span>
                          <strong>{p.name}</strong>
                          <p>{productDescription(p, category, categoryName, t)}</p>
                        </div>

                        <div className="category-details-product-footer">
                          <span className="category-details-product-price">
                            {Number.isFinite(price) && price > 0 ? `${price.toFixed(3)} BHD` : t('Quote on request')}
                          </span>
                          <span className="category-details-product-cta">{t('Open product')}</span>
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
