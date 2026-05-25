import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <h3>GreenCare Pharmacy</h3>
        <p>Online pharmacy demo for safe browsing, secure checkout, and simple pharmacy operations.</p>
        <p className="disclaimer">This website is for demonstration purposes only and does not provide medical advice. Always consult a qualified healthcare professional before using any medicine.</p>
      </div>
      <div>
        <h4>Useful links</h4>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart</Link>
      </div>
      <div>
        <h4>Contact</h4>
        <p>support@greencare.example</p>
        <p>+1 (555) 123-4567</p>
        <p>123 Wellness Avenue</p>
      </div>
    </footer>
  );
}
