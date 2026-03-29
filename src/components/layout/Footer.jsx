import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--secondary)', color: 'rgba(255,255,255,0.8)', paddingTop: '3.5rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.2fr', gap: '3rem', paddingBottom: '3rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--primary), #a020f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>DW</div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'white' }}>Daily Wear Hub</span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.2rem', opacity: 0.7 }}>
              Your Everyday Style Partner — quality clothes, shoes & slippers for daily life.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.7)', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                ><Icon size={16} /></a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Shop</h4>
            {['All Products', 'Clothes', 'Shoes', 'Slippers', 'New Arrivals', 'Sale'].map(l => (
              <Link key={l} to="/products" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', opacity: 0.65, transition: 'opacity 0.15s' }}
                onMouseEnter={e => e.target.style.opacity = 1}
                onMouseLeave={e => e.target.style.opacity = 0.65}
              >{l}</Link>
            ))}
          </div>

          {/* Account */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Account</h4>
            {[['My Profile', '/profile'], ['My Orders', '/orders'], ['Wishlist', '/wishlist'], ['Cart', '/cart']].map(([l, p]) => (
              <Link key={l} to={p} style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', opacity: 0.65, transition: 'opacity 0.15s' }}
                onMouseEnter={e => e.target.style.opacity = 1}
                onMouseLeave={e => e.target.style.opacity = 0.65}
              >{l}</Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Contact</h4>
            {[
              { icon: FiMail, text: 'support@dailywearhub.in' },
              { icon: FiPhone, text: '+91 98765 43210' },
              { icon: FiMapPin, text: 'Mumbai, Maharashtra, India' },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.7rem', fontSize: '0.83rem', opacity: 0.65 }}>
                <Icon size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                {text}
              </div>
            ))}
            <div style={{ marginTop: '1rem' }}>
              <div style={{ fontSize: '0.75rem', opacity: 0.5, marginBottom: '0.4rem' }}>We accept</div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {['UPI', 'Visa', 'Mastercard', 'COD'].map(p => (
                  <span key={p} style={{ padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: 4, fontSize: '0.68rem', fontWeight: 600 }}>{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '1.2rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.78rem', opacity: 0.5 }}>© 2025 Daily Wear Hub. All rights reserved.</span>
          <span style={{ fontSize: '0.78rem', opacity: 0.5 }}>Made with ♥ in India</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer .container > div:first-child { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          footer .container > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
