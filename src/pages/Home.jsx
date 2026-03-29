import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productsAPI } from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import { FiArrowRight, FiTruck, FiRefreshCw, FiShield, FiHeadphones } from 'react-icons/fi';

const CATEGORIES = [
  { label: 'Clothes', value: 'clothes', emoji: '👗', desc: 'Shirts, dresses, kurtas & more', color: '#ffeef6', accent: '#e84393' },
  { label: 'Shoes', value: 'shoes', emoji: '👟', desc: 'Sneakers, heels, formals & more', color: '#fff0e6', accent: '#f4a261' },
  { label: 'Slippers', value: 'slippers', emoji: '🩴', desc: 'Home, flip-flops & ethnic', color: '#e8faf8', accent: '#2ec4b6' },
];

const PERKS = [
  { icon: FiTruck, title: 'Free Delivery', desc: 'On orders above ₹999', color: '#e84393' },
  { icon: FiRefreshCw, title: 'Easy Returns', desc: '7-day hassle-free returns', color: '#f4a261' },
  { icon: FiShield, title: '100% Authentic', desc: 'Genuine products only', color: '#2ec4b6' },
  { icon: FiHeadphones, title: '24/7 Support', desc: 'We\'re always here to help', color: '#a020f0' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    productsAPI.getAll({ featured: true, limit: 8 })
      .then(res => setFeatured(res.data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 50%, #1a1a2e 100%)',
        padding: '5rem 0 4rem',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'rgba(232,67,147,0.12)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(160,32,240,0.1)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div style={{ animation: 'fadeUp 0.7s ease' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.9rem', background: 'rgba(232,67,147,0.15)', borderRadius: 100, marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#e84393', fontWeight: 700, letterSpacing: '0.1em' }}>✨ NEW ARRIVALS</span>
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 4vw, 3.6rem)',
              color: 'white', lineHeight: 1.15, marginBottom: '1.2rem',
            }}>
              Your Everyday<br />
              <span style={{ background: 'linear-gradient(135deg, #e84393, #a020f0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Style Partner
              </span>
            </h1>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 420 }}>
              Discover premium quality clothes, shoes & slippers for daily wear. Style meets comfort at unbeatable prices.
            </p>
            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/products')} className="btn-primary" style={{ fontSize: '0.95rem', padding: '0.85rem 2rem' }}>
                Shop Now <FiArrowRight />
              </button>
              <button onClick={() => navigate('/products?category=clothes')} style={{
                padding: '0.85rem 2rem', background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)', borderRadius: 100,
                color: 'white', fontSize: '0.9rem', fontWeight: 600,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.08)'}
              >View Lookbook</button>
            </div>
            <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem' }}>
              {[['50K+', 'Happy Customers'], ['10K+', 'Products'], ['4.8★', 'Rating']].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white' }}>{v}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', animation: 'fadeUp 0.9s ease 0.1s both' }}>
            {[
              { emoji: '👗', label: 'Ethnic Wear', sub: 'From ₹499', bg: 'linear-gradient(135deg, #ffeef6, #f8d7ea)' },
              { emoji: '👟', label: 'Sneakers', sub: 'From ₹999', bg: 'linear-gradient(135deg, #fff0e6, #fde0c5)' },
              { emoji: '🩴', label: 'Slippers', sub: 'From ₹299', bg: 'linear-gradient(135deg, #e8faf8, #c5f0ea)' },
              { emoji: '👔', label: 'Formals', sub: 'From ₹799', bg: 'linear-gradient(135deg, #f0e8ff, #dcc5f5)' },
            ].map((item, i) => (
              <div key={i} onClick={() => navigate('/products')} style={{
                background: item.bg, borderRadius: 'var(--radius)',
                padding: '1.5rem 1rem', textAlign: 'center',
                cursor: 'pointer', transition: 'transform 0.2s',
                animationDelay: `${i * 0.1}s`,
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>{item.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1a1a2e' }}>{item.label}</div>
                <div style={{ fontSize: '0.72rem', color: '#555566' }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Responsive */}
        <style>{`@media (max-width: 768px) { section > .container { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* ── PERKS ── */}
      <section style={{ background: 'white', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0' }}>
          {PERKS.map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '0.8rem',
              padding: '1.2rem 1.5rem',
              borderRight: i < 3 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${p.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <p.icon size={18} color={p.color} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{p.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <style>{`@media (max-width: 768px) { section > .container { grid-template-columns: repeat(2, 1fr) !important; } section > .container > div { border-right: none !important; border-bottom: 1px solid var(--border); } }`}</style>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-sub">Everything you need for daily wear, all in one place</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem' }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.value} to={`/products?category=${cat.value}`} style={{
                background: cat.color, borderRadius: 'var(--radius)',
                padding: '2rem', display: 'flex', flexDirection: 'column',
                alignItems: 'center', textAlign: 'center', border: 'none',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '0.8rem' }}>{cat.emoji}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: cat.accent, marginBottom: '0.3rem' }}>{cat.label}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>{cat.desc}</p>
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: cat.accent, fontWeight: 700, fontSize: '0.82rem' }}>
                  Shop Now <FiArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-sub">Handpicked just for you</p>
            </div>
            <Link to="/products" className="btn-outline">View All <FiArrowRight style={{ display: 'inline' }} /></Link>
          </div>
          {loading ? (
            <div className="flex-center" style={{ height: 200 }}><div className="spinner" /></div>
          ) : (
            <div className="grid-4">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── BANNER ── */}
      <section style={{ background: 'linear-gradient(135deg, var(--primary), #a020f0)', padding: '4rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: 'white', marginBottom: '0.8rem' }}>
            Free Shipping on Orders ₹999+
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Shop your everyday essentials and save on shipping!
          </p>
          <Link to="/products" className="btn-primary" style={{ background: 'white', color: 'var(--primary)', fontSize: '0.95rem', padding: '0.85rem 2rem' }}>
            Shop Now <FiArrowRight style={{ display: 'inline' }} />
          </Link>
        </div>
      </section>
    </div>
  );
}
