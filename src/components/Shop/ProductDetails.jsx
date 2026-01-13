import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');
  const [product, setProduct] = useState(null);
  const [variantId, setVariantId] = useState('');
  const [activeImage, setActiveImage] = useState('');
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      const data = await response.json();
      setProduct(data);
      if (data?.variants?.length) {
        setVariantId(data.variants[0]._id);
      }
      const firstImage = data?.image || data?.images?.[0] || '';
      setActiveImage(firstImage);
    } catch (err) {
      console.error('Failed to load product:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) {
      navigate('/sign-in');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, variantId, quantity: qty }),
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

  const selectedVariant = product.variants?.find(v => v._id === variantId);
  const displayPrice = selectedVariant?.price ?? product.basePrice ?? 0;
  const gallery = [product.image, ...(product.images || [])].filter(Boolean);

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

          {product.variants?.length > 0 && (
            <div className="product-variant">
              <label>Choose Variant</label>
              <select value={variantId} onChange={(e) => setVariantId(e.target.value)}>
                {product.variants.map(v => (
                  <option key={v._id} value={v._id}>
                    {v.name || v.size || v.sku} - {Number(v.price).toFixed(3)} BHD
                  </option>
                ))}
              </select>
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

          {(selectedVariant?.specs?.length || product.specs?.length) && (
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
