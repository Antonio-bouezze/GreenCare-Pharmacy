import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function Cart() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <section className="section page">
        <div className="empty-state">
          <h1>Your cart is empty</h1>
          <p>Add pharmacy essentials from the product catalog.</p>
          <Link className="btn btn-primary" to="/products">Shop Products</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section page">
      <div className="section-heading">
        <span className="eyebrow">Cart</span>
        <h1>Your Cart</h1>
      </div>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map(({ product, quantity }) => (
            <div className="cart-item" key={product.id}>
              <img src={product.imageUrl} alt={product.name} />
              <div>
                <h3>{product.name}</h3>
                <p>{product.categoryName}</p>
                <strong>${product.price.toFixed(2)}</strong>
              </div>
              <input aria-label={`Quantity for ${product.name}`} type="number" min="1" max={product.stockQuantity} value={quantity} onChange={(event) => updateQuantity(product.id, event.target.value)} />
              <button className="text-button" onClick={() => removeItem(product.id)}>Remove</button>
            </div>
          ))}
        </div>
        <aside className="summary-box">
          <h2>Order Summary</h2>
          <div><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
          <div><span>Total</span><strong>${subtotal.toFixed(2)}</strong></div>
          <button className="btn btn-primary full" onClick={() => navigate('/checkout')}>Checkout</button>
        </aside>
      </div>
    </section>
  );
}
