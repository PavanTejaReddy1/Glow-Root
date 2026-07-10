import { motion } from 'framer-motion';
import Reveal from '../common/Reveal.jsx';
import SectionHeading from '../common/SectionHeading.jsx';
import { instagramPosts } from '../../data/content.js';

export default function InstagramGallery() {
  return (
    <section className="relative overflow-hidden section-bg-warm section-pad">
      <div className="relative mx-auto max-w-content">
        <SectionHeading
          eyebrow="@glowroot.ritual"
          title="Join our community of glow"
          subtitle="Tag your ritual for a chance to be featured in our gallery."
        />

        <div className="mt-16 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-6">
          {instagramPosts.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.05}>
              <motion.a
                href="#"
                whileHover={{ y: -4 }}
                className={`group relative block overflow-hidden rounded-[20px] shadow-card ${
                  i === 0 || i === 3 ? 'md:col-span-2 md:row-span-2 aspect-square' : 'aspect-square'
                }`}
              >
                <img
                  src={post.image}
                  alt="GlowRoot community post"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-brown-dark/0 transition-all duration-400 group-hover:bg-brown-dark/50" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex items-center gap-2 rounded-pill bg-cream/20 px-4 py-2 backdrop-blur-md">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#F8F2E8">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z" />
                    </svg>
                    <span className="font-ui text-xs text-cream">{post.likes.toLocaleString()}</span>
                  </div>
                </div>
                {/* Gold border on hover */}
                <div className="absolute inset-0 rounded-[20px] ring-0 ring-gold/0 transition-all duration-300 group-hover:ring-2 group-hover:ring-gold/50" />
              </motion.a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
