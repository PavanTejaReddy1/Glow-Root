import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard.jsx';
import { getProductBySlug, products } from '../data/products.js';

export default function ProductDetail() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) document.title = `${product.name} — GlowRoot`;
  }, [product]);

  if (!product) return <Navigate to="/shop" replace />;

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="py-16 md:py-24" style={{ backgroundColor: '#F8F2E8' }}>
      <div className="mx-auto max-w-content px-4">
        {/* Breadcrumb */}
        <p
          className="mb-8 text-xs tracking-wider uppercase"
          style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
        >
          <Link to="/shop" className="transition-colors hover:opacity-80">Shop</Link>
          {' / '}
          <span>{product.category}</span>
          {' / '}
          <span>{product.name}</span>
        </p>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Product Image */}
          <div className="relative">
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-sm">
              <img src={product.hero} alt={product.name} className="h-full w-full object-cover" />
            </div>
          </div>

          {/* Product Details */}
          <div>
            <span
              className="mb-3 inline-block text-sm font-medium tracking-wider uppercase"
              style={{ fontFamily: '"Poppins", sans-serif', color: '#C59B45' }}
            >
              {product.category}
            </span>
            <h1
              className="mb-4 text-3xl font-medium md:text-4xl lg:text-5xl"
              style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
            >
              {product.name}
            </h1>
            
            <div className="mb-6 flex items-center gap-2">
              <div className="flex gap-0.5" style={{ color: '#C59B45' }}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8L5.8 21l1.6-7L2 9.2l7.1-.6L12 2Z" />
                  </svg>
                ))}
              </div>
              <span
                className="text-sm"
                style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
              >
                {product.rating} · {product.reviews} reviews · {product.ritualTime}
              </span>
            </div>

            <div className="mb-8 border-b" style={{ borderColor: 'rgba(197,155,69,0.25)' }} />

            <p
              className="mb-8 text-base leading-relaxed"
              style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
            >
              {product.description}
            </p>

            <p
              className="mb-8 text-3xl font-medium md:text-4xl"
              style={{ fontFamily: '"Cormorant Garamond", serif', color: '#C59B45' }}
            >
              ₹{product.price.toLocaleString('en-IN')}
            </p>

            <div className="mb-8 flex items-center gap-4">
              <div className="flex items-center border" style={{ borderColor: 'rgba(197,155,69,0.25)' }}>
                <button
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="rounded-full px-4 py-3 transition-colors hover:opacity-80"
                  style={{ color: '#6E4B2A' }}
                >
                  −
                </button>
                <span
                  className="w-10 text-center font-medium"
                  style={{ fontFamily: '"Poppins", sans-serif', color: '#4B2F1F' }}
                >
                  {qty}
                </span>
                <button
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => q + 1)}
                  className="rounded-full px-4 py-3 transition-colors hover:opacity-80"
                  style={{ color: '#6E4B2A' }}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => setAdded(true)}
                className="flex-1 rounded-full px-8 py-3 text-sm font-medium tracking-wider uppercase transition-colors hover:opacity-90"
                style={{
                  fontFamily: '"Poppins", sans-serif',
                  backgroundColor: '#6E4B2A',
                  color: '#F8F2E8'
                }}
              >
                {added ? 'Added to Bag ✓' : 'Add to Bag'}
              </button>
            </div>

            <div className="space-y-4 rounded-lg p-6 shadow-sm" style={{ backgroundColor: '#FCFAF6' }}>
              <Detail label="Free shipping" value="On orders above ₹1,999" />
              <Detail label="Formulation" value="Cold-processed, small batch" />
              <Detail label="Returns" value="14-day ritual guarantee" />
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-24">
            <h2
              className="mb-8 text-3xl font-medium md:text-4xl"
              style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
            >
              You may also love
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-3 last:border-0" style={{ borderColor: 'rgba(197,155,69,0.25)' }}>
      <span
        className="text-sm"
        style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
      >
        {label}
      </span>
      <span
        className="text-sm font-medium"
        style={{ fontFamily: '"Poppins", sans-serif', color: '#4B2F1F' }}
      >
        {value}
      </span>
    </div>
  );
}
