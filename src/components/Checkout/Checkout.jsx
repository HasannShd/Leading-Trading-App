import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';
import { authFetch, API_URL } from '../../services/authFetch';
import { useLanguage } from '../../context/LanguageContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
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
  const [formNotice, setFormNotice] = useState('');

  const fetchCart = useCallback(async () => {
    const response = await authFetch('/cart', { scope: 'user' });
    if (response.status === 401) {
      navigate('/sign-in');
      return;
    }
    const data = await response.json();
    setCart(data);
  }, [navigate]);

  const fetchTapReady = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/orders/tap/ready`);
      const data = await response.json();
      setTapReady(!!data.ready);
    } catch (err) {
      setTapReady(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
    fetchTapReady();
  }, [fetchCart, fetchTapReady]);

  const subtotal = cart?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const shippingFee = subtotal < 10 ? 1 : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormNotice('');
    setLoading(true);
    try {
      if (paymentMethod === 'tap') {
        const tapResponse = await authFetch('/orders/tap/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          scope: 'user',
          body: JSON.stringify({
            shippingAddress: address,
            notes,
          }),
        });
        const tapData = await tapResponse.json();
        if (!tapResponse.ok) {
          setFormNotice(tapData.message || t('Tap is not available'));
          return;
        }
        return;
      }

      const response = await authFetch('/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        scope: 'user',
        body: JSON.stringify({
          paymentMethod,
          shippingAddress: address,
          notes,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setFormNotice(data.message || t('Checkout failed'));
        return;
      }
      navigate('/orders');
    } catch (err) {
      console.error(err);
      setFormNotice(t('Checkout failed'));
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <main>
        <section className="cart-section">
          <h1>{t('Request Final Quotation')}</h1>
          <p className="shop-empty">{t('Your quote basket is empty.')}</p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="checkout-section">
        <h1>{t('Request Final Quotation')}</h1>
        <div className="checkout-grid">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2>{t('Quotation Contact Details')}</h2>
            <label>
              {t('Full Name')}
              <input
                type="text"
                value={address.fullName}
                onChange={(e) => setAddress(prev => ({ ...prev, fullName: e.target.value }))}
                required
              />
            </label>
            <label>
              {t('Phone')}
              <input
                type="tel"
                value={address.phone}
                onChange={(e) => setAddress(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </label>
            <label>
              {t('Address Line 1')}
              <input
                type="text"
                value={address.line1}
                onChange={(e) => setAddress(prev => ({ ...prev, line1: e.target.value }))}
                required
              />
            </label>
            <label>
              {t('Address Line 2')}
              <input
                type="text"
                value={address.line2}
                onChange={(e) => setAddress(prev => ({ ...prev, line2: e.target.value }))}
              />
            </label>
            <label>
              {t('City')}
              <input
                type="text"
                value={address.city}
                onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
              />
            </label>
            <label>
              {t('Country')}
              <input
                type="text"
                value={address.country}
                onChange={(e) => setAddress(prev => ({ ...prev, country: e.target.value }))}
              />
            </label>
            <label>
              {t('Postal Code')}
              <input
                type="text"
                value={address.postalCode}
                onChange={(e) => setAddress(prev => ({ ...prev, postalCode: e.target.value }))}
              />
            </label>

            <h2>{t('Quotation Method')}</h2>
            <div className="checkout-payment">
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                {t('Confirm by phone')}
              </label>
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  checked={paymentMethod === 'bank'}
                  onChange={() => setPaymentMethod('bank')}
                />
                {t('Prepare bank-transfer quote')}
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
                {t('Online payment link')} {tapReady ? '' : `(${t('Unavailable')})`}
              </label>
            </div>
            {paymentMethod === 'bank' && (
              <div className="checkout-note">
                {t('Bank transfer details will be shared after the quotation is confirmed.')}
              </div>
            )}
            {paymentMethod === 'tap' && !tapReady && (
              <div className="checkout-note">
                {t('Online payment is not configured yet. Please request a quotation first.')}
              </div>
            )}
            <label>
              {t('Notes')}
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
            </label>

            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? t('Sending quotation request...') : t('Submit Quotation Request')}
            </button>
            {formNotice ? (
              <div className="checkout-form-notice" role="alert">
                {formNotice}
              </div>
            ) : null}
          </form>

          <div className="checkout-summary">
            <h2>{t('Quote Basket Summary')}</h2>
            <div className="checkout-items">
              {cart.items.map(item => (
                <div className="checkout-item" key={item._id}>
                  <div className="checkout-item-media">
                    {item.image ? (
                      <img
                        src={item.image.startsWith('http') ? item.image : `${import.meta.env.BASE_URL}${item.image.replace(/^\//, '')}`}
                        alt={item.name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="checkout-item-fallback">{t('No image')}</div>
                    )}
                  </div>
                  <div className="checkout-item-info">
                    <div className="checkout-item-title">{item.name}</div>
                    {item.size && <div className="checkout-item-meta">{item.size}</div>}
                    <div className="checkout-item-qty">{t('Qty')} {item.quantity}</div>
                  </div>
                  <div className="checkout-item-price">
                    {(Number(item.price) * Number(item.quantity || 0)).toFixed(3)} BHD
                  </div>
                </div>
              ))}
            </div>
            <div className="checkout-summary-row">
              <span>{t('Estimated subtotal')}</span>
              <span>{subtotal.toFixed(3)} BHD</span>
            </div>
            <div className="checkout-summary-row">
              <span>{t('Estimated shipping')}</span>
              <span>{shippingFee.toFixed(3)} BHD</span>
            </div>
            <div className="checkout-summary-row total">
              <span>{t('Estimated total')}</span>
              <span>{(subtotal + shippingFee).toFixed(3)} BHD</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Checkout;
