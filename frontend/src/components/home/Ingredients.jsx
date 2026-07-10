import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '../common/Reveal.jsx';
import SectionHeading from '../common/SectionHeading.jsx';
import { ingredients } from '../../data/content.js';

export default function Ingredients() {
  const [selected, setSelected] = useState(null);

  return (
    <section id="ingredients" className="relative overflow-hidden section-bg-leaf section-pad">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 30% 70%, rgba(255,220,130,0.2) 0%, transparent 50%)',
        }}
      />

      <div className="relative mx-auto max-w-content">
        <SectionHeading
          eyebrow="Our Ingredients"
          title="Nature's most potent botanicals"
          subtitle="Each GlowRoot formula begins with a hero ingredient, dosed at clinical concentration for visible results."
          light
        />

        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-6">
          {ingredients.map((ing, i) => (
            <Reveal key={ing.id} delay={i * 0.08}>
              <motion.button
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(ing)}
                className="group w-full text-left"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] shadow-luxury">
                  <img
                    src={ing.image}
                    alt={ing.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/90 via-brown/30 to-transparent" />
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ boxShadow: 'inset 0 0 40px rgba(255,220,130,0.3)' }}
                  />
                  <div className="absolute bottom-0 p-4 md:p-5">
                    <p className="font-ui text-[9px] tracking-widest2 uppercase text-gold-light md:text-[10px]">
                      {ing.sanskrit}
                    </p>
                    <h3 className="mt-1 font-display text-base text-cream md:text-lg">{ing.name}</h3>
                    <p className="mt-1 font-body text-[10px] text-cream/70 md:text-xs">{ing.benefit}</p>
                  </div>
                  <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-cream/20 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F8F2E8" strokeWidth="2">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </div>
                </div>
              </motion.button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Ingredient Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <div className="absolute inset-0 bg-brown-dark/70 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-lg overflow-hidden rounded-[28px] glass shadow-luxury"
            >
              <div className="relative h-56 overflow-hidden">
                <img src={selected.image} alt={selected.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-cream to-transparent" />
                <button
                  onClick={() => setSelected(null)}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-cream/80 backdrop-blur-sm"
                  aria-label="Close"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>
              <div className="p-8">
                <p className="font-ui text-[10px] tracking-widest2 uppercase text-gold">{selected.sanskrit}</p>
                <h3 className="mt-2 font-display text-3xl text-text">{selected.name}</h3>
                <p className="mt-4 font-body text-sm leading-relaxed text-text-muted">{selected.description}</p>
                <div className="mt-6">
                  <p className="font-ui text-[10px] tracking-widest2 uppercase text-brown/60">Key Benefits</p>
                  <ul className="mt-3 grid grid-cols-2 gap-2">
                    {selected.benefits.map((b) => (
                      <li key={b} className="flex items-center gap-2 font-body text-xs text-text">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
