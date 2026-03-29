import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/common/ProductCard';
import { FiHeart } from 'react-icons/fi';

export default function Wishlist() {
  const { wishlist } = useCart();
  const products = wishlist.products || [];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '80vh', paddingBottom: '4rem' }}>
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <FiHeart size={22} color="var(--primary)" fill="var(--primary)" />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>Wishlist ({products.length})</h1>
        </div>
        {!products.length ? (
          <div className="flex-center" style={{ height: '40vh', flexDirection: 'column', gap: '1rem' }}>
            <FiHeart size={60} style={{ opacity: 0.12 }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>Your wishlist is empty</h3>
            <p style={{ color: 'var(--text2)', fontSize: '0.88rem' }}>Save items you love for later</p>
            <Link to="/products" className="btn-primary">Explore Products</Link>
          </div>
        ) : (
          <div className="grid-4">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
