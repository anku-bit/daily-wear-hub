import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to Daily Wear Hub 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e, #2d1b4e)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '2.5rem', width: '100%', maxWidth: 440, boxShadow: 'var(--shadow-lg)', animation: 'fadeUp 0.5s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 50, height: 50, borderRadius: 14, background: 'linear-gradient(135deg, var(--primary), #a020f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.2rem', margin: '0 auto 1rem' }}>DW</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>Create Account</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.88rem' }}>Join Daily Wear Hub today</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" type="text" placeholder="John Doe" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input className="form-input" type="password" placeholder="Repeat password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: 'center', marginTop: '0.5rem', padding: '0.85rem' }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '0.85rem', color: 'var(--text2)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}
