import { Link } from 'react-router-dom';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1600&auto=format&fit=crop';

export default function Hero() {
  return (
    <section className="relative" style={{ backgroundColor: '#F8F2E8' }}>
      <div className="mx-auto max-w-content px-4 py-6 lg:pl-20 lg:pr-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left - Content */}
          <div className="order-2 lg:order-1">
            <span
              className="mb-4 inline-block text-sm font-medium tracking-wider uppercase"
              style={{ color: '#C59B45' }}
            >
              Ayurvedic Luxury Skincare
            </span>
            
            <h1
              className="mb-6 text-4xl font-medium leading-tight md:text-5xl lg:text-6xl"
              style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
            >
              Rooted in Nature.{' '}
              <span className="italic" style={{ color: '#C59B45' }}>
                Crafted for Radiance.
              </span>
            </h1>
            
            <p
              className="mb-8 max-w-lg text-base leading-relaxed"
              style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
            >
              GlowRoot blends ancient Ayurvedic wisdom with modern formulation science — 
              cold-infused botanicals, traceable to the root, for skin that glows from within.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="inline-block rounded px-8 py-3 text-sm font-medium tracking-wider uppercase transition-colors hover:opacity-90"
                style={{ backgroundColor: '#6E4B2A', color: '#F8F2E8' }}
              >
                Shop All Products
              </Link>
              <Link
                to="/shop/Serums"
                className="inline-block rounded px-8 py-3 text-sm font-medium tracking-wider uppercase transition-colors hover:opacity-80"
                style={{ border: '1px solid #6E4B2A', color: '#6E4B2A' }}
              >
                Best Sellers
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 border-t pt-8" style={{ borderColor: 'rgba(197,155,69,0.25)' }}>
              <div>
                <p
                  className="text-3xl font-medium"
                  style={{ fontFamily: '"Cormorant Garamond", serif', color: '#C59B45' }}
                >
                  18+
                </p>
                <p
                  className="mt-1 text-xs uppercase tracking-wider"
                  style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
                >
                  Botanical Ingredients
                </p>
              </div>
              <div>
                <p
                  className="text-3xl font-medium"
                  style={{ fontFamily: '"Cormorant Garamond", serif', color: '#C59B45' }}
                >
                  500
                </p>
                <p
                  className="mt-1 text-xs uppercase tracking-wider"
                  style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
                >
                  Max Batch Size
                </p>
              </div>
              <div>
                <p
                  className="text-3xl font-medium"
                  style={{ fontFamily: '"Cormorant Garamond", serif', color: '#C59B45' }}
                >
                  4.9★
                </p>
                <p
                  className="mt-1 text-xs uppercase tracking-wider"
                  style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
                >
                  Customer Rating
                </p>
              </div>
            </div>
          </div>

          {/* Right - Image */}
          <div className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <img
                src={HERO_IMAGE}
                alt="GlowRoot Luxury Skincare"
                className="h-[400px] w-full object-cover md:h-[500px] lg:h-[600px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
