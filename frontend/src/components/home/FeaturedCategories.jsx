import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../services/categoryService.js';

/* Curated fallback images per category slug/name — used when Cloudinary URL is broken */
const FALLBACK_IMAGES = {
  skincare:  'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=900&auto=format&fit=crop',
  bodycare:  'https://images.unsplash.com/photo-1570554886117-e4747c227d57?q=80&w=900&auto=format&fit=crop',
  haircare:  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=900&auto=format&fit=crop',
  serums:    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=900&auto=format&fit=crop',
  oils:      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=900&auto=format&fit=crop',
  masks:     'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=900&auto=format&fit=crop',
  cleansers: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=900&auto=format&fit=crop',
  default:   'https://images.unsplash.com/photo-1598452963314-b09f397a5c48?q=80&w=900&auto=format&fit=crop',
};

function getCategoryImage(cat) {
  // Get the stored URL (handle both { url } object and plain string)
  const storedUrl = typeof cat.image === 'string'
    ? cat.image
    : cat.image?.url;

  // If stored URL is missing, empty, or a placeholder demo URL — use fallback
  if (!storedUrl || storedUrl.includes('res.cloudinary.com/demo') || storedUrl.trim() === '') {
    const key = cat.slug?.toLowerCase() || cat.name?.toLowerCase() || '';
    return (
      FALLBACK_IMAGES[key] ||
      Object.entries(FALLBACK_IMAGES).find(([k]) => key.includes(k))?.[1] ||
      FALLBACK_IMAGES.default
    );
  }

  return storedUrl;
}

function CategoryCard({ cat }) {
  const [imgSrc, setImgSrc] = useState(() => getCategoryImage(cat));

  const handleError = () => {
    // If the real URL breaks, swap to fallback
    const key = cat.slug?.toLowerCase() || cat.name?.toLowerCase() || '';
    const fallback =
      FALLBACK_IMAGES[key] ||
      Object.entries(FALLBACK_IMAGES).find(([k]) => key.includes(k))?.[1] ||
      FALLBACK_IMAGES.default;

    if (imgSrc !== fallback) setImgSrc(fallback);
  };

  return (
    <Link to={`/shop/${cat.slug}`} className="category-card group block">
      <div className="relative overflow-hidden rounded-3xl" style={{ aspectRatio: '3/4' }}>

        <img
          src={imgSrc}
          alt={cat.image?.alt || cat.name}
          loading="lazy"
          className="category-img h-full w-full object-cover"
          onError={handleError}
        />

        {/* Gradient overlay */}
        <div
          className="category-overlay absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(75,47,31,0.85) 0%, rgba(75,47,31,0.15) 55%, transparent 100%)',
          }}
        />

        {/* Text content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p
            className="mb-1 text-[10px] font-semibold uppercase tracking-widest"
            style={{ fontFamily: '"Poppins", sans-serif', color: '#C59B45' }}
          >
            {cat.description || 'Collection'}
          </p>
          <h3
            className="mb-3 text-xl font-medium"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#F8F2E8' }}
          >
            {cat.name}
          </h3>
          <span
            className="category-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider"
            style={{ backgroundColor: 'rgba(197,155,69,0.9)', color: '#fff' }}
          >
            Shop Now
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    categoryService.getFeaturedCategories()
      .then(r => setCategories(r.data?.categories || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="collections" className="py-10 md:py-28" style={{ backgroundColor: '#FCFAF6' }}>
      <div className="mx-auto max-w-content px-4 lg:px-8">

        {/* Header */}
        <div className="section-header mb-14 text-center">
          <span
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest"
            style={{
              backgroundColor: 'rgba(197,155,69,0.1)',
              color: '#C59B45',
              border: '1px solid rgba(197,155,69,0.25)',
            }}
          >
            Featured Collections
          </span>
          <h2
            className="mb-4 text-3xl font-medium md:text-4xl lg:text-5xl"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
          >
            Curated rituals for every moment
          </h2>
          <p
            className="mx-auto max-w-xl text-[15px] leading-relaxed"
            style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
          >
            Four collections, each built around a single Ayurvedic principle.
          </p>
        </div>

        {/* Grid — centered regardless of item count */}
        {loading ? (
          <div className="flex flex-wrap justify-center gap-5">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="w-full animate-pulse rounded-3xl sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]"
                style={{ aspectRatio: '3/4', backgroundColor: 'rgba(197,155,69,0.07)' }}
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center">
            <p style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
              No featured collections yet — mark categories as featured in the admin panel.
            </p>
          </div>
        ) : (
          /* flex-wrap + justify-center: if 3 cards, they sit centred;
             if 4 cards, they fill the row. Each card is capped at 280px
             so they never stretch too wide when there are fewer items. */
          <div className="flex flex-wrap justify-center gap-5">
            {categories.map(cat => (
              <div
                key={cat._id}
                className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]"
                style={{ minWidth: '200px', maxWidth: '280px', flex: '1 1 220px' }}
              >
                <CategoryCard cat={cat} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
