import { Link } from 'react-router-dom';
import { categories } from '../../data/products.js';

export default function FeaturedCategories() {
  return (
    <section id="collections" className="py-16 md:py-24" style={{ backgroundColor: '#FCFAF6' }}>
      <div className="mx-auto max-w-content px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <span
            className="mb-3 inline-block text-sm font-medium tracking-wider uppercase"
            style={{ color: '#C59B45' }}
          >
            Featured Collections
          </span>
          <h2
            className="mb-4 text-3xl font-medium md:text-4xl"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
          >
            Curated rituals for every moment
          </h2>
          <p
            className="mx-auto max-w-2xl text-base"
            style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
          >
            Four collections, each built around a single Ayurvedic principle — from morning awakening to night repair.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link key={cat.id} to={`/shop/${cat.name}`} className="group">
              <div className="relative overflow-hidden rounded-lg shadow-sm transition-shadow hover:shadow-md">
                <div className="relative aspect-[3/4]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p
                      className="mb-2 text-xs font-medium tracking-wider uppercase"
                      style={{ fontFamily: '"Poppins", sans-serif', color: '#C59B45' }}
                    >
                      {cat.tagline}
                    </p>
                    <h3
                      className="text-xl font-medium"
                      style={{ fontFamily: '"Cormorant Garamond", serif', color: '#F8F2E8' }}
                    >
                      {cat.name}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
