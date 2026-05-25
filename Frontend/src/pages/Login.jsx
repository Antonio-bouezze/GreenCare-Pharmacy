import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert.jsx';
import Input from '../components/Input.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form);
      navigate(user.role === 'Admin' ? '/admin' : location.state?.from?.pathname || '/products', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <span className="eyebrow">Welcome back</span>
        <h1>Login</h1>
        <Alert type="error">{error}</Alert>
        <Input id="email" label="Email" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <Input id="password" label="Password" type="password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        <button className="btn btn-primary full" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        <p>New customer? <Link to="/register">Create an account</Link></p>
        <small>Demo admin: admin@pharmacy.com / Admin123!</small>
      </form>
    </section>
  );
}
