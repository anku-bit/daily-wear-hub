import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e, #2d1b4e)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '2.5rem', width: '100%', maxWidth: 420, boxShadow: 'var(--shadow-lg)', animation: 'fadeUp 0.5s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 50, height: 50, borderRadius: 14, background: 'linear-gradient(135deg, var(--primary), #a020f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.2rem', margin: '0 auto 1rem' }}>DW</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.88rem' }}>Sign in to your Daily Wear Hub account</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: 'center', marginTop: '0.5rem', padding: '0.85rem' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '0.85rem', color: 'var(--text2)' }}>
          Don&apos;t have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign Up</Link>
        </div>
        <div style={{ textAlign: 'center', marginTop: '0.8rem', padding: '0.8rem', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text2)' }}>
          <strong>Demo:</strong> admin@dailywearhub.com / admin123<br />user@dailywearhub.com / user123
        </div>
      </div>
    </div>
  );
}
