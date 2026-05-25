import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Alert from '../components/Alert.jsx';
import { adminApi } from '../api/adminApi.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.dashboardStats().then(setStats).catch((err) => setError(err.message));
  }, []);

  if (!stats && !error) return <LoadingSpinner label="Loading dashboard" />;

  return (
    <AdminLayout title="Dashboard">
      <Alert type="error">{error}</Alert>
      {stats && (
        <>
          <div className="stat-grid">
            <Stat label="Total products" value={stats.totalProducts} />
            <Stat label="Total orders" value={stats.totalOrders} />
            <Stat label="Total users" value={stats.totalUsers} />
            <Stat label="Revenue" value={`$${stats.revenueTotal.toFixed(2)}`} />
          </div>
          <div className="dashboard-grid">
            <section className="table-card">
              <h2>Recent orders</h2>
              <Table headers={['Order', 'Customer', 'Total', 'Status']} rows={stats.recentOrders.map((o) => [`#${o.id}`, o.customerName, `$${o.totalAmount.toFixed(2)}`, o.status])} />
            </section>
            <section className="table-card">
              <h2>Low stock</h2>
              <Table headers={['Product', 'Category', 'Stock']} rows={stats.lowStockProducts.map((p) => [p.name, p.categoryName, p.stockQuantity])} />
            </section>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

function Stat({ label, value }) {
  return <div className="stat-card"><span>{label}</span><strong>{value}</strong></div>;
}

function Table({ headers, rows }) {
  return (
    <div className="responsive-table"><table><thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cIndex) => <td key={cIndex}>{cell}</td>)}</tr>)}</tbody></table></div>
  );
}
