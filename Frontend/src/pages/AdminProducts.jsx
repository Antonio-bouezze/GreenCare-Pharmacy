import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout.jsx';
import Alert from '../components/Alert.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { productApi } from '../api/productApi.js';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);

  const load = () => {
    setLoading(true);
    productApi.adminProducts({ search })
      .then(setProducts)
      .catch((err) => setNotice({ type: 'error', text: err.message }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const remove = async (product) => {
    if (!window.confirm(`Deactivate ${product.name}?`)) return;
    try {
      await productApi.deleteProduct(product.id);
      setNotice({ type: 'success', text: 'Product deactivated.' });
      load();
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    }
  };

  return (
    <AdminLayout title="Product Management">
      <Alert type={notice?.type}>{notice?.text}</Alert>
      <div className="admin-toolbar">
        <input aria-label="Search admin products" placeholder="Search products..." value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && load()} />
        <button className="btn btn-secondary" onClick={load}>Search</button>
        <Link className="btn btn-primary" to="/admin/products/new">Add Product</Link>
      </div>
      {loading ? <LoadingSpinner label="Loading products" /> : (
        <div className="responsive-table table-card">
          <table>
            <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td><img className="table-thumb" src={product.imageUrl} alt={product.name} /></td>
                  <td>{product.name}</td>
                  <td>{product.categoryName}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.stockQuantity}</td>
                  <td>{product.isActive ? 'Visible' : 'Inactive'}</td>
                  <td className="table-actions">
                    <Link className="text-button" to={`/admin/products/${product.id}/edit`}>Edit</Link>
                    <button className="text-button danger" onClick={() => remove(product)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
