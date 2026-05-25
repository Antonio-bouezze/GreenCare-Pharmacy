import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import Alert from '../components/Alert.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { adminApi } from '../api/adminApi.js';

const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);

  const load = () => {
    setLoading(true);
    adminApi.allOrders()
      .then(setOrders)
      .catch((err) => setNotice({ type: 'error', text: err.message }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      const updated = await adminApi.updateOrderStatus(id, status);
      setOrders((current) => current.map((order) => order.id === id ? updated : order));
      setNotice({ type: 'success', text: 'Order status updated.' });
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    }
  };

  return (
    <AdminLayout title="Orders">
      <Alert type={notice?.type}>{notice?.text}</Alert>
      {loading ? <LoadingSpinner label="Loading orders" /> : (
        <div className="responsive-table table-card">
          <table>
            <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th>Items</th></tr></thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>
                    <select value={order.status} onChange={(event) => updateStatus(order.id, event.target.value)} aria-label={`Status for order ${order.id}`}>
                      {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </td>
                  <td>{order.items.map((item) => `${item.productName} x ${item.quantity}`).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
