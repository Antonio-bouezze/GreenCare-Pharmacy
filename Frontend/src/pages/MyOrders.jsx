import { useEffect, useState } from 'react';
import Alert from '../components/Alert.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { orderApi } from '../api/orderApi.js';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    orderApi.myOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading orders" />;

  return (
    <section className="section page">
      <div className="section-heading">
        <span className="eyebrow">History</span>
        <h1>Your Orders</h1>
      </div>
      <Alert type="error">{error}</Alert>
      {orders.length ? (
        <div className="order-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-header">
                <div>
                  <h2>Order #{order.id}</h2>
                  <p>{new Date(order.orderDate).toLocaleString()}</p>
                </div>
                <span className="status-badge">{order.status}</span>
              </div>
              {order.items.map((item) => (
                <div className="order-line" key={item.id}>
                  <span>{item.productName} x {item.quantity}</span>
                  <strong>${item.totalPrice.toFixed(2)}</strong>
                </div>
              ))}
              <div className="order-total"><span>Total</span><strong>${order.totalAmount.toFixed(2)}</strong></div>
            </article>
          ))}
        </div>
      ) : <div className="empty-state">You have not placed any orders yet.</div>}
    </section>
  );
}
