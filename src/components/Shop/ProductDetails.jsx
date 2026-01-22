import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');
  const [product, setProduct] = useState(null);
  const [variantId, setVariantId] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImage, setActiveImage] = useState('');
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  const buildSizeLabel = (entry) => [entry.size, entry.inches, entry.color].filter(Boolean).join(' / ');

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      const data = await response.json();
      setProduct(data);
      const variants = data?.variants || [];
      if (variants.length) {
        const first = variants[0];
        setVariantId(first._id);
        const firstSize = (first.sizes || []).find(entry => !entry.outOfStock) || first.sizes?.[0];
        if (firstSize) {
          setSelectedSize(buildSizeLabel(firstSize));
        }
      }
      const gallery = [data?.image, ...(data?.images || [])].filter(Boolean);
      const uniqueGallery = Array.from(new Set(gallery));
      setActiveImage(uniqueGallery[0] || '');
    } catch (err) {
      console.error('Failed to load product:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const variants = product?.variants || [];
  const selectedVariant = variants.find(v => v._id === variantId);
  const sizeOptions = (selectedVariant?.sizes || []).filter(entry => entry.size || entry.inches || entry.color);
  const hasTypes = variants.some(variant => (variant.type || '').trim());

  useEffect(() => {
    if (selectedVariant?.image) {
      setActiveImage(selectedVariant.image);
    }
    if (selectedVariant?.sizes?.length) {
      const labels = selectedVariant.sizes.map((entry) => buildSizeLabel(entry));
      if (!selectedSize || !labels.includes(selectedSize)) {
        const nextEntry = selectedVariant.sizes.find(entry => !entry.outOfStock) || selectedVariant.sizes[0];
        const nextLabel = nextEntry ? buildSizeLabel(nextEntry) : '';
        setSelectedSize(nextLabel);
      }
    }
  }, [selectedVariant, selectedSize]);

  const handleAddToCart = async () => {
    if (!token) {
      navigate('/sign-in');
      return;
    }
    if (sizeOptions.length && !selectedSize) {
      alert('Please choose a size.');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, variantId, quantity: qty, size: selectedSize }),
      });
      if (!response.ok) {
        const data = await response.json();
        alert(data.message || 'Failed to add to cart');
        return;
      }
      navigate('/cart');
    } catch (err) {
      console.error(err);
      alert('Failed to add to cart');
    }
  };

  if (loading || !product) {
    return <main><p className="shop-empty">Loading product...</p></main>;
  }

  const variantPriceValue = Number(selectedVariant?.price);
  const fallbackVariantPrice = Number(variants[0]?.price);
  const displayPrice = Number.isFinite(variantPriceValue) && variantPriceValue > 0
    ? variantPriceValue
    : (Number.isFinite(fallbackVariantPrice) && fallbackVariantPrice > 0
        ? fallbackVariantPrice
        : Number(product.basePrice || 0));
  const gallery = Array.from(new Set([product.image, ...(product.images || [])].filter(Boolean)));
  const handleTypeChange = (value) => {
    setVariantId(value);
    const nextVariant = variants.find(v => v._id === value);
    if (nextVariant?.image) {
      setActiveImage(nextVariant.image);
    }
    const nextSize = nextVariant?.sizes?.find(entry => !entry.outOfStock) || nextVariant?.sizes?.[0];
    setSelectedSize(nextSize ? buildSizeLabel(nextSize) : '');
  };

  return (
    <main>
      <section className="product-details">
        <div className="product-media">
          {activeImage ? (
            <img
              src={
                activeImage.startsWith('http')
                  ? activeImage
                  : `${import.meta.env.BASE_URL}${activeImage.replace(/^\//, '')}`
              }
              alt={product.name}
              loading="lazy"
            />
          ) : (
            <div className="shop-card-placeholder">No image</div>
          )}
          {gallery.length > 1 && (
            <div className="product-gallery">
              {gallery.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  className={`product-thumb${activeImage === img ? ' active' : ''}`}
                  onClick={() => setActiveImage(img)}
                >
                  <img
                    src={img.startsWith('http') ? img : `${import.meta.env.BASE_URL}${img.replace(/^\//, '')}`}
                    alt={`${product.name} ${idx + 1}`}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="product-brand">{product.brand || '—'}</p>
          <p className="product-desc">{product.description}</p>
          <p className="product-price">{Number(displayPrice).toFixed(3)} BHD</p>

          {variants.length > 0 && (
            <div className="product-variant">
              {hasTypes && (
                <>
                  <label>Choose Type</label>
                  <select value={variantId} onChange={(e) => handleTypeChange(e.target.value)}>
                    {variants.map(v => (
                      <option key={v._id} value={v._id}>
                        {v.type || v.name || v.sku}
                      </option>
                    ))}
                  </select>
                </>
              )}
              {sizeOptions.length > 0 && (
                <>
                  <label>Choose Size</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                  >
                    {sizeOptions.map((entry, idx) => {
                      const label = buildSizeLabel(entry);
                      return (
                        <option key={`${label}-${idx}`} value={label} disabled={entry.outOfStock}>
                          {label}{entry.outOfStock ? ' (Out of stock)' : ''}
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
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            />
          </div>

          <button className="btn primary" onClick={handleAddToCart}>
            Add to Cart
          </button>

          {(selectedVariant?.specs?.length > 0 || product.specs?.length > 0) && (
            <div className="product-specs">
              <h3>Specifications</h3>
              <ul>
                {(selectedVariant?.specs?.length ? selectedVariant.specs : product.specs).map((spec, idx) => (
                  <li key={`${spec.label}-${idx}`}>
                    <strong>{spec.label}</strong>: {spec.value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ProductDetails;
