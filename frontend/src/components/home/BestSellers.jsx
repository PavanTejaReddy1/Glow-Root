import { Link } from 'react-router-dom';
import ProductCard from '../product/ProductCard.jsx';
import { products } from '../../data/products.js';

export default function BestSellers() {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: '#F8F2E8' }}>
      <div className="mx-auto max-w-content px-4 ">
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end lg:pl-20 lg:pr-20">
          <div>
            <span
              className="mb-3 inline-block text-sm font-medium tracking-wider uppercase"
              style={{ color: '#C59B45' }}
            >
              Best Sellers
            </span>
            <h2
              className="mb-4 text-3xl font-medium md:text-4xl"
              style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
            >
              Most loved by our community
            </h2>
            <p
              className="max-w-xl text-base"
              style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
            >
              The formulations our customers reorder most — proven across skin types and seasons.
            </p>
          </div>
          <Link
            to="/shop"
            className="rounded-full px-6 py-2.5 text-sm font-medium tracking-wider uppercase transition-colors hover:opacity-80"
            style={{ fontFamily: '"Poppins", sans-serif', border: '1px solid #6E4B2A', color: '#6E4B2A' }}
          >
            View All Products
          </Link>
        </div>

        {/* Products Grid */}
        <div className="px-4 lg:pl-20 lg:pr-20">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
