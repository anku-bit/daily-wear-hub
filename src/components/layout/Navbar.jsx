import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiShoppingBag, FiHeart, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiPackage, FiSettings } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount, setCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => { setMenuOpen(false); setUserMenu(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { navigate(`/products?search=${search}`); setSearch(''); }
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 200,
      background: scrolled ? 'rgba(255,255,255,0.97)' : 'white',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: 64, gap: '1rem' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--primary), #a020f0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '1rem', fontWeight: 800,
          }}>DW</div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem', color: 'var(--text)',
            display: window.innerWidth < 480 ? 'none' : 'block',
          }}>Daily Wear Hub</span>
        </Link>

        {/* Nav links — desktop */}
        <div className="hide-mobile" style={{ display: 'flex', gap: '0.2rem', marginLeft: '0.5rem' }}>
          {[
            { label: 'All', path: '/products' },
            { label: 'Clothes', path: '/products?category=clothes' },
            { label: 'Shoes', path: '/products?category=shoes' },
            { label: 'Slippers', path: '/products?category=slippers' },
          ].map(item => (
            <Link key={item.label} to={item.path} style={{
              padding: '0.4rem 0.9rem',
              borderRadius: 100,
              fontSize: '0.85rem', fontWeight: 600,
              color: location.search?.includes(item.label.toLowerCase()) || (item.label === 'All' && location.pathname === '/products' && !location.search) ? 'var(--primary)' : 'var(--text2)',
              background: location.search?.includes(item.label.toLowerCase()) ? 'var(--primary-light)' : 'transparent',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (!e.currentTarget.style.background.includes('primary')) e.currentTarget.style.background = 'var(--bg2)'; }}
            onMouseLeave={e => { if (!location.search?.includes(item.label.toLowerCase())) e.currentTarget.style.background = 'transparent'; }}
            >{item.label}</Link>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 360, margin: '0 auto' }}>
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', fontSize: '1rem' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search clothes, shoes..."
              style={{
                width: '100%', padding: '0.55rem 1rem 0.55rem 2.5rem',
                border: '1.5px solid var(--border)', borderRadius: 100,
                fontSize: '0.85rem', background: 'var(--bg)',
                outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </form>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          {user && (
            <Link to="/wishlist" title="Wishlist" style={{ position: 'relative', padding: '0.5rem', color: 'var(--text2)', display: 'flex' }}>
              <FiHeart size={20} />
            </Link>
          )}

          <button onClick={() => user ? setCartOpen(true) : navigate('/login')}
            style={{ position: 'relative', padding: '0.5rem', background: 'none', border: 'none', color: 'var(--text2)', display: 'flex' }}>
            <FiShoppingBag size={20} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: 2, right: 2,
                background: 'var(--primary)', color: 'white',
                borderRadius: '50%', width: 16, height: 16,
                fontSize: '0.62rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{cartCount}</span>
            )}
          </button>

          {user ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setUserMenu(v => !v)} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.4rem 0.7rem', border: '1.5px solid var(--border)',
                borderRadius: 100, background: 'white', color: 'var(--text)',
                fontSize: '0.82rem', fontWeight: 600,
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), #a020f0)',
                  color: 'white', fontSize: '0.65rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{user.name.charAt(0).toUpperCase()}</div>
                <span className="hide-mobile">{user.name.split(' ')[0]}</span>
              </button>

              {userMenu && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  background: 'white', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)',
                  minWidth: 200, padding: '0.5rem', zIndex: 300,
                  animation: 'fadeIn 0.15s ease',
                }}>
                  {isAdmin && (
                    <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                      <FiSettings size={15} /> Admin Panel
                    </Link>
                  )}
                  <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '0.85rem' }}>
                    <FiUser size={15} /> My Profile
                  </Link>
                  <Link to="/orders" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '0.85rem' }}>
                    <FiPackage size={15} /> My Orders
                  </Link>
                  <Link to="/wishlist" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '0.85rem' }}>
                    <FiHeart size={15} /> Wishlist
                  </Link>
                  <div style={{ height: 1, background: 'var(--border)', margin: '0.4rem 0' }} />
                  <button onClick={() => { logout(); setUserMenu(false); }} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
                    padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)',
                    color: 'var(--error)', fontSize: '0.85rem', background: 'none', border: 'none', cursor: 'pointer',
                  }}>
                    <FiLogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.82rem' }}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
