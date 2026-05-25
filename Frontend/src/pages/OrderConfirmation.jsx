import { Link, Navigate, useLocation } from 'react-router-dom';

export default function OrderConfirmation() {
  const { state } = useLocation();
  const order = state?.order;
  if (!order) return <Navigate to="/orders" replace />;

  return (
    <section className="section page">
      <div className="confirmation">
        <span className="success-mark">✓</span>
        <h1>Order placed successfully</h1>
        <p>Order #{order.id} is now {order.status.toLowerCase()}.</p>
        <div className="summary-box">
          {order.items.map((item) => <div key={item.id}><span>{item.productName} x {item.quantity}</span><strong>${item.totalPrice.toFixed(2)}</strong></div>)}
          <div><span>Total</span><strong>${order.totalAmount.toFixed(2)}</strong></div>
        </div>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/orders">Order History</Link>
          <Link className="btn btn-secondary" to="/products">Back to Products</Link>
        </div>
      </div>
    </section>
  );
}
