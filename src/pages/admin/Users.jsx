import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiShield, FiToggleLeft, FiToggleRight, FiSearch } from 'react-icons/fi';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toggling, setToggling] = useState(null);

  useEffect(() => {
    adminAPI.getUsers ? adminAPI.getUsers()
      .then(r => setUsers(r.data.users))
      .finally(() => setLoading(false))
    : setLoading(false);
  }, []);

  const handleToggle = async (id, name) => {
    if (id === currentUser._id) { toast.error("Can't disable your own account"); return; }
    setToggling(id);
    try {
      const res = await adminAPI.toggleUser(id);
      setUsers(prev => prev.map(u => u._id === id ? res.data.user : u));
      toast.success(`${name} ${res.data.user.isActive ? 'enabled' : 'disabled'}`);
    } catch { toast.error('Failed to update user'); }
    finally { setToggling(null); }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Users">
      <div style={{ background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              style={{ width: '100%', padding: '0.55rem 0.8rem 0.55rem 2.2rem', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '0.85rem', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text2)', whiteSpace: 'nowrap' }}>{filtered.length} users</span>
        </div>

        {loading ? (
          <div className="flex-center" style={{ height: 200 }}><div className="spinner" /></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg)' }}>
                  {['User', 'Email', 'Phone', 'Role', 'Joined', 'Status', 'Action'].map(h => (
                    <th key={h} style={{ padding: '0.7rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u._id} style={{ borderTop: '1px solid var(--border)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafaf8'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: u.role === 'admin' ? 'linear-gradient(135deg, var(--primary), #a020f0)' : 'var(--bg)',
                          border: '1px solid var(--border)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '0.82rem',
                          color: u.role === 'admin' ? 'white' : 'var(--text2)',
                          flexShrink: 0,
                        }}>
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                          {u.name}
                          {u._id === currentUser?._id && <span style={{ marginLeft: '0.4rem', fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 600 }}>(You)</span>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.8rem 1rem', fontSize: '0.82rem', color: 'var(--text2)' }}>{u.email}</td>
                    <td style={{ padding: '0.8rem 1rem', fontSize: '0.82rem', color: 'var(--text2)' }}>{u.phone || '—'}</td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                        padding: '0.2rem 0.6rem', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700,
                        background: u.role === 'admin' ? 'rgba(232,67,147,0.1)' : 'var(--bg)',
                        color: u.role === 'admin' ? 'var(--primary)' : 'var(--text2)',
                      }}>
                        {u.role === 'admin' ? <FiShield size={10} /> : <FiUser size={10} />}
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.8rem 1rem', fontSize: '0.78rem', color: 'var(--text3)', whiteSpace: 'nowrap' }}>
                      {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700,
                        background: u.isActive ? '#e8fce8' : '#ffecee',
                        color: u.isActive ? '#2dc653' : '#e63946',
                      }}>{u.isActive ? 'Active' : 'Disabled'}</span>
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggle(u._id, u.name)}
                          disabled={toggling === u._id}
                          title={u.isActive ? 'Disable User' : 'Enable User'}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.35rem',
                            padding: '0.35rem 0.8rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600,
                            border: '1px solid var(--border)', background: 'white',
                            color: u.isActive ? 'var(--error)' : 'var(--success)',
                            cursor: 'pointer', transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = u.isActive ? '#ffecee' : '#e8fce8'}
                          onMouseLeave={e => e.currentTarget.style.background = 'white'}
                        >
                          {u.isActive ? <FiToggleRight size={14} /> : <FiToggleLeft size={14} />}
                          {u.isActive ? 'Disable' : 'Enable'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="flex-center" style={{ height: 150, color: 'var(--text2)' }}>No users found</div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
