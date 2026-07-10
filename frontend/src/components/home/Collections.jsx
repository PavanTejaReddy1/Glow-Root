import { Link } from 'react-router-dom';
import Reveal from '../common/Reveal.jsx';
import SectionHeading from '../common/SectionHeading.jsx';
import { collections } from '../../data/content.js';

/**
 * Collections — curated ritual bundles rather than raw category
 * links; framed by occasion/time of day, which is how the brand
 * actually wants people to shop.
 */
export default function Collections() {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-content">
        <SectionHeading
          eyebrow="Curated Rituals"
          title="Shop by moment, not just by product"
        />

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {collections.map((col, i) => (
            <Reveal key={col.id} delay={i * 0.1}>
              <Link to="/shop" className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl2">
                  <img
                    src={col.image}
                    alt={col.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-5 font-display text-2xl text-ink">{col.name}</h3>
                <p className="mt-2 font-body text-sm text-ink/60">{col.description}</p>
                <span className="mt-3 inline-block font-ui text-[11px] tracking-widest2 uppercase text-primary border-b border-primary/40 pb-0.5 transition-colors group-hover:border-primary">
                  Discover The Ritual
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
