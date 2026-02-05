import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCart(data);
    } catch (err) {
      console.error('Failed to load cart', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/sign-in');
      return;
    }
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });
    const data = await response.json();
    setCart(data);
  };

  const removeItem = async (itemId) => {
    const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setCart(data);
  };

  const subtotal = cart?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  return (
    <main>
      <section className="cart-section">
        <h1>Your Cart</h1>
        {loading ? (
          <p className="shop-empty">Loading cart...</p>
        ) : !cart || cart.items.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty.</p>
            <Link to="/shop" className="btn">Browse products</Link>
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
                        <div className="cart-item-fallback">No image</div>
                      )}
                    </div>
                    <div className="cart-item-info">
                      <div className="cart-item-title-row">
                        <h3>{item.name}</h3>
                        <span className="cart-item-price">{Number(item.price).toFixed(3)} BHD</span>
                      </div>
                      <div className="cart-item-meta">
                        {item.size && <span className="cart-chip">{item.size}</span>}
                        {item.sku && <span className="cart-chip subtle">SKU: {item.sku}</span>}
                      </div>
                      <div className="cart-item-subtotal">
                        Line total: {lineTotal.toFixed(3)} BHD
                      </div>
                    </div>
                    <div className="cart-item-actions">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                      />
                      <button className="btn" onClick={() => removeItem(item._id)}>Remove</button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="cart-summary">
              <h2>Summary</h2>
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>{subtotal.toFixed(3)} BHD</span>
              </div>
              <div className="cart-summary-row">
                <span>Shipping</span>
                <span>{subtotal < 10 ? '1.000 BHD' : '0.000 BHD'}</span>
              </div>
              <div className="cart-summary-row total">
                <span>Total</span>
                <span>{(subtotal + (subtotal < 10 ? 1 : 0)).toFixed(3)} BHD</span>
              </div>
              <Link className="btn primary" to="/checkout">Proceed to Checkout</Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Cart;
