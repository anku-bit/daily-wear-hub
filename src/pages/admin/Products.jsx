import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiEye } from 'react-icons/fi';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [deleting, setDeleting] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    productsAPI.getAll({ search, category, page, limit: 15 })
      .then(r => { setProducts(r.data.products); setTotal(r.data.total); setPages(r.data.pages); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [search, category, page]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    setDeleting(id);
    try {
      await productsAPI.delete(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Failed to delete'); }
    finally { setDeleting(null); }
  };

  return (
    <AdminLayout title="Products">
      <div style={{ background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, position: 'relative', minWidth: 200 }}>
            <FiSearch style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products..."
              style={{ width: '100%', padding: '0.55rem 0.8rem 0.55rem 2.2rem', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '0.85rem', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
          <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
            style={{ padding: '0.55rem 1rem', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '0.85rem', outline: 'none' }}>
            <option value="">All Categories</option>
            <option value="clothes">Clothes</option>
            <option value="shoes">Shoes</option>
            <option value="slippers">Slippers</option>
          </select>
          <span style={{ fontSize: '0.82rem', color: 'var(--text2)', whiteSpace: 'nowrap' }}>{total} products</span>
          <Link to="/admin/products/new" className="btn-primary" style={{ whiteSpace: 'nowrap', fontSize: '0.82rem', padding: '0.55rem 1.1rem' }}>
            <FiPlus size={14} /> Add Product
          </Link>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex-center" style={{ height: 200 }}><div className="spinner" /></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg)' }}>
                  {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Featured', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.7rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id} style={{ borderTop: '1px solid var(--border)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafaf8'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                        <img src={p.images?.[0]} alt={p.name}
                          style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text3)', textTransform: 'capitalize' }}>{p.gender} · {p.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <span style={{ padding: '0.2rem 0.6rem', borderRadius: 100, fontSize: '0.72rem', fontWeight: 600, background: 'var(--bg)', color: 'var(--text2)', textTransform: 'capitalize' }}>{p.category}</span>
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>₹{p.price?.toLocaleString()}</div>
                      {p.originalPrice > p.price && <div style={{ fontSize: '0.72rem', color: 'var(--text3)', textDecoration: 'line-through' }}>₹{p.originalPrice?.toLocaleString()}</div>}
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700,
                        background: p.stock > 10 ? '#e8fce8' : p.stock > 0 ? '#fff4e6' : '#ffecee',
                        color: p.stock > 10 ? '#2dc653' : p.stock > 0 ? '#f4a261' : 'var(--error)',
                      }}>{p.stock > 0 ? p.stock : 'Out'}</span>
                    </td>
                    <td style={{ padding: '0.8rem 1rem', fontSize: '0.85rem' }}>
                      <span style={{ color: '#f4a261' }}>★</span> {p.rating?.toFixed(1)} <span style={{ color: 'var(--text3)', fontSize: '0.72rem' }}>({p.numReviews})</span>
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <span style={{ fontSize: '0.82rem' }}>{p.isFeatured ? '⭐ Yes' : '—'}</span>
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        <Link to={`/products/${p._id}`} title="View" style={{
                          width: 30, height: 30, borderRadius: 8,
                          border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--text2)', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                        ><FiEye size={13} /></Link>
                        <Link to={`/admin/products/${p._id}/edit`} title="Edit" style={{
                          width: 30, height: 30, borderRadius: 8,
                          border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--primary)', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-light)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                        ><FiEdit2 size={13} /></Link>
                        <button onClick={() => handleDelete(p._id, p.name)} disabled={deleting === p._id} title="Delete" style={{
                          width: 30, height: 30, borderRadius: 8,
                          border: '1px solid var(--border)', background: 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--error)', cursor: 'pointer', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#ffecee'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                        ><FiTrash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {products.length === 0 && (
              <div className="flex-center" style={{ height: 160, color: 'var(--text2)', fontSize: '0.9rem' }}>
                No products found
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} style={{
                width: 30, height: 30, borderRadius: 6,
                border: `1px solid ${p === page ? 'var(--primary)' : 'var(--border)'}`,
                background: p === page ? 'var(--primary)' : 'transparent',
                color: p === page ? 'white' : 'var(--text)',
                fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
              }}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
