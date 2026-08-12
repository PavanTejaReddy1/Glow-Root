import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext.jsx';

export default function Hero() {
  const { settings } = useSettings();
  const sectionRef = useRef(null);

  /*
    Measure the actual remaining viewport height after the navbar renders,
    and set the section height to exactly that — no gap possible.
  */
  useEffect(() => {
    const setHeight = () => {
      if (!sectionRef.current) return;
      // getBoundingClientRect().top = distance from viewport top to section top
      // = exact height of everything above the hero (announcement bar + navbar)
      const top = sectionRef.current.getBoundingClientRect().top;
      const availableHeight = window.innerHeight - top;
      sectionRef.current.style.height = `${Math.max(availableHeight, 480)}px`;
    };

    // Run after paint so navbar has measured
    const raf = requestAnimationFrame(setHeight);
    window.addEventListener('resize', setHeight);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', setHeight);
    };
  }, []);

  const stats = [
    { value: settings?.heroStat1Value || '18+',  label: settings?.heroStat1Label || 'Botanical Ingredients' },
    { value: settings?.heroStat2Value || '500',  label: settings?.heroStat2Label || 'Max Batch Size'        },
    { value: settings?.heroStat3Value || '4.9★', label: settings?.heroStat3Label || 'Customer Rating'       },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        /* JS will override this after mount with the exact available height */
        height: 'calc(100vh - 108px)',
        minHeight: '480px',
        maxHeight: '860px',
      }}
    >
      {/* ── Full-bleed background image — desktop/tablet only ── */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          backgroundImage:    'url(/hero-products.png)',
          backgroundSize:     'cover',
          backgroundPosition: 'right center',
          backgroundRepeat:   'no-repeat',
          backgroundColor:    '#F5EDE0',
        }}
      />

      {/* ── Mobile: plain cream background, no image ── */}
      <div
        className="absolute inset-0 md:hidden"
        style={{ backgroundColor: '#F5EDE0' }}
      />

      {/* ── Desktop cream gradient: solid left side, fades into image ── */}
      <div
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{
          background: 'linear-gradient(to right, #F5EDE0 0%, #F5EDE0 41%, rgba(245,237,224,0.45) 52%, transparent 64%)',
        }}
      />

      {/* ── Content (positioned above image) ── */}
      <div className="relative z-10 h-full flex flex-col md:flex-row">

        {/* LEFT: text — 45% on desktop, full-width on mobile */}
        <div
          className="flex flex-col justify-center h-full px-6 py-12 sm:px-10 md:pl-12 md:pr-8 md:py-14 lg:pl-16 xl:pl-20"
          style={{ flex: '0 0 45%', maxWidth: '580px' }}
        >

          {/* Top group */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="mb-6 inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{ backgroundColor: 'rgba(197,155,69,0.13)', color: '#A8771E', border: '1px solid rgba(197,155,69,0.32)' }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#C59B45' }} />
              Ayurvedic Wellness
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.08 }}
              className="mb-5 font-medium leading-[1.1]"
              style={{ fontFamily: '"Cormorant Garamond", serif', color: '#3A1F0D', fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)' }}
            >
              {settings?.heroTagline ? (
                settings.heroTagline
              ) : (
                <>
                  Rooted in Nature.
                  <br />
                  <em style={{ color: '#5B7F3A' }}>Crafted for You.</em>
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, ease: 'easeOut', delay: 0.16 }}
              className="mb-8 max-w-[380px] text-[14.5px] leading-[1.8]"
              style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
            >
              {settings?.heroSubtext ||
                'GlowRoot brings the purity of Ayurveda to your daily self-care routine. Natural ingredients. Honest formulas. Visible results.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: 0.24 }}
            >
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                style={{ backgroundColor: '#3A1F0D', color: '#F8F2E8' }}
              >
                Shop All Products
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* RIGHT: empty spacer — bg-image fills this area */}
        <div className="hidden md:block" style={{ flex: '1 1 55%' }} />
      </div>
    </section>
  );
}
