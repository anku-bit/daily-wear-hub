import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../utils/api';
import { FiPackage } from 'react-icons/fi';

const STATUS_COLORS = { pending: 'warning', confirmed: 'secondary', processing: 'secondary', shipped: 'primary', delivered: 'success', cancelled: 'error' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersAPI.myOrders().then(r => setOrders(r.data.orders)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex-center" style={{ height: '60vh' }}><div className="spinner" /></div>;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '80vh', paddingBottom: '4rem' }}>
      <div className="container" style={{ paddingTop: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1.5rem' }}>My Orders</h1>
        {!orders.length ? (
          <div className="flex-center" style={{ height: '40vh', flexDirection: 'column', gap: '1rem' }}>
            <FiPackage size={60} style={{ opacity: 0.15 }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>No orders yet</h3>
            <Link to="/products" className="btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map(order => (
              <Link key={order._id} to={`/orders/${order._id}`} style={{ display: 'block', color: 'inherit' }}>
                <div className="card" style={{ padding: '1.2rem', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                        Order #{order._id?.slice(-8).toUpperCase()}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        &nbsp;·&nbsp;{order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span className={`badge badge-${STATUS_COLORS[order.orderStatus] || 'secondary'}`} style={{ textTransform: 'capitalize' }}>
                        {order.orderStatus}
                      </span>
                      <span style={{ fontWeight: 800, color: 'var(--primary)' }}>₹{order.totalPrice?.toLocaleString()}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem', flexWrap: 'wrap' }}>
                    {order.orderItems.slice(0, 4).map((item, i) => (
                      <img key={i} src={item.image || 'https://via.placeholder.com/50'} alt=""
                        style={{ width: 46, height: 46, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} />
                    ))}
                    {order.orderItems.length > 4 && (
                      <div style={{ width: 46, height: 46, borderRadius: 6, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text2)' }}>
                        +{order.orderItems.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
