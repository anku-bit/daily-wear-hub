import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import { FiChevronDown } from 'react-icons/fi';

const STATUS_FLOW = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const STATUS_CFG = {
  pending:    { color: '#f4a261', bg: '#fff4e6' },
  confirmed:  { color: '#2ec4b6', bg: '#e8faf8' },
  processing: { color: '#a020f0', bg: '#f5eeff' },
  shipped:    { color: '#4361ee', bg: '#eef0ff' },
  delivered:  { color: '#2dc653', bg: '#e8fce8' },
  cancelled:  { color: '#e63946', bg: '#ffecee' },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [updating, setUpdating] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    adminAPI.getOrders({ status: statusFilter, page, limit: 15 })
      .then(r => { setOrders(r.data.orders); setTotal(r.data.total); setPages(r.data.pages); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [statusFilter, page]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const res = await adminAPI.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o._id === orderId ? res.data.order : o));
      toast.success(`Order marked as ${newStatus}`);
    } catch {
      toast.error('Failed to update order status');
    } finally { setUpdating(null); }
  };

  return (
    <AdminLayout title="Orders">
      <div style={{ background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        {/* Filters */}
        <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', marginRight: '0.5rem' }}>Filter:</span>
          {['', ...STATUS_FLOW, 'cancelled'].map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} style={{
              padding: '0.35rem 0.9rem', borderRadius: 100, fontSize: '0.78rem', fontWeight: 600,
              border: `1px solid ${statusFilter === s ? 'var(--primary)' : 'var(--border)'}`,
              background: statusFilter === s ? 'var(--primary-light)' : 'transparent',
              color: statusFilter === s ? 'var(--primary)' : 'var(--text2)',
              cursor: 'pointer', textTransform: 'capitalize',
            }}>
              {s || 'All'} {s && <span style={{ color: STATUS_CFG[s]?.color }}>●</span>}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '0.82rem', color: 'var(--text2)' }}>{total} orders</span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex-center" style={{ height: 200 }}><div className="spinner" /></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg)' }}>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Update'].map(h => (
                    <th key={h} style={{ padding: '0.7rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} style={{ borderTop: '1px solid var(--border)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafaf8'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <Link to={`/orders/${order._id}`} style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)' }}>
                        #{order._id?.slice(-7).toUpperCase()}
                      </Link>
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{order.user?.name || 'N/A'}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{order.user?.email}</div>
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        {order.orderItems.slice(0, 3).map((item, i) => (
                          <img key={i} src={item.image} alt="" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border)' }} />
                        ))}
                        {order.orderItems.length > 3 && <div style={{ width: 32, height: 32, borderRadius: 4, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: 'var(--text2)' }}>+{order.orderItems.length - 3}</div>}
                      </div>
                    </td>
                    <td style={{ padding: '0.8rem 1rem', fontWeight: 800, fontSize: '0.9rem' }}>
                      ₹{order.totalPrice?.toLocaleString()}
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase' }}>{order.paymentMethod}</div>
                      <span style={{
                        fontSize: '0.68rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: 100,
                        background: order.paymentStatus === 'paid' ? '#e8fce8' : '#fff4e6',
                        color: order.paymentStatus === 'paid' ? '#2dc653' : '#f4a261',
                      }}>{order.paymentStatus}</span>
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <span style={{
                        padding: '0.2rem 0.7rem', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700,
                        background: STATUS_CFG[order.orderStatus]?.bg,
                        color: STATUS_CFG[order.orderStatus]?.color,
                        textTransform: 'capitalize',
                      }}>{order.orderStatus}</span>
                    </td>
                    <td style={{ padding: '0.8rem 1rem', fontSize: '0.78rem', color: 'var(--text3)', whiteSpace: 'nowrap' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      {order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered' && (
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <select
                            value={order.orderStatus}
                            disabled={updating === order._id}
                            onChange={e => handleStatusChange(order._id, e.target.value)}
                            style={{
                              padding: '0.35rem 1.6rem 0.35rem 0.6rem', borderRadius: 8, fontSize: '0.78rem',
                              border: '1.5px solid var(--border)', background: 'white',
                              color: 'var(--text)', outline: 'none', cursor: 'pointer',
                              appearance: 'none', fontWeight: 600,
                            }}>
                            {STATUS_FLOW.map(s => (
                              <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </select>
                          <FiChevronDown size={11} style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text2)' }} />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div className="flex-center" style={{ height: 150, color: 'var(--text2)' }}>No orders found</div>
            )}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} style={{
                width: 30, height: 30, borderRadius: 6, border: `1px solid ${p === page ? 'var(--primary)' : 'var(--border)'}`,
                background: p === page ? 'var(--primary)' : 'transparent', color: p === page ? 'white' : 'var(--text)',
                fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
              }}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
