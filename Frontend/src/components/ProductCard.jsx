import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product, onNotice }) {
  const { addToCart } = useCart();
  const unavailable = product.stockQuantity <= 0 || product.requiresPrescription;

  const handleAdd = () => {
    try {
      addToCart(product, 1);
      onNotice?.(`${product.name} added to cart.`);
    } catch (error) {
      onNotice?.(error.message, 'error');
    }
  };

  return (
    <article className={`product-card ${product.stockQuantity <= 0 ? 'is-muted' : ''}`}>
      <div className="product-image-wrap">
        <img src={product.imageUrl} alt={product.name} />
        {product.requiresPrescription && <span className="badge badge-warn">Prescription Required</span>}
        {product.stockQuantity <= 0 && <span className="badge badge-gray">Out of Stock</span>}
      </div>
      <div className="product-card-body">
        <span className="eyebrow">{product.categoryName}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-meta">
          <strong>${product.price.toFixed(2)}</strong>
          <span>{product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Unavailable'}</span>
        </div>
        <div className="card-actions">
          <button className="btn btn-primary" onClick={handleAdd} disabled={unavailable}>Add to Cart</button>
          <Link className="btn btn-secondary" to={`/products/${product.id}`}>View Details</Link>
        </div>
      </div>
    </article>
  );
}
