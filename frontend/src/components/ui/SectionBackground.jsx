import FloatingLeaves from './FloatingLeaves.jsx';

const VARIANTS = {
  cream: 'section-bg-cream',
  sage: 'section-bg-sage',
  warm: 'section-bg-warm',
  leaf: 'section-bg-leaf',
  brown: 'section-bg-brown',
};

export default function SectionBackground({
  variant = 'cream',
  leaves = false,
  glow = false,
  className = '',
  children,
}) {
  return (
    <section className={`relative overflow-hidden ${VARIANTS[variant]} ${className}`}>
      {glow && (
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse at 30% 20%, rgba(255,220,130,0.2) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(165,181,138,0.15) 0%, transparent 50%)',
          }}
        />
      )}
      {leaves && <FloatingLeaves />}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
