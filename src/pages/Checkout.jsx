import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState({
    name: user?.name || '', phone: user?.phone || '',
    street: '', city: '', state: '', pincode: '',
  });

  const shipping = cartTotal >= 999 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.05);
  const total = cartTotal + shipping + tax;

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!cart.items?.length) { toast.error('Cart is empty'); return; }
    for (const key of ['name','phone','street','city','state','pincode']) {
      if (!address[key]) { toast.error(`Please fill ${key}`); return; }
    }
    setLoading(true);
    try {
      const orderItems = cart.items.map(item => ({
        product: item.product._id, name: item.product.name,
        image: item.product.images?.[0], price: item.product.price,
        quantity: item.quantity, size: item.size, color: item.color,
      }));
      const res = await ordersAPI.create({
        orderItems, shippingAddress: address, paymentMethod,
        itemsPrice: cartTotal, shippingPrice: shipping, taxPrice: tax, totalPrice: total,
      });
      await clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/order-success/${res.data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '80vh', paddingBottom: '4rem' }}>
      <div className="container" style={{ paddingTop: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1.5rem' }}>Checkout</h1>
        <form onSubmit={handleOrder}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* Delivery Address */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1.2rem', fontSize: '1rem' }}>📦 Delivery Address</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[['name','Full Name'],['phone','Phone Number'],['street','Street Address'],['city','City'],['state','State'],['pincode','PIN Code']].map(([key, label]) => (
                    <div key={key} className="form-group" style={{ gridColumn: key === 'street' ? '1 / -1' : '' }}>
                      <label className="form-label">{label}</label>
                      <input className="form-input" value={address[key]} onChange={e => setAddress(a => ({ ...a, [key]: e.target.value }))} required />
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1.2rem', fontSize: '1rem' }}>💳 Payment Method</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  {[
                    { value: 'cod', label: 'Cash on Delivery (COD)', icon: '💵', sub: 'Pay when you receive your order' },
                    { value: 'online', label: 'Online Payment', icon: '💳', sub: 'Razorpay (UPI, Cards, Net Banking) — coming soon' },
                  ].map(opt => (
                    <label key={opt.value} style={{
                      display: 'flex', alignItems: 'center', gap: '0.8rem',
                      padding: '1rem', borderRadius: 'var(--radius-sm)',
                      border: `1.5px solid ${paymentMethod === opt.value ? 'var(--primary)' : 'var(--border)'}`,
                      background: paymentMethod === opt.value ? 'var(--primary-light)' : 'white',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}>
                      <input type="radio" name="payment" value={opt.value} checked={paymentMethod === opt.value} onChange={() => setPaymentMethod(opt.value)} style={{ accentColor: 'var(--primary)' }} />
                      <span style={{ fontSize: '1.3rem' }}>{opt.icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{opt.label}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>{opt.sub}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: 80 }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Order Summary ({cart.items?.length || 0} items)</h3>
              <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: '1rem' }}>
                {cart.items?.map(item => (
                  <div key={item._id} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.6rem', alignItems: 'center' }}>
                    <img src={item.product?.images?.[0]} alt="" style={{ width: 42, height: 42, objectFit: 'cover', borderRadius: 6 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product?.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text2)' }}>Qty: {item.quantity} {item.size && `· ${item.size}`}</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>₹{(item.product?.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <div style={{ height: 1, background: 'var(--border)', margin: '0.8rem 0' }} />
              {[['Subtotal', `₹${cartTotal.toLocaleString()}`], ['Shipping', shipping === 0 ? 'FREE' : `₹${shipping}`], ['Tax', `₹${tax}`]].map(([l,v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text2)', marginBottom: '0.5rem' }}>
                  <span>{l}</span><span style={{ color: v==='FREE'?'var(--success)':'' }}>{v}</span>
                </div>
              ))}
              <div style={{ height: 1, background: 'var(--border)', margin: '0.8rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.2rem' }}>
                <span>Total</span><span style={{ color: 'var(--primary)' }}>₹{total.toLocaleString()}</span>
              </div>
              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
                {loading ? 'Placing Order...' : `Place Order · ₹${total.toLocaleString()}`}
              </button>
            </div>
          </div>
        </form>
      </div>
      <style>{`@media(max-width:768px){.container>form>div{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}
