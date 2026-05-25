import { NavLink } from 'react-router-dom';

export default function AdminLayout({ title, children }) {
  return (
    <section className="admin-shell">
      <aside className="admin-sidebar">
        <h2>Admin</h2>
        <NavLink to="/admin">Overview</NavLink>
        <NavLink to="/admin/products">Products</NavLink>
        <NavLink to="/admin/orders">Orders</NavLink>
      </aside>
      <div className="admin-content">
        <div className="section-heading">
          <span className="eyebrow">Pharmacy operations</span>
          <h1>{title}</h1>
        </div>
        {children}
      </div>
    </section>
  );
}
