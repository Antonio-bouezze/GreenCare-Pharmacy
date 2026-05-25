import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert.jsx';
import Input from '../components/Input.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register({ fullName: form.fullName, email: form.email, password: form.password });
      navigate('/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <span className="eyebrow">Join GreenCare</span>
        <h1>Create Account</h1>
        <Alert type="error">{error}</Alert>
        <Input id="fullName" label="Full name" required value={form.fullName} onChange={(event) => update('fullName', event.target.value)} />
        <Input id="email" label="Email" type="email" required value={form.email} onChange={(event) => update('email', event.target.value)} />
        <Input id="password" label="Password" type="password" minLength="8" required value={form.password} onChange={(event) => update('password', event.target.value)} />
        <Input id="confirmPassword" label="Confirm password" type="password" required value={form.confirmPassword} onChange={(event) => update('confirmPassword', event.target.value)} />
        <button className="btn btn-primary full" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
        <p>Already registered? <Link to="/login">Login</Link></p>
      </form>
    </section>
  );
}
