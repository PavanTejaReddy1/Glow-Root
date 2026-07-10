import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '../common/Reveal.jsx';
import SectionHeading from '../common/SectionHeading.jsx';
import LuxuryButton from '../ui/LuxuryButton.jsx';
import MoonGlow from '../ui/MoonGlow.jsx';
import { rituals } from '../../data/content.js';

export default function OurRituals() {
  const [active, setActive] = useState(0);

  return (
    <section id="rituals" className="relative overflow-hidden section-bg-cream section-pad">
      <MoonGlow size="md" className="left-0 top-1/2 -translate-y-1/2 opacity-40" />

      <div className="relative mx-auto max-w-content">
        <SectionHeading
          eyebrow="Our Rituals"
          title="Ancient practices, modern devotion"
          subtitle="Three timeless Ayurvedic rituals reimagined for contemporary self-care — each designed to restore balance and radiance."
        />

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Ritual tabs */}
          <div className="flex flex-col gap-4">
            {rituals.map((ritual, i) => (
              <Reveal key={ritual.id} delay={i * 0.1}>
                <motion.button
                  onClick={() => setActive(i)}
                  whileHover={{ x: 4 }}
                  className={`w-full rounded-[20px] p-6 text-left transition-all duration-400 ${
                    active === i
                      ? 'glass shadow-luxury border-gold/30'
                      : 'bg-cream-dark/30 hover:bg-cream-dark/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-ui text-[10px] tracking-widest2 uppercase text-gold-dark">
                        {ritual.subtitle}
                      </p>
                      <h3 className="mt-1 font-display text-2xl text-text">{ritual.name}</h3>
                      <p className="mt-2 font-body text-sm text-text-muted">{ritual.description}</p>
                    </div>
                    <span
                      className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm transition-colors ${
                        active === i ? 'bg-gold text-cream' : 'bg-brown/10 text-brown'
                      }`}
                    >
                      {i + 1}
                    </span>
                  </div>
                </motion.button>
              </Reveal>
            ))}
            <LuxuryButton to="/shop" className="mt-4 self-start">Shop Ritual Kits</LuxuryButton>
          </div>

          {/* Ritual visual */}
          <Reveal delay={0.2}>
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="relative overflow-hidden rounded-[28px] shadow-float"
                >
                  <div className="aspect-[4/5]">
                    <img
                      src={rituals[active].image}
                      alt={rituals[active].name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/70 via-transparent to-transparent" />

                  {/* Steps overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <p className="font-ui text-[10px] tracking-widest2 uppercase text-gold-light">The Steps</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {rituals[active].steps.map((step, i) => (
                        <motion.span
                          key={step}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="inline-flex items-center gap-2 rounded-pill bg-cream/20 px-4 py-2 backdrop-blur-md"
                        >
                          <span className="font-ui text-[10px] text-gold">{String(i + 1).padStart(2, '0')}</span>
                          <span className="font-body text-xs text-cream">{step}</span>
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
