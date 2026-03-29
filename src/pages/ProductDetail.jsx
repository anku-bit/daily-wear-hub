import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsAPI, reviewsAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/common/ProductCard';
import toast from 'react-hot-toast';
import { FiHeart, FiShoppingBag, FiStar, FiTruck, FiRefreshCw, FiShield, FiChevronLeft } from 'react-icons/fi';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState('desc');
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    productsAPI.getOne(id).then(res => {
      setProduct(res.data.product);
      setSelectedSize(res.data.product.sizes?.[0] || '');
      setSelectedColor(res.data.product.colors?.[0] || '');
      setActiveImg(0);
      // Fetch related
      return productsAPI.getAll({ category: res.data.product.category, limit: 4 });
    }).then(res => {
      setRelated(res.data.products.filter(p => p._id !== id));
    }).finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (product.sizes?.length && !selectedSize) { toast.error('Please select a size'); return; }
    addToCart(product._id, qty, selectedSize, selectedColor);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!review.comment.trim()) { toast.error('Please write a comment'); return; }
    setSubmitting(true);
    try {
      const res = await reviewsAPI.add(id, review);
      setProduct(res.data.product);
      setReview({ rating: 5, comment: '' });
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex-center" style={{ height: '60vh' }}><div className="spinner" /></div>;
  if (!product) return <div className="flex-center" style={{ height: '60vh' }}>Product not found</div>;

  const discount = product.discount || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '80vh', paddingBottom: '4rem' }}>
      <div className="container" style={{ paddingTop: '1.5rem' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--text2)' }}>
          <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--text2)' }}>
            <FiChevronLeft size={14} /> Products
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--text)', fontWeight: 600 }}>{product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', background: 'white', borderRadius: 'var(--radius)', padding: '2rem', border: '1px solid var(--border)' }}>
          {/* Images */}
          <div>
            <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '0.8rem', background: 'var(--bg)', aspectRatio: '1', position: 'relative' }}>
              <img src={product.images?.[activeImg] || 'https://via.placeholder.com/500'} alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }} />
              {discount > 0 && (
                <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--primary)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: 100, fontSize: '0.8rem', fontWeight: 700 }}>
                  -{discount}% OFF
                </div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {product.images.map((img, i) => (
                  <div key={i} onClick={() => setActiveImg(i)} style={{
                    width: 64, height: 64, borderRadius: 8, overflow: 'hidden',
                    border: `2px solid ${i === activeImg ? 'var(--primary)' : 'var(--border)'}`,
                    cursor: 'pointer', transition: 'border-color 0.2s',
                  }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <span className="badge badge-secondary" style={{ textTransform: 'capitalize' }}>{product.category}</span>
              <span className="badge badge-secondary" style={{ textTransform: 'capitalize' }}>{product.gender}</span>
              {product.brand && <span className="badge badge-primary">{product.brand}</span>}
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', lineHeight: 1.2, marginBottom: '0.8rem' }}>{product.name}</h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1,2,3,4,5].map(s => (
                  <FiStar key={s} size={16} fill={s <= Math.round(product.rating) ? '#f4a261' : 'none'} color={s <= Math.round(product.rating) ? '#f4a261' : '#ddd'} />
                ))}
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{product.rating?.toFixed(1)}</span>
              <span style={{ color: 'var(--text2)', fontSize: '0.82rem' }}>({product.numReviews} reviews)</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8rem', marginBottom: '1.5rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>₹{product.price?.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <span style={{ fontSize: '1.1rem', color: 'var(--text3)', textDecoration: 'line-through' }}>₹{product.originalPrice?.toLocaleString()}</span>
              )}
              {discount > 0 && <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.9rem' }}>You save ₹{(product.originalPrice - product.price)?.toLocaleString()}</span>}
            </div>

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div style={{ marginBottom: '1.2rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>Size: <span style={{ color: 'var(--primary)' }}>{selectedSize}</span></div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)} style={{
                      padding: '0.4rem 0.9rem', borderRadius: 8,
                      border: `1.5px solid ${selectedSize === s ? 'var(--primary)' : 'var(--border)'}`,
                      background: selectedSize === s ? 'var(--primary-light)' : 'white',
                      color: selectedSize === s ? 'var(--primary)' : 'var(--text)',
                      fontWeight: 600, fontSize: '0.82rem', transition: 'all 0.15s',
                    }}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div style={{ marginBottom: '1.2rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>Color: <span style={{ color: 'var(--primary)' }}>{selectedColor}</span></div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {product.colors.map(c => (
                    <button key={c} onClick={() => setSelectedColor(c)} style={{
                      padding: '0.35rem 0.8rem', borderRadius: 100,
                      border: `1.5px solid ${selectedColor === c ? 'var(--primary)' : 'var(--border)'}`,
                      background: selectedColor === c ? 'var(--primary-light)' : 'white',
                      color: selectedColor === c ? 'var(--primary)' : 'var(--text)',
                      fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.15s',
                    }}>{c}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            <div style={{ fontSize: '0.82rem', marginBottom: '1.2rem' }}>
              {product.stock > 0 ? (
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>✓ In Stock ({product.stock} left)</span>
              ) : (
                <span style={{ color: 'var(--error)', fontWeight: 600 }}>✗ Out of Stock</span>
              )}
            </div>

            {/* Qty + Actions */}
            <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.2rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 100, overflow: 'hidden' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: '0.5rem 0.9rem', background: 'none', border: 'none', fontWeight: 700, fontSize: '1rem' }}>−</button>
                <span style={{ padding: '0 0.5rem', fontWeight: 700, minWidth: 30, textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{ padding: '0.5rem 0.9rem', background: 'none', border: 'none', fontWeight: 700, fontSize: '1rem' }}>+</button>
              </div>
              <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                <FiShoppingBag /> Add to Cart
              </button>
              <button onClick={() => toggleWishlist(product._id)} style={{
                width: 44, height: 44, borderRadius: '50%', border: '1.5px solid var(--border)',
                background: isInWishlist(product._id) ? 'var(--primary-light)' : 'white',
                color: isInWishlist(product._id) ? 'var(--primary)' : 'var(--text2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <FiHeart fill={isInWishlist(product._id) ? 'var(--primary)' : 'none'} size={18} />
              </button>
            </div>

            {/* Perks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', background: 'var(--bg)', borderRadius: 'var(--radius-sm)' }}>
              {[
                { icon: FiTruck, text: 'Free delivery on orders ₹999+' },
                { icon: FiRefreshCw, text: '7-day easy returns' },
                { icon: FiShield, text: '100% authentic product' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text2)' }}>
                  <Icon size={14} color="var(--primary)" /> {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginTop: '1.5rem', overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
            {[['desc', 'Description'], ['reviews', `Reviews (${product.numReviews})`]].map(([t, l]) => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '1rem 1.5rem', background: 'none', border: 'none',
                fontWeight: 700, fontSize: '0.88rem',
                color: tab === t ? 'var(--primary)' : 'var(--text2)',
                borderBottom: `2px solid ${tab === t ? 'var(--primary)' : 'transparent'}`,
                marginBottom: -1, transition: 'all 0.2s',
              }}>{l}</button>
            ))}
          </div>
          <div style={{ padding: '1.5rem' }}>
            {tab === 'desc' ? (
              <p style={{ fontSize: '0.9rem', lineHeight: 1.8, color: 'var(--text2)' }}>{product.description}</p>
            ) : (
              <div>
                {/* Add review */}
                {user && (
                  <form onSubmit={handleReview} style={{ background: 'var(--bg)', padding: '1.2rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
                    <h4 style={{ fontWeight: 700, marginBottom: '0.8rem', fontSize: '0.9rem' }}>Write a Review</h4>
                    <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.8rem' }}>
                      {[1,2,3,4,5].map(s => (
                        <button key={s} type="button" onClick={() => setReview(r => ({ ...r, rating: s }))} style={{ background: 'none', border: 'none', padding: '0.1rem' }}>
                          <FiStar size={20} fill={s <= review.rating ? '#f4a261' : 'none'} color={s <= review.rating ? '#f4a261' : '#ddd'} />
                        </button>
                      ))}
                    </div>
                    <textarea value={review.comment} onChange={e => setReview(r => ({ ...r, comment: e.target.value }))}
                      placeholder="Share your experience..." rows={3}
                      className="form-input" style={{ width: '100%', resize: 'vertical', marginBottom: '0.8rem' }} />
                    <button type="submit" disabled={submitting} className="btn-primary" style={{ fontSize: '0.85rem' }}>
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
                {/* Reviews list */}
                {product.reviews?.length === 0 ? (
                  <p style={{ color: 'var(--text2)', fontSize: '0.88rem' }}>No reviews yet. Be the first!</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {product.reviews.map(r => (
                      <div key={r._id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{r.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{new Date(r.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 2, marginBottom: '0.4rem' }}>
                          {[1,2,3,4,5].map(s => <FiStar key={s} size={12} fill={s <= r.rating ? '#f4a261' : 'none'} color={s <= r.rating ? '#f4a261' : '#ddd'} />)}
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.6 }}>{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: '2.5rem' }}>
            <h2 className="section-title" style={{ marginBottom: '1.2rem' }}>Related Products</h2>
            <div className="grid-4">
              {related.slice(0, 4).map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
      <style>{`@media (max-width: 768px) { .container > div:nth-child(2) > div { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
