// Cart page
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

export default function Cart() {
  const { cart, updateCart, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();
  const shipping = cartTotal >= 999 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.05);
  const total = cartTotal + shipping + tax;

  if (!cart.items?.length) return (
    <div className="flex-center" style={{ height: '60vh', flexDirection: 'column', gap: '1rem' }}>
      <FiShoppingBag size={60} style={{ opacity: 0.15 }} />
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Your cart is empty</h2>
      <Link to="/products" className="btn-primary">Start Shopping</Link>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg)', minHeight: '80vh', paddingBottom: '4rem' }}>
      <div className="container" style={{ paddingTop: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1.5rem' }}>Shopping Cart ({cart.items.length})</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem', alignItems: 'start' }}>
          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {cart.items.map(item => {
              const p = item.product;
              if (!p) return null;
              return (
                <div key={item._id} className="card" style={{ display: 'flex', gap: '1rem', padding: '1.2rem' }}>
                  <img src={p.images?.[0] || 'https://via.placeholder.com/100'} alt={p.name}
                    style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={`/products/${p._id}`} style={{ fontWeight: 700, fontSize: '0.95rem', display: 'block', marginBottom: '0.2rem' }}>{p.name}</Link>
                    {item.size && <div style={{ fontSize: '0.75rem', color: 'var(--text2)', marginBottom: '0.1rem' }}>Size: {item.size}</div>}
                    {item.color && <div style={{ fontSize: '0.75rem', color: 'var(--text2)', marginBottom: '0.4rem' }}>Color: {item.color}</div>}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1rem' }}>₹{(p.price * item.quantity).toLocaleString()}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 100 }}>
                          <button onClick={() => updateCart(item._id, item.quantity - 1)} style={{ padding: '0.3rem 0.7rem', background: 'none', border: 'none', fontSize: '1rem' }}>−</button>
                          <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center', fontSize: '0.88rem' }}>{item.quantity}</span>
                          <button onClick={() => updateCart(item._id, item.quantity + 1)} style={{ padding: '0.3rem 0.7rem', background: 'none', border: 'none', fontSize: '1rem' }}>+</button>
                        </div>
                        <button onClick={() => removeFromCart(item._id)} style={{ background: 'none', border: 'none', color: 'var(--error)', padding: '0.3rem', display: 'flex' }}>
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: 80 }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.2rem', fontSize: '1rem' }}>Order Summary</h3>
            {[['Subtotal', `₹${cartTotal.toLocaleString()}`], ['Shipping', shipping === 0 ? 'FREE' : `₹${shipping}`], ['Tax (5%)', `₹${tax}`]].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.7rem', fontSize: '0.88rem', color: 'var(--text2)' }}>
                <span>{l}</span><span style={{ color: v === 'FREE' ? 'var(--success)' : 'inherit', fontWeight: v === 'FREE' ? 700 : 400 }}>{v}</span>
              </div>
            ))}
            <div style={{ height: 1, background: 'var(--border)', margin: '1rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.2rem' }}>
              <span>Total</span><span>₹{total.toLocaleString()}</span>
            </div>
            <button onClick={() => navigate('/checkout')} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
              Proceed to Checkout <FiArrowRight />
            </button>
            {cartTotal < 999 && (
              <div style={{ marginTop: '0.8rem', padding: '0.6rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--primary)', textAlign: 'center' }}>
                Add ₹{(999 - cartTotal).toLocaleString()} more for FREE shipping!
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.container>div{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}
