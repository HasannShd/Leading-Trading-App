import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';
import { authFetch } from '../../services/authFetch';
import { useLanguage } from '../../context/LanguageContext';

const Cart = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const response = await authFetch('/cart', { scope: 'user' });
      const data = await response.json();
      if (response.status === 401) {
        navigate('/sign-in');
        return;
      }
      setCart(data);
    } catch (err) {
      console.error('Failed to load cart', err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    const response = await authFetch(`/cart/items/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      scope: 'user',
      body: JSON.stringify({ quantity }),
    });
    const data = await response.json();
    setCart(data);
  };

  const removeItem = async (itemId) => {
    const response = await authFetch(`/cart/items/${itemId}`, {
      method: 'DELETE',
      scope: 'user',
    });
    const data = await response.json();
    setCart(data);
  };

  const subtotal = cart?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  return (
    <main>
      <section className="cart-section">
        <h1>{t('Your Cart')}</h1>
        {loading ? (
          <p className="shop-empty">{t('Loading cart...')}</p>
        ) : !cart || cart.items.length === 0 ? (
          <div className="cart-empty">
            <p>{t('Your cart is empty.')}</p>
            <Link to="/shop" className="btn">{t('Browse products')}</Link>
          </div>
        ) : (
          <div className="cart-grid">
            <div className="cart-items">
              {cart.items.map(item => {
                const lineTotal = Number(item.price) * Number(item.quantity || 0);
                return (
                  <div className="cart-item" key={item._id}>
                    <div className="cart-item-media">
                      {item.image ? (
                        <img
                          src={item.image.startsWith('http') ? item.image : `${import.meta.env.BASE_URL}${item.image.replace(/^\//, '')}`}
                          alt={item.name}
                          loading="lazy"
                        />
                      ) : (
                        <div className="cart-item-fallback">{t('No image')}</div>
                      )}
                    </div>
                    <div className="cart-item-info">
                      <div className="cart-item-title-row">
                        <h3>{item.name}</h3>
                        <span className="cart-item-price">{Number(item.price).toFixed(3)} BHD</span>
                      </div>
                      <div className="cart-item-meta">
                        {item.size && <span className="cart-chip">{item.size}</span>}
                        {item.sku && <span className="cart-chip subtle">{t('SKU')}: {item.sku}</span>}
                      </div>
                      <div className="cart-item-subtotal">
                        {t('Line total')}: {lineTotal.toFixed(3)} BHD
                      </div>
                    </div>
                    <div className="cart-item-actions">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                      />
                      <button className="btn" onClick={() => removeItem(item._id)}>{t('Remove')}</button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="cart-summary">
              <h2>{t('Summary')}</h2>
              <div className="cart-summary-row">
                <span>{t('Subtotal')}</span>
                <span>{subtotal.toFixed(3)} BHD</span>
              </div>
              <div className="cart-summary-row">
                <span>{t('Shipping')}</span>
                <span>{subtotal < 10 ? '1.000 BHD' : '0.000 BHD'}</span>
              </div>
              <div className="cart-summary-row total">
                <span>{t('Total')}</span>
                <span>{(subtotal + (subtotal < 10 ? 1 : 0)).toFixed(3)} BHD</span>
              </div>
              <Link className="btn primary" to="/checkout">{t('Proceed to Checkout')}</Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Cart;
