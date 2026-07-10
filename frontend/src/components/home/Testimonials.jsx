import { testimonials } from '../../data/content.js';

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: '#F8F2E8' }}>
      <div className="mx-auto max-w-content px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <span
            className="mb-3 inline-block text-sm font-medium tracking-wider uppercase"
            style={{ color: '#C59B45' }}
          >
            Customer Stories
          </span>
          <h2
            className="mb-4 text-3xl font-medium md:text-4xl"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
          >
            Rituals, reviewed with love
          </h2>
          <p
            className="mx-auto max-w-2xl text-base"
            style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
          >
            Real experiences from our community — because the glow speaks for itself.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-6 shadow-sm"
              style={{ backgroundColor: '#FCFAF6' }}
            >
              {/* Stars */}
              <div className="mb-4 flex gap-1" style={{ color: '#C59B45' }}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <StarIcon key={j} />
                ))}
              </div>

              <blockquote
                className="mb-6 text-base italic leading-relaxed"
                style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
              >
                {t.quote}
              </blockquote>

              <div className="flex items-center gap-4 border-t pt-4" style={{ borderColor: 'rgba(197,155,69,0.25)' }}>
                <img
                  src={t.image}
                  alt={t.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p
                    className="font-medium"
                    style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="text-xs uppercase tracking-wider"
                    style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
                  >
                    {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8L5.8 21l1.6-7L2 9.2l7.1-.6L12 2Z" />
  </svg>
);
