import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Alert from '../components/Alert.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { productApi } from '../api/productApi.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    setLoading(true);
    productApi.getProduct(id)
      .then((item) => {
        setProduct(item);
        return productApi.getProducts({ categoryId: item.categoryId });
      })
      .then((items) => setRelated(items.filter((item) => item.id !== Number(id)).slice(0, 3)))
      .catch((error) => setNotice({ type: 'error', text: error.message }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    try {
      addToCart(product, Number(quantity));
      setNotice({ type: 'success', text: 'Product added to cart.' });
    } catch (error) {
      setNotice({ type: 'error', text: error.message });
    }
  };

  if (loading) return <LoadingSpinner label="Loading product" />;
  if (!product) return <section className="section"><div className="empty-state">Product not found.</div></section>;

  const disabled = product.stockQuantity <= 0 || product.requiresPrescription;

  return (
    <section className="page section">
      <Alert type={notice?.type}>{notice?.text}</Alert>
      <div className="details-layout">
        <div className="details-image">
          <img src={product.imageUrl} alt={product.name} />
          {product.requiresPrescription && <span className="badge badge-warn">Prescription Required</span>}
        </div>
        <div className="details-copy">
          <span className="eyebrow">{product.categoryName}</span>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <div className="price-line">${product.price.toFixed(2)}</div>
          <div className="detail-list">
            <span>Stock: {product.stockQuantity > 0 ? `${product.stockQuantity} available` : 'Out of stock'}</span>
            <span>Manufacturer: {product.manufacturer || 'Not specified'}</span>
            {product.dosage && <span>Dosage: {product.dosage}</span>}
          </div>
          <div className="quantity-row">
            <label htmlFor="quantity">Quantity</label>
            <input id="quantity" type="number" min="1" max={product.stockQuantity || 1} value={quantity} onChange={(event) => setQuantity(event.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={handleAdd} disabled={disabled}>Add to Cart</button>
          <p className="medical-notice">Please consult a healthcare professional before using any medicine.</p>
          {product.requiresPrescription && <Alert type="warning">This product requires a prescription and cannot be checked out in this demo.</Alert>}
        </div>
      </div>

      <div className="section-heading">
        <span className="eyebrow">Related</span>
        <h2>Similar products</h2>
      </div>
      {related.length ? <div className="product-grid compact">{related.map((item) => <ProductCard key={item.id} product={item} onNotice={(text, type = 'success') => setNotice({ text, type })} />)}</div> : <Link to="/products">Browse all products</Link>}
    </section>
  );
}
