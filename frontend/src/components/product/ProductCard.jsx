import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const { slug, name, category, price, hero, rating, reviews } = product;

  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-lg shadow-sm transition-shadow hover:shadow-md">
        {/* Image */}
        <div className="relative aspect-square bg-gray-100">
          <Link to={`/product/${slug}`}>
            <img
              src={hero}
              alt={name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Wishlist Button */}
          <button
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={() => setWishlisted((v) => !v)}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm transition-all hover:scale-110"
            style={{ color: wishlisted ? '#C59B45' : '#6E4B2A' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-3" style={{ backgroundColor: '#F8F2E8' }}>
          <p
            className="mb-1 text-[10px] font-medium tracking-wider uppercase"
            style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
          >
            {category}
          </p>
          <Link to={`/product/${slug}`}>
            <h3
              className="mb-1.5 text-sm font-medium leading-tight transition-colors hover:opacity-80"
              style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
            >
              {name}
            </h3>
          </Link>
          
          <div className="flex items-center justify-between">
            <p
              className="text-base font-medium"
              style={{ fontFamily: '"Cormorant Garamond", serif', color: '#C59B45' }}
            >
              ₹{price.toLocaleString('en-IN')}
            </p>
            
            {rating && (
              <div className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#C59B45">
                  <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8L5.8 21l1.6-7L2 9.2l7.1-.6L12 2Z" />
                </svg>
                <span
                  className="text-[10px]"
                  style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
                >
                  {rating}
                </span>
              </div>
            )}
          </div>

          <button
            className="mt-3 w-full rounded py-2 text-[10px] font-medium tracking-wider uppercase transition-colors hover:opacity-90"
            style={{ fontFamily: '"Poppins", sans-serif', backgroundColor: '#6E4B2A', color: '#F8F2E8' }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
