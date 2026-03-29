// OrderSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersAPI } from '../utils/api';
export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => { ordersAPI.getOne(id).then(r => setOrder(r.data.order)).catch(() => {}); }, [id]);
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'pulse 1s ease 3' }}>🎉</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginBottom: '0.5rem', color: 'var(--success)' }}>Order Placed!</h1>
        <p style={{ color: 'var(--text2)', marginBottom: '0.5rem' }}>Your order has been placed successfully.</p>
        {order && <p style={{ fontSize: '0.85rem', color: 'var(--text3)', marginBottom: '1.5rem' }}>Order ID: <strong style={{ color: 'var(--text)' }}>#{order._id?.slice(-8).toUpperCase()}</strong></p>}
        {order && (
          <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text2)' }}>Payment</span>
              <span className="badge badge-warning">{order.paymentMethod?.toUpperCase()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text2)' }}>Total</span>
              <span style={{ fontWeight: 800, color: 'var(--primary)' }}>₹{order.totalPrice?.toLocaleString()}</span>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/orders" className="btn-primary">View My Orders</Link>
          <Link to="/products" className="btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
