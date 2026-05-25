import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const close = () => setOpen(false);
  const handleLogout = () => {
    logout();
    close();
    navigate('/');
  };

  return (
    <header className="navbar">
      <Link className="brand" to="/" onClick={close} aria-label="GreenCare Pharmacy home">
        <span className="brand-mark">+</span>
        <span>GreenCare Pharmacy</span>
      </Link>

      <button className="menu-toggle" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
        <span />
        <span />
        <span />
      </button>

      <nav className={`nav-links ${open ? 'is-open' : ''}`}>
        <NavLink onClick={close} to="/">Home</NavLink>
        <NavLink onClick={close} to="/products">Products</NavLink>
        <NavLink onClick={close} to="/cart">Cart <span className="pill">{totalItems}</span></NavLink>
        {isAuthenticated ? (
          <>
            <NavLink onClick={close} to="/orders">Orders</NavLink>
            <NavLink onClick={close} to="/profile">{user?.fullName?.split(' ')[0] || 'Profile'}</NavLink>
            {isAdmin && <NavLink onClick={close} to="/admin">Admin Dashboard</NavLink>}
            <button className="nav-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink onClick={close} to="/login">Login</NavLink>
            <NavLink onClick={close} to="/register" className="nav-cta">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
