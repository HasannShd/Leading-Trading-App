import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [tapReady, setTapReady] = useState(false);
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    country: 'Bahrain',
    postalCode: '',
  });
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    const response = await fetch(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setCart(data);
  };

  const fetchTapReady = async () => {
    try {
      const response = await fetch(`${API_URL}/orders/tap/ready`);
      const data = await response.json();
      setTapReady(!!data.ready);
    } catch (err) {
      setTapReady(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/sign-in');
      return;
    }
    fetchCart();
    fetchTapReady();
  }, []);

  const subtotal = cart?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const shippingFee = subtotal < 10 ? 1 : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (paymentMethod === 'tap') {
        const tapResponse = await fetch(`${API_URL}/orders/tap/session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            shippingAddress: address,
            notes,
          }),
        });
        const tapData = await tapResponse.json();
        if (!tapResponse.ok) {
          alert(tapData.message || 'Tap is not available');
          return;
        }
        return;
      }

      const response = await fetch(`${API_URL}/orders/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentMethod,
          shippingAddress: address,
          notes,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Checkout failed');
        return;
      }
      navigate('/orders');
    } catch (err) {
      console.error(err);
      alert('Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <main>
        <section className="cart-section">
          <h1>Checkout</h1>
          <p className="shop-empty">Your cart is empty.</p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="checkout-section">
        <h1>Checkout</h1>
        <div className="checkout-grid">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2>Shipping Details</h2>
            <label>
              Full Name
              <input
                type="text"
                value={address.fullName}
                onChange={(e) => setAddress(prev => ({ ...prev, fullName: e.target.value }))}
                required
              />
            </label>
            <label>
              Phone
              <input
                type="tel"
                value={address.phone}
                onChange={(e) => setAddress(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </label>
            <label>
              Address Line 1
              <input
                type="text"
                value={address.line1}
                onChange={(e) => setAddress(prev => ({ ...prev, line1: e.target.value }))}
                required
              />
            </label>
            <label>
              Address Line 2
              <input
                type="text"
                value={address.line2}
                onChange={(e) => setAddress(prev => ({ ...prev, line2: e.target.value }))}
              />
            </label>
            <label>
              City
              <input
                type="text"
                value={address.city}
                onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
              />
            </label>
            <label>
              Country
              <input
                type="text"
                value={address.country}
                onChange={(e) => setAddress(prev => ({ ...prev, country: e.target.value }))}
              />
            </label>
            <label>
              Postal Code
              <input
                type="text"
                value={address.postalCode}
                onChange={(e) => setAddress(prev => ({ ...prev, postalCode: e.target.value }))}
              />
            </label>

            <h2>Payment</h2>
            <div className="checkout-payment">
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                Cash on Delivery
              </label>
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  checked={paymentMethod === 'bank'}
                  onChange={() => setPaymentMethod('bank')}
                />
                Bank Transfer
              </label>
              <label className={!tapReady ? 'checkout-disabled' : ''}>
                <input
                  type="radio"
                  name="payment"
                  value="tap"
                  checked={paymentMethod === 'tap'}
                  onChange={() => setPaymentMethod('tap')}
                  disabled={!tapReady}
                />
                Tap Card Payment {tapReady ? '' : '(Unavailable)'}
              </label>
            </div>
            {paymentMethod === 'bank' && (
              <div className="checkout-note">
                Bank transfer details will be shared after placing the order.
              </div>
            )}
            {paymentMethod === 'tap' && !tapReady && (
              <div className="checkout-note">
                Tap is not configured yet. Please use COD or Bank Transfer.
              </div>
            )}
            <label>
              Notes
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
            </label>

            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? 'Placing order...' : 'Place Order'}
            </button>
          </form>

          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <div className="checkout-summary-row">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(3)} BHD</span>
            </div>
            <div className="checkout-summary-row">
              <span>Shipping</span>
              <span>{shippingFee.toFixed(3)} BHD</span>
            </div>
            <div className="checkout-summary-row total">
              <span>Total</span>
              <span>{(subtotal + shippingFee).toFixed(3)} BHD</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Checkout;
