import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout.jsx';
import Alert from '../components/Alert.jsx';
import Input from '../components/Input.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { productApi } from '../api/productApi.js';

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  stockQuantity: '',
  categoryId: '',
  imageUrl: '',
  isActive: true,
  requiresPrescription: false,
  manufacturer: '',
  expiryDate: '',
  dosage: '',
};

export default function AdminProductForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState('');

  useEffect(() => {
    productApi.getCategories().then(setCategories);
    if (isEditing) {
      productApi.getProduct(id)
        .then((product) => setForm({
          ...product,
          expiryDate: product.expiryDate ? product.expiryDate.slice(0, 10) : '',
        }))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    const payload = {
      ...form,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      categoryId: Number(form.categoryId),
      expiryDate: form.expiryDate || null,
      dosage: form.dosage || null,
    };

    if (!payload.name || !payload.description || payload.price <= 0 || payload.stockQuantity < 0 || !payload.categoryId) {
      setError('Please complete required fields with valid values.');
      return;
    }

    try {
      if (isEditing) await productApi.updateProduct(id, payload);
      else await productApi.createProduct(payload);
      navigate('/admin/products');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <LoadingSpinner label="Loading product" />;

  return (
    <AdminLayout title={isEditing ? 'Edit Product' : 'Add Product'}>
      <Alert type="error">{error}</Alert>
      <form className="form-card wide" onSubmit={submit}>
        <Input id="name" label="Product name" required value={form.name} onChange={(event) => update('name', event.target.value)} />
        <label className="field" htmlFor="description">
          <span>Description</span>
          <textarea id="description" required value={form.description} onChange={(event) => update('description', event.target.value)} />
        </label>
        <div className="form-grid">
          <Input id="price" label="Price" type="number" min="0.01" step="0.01" required value={form.price} onChange={(event) => update('price', event.target.value)} />
          <Input id="stockQuantity" label="Stock quantity" type="number" min="0" required value={form.stockQuantity} onChange={(event) => update('stockQuantity', event.target.value)} />
          <label className="field" htmlFor="categoryId">
            <span>Category</span>
            <select id="categoryId" required value={form.categoryId} onChange={(event) => update('categoryId', event.target.value)}>
              <option value="">Choose category</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </label>
          <Input id="manufacturer" label="Manufacturer" value={form.manufacturer || ''} onChange={(event) => update('manufacturer', event.target.value)} />
          <Input id="expiryDate" label="Expiry date" type="date" value={form.expiryDate || ''} onChange={(event) => update('expiryDate', event.target.value)} />
          <Input id="dosage" label="Dosage" value={form.dosage || ''} onChange={(event) => update('dosage', event.target.value)} />
        </div>
        <Input id="imageUrl" label="Image URL" value={form.imageUrl || ''} onChange={(event) => update('imageUrl', event.target.value)} />
        <div className="toggle-row">
          <label><input type="checkbox" checked={form.isActive} onChange={(event) => update('isActive', event.target.checked)} /> Active / visible</label>
          <label><input type="checkbox" checked={form.requiresPrescription} onChange={(event) => update('requiresPrescription', event.target.checked)} /> Requires prescription</label>
        </div>
        <button className="btn btn-primary">{isEditing ? 'Save Product' : 'Create Product'}</button>
      </form>
    </AdminLayout>
  );
}
