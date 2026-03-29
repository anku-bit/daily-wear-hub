import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const inWishlist = isInWishlist(product._id);
  const discount = product.discount || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div style={{
      background: 'white', borderRadius: 'var(--radius)',
      border: '1px solid var(--border)', overflow: 'hidden',
      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      position: 'relative',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Image */}
      <div style={{ position: 'relative', paddingBottom: '100%', overflow: 'hidden', background: 'var(--bg)' }}>
        <Link to={`/products/${product._id}`}>
          <img src={product.images?.[0] || 'https://via.placeholder.com/400'} alt={product.name}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', transition: 'transform 0.4s ease',
            }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
        </Link>

        {/* Discount badge */}
        {discount > 0 && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: 'var(--primary)', color: 'white',
            padding: '0.2rem 0.55rem', borderRadius: 100,
            fontSize: '0.7rem', fontWeight: 700,
          }}>-{discount}%</div>
        )}

        {/* Stock badge */}
        {product.stock === 0 && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontWeight: 700, color: 'var(--text2)', fontSize: '0.85rem' }}>Out of Stock</span>
          </div>
        )}

        {/* Actions overlay */}
        <div style={{
          position: 'absolute', top: 10, right: 10,
          display: 'flex', flexDirection: 'column', gap: '0.4rem',
        }}>
          <button onClick={() => toggleWishlist(product._id)} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'white', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: inWishlist ? 'var(--primary)' : 'var(--text2)',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-light)'}
          onMouseLeave={e => e.currentTarget.style.background = 'white'}
          >
            <FiHeart size={14} fill={inWishlist ? 'var(--primary)' : 'none'} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '0.9rem' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>
          {product.category} · {product.gender}
        </div>
        <Link to={`/products/${product._id}`} style={{ color: 'inherit' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.3rem', lineHeight: 1.3,
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', gap: 1 }}>
            {[1,2,3,4,5].map(s => (
              <FiStar key={s} size={11} fill={s <= Math.round(product.rating) ? '#f4a261' : 'none'} color={s <= Math.round(product.rating) ? '#f4a261' : '#ddd'} />
            ))}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>({product.numReviews})</span>
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.7rem' }}>
          <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>₹{product.price?.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text3)', textDecoration: 'line-through' }}>₹{product.originalPrice?.toLocaleString()}</span>
          )}
        </div>

        <button
          disabled={product.stock === 0}
          onClick={() => addToCart(product._id, 1, product.sizes?.[0])}
          style={{
            width: '100%', padding: '0.55rem',
            background: product.stock === 0 ? 'var(--bg)' : 'var(--primary)',
            color: product.stock === 0 ? 'var(--text3)' : 'white',
            border: 'none', borderRadius: 100,
            fontSize: '0.8rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
            transition: 'opacity 0.2s',
            cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={e => { if (product.stock > 0) e.currentTarget.style.opacity = '0.85'; }}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <FiShoppingBag size={14} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
