import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { FiUser, FiLock, FiPackage } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pass, setPass] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.updateProfile(form);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally { setLoading(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pass.newPassword !== pass.confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await authAPI.updatePassword({ currentPassword: pass.currentPassword, newPassword: pass.newPassword });
      toast.success('Password updated!');
      setPass({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '80vh', paddingBottom: '4rem' }}>
      <div className="container" style={{ paddingTop: '2rem', maxWidth: 800 }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, var(--primary), #a020f0)', borderRadius: 'var(--radius)', padding: '2rem', marginBottom: '1.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>{user?.name}</h2>
            <p style={{ opacity: 0.8, fontSize: '0.85rem' }}>{user?.email}</p>
            {user?.role === 'admin' && <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.15rem 0.6rem', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700 }}>ADMIN</span>}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem' }}>
          {[['profile', FiUser, 'Profile'], ['password', FiLock, 'Password'], ['orders', FiPackage, 'Orders']].map(([t, Icon, l]) => (
            <button key={t} onClick={() => setTab(t)} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.6rem 1.2rem', borderRadius: 100,
              border: `1.5px solid ${tab === t ? 'var(--primary)' : 'var(--border)'}`,
              background: tab === t ? 'var(--primary-light)' : 'white',
              color: tab === t ? 'var(--primary)' : 'var(--text2)',
              fontWeight: 700, fontSize: '0.82rem', transition: 'all 0.15s',
            }}>
              <Icon size={14} /> {l}
            </button>
          ))}
        </div>

        {/* Profile form */}
        {tab === 'profile' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.2rem' }}>Personal Information</h3>
            <form onSubmit={handleProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" value={user?.email} disabled style={{ background: 'var(--bg)', color: 'var(--text2)' }} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* Password */}
        {tab === 'password' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.2rem' }}>Change Password</h3>
            <form onSubmit={handlePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 400 }}>
              {[['currentPassword','Current Password'],['newPassword','New Password'],['confirm','Confirm New Password']].map(([k, l]) => (
                <div key={k} className="form-group">
                  <label className="form-label">{l}</label>
                  <input className="form-input" type="password" value={pass[k]} onChange={e => setPass(p => ({ ...p, [k]: e.target.value }))} required />
                </div>
              ))}
              <button type="submit" disabled={loading} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}

        {/* Orders shortcut */}
        {tab === 'orders' && (
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <FiPackage size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text2)', marginBottom: '1rem', fontSize: '0.9rem' }}>View all your orders and track their status</p>
            <Link to="/orders" className="btn-primary">Go to My Orders</Link>
          </div>
        )}
      </div>
      <style>{`@media(max-width:580px){.card>form>div{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}
