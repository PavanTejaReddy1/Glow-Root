import { whyGlowRoot } from '../../data/content.js';

const ICONS = {
  leaf: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C8 6 4 10 4 16c0 3 2 5 4 6 1-3 2-6 4-8 2 2 3 5 4 8 2-1 4-3 4-6 0-6-4-10-8-14Z" /></svg>,
  batch: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>,
  shield: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3l8 4v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4Z" /><path d="M9 12l2 2 4-4" /></svg>,
  pure: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3 7h7l-5.5 4.5 2 7L12 17l-6.5 3.5 2-7L2 9h7l3-7Z" /></svg>,
};

export default function WhyGlowRoot() {
  return (
    <section id="why-glowroot" className="relative py-20 md:py-28" style={{ backgroundColor: '#FCFAF6' }}>
      {/* Static texture — no animation */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{ backgroundImage: 'radial-gradient(#4B2F1F 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="relative mx-auto max-w-content px-4 lg:px-8">
        <div className="section-header mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest"
            style={{ backgroundColor: 'rgba(197,155,69,0.1)', color: '#C59B45', border: '1px solid rgba(197,155,69,0.25)' }}>
            Why GlowRoot
          </span>
          <h2 className="mb-4 text-3xl font-medium md:text-4xl lg:text-5xl"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}>
            Where ancient wisdom meets modern science
          </h2>
          <p className="mx-auto max-w-xl text-[15px] leading-relaxed"
            style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
            Four pillars that define every formulation — from farm to your vanity.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyGlowRoot.map((item, i) => (
            <div key={item.id} className="why-card relative overflow-hidden rounded-3xl p-8 text-center"
              style={{
                backgroundColor: '#F8F2E8',
                border: '1px solid rgba(197,155,69,0.18)',
                animationDelay: `${i * 80}ms`,
              }}>
              {/* Watermark number */}
              <span className="pointer-events-none absolute right-4 top-2 select-none text-[5rem] font-bold leading-none opacity-[0.04]"
                style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}>
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ background: 'linear-gradient(135deg, rgba(197,155,69,0.16) 0%, rgba(197,155,69,0.06) 100%)', color: '#C59B45' }}>
                {ICONS[item.icon]}
              </div>
              <h3 className="mb-3 text-xl font-medium" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}>
                {item.title}
              </h3>
              <p className="text-[13.5px] leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
                {item.text}
              </p>
              <div className="absolute bottom-0 left-1/2 h-0.5 w-16 -translate-x-1/2 rounded-full"
                style={{ background: 'linear-gradient(90deg, transparent, #C59B45, transparent)' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
