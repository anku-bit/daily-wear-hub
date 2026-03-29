import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI } from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import { FiFilter, FiX } from 'react-icons/fi';

const CATEGORIES = ['clothes', 'shoes', 'slippers'];
const GENDERS = ['men', 'women', 'kids', 'unisex'];
const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Most Popular', value: 'popular' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const category = searchParams.get('category') || '';
  const gender = searchParams.get('gender') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const page = Number(searchParams.get('page')) || 1;

  const setParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(key, val); else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  useEffect(() => {
    setLoading(true);
    productsAPI.getAll({ category, gender, search, sort, minPrice, maxPrice, page, limit: 12 })
      .then(res => {
        setProducts(res.data.products);
        setTotal(res.data.total);
        setPages(res.data.pages);
      })
      .finally(() => setLoading(false));
  }, [category, gender, search, sort, minPrice, maxPrice, page]);

  const FilterPanel = () => (
    <div style={{ width: 240, flexShrink: 0 }}>
      <div style={{ background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '1.5rem', position: 'sticky', top: 80 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Filters</h3>
          <button onClick={() => setSearchParams({})} style={{ fontSize: '0.75rem', color: 'var(--primary)', background: 'none', border: 'none', fontWeight: 600 }}>Clear All</button>
        </div>

        {/* Category */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text2)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Category</div>
          {CATEGORIES.map(c => (
            <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0', cursor: 'pointer', fontSize: '0.88rem' }}>
              <input type="radio" name="category" checked={category === c} onChange={() => setParam('category', c === category ? '' : c)}
                style={{ accentColor: 'var(--primary)' }} />
              <span style={{ textTransform: 'capitalize' }}>{c}</span>
            </label>
          ))}
        </div>

        {/* Gender */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text2)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Gender</div>
          {GENDERS.map(g => (
            <label key={g} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0', cursor: 'pointer', fontSize: '0.88rem' }}>
              <input type="radio" name="gender" checked={gender === g} onChange={() => setParam('gender', g === gender ? '' : g)}
                style={{ accentColor: 'var(--primary)' }} />
              <span style={{ textTransform: 'capitalize' }}>{g}</span>
            </label>
          ))}
        </div>

        {/* Price */}
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text2)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Price Range</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input className="form-input" placeholder="Min" type="number" value={minPrice}
              onChange={e => setParam('minPrice', e.target.value)} style={{ flex: 1, padding: '0.5rem 0.7rem', fontSize: '0.82rem' }} />
            <input className="form-input" placeholder="Max" type="number" value={maxPrice}
              onChange={e => setParam('maxPrice', e.target.value)} style={{ flex: 1, padding: '0.5rem 0.7rem', fontSize: '0.82rem' }} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg)', minHeight: '80vh', paddingBottom: '4rem' }}>
      <div className="container" style={{ paddingTop: '2rem' }}>
        {/* Breadcrumb + header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '0.3rem' }}>
            {category ? category.charAt(0).toUpperCase() + category.slice(1) : search ? `Search: "${search}"` : 'All Products'}
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.88rem' }}>{total} products found</p>
        </div>

        {/* Active filters */}
        {(category || gender || minPrice || maxPrice || search) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {[
              category && { label: `Category: ${category}`, clear: () => setParam('category', '') },
              gender && { label: `Gender: ${gender}`, clear: () => setParam('gender', '') },
              minPrice && { label: `Min: ₹${minPrice}`, clear: () => setParam('minPrice', '') },
              maxPrice && { label: `Max: ₹${maxPrice}`, clear: () => setParam('maxPrice', '') },
              search && { label: `Search: ${search}`, clear: () => setParam('search', '') },
            ].filter(Boolean).map((f, i) => (
              <span key={i} className="badge badge-primary" style={{ gap: '0.4rem' }}>
                {f.label}
                <button onClick={f.clear} style={{ background: 'none', border: 'none', color: 'inherit', padding: 0, display: 'flex' }}>
                  <FiX size={11} />
                </button>
              </span>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          {/* Filter sidebar */}
          <div className="hide-mobile"><FilterPanel /></div>

          {/* Products */}
          <div style={{ flex: 1 }}>
            {/* Sort bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <button onClick={() => setShowFilters(v => !v)} style={{ display: 'none' }} className="show-mobile btn-outline" style={{ fontSize: '0.82rem', padding: '0.4rem 1rem' }}>
                <FiFilter size={14} style={{ display: 'inline', marginRight: 4 }} /> Filters
              </button>
              <select value={sort} onChange={e => setParam('sort', e.target.value)} className="form-input"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', width: 'auto' }}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {loading ? (
              <div className="flex-center" style={{ height: 300 }}><div className="spinner" /></div>
            ) : products.length === 0 ? (
              <div className="flex-center" style={{ height: 300, flexDirection: 'column', gap: '1rem', color: 'var(--text2)' }}>
                <span style={{ fontSize: '3rem' }}>🔍</span>
                <div style={{ fontWeight: 700 }}>No products found</div>
                <p style={{ fontSize: '0.85rem' }}>Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="grid-4">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => { const n = new URLSearchParams(searchParams); n.set('page', p); setSearchParams(n); }}
                        style={{
                          width: 36, height: 36, borderRadius: 8,
                          border: `1.5px solid ${p === page ? 'var(--primary)' : 'var(--border)'}`,
                          background: p === page ? 'var(--primary)' : 'white',
                          color: p === page ? 'white' : 'var(--text)',
                          fontWeight: 700, fontSize: '0.85rem',
                          transition: 'all 0.15s',
                        }}>
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
