import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersAPI } from '../utils/api';
import toast from 'react-hot-toast';

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    ordersAPI.getOne(id).then(r => setOrder(r.data.order)).finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return;
    setCancelling(true);
    try {
      const res = await ordersAPI.cancel(id, 'Cancelled by customer');
      setOrder(res.data.order);
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel');
    } finally { setCancelling(false); }
  };

  if (loading) return <div className="flex-center" style={{ height: '60vh' }}><div className="spinner" /></div>;
  if (!order) return <div className="flex-center" style={{ height: '60vh' }}>Order not found</div>;

  const currentStep = STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '80vh', paddingBottom: '4rem' }}>
      <div className="container" style={{ paddingTop: '2rem', maxWidth: 800 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>Order Details</h1>
            <p style={{ color: 'var(--text2)', fontSize: '0.82rem' }}>#{order._id?.slice(-8).toUpperCase()} · {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          {['pending', 'confirmed'].includes(order.orderStatus) && (
            <button onClick={handleCancel} disabled={cancelling} style={{ background: 'none', border: '1.5px solid var(--error)', color: 'var(--error)', padding: '0.5rem 1.2rem', borderRadius: 100, fontSize: '0.82rem', fontWeight: 600 }}>
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>

        {/* Status tracker */}
        {order.orderStatus !== 'cancelled' && (
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.2rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.2rem', fontSize: '0.9rem' }}>Order Status</h3>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {STATUS_STEPS.map((step, i) => (
                <React.Fragment key={step}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: i < STATUS_STEPS.length - 1 ? 0 : 'none' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: i <= currentStep ? 'var(--primary)' : 'var(--bg)',
                      border: `2px solid ${i <= currentStep ? 'var(--primary)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: i <= currentStep ? 'white' : 'var(--text3)',
                      fontSize: '0.7rem', fontWeight: 700, transition: 'all 0.3s',
                    }}>{i <= currentStep ? '✓' : i + 1}</div>
                    <span style={{ fontSize: '0.65rem', color: i <= currentStep ? 'var(--primary)' : 'var(--text3)', textTransform: 'capitalize', textAlign: 'center', fontWeight: i === currentStep ? 700 : 400 }}>{step}</span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div style={{ flex: 1, height: 2, background: i < currentStep ? 'var(--primary)' : 'var(--border)', margin: '0 0.3rem', marginBottom: '1.2rem', transition: 'background 0.3s' }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
        {order.orderStatus === 'cancelled' && (
          <div style={{ background: '#ffecee', border: '1px solid var(--error)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '1.2rem', color: 'var(--error)', fontSize: '0.88rem', fontWeight: 600 }}>
            ✗ Order Cancelled {order.cancelReason && `— ${order.cancelReason}`}
          </div>
        )}

        {/* Items */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.2rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem' }}>Items Ordered</h3>
          {order.orderItems.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.8rem', marginBottom: '0.8rem', alignItems: 'center' }}>
              <img src={item.image} alt={item.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{item.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>Qty: {item.quantity} {item.size && `· Size: ${item.size}`}</div>
              </div>
              <div style={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toLocaleString()}</div>
            </div>
          ))}
          <div style={{ height: 1, background: 'var(--border)', margin: '1rem 0' }} />
          {[['Subtotal', `₹${order.itemsPrice?.toLocaleString()}`], ['Shipping', order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`], ['Tax', `₹${order.taxPrice?.toLocaleString()}`]].map(([l,v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text2)', marginBottom: '0.4rem' }}>
              <span>{l}</span><span>{v}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem', marginTop: '0.5rem' }}>
            <span>Total</span><span style={{ color: 'var(--primary)' }}>₹{order.totalPrice?.toLocaleString()}</span>
          </div>
        </div>

        {/* Address + Payment */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="card" style={{ padding: '1.2rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '0.8rem', fontSize: '0.88rem' }}>📦 Delivery Address</h3>
            {['name','street','city','state','pincode'].map(k => (
              <div key={k} style={{ fontSize: '0.82rem', color: 'var(--text2)', marginBottom: '0.2rem', textTransform: k === 'name' ? 'none' : 'capitalize' }}>
                {order.shippingAddress?.[k]}
              </div>
            ))}
            {order.shippingAddress?.phone && <div style={{ fontSize: '0.82rem', color: 'var(--text2)', marginTop: '0.3rem' }}>📞 {order.shippingAddress.phone}</div>}
          </div>
          <div className="card" style={{ padding: '1.2rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '0.8rem', fontSize: '0.88rem' }}>💳 Payment</h3>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>{order.paymentMethod?.toUpperCase()}</div>
            <span className={`badge badge-${order.paymentStatus === 'paid' ? 'success' : 'warning'}`}>
              {order.paymentStatus === 'paid' ? '✓ Paid' : 'Pending'}
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/orders" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.88rem' }}>← Back to Orders</Link>
        </div>
      </div>
      <style>{`@media(max-width:580px){.container>div:last-child{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}
