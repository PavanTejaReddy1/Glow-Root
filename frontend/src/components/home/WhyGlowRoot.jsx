import { whyGlowRoot } from '../../data/content.js';

const ICONS = {
  leaf: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2C8 6 4 10 4 16c0 3 2 5 4 6 1-3 2-6 4-8 2 2 3 5 4 8 2-1 4-3 4-6 0-6-4-10-8-14Z" />
    </svg>
  ),
  batch: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  ),
  shield: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3l8 4v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  pure: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l3 7h7l-5.5 4.5 2 7L12 17l-6.5 3.5 2-7L2 9h7l3-7Z" />
    </svg>
  ),
};

export default function WhyGlowRoot() {
  return (
    <section id="why-glowroot" className="py-16 md:py-24" style={{ backgroundColor: '#FCFAF6' }}>
      <div className="mx-auto max-w-content px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <span
            className="mb-3 inline-block text-sm font-medium tracking-wider uppercase"
            style={{ color: '#C59B45' }}
          >
            Why GlowRoot
          </span>
          <h2
            className="mb-4 text-3xl font-medium md:text-4xl"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
          >
            Where ancient wisdom meets modern science
          </h2>
          <p
            className="mx-auto max-w-2xl text-base"
            style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
          >
            Four pillars that define every formulation — from farm to your vanity.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {whyGlowRoot.map((item) => (
            <div key={item.id} className="p-6 text-center">
              <div
                className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: 'rgba(197,155,69,0.1)', color: '#C59B45' }}
              >
                {ICONS[item.icon]}
              </div>
              <h3
                className="mb-3 text-xl font-medium"
                style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
              >
                {item.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
