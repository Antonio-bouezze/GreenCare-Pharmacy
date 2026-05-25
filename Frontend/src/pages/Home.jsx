import { Link } from 'react-router-dom';

const categories = ['Pain Relief', 'Cold & Flu', 'Vitamins', 'First Aid'];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Licensed pharmacy demo</span>
          <h1>Your Trusted Online Pharmacy</h1>
          <p>Browse everyday medicine, wellness essentials, and pharmacy products with reliable stock visibility and secure checkout.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/products">Shop Now</Link>
            <Link className="btn btn-secondary" to="/register">Create Account</Link>
          </div>
        </div>
        <div className="hero-visual" aria-label="Pharmacy product display">
          <div className="hero-card hero-card-main">
            <span className="plus-symbol">+</span>
            <h2>GreenCare</h2>
            <p>Medicine, wellness, and first aid essentials.</p>
          </div>
          <div className="floating-tile tile-one">Secure checkout</div>
          <div className="floating-tile tile-two">Fast delivery</div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">Featured</span>
          <h2>Popular pharmacy essentials</h2>
        </div>
        <div className="feature-grid">
          {['Digital Thermometer', 'Vitamin C Tablets', 'First Aid Kit'].map((name) => (
            <div className="mini-card" key={name}>
              <div className="mini-icon">+</div>
              <h3>{name}</h3>
              <p>Useful everyday care products with clear labeling and responsible descriptions.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section green-band">
        <div className="section-heading">
          <span className="eyebrow">Shop by need</span>
          <h2>Category preview</h2>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link to="/products" className="category-pill" key={category}>{category}</Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="benefit-grid">
          {[
            ['Trusted products', 'Clear product information and safe demo descriptions.'],
            ['Fast delivery', 'Simple checkout flow for delivery details and order tracking.'],
            ['Secure checkout', 'Authenticated order placement with server-side totals.'],
            ['Licensed support', 'Demo pharmacy support language without medical advice.'],
          ].map(([title, text]) => (
            <div className="benefit" key={title}>
              <span className="check">✓</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
