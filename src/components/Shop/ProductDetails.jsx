import { useEffect, useMemo, useState, useCallback, startTransition, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import StatePanel from '../Common/StatePanel';
import { normalizeImageSrc } from '../../utils/normalizeImageSrc';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { authFetch } from '../../services/authFetch';
import './ProductDetails.css';

const buildSizeLabel = (entry) => [entry.size, entry.inches, entry.color].filter(Boolean).join(' / ');

const getSizePrice = (entry) => {
  const priceValue = Number(entry?.price);
  return Number.isFinite(priceValue) && priceValue > 0 ? priceValue : null;
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [variantId, setVariantId] = useState('');
  const [selectedSizeIndex, setSelectedSizeIndex] = useState('');
  const [activeImage, setActiveImage] = useState('');
  const [brokenImages, setBrokenImages] = useState([]);
  const [brokenRelatedImages, setBrokenRelatedImages] = useState({});
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);
  const rootRef = useRef(null);

  useScrollReveal(rootRef);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setNotice(null);
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      const data = await response.json();
      setProduct(data);

      const variants = data?.variants || [];
      if (variants.length) {
        const first = variants[0];
        setVariantId(first._id);
        const firstIndex = (first.sizes || []).findIndex((entry) => !entry.outOfStock);
        setSelectedSizeIndex(firstIndex >= 0 ? String(firstIndex) : first.sizes?.length ? '0' : '');
      } else {
        setVariantId('');
        setSelectedSizeIndex('');
      }

      const gallery = [data?.image, ...(data?.images || [])].filter(Boolean);
      const uniqueGallery = Array.from(new Set(gallery));
      setActiveImage(uniqueGallery[0] || '');
      setBrokenImages([]);
      setBrokenRelatedImages({});

      const categoryId = data?.categorySlug?._id || data?.categorySlug;
      if (categoryId) {
        const relatedRes = await fetch(`${API_URL}/products?category=${categoryId}&limit=4`);
        const relatedData = await relatedRes.json();
        const relatedItems = Array.isArray(relatedData) ? relatedData : (relatedData.items || []);
        setRelatedProducts(relatedItems.filter((item) => item._id !== data._id).slice(0, 3));
      } else {
        setRelatedProducts([]);
      }
    } catch (err) {
      setNotice({
        type: 'error',
        title: 'Product unavailable',
        description: 'We could not load the selected product right now.',
      });
    } finally {
      setLoading(false);
    }
  }, [API_URL, id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const variants = product?.variants || [];
  const selectedVariant = variants.find((v) => v._id === variantId);
  const sizeOptions = (selectedVariant?.sizes || []).filter((entry) => entry.size || entry.inches || entry.color);
  const hasTypes = variants.some((variant) => (variant.type || '').trim());

  useEffect(() => {
    if (selectedVariant?.image) {
      setActiveImage(selectedVariant.image);
    }

    if (selectedVariant?.sizes?.length) {
      const nextIndex = selectedVariant.sizes.findIndex((entry) => !entry.outOfStock);
      if (selectedSizeIndex === '' || Number(selectedSizeIndex) >= selectedVariant.sizes.length) {
        setSelectedSizeIndex(nextIndex >= 0 ? String(nextIndex) : '0');
      }
    }
  }, [selectedVariant, selectedSizeIndex]);

  const selectedEntry = sizeOptions[Number(selectedSizeIndex)];
  const selectedSizePrice = getSizePrice(selectedEntry);
  const variantPriceValue = Number(selectedVariant?.price);
  const fallbackVariantPrice = Number(variants[0]?.price);
  const basePriceValue = Number(product?.basePrice || 0);
  const displayPrice = Number.isFinite(selectedSizePrice) && selectedSizePrice > 0
    ? selectedSizePrice
    : (Number.isFinite(variantPriceValue) && variantPriceValue > 0
        ? variantPriceValue
        : (Number.isFinite(fallbackVariantPrice) && fallbackVariantPrice > 0
            ? fallbackVariantPrice
            : basePriceValue));

  const gallery = useMemo(
    () => Array.from(new Set([product?.image, ...(product?.images || []), selectedVariant?.image].filter(Boolean))),
    [product, selectedVariant]
  );
  const availableGallery = useMemo(
    () => gallery.filter((img) => !brokenImages.includes(img)),
    [brokenImages, gallery]
  );
  const resolvedActiveImage = normalizeImageSrc(activeImage);

  const productSpecs = useMemo(
    () => (selectedVariant?.specs?.length ? selectedVariant.specs : product?.specs || []).filter((spec) => spec?.label || spec?.value),
    [product, selectedVariant]
  );

  const handleTypeChange = (value) => {
    setVariantId(value);
    const nextVariant = variants.find((v) => v._id === value);
    if (nextVariant?.image) setActiveImage(nextVariant.image);
    if (nextVariant?.sizes?.length) {
      const nextIndex = nextVariant.sizes.findIndex((entry) => !entry.outOfStock);
      setSelectedSizeIndex(nextIndex >= 0 ? String(nextIndex) : '0');
    } else {
      setSelectedSizeIndex('');
    }
  };

  const handleImageFailure = (failedImage) => {
    if (!failedImage) return;

    setBrokenImages((prev) => (prev.includes(failedImage) ? prev : [...prev, failedImage]));

    if (activeImage === failedImage) {
      const nextImage = availableGallery.find((img) => img !== failedImage);
      setActiveImage(nextImage || '');
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (sizeOptions.length && (selectedSizeIndex === '' || Number.isNaN(Number(selectedSizeIndex)))) {
      setNotice({
        type: 'error',
        title: 'Choose a size before adding to cart',
        description: 'This product uses size-level selection, so we need that choice first.',
      });
      return;
    }

    const selectedLabel = selectedEntry ? buildSizeLabel(selectedEntry) : '';

    try {
      const response = await authFetch('/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        scope: 'user',
        body: JSON.stringify({
          productId: product._id,
          variantId,
          quantity: qty,
          size: selectedLabel,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/sign-in');
          return;
        }
        const data = await response.json();
        setNotice({
          type: 'error',
          title: 'Could not add product to cart',
          description: data.message || 'Please try again in a moment.',
        });
        return;
      }

      startTransition(() => {
        setNotice({
          type: 'success',
          title: 'Added to cart',
          description: 'The product was added successfully. You can continue browsing or review the cart now.',
        });
      });
    } catch (err) {
      setNotice({
        type: 'error',
        title: 'Could not add product to cart',
        description: 'Please try again in a moment.',
      });
    }
  };

  if (loading) {
    return (
      <main>
        <section className="product-details-shell">
          <StatePanel
            eyebrow="Loading"
            title="Preparing product details"
            description="We’re loading the gallery, pricing, specifications, and related products."
            variant="loading"
          />
        </section>
      </main>
    );
  }

  if (!product) {
    return (
      <main>
        <section className="product-details-shell">
          <StatePanel
            eyebrow="Unavailable"
            title="Product not available"
            description={notice?.description || 'The selected product could not be loaded.'}
            variant="error"
            action={<Link className="btn primary" to="/shop">Return to Shop</Link>}
          />
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="product-details-shell" ref={rootRef}>
        <section className="product-details">
          <div className="product-media animate-on-scroll">
            {resolvedActiveImage ? (
              <img
                src={resolvedActiveImage}
                alt={product.name}
                loading="lazy"
                onError={() => handleImageFailure(activeImage)}
              />
            ) : (
              <div className="product-media-empty">
                <span>{product.brand || 'Leading Trading Est'}</span>
                <strong>Image available on request</strong>
                <p>Contact our team for visuals, specifications, and availability details.</p>
              </div>
            )}

            {availableGallery.length > 1 && (
              <div className="product-gallery">
                {availableGallery.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    className={`product-thumb${activeImage === img ? ' active' : ''}`}
                    onClick={() => setActiveImage(img)}
                  >
                    <img
                      src={normalizeImageSrc(img)}
                      alt={`${product.name} ${idx + 1}`}
                      loading="lazy"
                      onError={() => handleImageFailure(img)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-info animate-stagger" data-stagger-step="100ms">
            <span className="product-kicker animate-on-scroll">
              {product.categorySlug?.parent?.name
                ? `${product.categorySlug.parent.name} / ${product.categorySlug?.name || ''}`
                : (product.categorySlug?.name || product.brand || 'Catalog product')}
            </span>
            <h1 className="animate-on-scroll">{product.name}</h1>
            <p className="product-brand animate-on-scroll">{product.brand || 'Leading Trading Est'}</p>
            <p className="product-desc animate-on-scroll">
              {product.description?.trim() || 'Contact our team for product specifications, availability, and commercial support.'}
            </p>

            <div className="product-service-grid animate-stagger" data-stagger-step="100ms">
              <article className="product-service-card animate-on-scroll">
                <span>Procurement use</span>
                <strong>Review the product structure before moving into quotation or cart handling.</strong>
                <p>Where products depend on type, size, brand, or commercial fit, the detail page gives the clearest next step.</p>
              </article>
              <article className="product-service-card animate-on-scroll">
                <span>Support path</span>
                <strong>LTE can assist with specification fit, availability, and repeat-order planning.</strong>
                <p>Use WhatsApp, direct enquiry, or quotation handling when the requirement needs confirmation before purchase.</p>
              </article>
            </div>

            {notice && (
              <StatePanel
                eyebrow={notice.type === 'success' ? 'Success' : 'Notice'}
                title={notice.title}
                description={notice.description}
                variant={notice.type === 'success' ? 'success' : 'error'}
                className="product-notice"
                action={notice.type === 'success' ? <Link className="btn primary" to="/cart">Open Cart</Link> : null}
              />
            )}

            <div className="product-purchase-card animate-on-scroll">
              <div className="product-price-row">
                <div>
                  <span className="product-price-label">Current price</span>
                  <p className="product-price">{displayPrice > 0 ? `${Number(displayPrice).toFixed(3)} BHD` : 'Quote on request'}</p>
                </div>
                <a
                  className="btn"
                  href="https://wa.me/97317210665"
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp Quote
                </a>
              </div>

              {variants.length > 0 && (
                <div className="product-variant">
                  {hasTypes && (
                    <>
                      <label>Choose Type</label>
                      <select value={variantId} onChange={(e) => handleTypeChange(e.target.value)}>
                        {variants.map((v) => {
                          const priceTag = Number(v.price);
                          return (
                            <option key={v._id} value={v._id}>
                              {v.type || v.name || v.sku}
                              {Number.isFinite(priceTag) && priceTag > 0 ? ` — ${priceTag.toFixed(3)} BHD` : ''}
                            </option>
                          );
                        })}
                      </select>
                    </>
                  )}

                  {sizeOptions.length > 0 && (
                    <>
                      <label>Choose Size</label>
                      <select
                        value={selectedSizeIndex}
                        onChange={(e) => setSelectedSizeIndex(e.target.value)}
                      >
                        {sizeOptions.map((entry, idx) => {
                          const label = buildSizeLabel(entry);
                          const priceTag = getSizePrice(entry);
                          return (
                            <option key={`${label}-${idx}`} value={String(idx)} disabled={entry.outOfStock}>
                              {label}
                              {priceTag ? ` — ${priceTag.toFixed(3)} BHD` : ''}
                              {entry.outOfStock ? ' (Out of stock)' : ''}
                            </option>
                          );
                        })}
                      </select>
                    </>
                  )}
                </div>
              )}

              <div className="product-qty">
                <label>Quantity</label>
                <div className="product-qty-controls">
                  <button type="button" className="btn" onClick={() => setQty((prev) => Math.max(1, prev - 1))}>-</button>
                  <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                  />
                  <button type="button" className="btn" onClick={() => setQty((prev) => prev + 1)}>+</button>
                </div>
              </div>

              <div className="product-actions">
                <button className="btn primary" onClick={handleAddToCart}>
                  Add to Cart
                </button>
                <Link className="btn" to="/contact">Request Quotation</Link>
              </div>
            </div>

            {productSpecs.length > 0 && (
              <div className="product-specs animate-on-scroll">
                <h3>Specifications</h3>
                <div className="product-spec-grid">
                  {productSpecs.map((spec, idx) => (
                    <div className="product-spec-card" key={`${spec.label}-${idx}`}>
                      <span>{spec.label || 'Specification'}</span>
                      <strong>{spec.value || '-'}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="product-related animate-stagger" data-stagger-step="100ms">
            <div className="product-related-header animate-on-scroll">
              <div className="animate-stagger" data-stagger-step="100ms">
                <span className="product-kicker animate-on-scroll">Also in this category</span>
                <h2 className="animate-on-scroll">Related products in the same operational category</h2>
              </div>
              <Link className="btn" to={`/categories/${product.categorySlug?.slug || product.categorySlug?._id || ''}`}>
                Browse Category
              </Link>
            </div>

            <div className="product-related-grid">
              {relatedProducts.map((item) => {
                const image = item.image || item.images?.[0] || '';
                const price = Number(item.basePrice || item.variants?.[0]?.price || 0);
                const imageFailed = brokenRelatedImages[item._id] === true;

                return (
                  <Link key={item._id} to={`/product/${item._id}`} className="product-related-card">
                    <div className="product-related-media">
                      {image && !imageFailed ? (
                        <img
                          src={normalizeImageSrc(image)}
                          alt={item.name}
                          loading="lazy"
                          onError={() => {
                            setBrokenRelatedImages((prev) => ({ ...prev, [item._id]: true }));
                          }}
                        />
                      ) : (
                        <span>{item.name?.[0] || 'P'}</span>
                      )}
                    </div>
                    <div className="product-related-copy">
                      <span>{item.brand || 'Catalog product'}</span>
                      <strong>{item.name}</strong>
                      <p>{price > 0 ? `${price.toFixed(3)} BHD` : 'Quote on request'}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </section>
    </main>
  );
};

export default ProductDetails;
