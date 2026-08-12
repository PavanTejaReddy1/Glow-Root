import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../product/ProductCard.jsx';
import { productService } from '../../services/productService.js';

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    // Fetch real products sorted by soldCount — shows whatever the admin has added
    // Falls back to createdAt if no products have been sold yet
    productService.getProducts({ sort: '-soldCount,-createdAt', status: 'active', limit: 8 })
      .then(r => setProducts(r.data?.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 md:py-28" style={{ backgroundColor: '#F8F2E8' }}>
      <div className="mx-auto max-w-content px-4 lg:px-8">

        <div className="section-header mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest"
              style={{ backgroundColor: 'rgba(197,155,69,0.1)', color: '#C59B45', border: '1px solid rgba(197,155,69,0.25)' }}>
              Our Products
            </span>
            <h2 className="mb-3 text-3xl font-medium md:text-4xl lg:text-5xl"
              style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}>
              Discover our rituals
            </h2>
            <p className="max-w-xl text-[15px] leading-relaxed"
              style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
              Ayurvedic formulations crafted for every skin type and daily routine.
            </p>
          </div>

          <Link to="/shop"
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-full px-7 py-3 text-[12px] font-semibold uppercase tracking-widest transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            style={{ border: '1.5px solid rgba(110,75,42,0.35)', color: '#6E4B2A', fontFamily: '"Poppins", sans-serif' }}>
            View All
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="rounded-3xl" style={{ aspectRatio: '4/5', backgroundColor: 'rgba(197,155,69,0.07)' }}>
                <div className="h-full w-full animate-pulse rounded-3xl" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <p className="mb-4 text-[15px]" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
              No products yet — add your first product from the admin panel.
            </p>
            <Link to="/shop"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-[12px] font-semibold uppercase tracking-widest transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              style={{ backgroundColor: '#4B2F1F', color: '#F8F2E8', fontFamily: '"Poppins", sans-serif' }}>
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.slice(0, 8).map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
