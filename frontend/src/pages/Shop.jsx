import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard.jsx';
import { products } from '../data/products.js';

const CATEGORIES = ['All', 'Serums', 'Oils', 'Masks', 'Mists', 'Cleansers', 'Eye Care'];

export default function Shop() {
  const { category } = useParams();
  const [active, setActive] = useState(category || 'All');

  useEffect(() => {
    document.title = 'Shop All Rituals — GlowRoot';
    if (category) setActive(category);
  }, [category]);

  const filtered = active === 'All' ? products : products.filter((p) => p.category === active);

  return (
    <div className="py-16 md:py-24" style={{ backgroundColor: '#F8F2E8' }}>
      <div className="mx-auto max-w-content px-4">
        {/* Header */}
        <div className="mb-12">
          <span
            className="mb-3 inline-block text-sm font-medium tracking-wider uppercase"
            style={{ color: '#C59B45' }}
          >
            Shop All
          </span>
          <h1
            className="mb-4 text-3xl font-medium md:text-4xl lg:text-5xl"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
          >
            Every ritual, in one place
          </h1>
          <p
            className="text-base"
            style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
          >
            {filtered.length} formulations, small-batch and cold-processed.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-12 flex flex-wrap gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className="px-6 py-2.5 text-xs font-medium tracking-wider uppercase transition-colors"
              style={{
                fontFamily: '"Poppins", sans-serif',
                backgroundColor: active === cat ? '#6E4B2A' : 'transparent',
                color: active === cat ? '#F8F2E8' : '#6E4B2A',
                border: active === cat ? 'none' : '1px solid #6E4B2A'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-16 text-center">
            <p
              className="text-base"
              style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
            >
              No formulations in this category yet.{' '}
              <Link
                to="/shop"
                className="underline"
                style={{ color: '#C59B45' }}
              >
                View all rituals
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
