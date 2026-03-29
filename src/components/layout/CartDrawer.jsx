import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateCart, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (!cartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div onClick={() => setCartOpen(false)} style={{
        position: 'fixed', inset: 0, background: 'rgba(26,26,46,0.45)',
        zIndex: 400, animation: 'fadeIn 0.2s ease',
      }} />

      {/* Drawer */}
      <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0,
        width: 420, maxWidth: '100vw',
        background: 'white', zIndex: 500,
        display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(26,26,46,0.15)',
        animation: 'slideIn 0.3s ease',
      }}>
        {/* Header */}
        <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiShoppingBag size={18} color="var(--primary)" />
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>
              Shopping Cart ({cart.items?.length || 0})
            </span>
          </div>
          <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text2)', padding: '0.3rem', display: 'flex', borderRadius: 8 }}>
            <FiX size={20} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {!cart.items?.length ? (
            <div style={{ textAlign: 'center', paddingTop: '4rem', color: 'var(--text2)' }}>
              <FiShoppingBag size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p style={{ fontSize: '0.9rem' }}>Your cart is empty</p>
              <button onClick={() => { setCartOpen(false); navigate('/products'); }}
                className="btn-primary" style={{ marginTop: '1rem' }}>
                Shop Now
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.items.map(item => {
                const product = item.product;
                if (!product) return null;
                return (
                  <div key={item._id} style={{
                    display: 'flex', gap: '0.8rem', padding: '0.8rem',
                    background: 'var(--bg)', borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                  }}>
                    <img src={product.images?.[0] || 'https://via.placeholder.com/70'} alt={product.name}
                      style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {product.name}
                      </div>
                      {item.size && <div style={{ fontSize: '0.72rem', color: 'var(--text2)' }}>Size: {item.size}</div>}
                      <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
                        ₹{product.price?.toLocaleString()}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button onClick={() => updateCart(item._id, item.quantity - 1)}
                          style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid var(--border)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FiMinus size={12} />
                        </button>
                        <span style={{ fontWeight: 700, fontSize: '0.88rem', minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateCart(item._id, item.quantity + 1)}
                          style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid var(--border)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FiPlus size={12} />
                        </button>
                        <button onClick={() => removeFromCart(item._id)}
                          style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--error)', padding: '0.2rem', display: 'flex' }}>
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.items?.length > 0 && (
          <div style={{ padding: '1.2rem 1.5rem', borderTop: '1px solid var(--border)', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text2)', fontSize: '0.88rem' }}>Subtotal</span>
              <span style={{ fontWeight: 700 }}>₹{cartTotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--text2)', fontSize: '0.88rem' }}>Shipping</span>
              <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.88rem' }}>{cartTotal >= 999 ? 'FREE' : '₹99'}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button onClick={() => { setCartOpen(false); navigate('/cart'); }}
                className="btn-outline" style={{ flex: 1 }}>View Cart</button>
              <button onClick={() => { setCartOpen(false); navigate('/checkout'); }}
                className="btn-primary" style={{ flex: 1 }}>Checkout →</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
