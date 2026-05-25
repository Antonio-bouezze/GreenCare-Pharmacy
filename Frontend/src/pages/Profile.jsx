import { useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert.jsx';
import Input from '../components/Input.jsx';
import { authApi } from '../api/authApi.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ fullName: user.fullName, email: user.email });
  const [notice, setNotice] = useState(null);

  const submit = async (event) => {
    event.preventDefault();
    try {
      const profile = await authApi.updateProfile(form);
      updateUser(profile);
      setNotice({ type: 'success', text: 'Profile updated.' });
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    }
  };

  return (
    <section className="section page narrow">
      <div className="section-heading">
        <span className="eyebrow">Account</span>
        <h1>Your Profile</h1>
      </div>
      <Alert type={notice?.type}>{notice?.text}</Alert>
      <form className="form-card" onSubmit={submit}>
        <Input id="fullName" label="Full name" required value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
        <Input id="email" label="Email" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <button className="btn btn-primary">Save Profile</button>
        <Link to="/orders">View order history</Link>
      </form>
    </section>
  );
}
