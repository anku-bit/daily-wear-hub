import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsAPI } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import { FiPlus, FiX } from 'react-icons/fi';

const INITIAL = {
  name: '', description: '', price: '', originalPrice: '', discount: 0,
  category: 'clothes', subcategory: '', gender: 'unisex', brand: '',
  stock: '', images: [''], sizes: [], colors: [], tags: [],
  isFeatured: false, isActive: true,
};

const SIZES = {
  clothes: ['XS','S','M','L','XL','XXL'],
  shoes: ['5','6','7','8','9','10','11'],
  slippers: ['4-5','6-7','8-9','10-11'],
};
const COLORS_LIST = ['White','Black','Grey','Red','Blue','Green','Yellow','Pink','Brown','Navy','Khaki','Olive','Beige','Orange','Purple'];

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      productsAPI.getOne(id).then(r => {
        const p = r.data.product;
        setForm({
          name: p.name, description: p.description, price: p.price,
          originalPrice: p.originalPrice, discount: p.discount,
          category: p.category, subcategory: p.subcategory || '',
          gender: p.gender, brand: p.brand || '',
          stock: p.stock, images: p.images?.length ? p.images : [''],
          sizes: p.sizes || [], colors: p.colors || [],
          tags: p.tags || [], isFeatured: p.isFeatured, isActive: p.isActive,
        });
      }).finally(() => setFetching(false));
    }
  }, [id]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const toggleArr = (key, val) => {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val],
    }));
  };

  const addImage = () => set('images', [...form.images, '']);
  const updateImage = (i, val) => { const imgs = [...form.images]; imgs[i] = val; set('images', imgs); };
  const removeImage = (i) => set('images', form.images.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.stock)
      return toast.error('Please fill all required fields');
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice) || Number(form.price),
        stock: Number(form.stock),
        images: form.images.filter(Boolean),
      };
      if (isEdit) await productsAPI.update(id, payload);
      else await productsAPI.create(payload);
      toast.success(`Product ${isEdit ? 'updated' : 'created'} successfully!`);
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally { setLoading(false); }
  };

  if (fetching) return (
    <AdminLayout title={isEdit ? 'Edit Product' : 'Add Product'}>
      <div className="flex-center" style={{ height: 300 }}><div className="spinner" /></div>
    </AdminLayout>
  );

  const labelStyle = { fontSize: '0.82rem', fontWeight: 700, color: 'var(--text2)', display: 'block', marginBottom: '0.35rem' };
  const Card = ({ title, children }) => (
    <div style={{ background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '1.5rem', marginBottom: '1.2rem' }}>
      {title && <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border)' }}>{title}</h3>}
      {children}
    </div>
  );

  return (
    <AdminLayout title={isEdit ? 'Edit Product' : 'Add New Product'}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.2rem', alignItems: 'start' }}>
          {/* Left */}
          <div>
            <Card title="Basic Information">
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Product Name *</label>
                <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Classic White Cotton Shirt" required />
              </div>
              <div className="form-group">
                <label style={labelStyle}>Description *</label>
                <textarea className="form-input" value={form.description} onChange={e => set('description', e.target.value)} rows={4} placeholder="Describe the product..." style={{ resize: 'vertical', width: '100%' }} required />
              </div>
            </Card>

            <Card title="Pricing & Stock">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                {[['price','Selling Price *','e.g. 799'],['originalPrice','Original (MRP)','e.g. 1299'],['stock','Stock Quantity *','e.g. 100']].map(([k,l,p]) => (
                  <div key={k} className="form-group">
                    <label style={labelStyle}>{l}</label>
                    <input className="form-input" type="number" value={form[k]} onChange={e => set(k, e.target.value)} placeholder={p} required={k !== 'originalPrice'} min="0" />
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Images (URLs)">
              {form.images.map((img, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem', alignItems: 'center' }}>
                  <input className="form-input" value={img} onChange={e => updateImage(i, e.target.value)}
                    placeholder="https://images.unsplash.com/..." style={{ flex: 1 }} />
                  {img && <img src={img} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)', flexShrink: 0 }} onError={e => e.target.style.display='none'} />}
                  {form.images.length > 1 && (
                    <button type="button" onClick={() => removeImage(i)} style={{ background: 'none', border: 'none', color: 'var(--error)', padding: '0.2rem', display: 'flex' }}>
                      <FiX size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addImage} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--primary)', background: 'none', border: '1.5px dashed var(--primary)', borderRadius: 8, padding: '0.5rem 1rem', width: '100%', justifyContent: 'center', cursor: 'pointer' }}>
                <FiPlus size={14} /> Add Image URL
              </button>
            </Card>

            <Card title="Sizes">
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {(SIZES[form.category] || SIZES.clothes).map(s => (
                  <button type="button" key={s} onClick={() => toggleArr('sizes', s)} style={{
                    padding: '0.35rem 0.8rem', borderRadius: 8, border: `1.5px solid ${form.sizes.includes(s) ? 'var(--primary)' : 'var(--border)'}`,
                    background: form.sizes.includes(s) ? 'var(--primary-light)' : 'white',
                    color: form.sizes.includes(s) ? 'var(--primary)' : 'var(--text)', fontWeight: 600, fontSize: '0.82rem',
                  }}>{s}</button>
                ))}
              </div>
            </Card>

            <Card title="Colors">
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {COLORS_LIST.map(c => (
                  <button type="button" key={c} onClick={() => toggleArr('colors', c)} style={{
                    padding: '0.3rem 0.7rem', borderRadius: 100, border: `1.5px solid ${form.colors.includes(c) ? 'var(--primary)' : 'var(--border)'}`,
                    background: form.colors.includes(c) ? 'var(--primary-light)' : 'white',
                    color: form.colors.includes(c) ? 'var(--primary)' : 'var(--text)', fontSize: '0.78rem', fontWeight: 600,
                  }}>{c}</button>
                ))}
              </div>
            </Card>
          </div>

          {/* Right sidebar */}
          <div>
            <Card title="Classification">
              {[['category','Category',['clothes','shoes','slippers']],['gender','Gender',['men','women','kids','unisex']]].map(([k,l,opts]) => (
                <div key={k} className="form-group" style={{ marginBottom: '0.9rem' }}>
                  <label style={labelStyle}>{l}</label>
                  <select className="form-input" value={form[k]} onChange={e => set(k, e.target.value)}>
                    {opts.map(o => <option key={o} value={o} style={{ textTransform: 'capitalize' }}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                  </select>
                </div>
              ))}
              <div className="form-group" style={{ marginBottom: '0.9rem' }}>
                <label style={labelStyle}>Brand</label>
                <input className="form-input" value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="e.g. DailyBasics" />
              </div>
              <div className="form-group">
                <label style={labelStyle}>Subcategory</label>
                <input className="form-input" value={form.subcategory} onChange={e => set('subcategory', e.target.value)} placeholder="e.g. shirts, sneakers" />
              </div>
            </Card>

            <Card title="Settings">
              {[['isFeatured','⭐ Featured Product'],['isActive','✓ Active (Visible)']].map(([k,l]) => (
                <label key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem', cursor: 'pointer', fontSize: '0.88rem' }}>
                  <input type="checkbox" checked={form[k]} onChange={e => set(k, e.target.checked)} style={{ accentColor: 'var(--primary)', width: 16, height: 16 }} />
                  {l}
                </label>
              ))}
            </Card>

            <div style={{ display: 'flex', gap: '0.8rem', flexDirection: 'column' }}>
              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
                {loading ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Product')}
              </button>
              <button type="button" onClick={() => navigate('/admin/products')} className="btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
      <style>{`@media(max-width:900px){form>div{grid-template-columns:1fr!important;}}`}</style>
    </AdminLayout>
  );
}
