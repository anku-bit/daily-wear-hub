import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers,
  FiPlusCircle, FiLogOut, FiMenu, FiX, FiExternalLink
} from 'react-icons/fi';

const NAV = [
  { label: 'Dashboard', path: '/admin', icon: FiGrid },
  { label: 'Products', path: '/admin/products', icon: FiPackage },
  { label: 'Add Product', path: '/admin/products/new', icon: FiPlusCircle },
  { label: 'Orders', path: '/admin/orders', icon: FiShoppingBag },
  { label: 'Users', path: '/admin/users', icon: FiUsers },
];

export default function AdminLayout({ children, title }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f0f5', fontFamily: 'var(--font-body)' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 240 : 64,
        background: 'var(--secondary)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s ease',
        flexShrink: 0, position: 'sticky', top: 0, height: '100vh',
        overflowX: 'hidden',
      }}>
        {/* Brand */}
        <div style={{ padding: '1.2rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '0.7rem', minHeight: 64 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--primary), #a020f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 }}>DW</div>
          {sidebarOpen && (
            <div>
              <div style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '0.95rem', lineHeight: 1.2 }}>Daily Wear Hub</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', letterSpacing: '0.12em' }}>ADMIN PANEL</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.8rem 0.6rem' }}>
          {NAV.map(({ label, path, icon: Icon }) => {
            const active = location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path) && path !== '/admin/products/new');
            return (
              <Link key={path} to={path} title={!sidebarOpen ? label : ''} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.65rem 0.8rem', borderRadius: 10, marginBottom: '0.2rem',
                background: active ? 'rgba(232,67,147,0.18)' : 'transparent',
                color: active ? 'var(--primary)' : 'rgba(255,255,255,0.6)',
                transition: 'all 0.15s', textDecoration: 'none', fontWeight: active ? 700 : 400,
                fontSize: '0.87rem', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                {sidebarOpen && label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '0.8rem 0.6rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link to="/" title="View Store" style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.6rem 0.8rem', borderRadius: 10,
            color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem',
            marginBottom: '0.3rem', whiteSpace: 'nowrap',
          }}>
            <FiExternalLink size={16} style={{ flexShrink: 0 }} />
            {sidebarOpen && 'View Store'}
          </Link>
          <button onClick={() => { logout(); navigate('/login'); }} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.6rem 0.8rem', borderRadius: 10, border: 'none',
            background: 'transparent', color: 'rgba(255,255,255,0.4)',
            fontSize: '0.82rem', cursor: 'pointer', whiteSpace: 'nowrap',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--error)'; e.currentTarget.style.background = 'rgba(230,57,70,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <FiLogOut size={16} style={{ flexShrink: 0 }} />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '0 1.5rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', color: 'var(--text2)', padding: '0.3rem', display: 'flex', borderRadius: 6 }}>
              {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>{title}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #a020f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.82rem' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{user?.name}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 600 }}>Administrator</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
