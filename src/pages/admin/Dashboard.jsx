import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  FiDollarSign, FiShoppingBag, FiPackage, FiUsers,
  FiTrendingUp, FiClock, FiCheckCircle, FiTruck
} from 'react-icons/fi';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    color: '#f4a261', bg: '#fff4e6' },
  confirmed:  { label: 'Confirmed',  color: '#2ec4b6', bg: '#e8faf8' },
  processing: { label: 'Processing', color: '#a020f0', bg: '#f5eeff' },
  shipped:    { label: 'Shipped',    color: '#4361ee', bg: '#eef0ff' },
  delivered:  { label: 'Delivered',  color: '#2dc653', bg: '#e8fce8' },
};

function StatCard({ icon: Icon, label, value, sub, color, bg }) {
  return (
    <div style={{ background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '1.2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: bg || '#ffeef6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={22} color={color || 'var(--primary)'} />
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text2)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{label}</div>
        <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-display)', lineHeight: 1, marginBottom: '0.2rem' }}>{value}</div>
        {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.dashboard().then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AdminLayout title="Dashboard">
      <div className="flex-center" style={{ height: 300 }}><div className="spinner" /></div>
    </AdminLayout>
  );

  const { stats, recentOrders } = data || {};

  return (
    <AdminLayout title="Dashboard">
      {/* Welcome */}
      <div style={{ background: 'linear-gradient(135deg, var(--secondary), #2d1b4e)', borderRadius: 'var(--radius)', padding: '1.5rem 2rem', marginBottom: '1.5rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.3rem' }}>Welcome back! 👋</h2>
          <p style={{ opacity: 0.7, fontSize: '0.88rem' }}>Here's what's happening at Daily Wear Hub today.</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary" style={{ background: 'var(--primary)', whiteSpace: 'nowrap' }}>
          + Add Product
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard icon={FiDollarSign} label="Total Revenue" value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`} sub="All time" color="#2dc653" bg="#e8fce8" />
        <StatCard icon={FiShoppingBag} label="Total Orders" value={stats?.totalOrders || 0} sub="All time" color="var(--primary)" bg="var(--primary-light)" />
        <StatCard icon={FiPackage} label="Products" value={stats?.totalProducts || 0} sub="Active listings" color="#f4a261" bg="#fff4e6" />
        <StatCard icon={FiUsers} label="Customers" value={stats?.totalUsers || 0} sub="Registered users" color="#4361ee" bg="#eef0ff" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
        {/* Recent orders */}
        <div style={{ background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Recent Orders</h3>
            <Link to="/admin/orders" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>View All →</Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg)' }}>
                  {['Order', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '0.7rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(recentOrders || []).map(order => (
                  <tr key={order._id} style={{ borderTop: '1px solid var(--border)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <Link to={`/orders/${order._id}`} style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)' }}>
                        #{order._id?.slice(-6).toUpperCase()}
                      </Link>
                    </td>
                    <td style={{ padding: '0.8rem 1rem', fontSize: '0.82rem' }}>{order.user?.name || 'N/A'}</td>
                    <td style={{ padding: '0.8rem 1rem', fontSize: '0.85rem', fontWeight: 700 }}>₹{order.totalPrice?.toLocaleString()}</td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700,
                        background: STATUS_CONFIG[order.orderStatus]?.bg || '#f0f0f0',
                        color: STATUS_CONFIG[order.orderStatus]?.color || '#888',
                        textTransform: 'capitalize',
                      }}>{order.orderStatus}</span>
                    </td>
                    <td style={{ padding: '0.8rem 1rem', fontSize: '0.78rem', color: 'var(--text3)', whiteSpace: 'nowrap' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order status breakdown */}
        <div style={{ background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '1.2rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.2rem' }}>Order Status</h3>
          {Object.entries(stats?.ordersByStatus || {}).map(([status, count]) => {
            const cfg = STATUS_CONFIG[status];
            const total = Object.values(stats?.ordersByStatus || {}).reduce((a, b) => a + b, 0);
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={status} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: cfg?.color, textTransform: 'capitalize' }}>{status}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{count}</span>
                </div>
                <div style={{ height: 6, borderRadius: 100, background: 'var(--bg)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: cfg?.color || '#ddd', borderRadius: 100, transition: 'width 0.8s ease' }} />
                </div>
              </div>
            );
          })}

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <FiTrendingUp size={14} color="var(--success)" />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--success)' }}>Quick Stats</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 1.7 }}>
              Avg order: <strong>₹{stats?.totalOrders > 0 ? Math.round((stats?.totalRevenue || 0) / stats.totalOrders).toLocaleString() : 0}</strong><br />
              Delivered: <strong>{stats?.ordersByStatus?.delivered || 0}</strong> orders
            </div>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){.container{grid-template-columns:repeat(2,1fr)!important;} section>div{grid-template-columns:1fr!important;}}`}</style>
    </AdminLayout>
  );
}
