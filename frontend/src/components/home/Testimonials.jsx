import { useEffect, useState } from 'react';
import { reviewService } from '../../services/reviewService.js';

const Stars = ({ count = 5 }) => (
  <div className="flex gap-1">
    {Array.from({ length: count }).map((_, i) => (
      <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#C59B45">
        <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8L5.8 21l1.6-7L2 9.2l7.1-.6L12 2Z" />
      </svg>
    ))}
  </div>
);

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the most-liked approved reviews to display as testimonials
    reviewService.getFeaturedReviews()
      .then(r => setReviews(r.data?.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  // Don't render section at all if no reviews and not loading
  if (!loading && reviews.length === 0) return null;

  return (
    <section className="py-20 md:py-28" style={{ backgroundColor: '#F8F2E8' }}>
      <div className="mx-auto max-w-content px-4 lg:px-8">
        <div className="section-header mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest"
            style={{ backgroundColor: 'rgba(197,155,69,0.1)', color: '#C59B45', border: '1px solid rgba(197,155,69,0.25)' }}>
            Customer Stories
          </span>
          <h2 className="mb-4 text-3xl font-medium md:text-4xl lg:text-5xl"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}>
            Rituals, reviewed with love
          </h2>
          <p className="mx-auto max-w-xl text-[15px] leading-relaxed"
            style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
            Real experiences from our community — because the glow speaks for itself.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-52 animate-pulse rounded-3xl" style={{ backgroundColor: 'rgba(197,155,69,0.07)' }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {reviews.map(review => (
              <div key={review._id}
                className="testimonial-card relative flex flex-col overflow-hidden rounded-3xl p-7"
                style={{ backgroundColor: '#FCFAF6', border: '1px solid rgba(197,155,69,0.16)', boxShadow: '0 2px 14px rgba(75,47,31,0.05)' }}>
                {/* Quote watermark */}
                <span className="pointer-events-none absolute right-5 top-3 select-none text-[5.5rem] leading-none opacity-[0.05]"
                  style={{ fontFamily: 'Georgia, serif', color: '#4B2F1F', lineHeight: 1 }}>
                  "
                </span>

                <Stars count={review.rating} />

                <blockquote className="mt-4 flex-1 text-[15px] italic leading-relaxed"
                  style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}>
                  "{review.title ? `${review.title} — ` : ''}{review.comment}"
                </blockquote>

                <div className="mt-6 flex items-center gap-3 border-t pt-5"
                  style={{ borderColor: 'rgba(197,155,69,0.18)' }}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full flex-shrink-0"
                    style={{ backgroundColor: 'rgba(197,155,69,0.12)', outline: '2px solid rgba(197,155,69,0.3)', outlineOffset: '2px' }}>
                    <span className="text-sm font-semibold" style={{ color: '#6E4B2A' }}>
                      {(review.user?.firstName || review.user?.email || 'A')[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}>
                      {review.user?.firstName
                        ? `${review.user.firstName}${review.user.lastName ? ` ${review.user.lastName[0]}.` : ''}`
                        : 'Verified Buyer'}
                    </p>
                    <p className="text-[11px]" style={{ fontFamily: '"Poppins", sans-serif', color: '#C59B45' }}>
                      Verified Purchase
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
