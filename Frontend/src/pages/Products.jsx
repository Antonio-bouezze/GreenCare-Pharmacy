import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Alert from '../components/Alert.jsx';
import { productApi } from '../api/productApi.js';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: '', categoryId: '', sort: 'name_asc' });
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    productApi.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    productApi.getProducts(filters)
      .then(setProducts)
      .catch((error) => setNotice({ type: 'error', text: error.message }))
      .finally(() => setLoading(false));
  }, [filters]);

  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const onNotice = (text, type = 'success') => setNotice({ text, type });

  return (
    <section className="page section">
      <div className="section-heading">
        <span className="eyebrow">Shop</span>
        <h1>Pharmacy Products</h1>
        <p>Search products, compare prices, and add available non-prescription demo items to your cart.</p>
      </div>
      <Alert type={notice?.type}>{notice?.text}</Alert>
      <div className="filters">
        <input aria-label="Search products" placeholder="Search products..." value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} />
        <select aria-label="Filter by category" value={filters.categoryId} onChange={(event) => updateFilter('categoryId', event.target.value)}>
          <option value="">All categories</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
        <select aria-label="Sort products" value={filters.sort} onChange={(event) => updateFilter('sort', event.target.value)}>
          <option value="name_asc">Name A-Z</option>
          <option value="name_desc">Name Z-A</option>
          <option value="price_asc">Price low to high</option>
          <option value="price_desc">Price high to low</option>
        </select>
      </div>
      {loading ? <LoadingSpinner label="Loading products" /> : products.length ? (
        <div className="product-grid">
          {products.map((product) => <ProductCard product={product} key={product.id} onNotice={onNotice} />)}
        </div>
      ) : (
        <div className="empty-state">No products match your filters.</div>
      )}
    </section>
  );
}
