import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert.jsx';
import Input from '../components/Input.jsx';
import { orderApi } from '../api/orderApi.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: user?.fullName || '', phoneNumber: '', address: '', city: '', notes: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!items.length) return <Navigate to="/cart" replace />;

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const order = await orderApi.createOrder({
        ...form,
        items: items.map(({ product, quantity }) => ({ productId: product.id, quantity })),
      });
      clearCart();
      navigate('/order-confirmation', { state: { order } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section page">
      <div className="section-heading">
        <span className="eyebrow">Secure checkout</span>
        <h1>Delivery Details</h1>
      </div>
      <Alert type="error">{error}</Alert>
      <form className="checkout-layout" onSubmit={submit}>
        <div className="form-card">
          <Input id="fullName" label="Full name" required value={form.fullName} onChange={(event) => update('fullName', event.target.value)} />
          <Input id="phoneNumber" label="Phone number" required value={form.phoneNumber} onChange={(event) => update('phoneNumber', event.target.value)} />
          <Input id="address" label="Address" required value={form.address} onChange={(event) => update('address', event.target.value)} />
          <Input id="city" label="City" required value={form.city} onChange={(event) => update('city', event.target.value)} />
          <label className="field" htmlFor="notes">
            <span>Notes</span>
            <textarea id="notes" value={form.notes} onChange={(event) => update('notes', event.target.value)} />
          </label>
        </div>
        <aside className="summary-box">
          <h2>Order Summary</h2>
          {items.map(({ product, quantity }) => (
            <div key={product.id}><span>{product.name} x {quantity}</span><strong>${(product.price * quantity).toFixed(2)}</strong></div>
          ))}
          <div><span>Total</span><strong>${subtotal.toFixed(2)}</strong></div>
          <button className="btn btn-primary full" disabled={loading}>{loading ? 'Placing order...' : 'Place Order'}</button>
        </aside>
      </form>
    </section>
  );
}
