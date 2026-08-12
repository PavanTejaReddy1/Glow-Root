import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, X, Upload, Plus, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../../services/productService.js';
import { categoryService } from '../../services/categoryService.js';
import { useToast } from '../../context/ToastContext.jsx';

/* ── Image Manager ─────────────────────────────────────────────── */
function ImageManager({ images, setImages }) {
  const handleFileAdd = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isNew: true,
      isPrimary: false,
    }));
    setImages(prev => {
      const merged = [...prev, ...newImgs];
      // If no primary set yet, make first one primary
      if (!merged.some(i => i.isPrimary) && merged.length > 0) {
        merged[0].isPrimary = true;
      }
      return merged;
    });
    // reset input so same file can be re-added
    e.target.value = '';
  };

  const remove = (idx) => {
    setImages(prev => {
      const next = prev.filter((_, i) => i !== idx);
      // If removed was primary, assign primary to first remaining
      if (prev[idx].isPrimary && next.length > 0) next[0].isPrimary = true;
      return next;
    });
  };

  const setPrimary = (idx) => {
    setImages(prev => prev.map((img, i) => ({ ...img, isPrimary: i === idx })));
  };

  return (
    <div>
      {/* Drop zone */}
      <label
        htmlFor="img-upload"
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 p-8 text-center transition-colors hover:border-amber-400 hover:bg-amber-50"
      >
        <Upload className="h-10 w-10 text-slate-300" />
        <p className="text-[13px] font-medium text-slate-500">Click to add images</p>
        <p className="text-[11px] text-slate-400">PNG, JPG, WebP · max 10 MB each</p>
        <input
          id="img-upload"
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={handleFileAdd}
        />
      </label>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-xl"
              style={{
                border: img.isPrimary
                  ? '2.5px solid #C59B45'
                  : '2px solid transparent',
                boxShadow: img.isPrimary
                  ? '0 0 0 1px rgba(197,155,69,0.35)'
                  : '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <img
                src={img.preview || img.url}
                alt={`img-${idx}`}
                className="h-24 w-full object-cover"
              />

              {/* Primary badge */}
              {img.isPrimary && (
                <span className="absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                  style={{ backgroundColor: '#C59B45', color: '#fff' }}>
                  <Star className="h-2.5 w-2.5" fill="currentColor" /> Primary
                </span>
              )}

              {/* New badge */}
              {img.isNew && (
                <span className="absolute bottom-1.5 left-1.5 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                  style={{ backgroundColor: 'rgba(91,127,58,0.9)', color: '#fff' }}>
                  New
                </span>
              )}

              {/* Hover actions */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                {!img.isPrimary && (
                  <button
                    type="button"
                    onClick={() => setPrimary(idx)}
                    title="Set as primary"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 transition-transform hover:scale-110"
                  >
                    <Star className="h-3.5 w-3.5 text-white" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  title="Remove image"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 transition-transform hover:scale-110"
                >
                  <X className="h-3.5 w-3.5 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="mt-2 text-[11px] text-slate-400">
          Hover an image to remove or set as primary. Gold border = primary (shown first in store).
        </p>
      )}
    </div>
  );
}

/* ── Main EditProduct ─────────────────────────────────────────── */
export default function EditProduct() {
  const navigate  = useNavigate();
  const { id }    = useParams();
  const { success, error } = useToast();

  const [images,           setImages]           = useState([]);
  const [tags,             setTags]             = useState([]);
  const [tagInput,         setTagInput]         = useState('');
  const [loading,          setLoading]          = useState(false);
  const [fetchLoading,     setFetchLoading]     = useState(true);
  const [categories,       setCategories]       = useState([]);
  const [categoriesLoading,setCategoriesLoading]= useState(true);

  const [formData, setFormData] = useState({
    name: '', slug: '', category: '', brand: 'GlowRoot',
    description: '', shortDescription: '',
    ingredients: '', benefits: '', howToUse: '',
    sellingPrice: '', discount: '', stock: '',
    featured: false, bestSeller: false, newArrival: false, published: true,
    seoTitle: '', seoDescription: '',
  });

  useEffect(() => {
    fetchProduct();
    categoryService.getCategories()
      .then(r => setCategories(r.data?.categories || []))
      .catch(() => {})
      .finally(() => setCategoriesLoading(false));
  }, [id]);

  const fetchProduct = async () => {
    setFetchLoading(true);
    try {
      const res     = await productService.getProductById(id);
      const product = res.data?.product;
      if (!product) throw new Error('Not found');

      setFormData({
        name:            product.name             || '',
        slug:            product.slug             || '',
        category:        product.category?._id    || product.category || '',
        brand:           product.brand            || 'GlowRoot',
        description:     product.description      || '',
        shortDescription:product.shortDescription || '',
        ingredients: Array.isArray(product.ingredients)
          ? product.ingredients.join('\n') : (product.ingredients || ''),
        benefits: Array.isArray(product.benefits)
          ? product.benefits.join('\n')    : (product.benefits    || ''),
        howToUse:        product.howToUse         || '',
        sellingPrice:    product.price            || '',
        discount:        product.discount         || '',
        stock:           product.stock            || '',
        featured:        product.isFeatured       || false,
        bestSeller:      product.isBestSeller     || false,
        newArrival:      product.isNewArrival     || false,
        published:       product.status === 'active',
        seoTitle:        product.seo?.metaTitle        || '',
        seoDescription:  product.seo?.metaDescription  || '',
      });

      setTags(product.tags || []);

      // Load existing images — keep _id + isPrimary so backend knows what to retain
      setImages((product.images || []).map(img => ({
        _id:       img._id,
        url:       img.url,
        preview:   img.url,       // preview = url for existing images
        publicId:  img.publicId,
        isPrimary: img.isPrimary || false,
        isNew:     false,
      })));
    } catch {
      error('Failed to fetch product');
      navigate('/admin/products');
    } finally {
      setFetchLoading(false);
    }
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) { setTags(p => [...p, t]); setTagInput(''); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim())     return error('Product name is required');
    if (!formData.category)        return error('Please select a category');
    if (!formData.sellingPrice)    return error('Selling price is required');

    setLoading(true);
    try {
      const fd = new FormData();

      // Scalar fields
      fd.append('name',           formData.name);
      fd.append('category',       formData.category);
      fd.append('brand',          formData.brand         || '');
      fd.append('description',    formData.description);
      fd.append('shortDescription',formData.shortDescription || '');
      fd.append('howToUse',       formData.howToUse      || '');
      fd.append('price',          formData.sellingPrice);
      fd.append('discount',       formData.discount      || '0');
      fd.append('stock',          formData.stock);
      fd.append('status',         formData.published ? 'active' : 'draft');
      fd.append('isFeatured',     String(formData.featured));
      fd.append('isBestSeller',   String(formData.bestSeller));
      fd.append('isNewArrival',   String(formData.newArrival));
      fd.append('seoTitle',       formData.seoTitle       || '');
      fd.append('seoDescription', formData.seoDescription || '');
      fd.append('ingredients',    formData.ingredients    || '');
      fd.append('benefits',       formData.benefits       || '');
      fd.append('tags',           tags.join('\n'));

      // Tell backend which existing images to keep (and their isPrimary flag)
      // Format: "id1:true,id2:false,id3:false"  (id:isPrimary)
      const keepStr = images
        .filter(img => !img.isNew && img._id)
        .map(img => `${img._id}:${img.isPrimary}`)
        .join(',');
      fd.append('keepImageIds', keepStr);

      // Primary index among new images (if any)
      const newImgs = images.filter(img => img.isNew);
      newImgs.forEach((img, idx) => {
        fd.append('images', img.file);
        if (img.isPrimary) fd.append('primaryNewIndex', String(idx));
      });

      await productService.updateProduct(id, fd);
      success('Product updated successfully!');
      navigate('/admin/products');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const inp = 'w-full rounded-lg border border-slate-200 px-4 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-amber-400';

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-amber-500 border-gray-200" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/products')}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Edit Product</h2>
            <p className="text-[13px] text-slate-500">Update product information &amp; images</p>
          </div>
        </div>
        <button onClick={handleSubmit} disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-50">
          {loading
            ? <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Saving…</>
            : <><Save className="h-4 w-4" /> Save Changes</>}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        {/* ── Left (2/3) ──────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Basic Info */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-[15px] font-semibold text-slate-800">Basic Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-slate-500">Product Name *</label>
                <input type="text" required value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className={inp} placeholder="e.g. Saffron Radiance Serum" />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-slate-500">Category *</label>
                <select required value={formData.category} disabled={categoriesLoading}
                  onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                  className={inp}>
                  <option value="">Select category…</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-slate-500">Brand</label>
                <input type="text" value={formData.brand}
                  onChange={e => setFormData(p => ({ ...p, brand: e.target.value }))}
                  className={inp} />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-slate-500">Short Description</label>
                <input type="text" value={formData.shortDescription}
                  onChange={e => setFormData(p => ({ ...p, shortDescription: e.target.value }))}
                  className={inp} placeholder="One-line summary shown in listings" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-slate-500">Full Description</label>
                <textarea rows={5} value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  className={inp} />
              </div>
            </div>
          </motion.div>

          {/* Images */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.08 }}
            className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-[15px] font-semibold text-slate-800">
              Product Images
              <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-normal text-amber-700">
                {images.length} image{images.length !== 1 ? 's' : ''}
              </span>
            </h3>
            <ImageManager images={images} setImages={setImages} />
          </motion.div>

          {/* Product Details */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.12 }}
            className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-[15px] font-semibold text-slate-800">Product Details</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                  Ingredients <span className="font-normal normal-case text-slate-400">(one per line)</span>
                </label>
                <textarea rows={3} value={formData.ingredients}
                  onChange={e => setFormData(p => ({ ...p, ingredients: e.target.value }))}
                  className={inp} placeholder={"Neem extract\nTulsi leaf\nRosehip oil"} />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                  Benefits <span className="font-normal normal-case text-slate-400">(one per line)</span>
                </label>
                <textarea rows={3} value={formData.benefits}
                  onChange={e => setFormData(p => ({ ...p, benefits: e.target.value }))}
                  className={inp} placeholder={"Reduces inflammation\nBrightens skin\nDeep hydration"} />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-slate-500">How To Use</label>
                <textarea rows={3} value={formData.howToUse}
                  onChange={e => setFormData(p => ({ ...p, howToUse: e.target.value }))}
                  className={inp} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Right (1/3) ─────────────────────── */}
        <div className="space-y-6">

          {/* Pricing */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.06 }}
            className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-[15px] font-semibold text-slate-800">Pricing</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-slate-500">Selling Price (₹) *</label>
                <input type="number" min="0" required value={formData.sellingPrice}
                  onChange={e => setFormData(p => ({ ...p, sellingPrice: e.target.value }))}
                  className={inp} />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-slate-500">Discount (%)</label>
                <input type="number" min="0" max="100" value={formData.discount}
                  onChange={e => setFormData(p => ({ ...p, discount: e.target.value }))}
                  className={inp} />
                {formData.sellingPrice > 0 && formData.discount > 0 && (
                  <p className="mt-1 text-[11px] text-slate-400">
                    Shown as: <span className="line-through text-slate-500">
                      ₹{Math.round(Number(formData.sellingPrice) / (1 - Number(formData.discount) / 100)).toLocaleString('en-IN')}
                    </span>
                    {' → '}₹{Number(formData.sellingPrice).toLocaleString('en-IN')}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Inventory */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.1 }}
            className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-[15px] font-semibold text-slate-800">Inventory</h3>
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-slate-500">Stock Quantity *</label>
              <input type="number" min="0" required value={formData.stock}
                onChange={e => setFormData(p => ({ ...p, stock: e.target.value }))}
                className={inp} />
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.14 }}
            className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-[15px] font-semibold text-slate-800">Tags</h3>
            <div className="flex gap-2">
              <input type="text" value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                placeholder="Add tag…"
                className={`${inp} flex-1`} />
              <button type="button" onClick={addTag}
                className="rounded-lg bg-amber-500 px-3 text-white hover:bg-amber-600">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map(t => (
                  <span key={t} className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[12px] text-slate-700">
                    {t}
                    <button type="button" onClick={() => setTags(p => p.filter(x => x !== t))}>
                      <X className="h-3 w-3 text-slate-400 hover:text-red-500" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Status & Flags */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.18 }}
            className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-[15px] font-semibold text-slate-800">Status &amp; Flags</h3>
            <div className="space-y-3">
              {[
                { key: 'published',   label: 'Published (visible in store)' },
                { key: 'featured',    label: 'Featured Product' },
                { key: 'bestSeller',  label: 'Best Seller' },
                { key: 'newArrival',  label: 'New Arrival' },
              ].map(({ key, label }) => (
                <label key={key} className="flex cursor-pointer items-center gap-3">
                  <input type="checkbox" checked={formData[key]}
                    onChange={e => setFormData(p => ({ ...p, [key]: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 accent-amber-500" />
                  <span className="text-[13px] text-slate-700">{label}</span>
                </label>
              ))}
            </div>
          </motion.div>

          {/* SEO */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.22 }}
            className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-[15px] font-semibold text-slate-800">SEO</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-slate-500">Meta Title</label>
                <input type="text" value={formData.seoTitle}
                  onChange={e => setFormData(p => ({ ...p, seoTitle: e.target.value }))}
                  className={inp} />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-slate-500">Meta Description</label>
                <textarea rows={3} value={formData.seoDescription}
                  onChange={e => setFormData(p => ({ ...p, seoDescription: e.target.value }))}
                  className={inp} />
              </div>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  );
}
