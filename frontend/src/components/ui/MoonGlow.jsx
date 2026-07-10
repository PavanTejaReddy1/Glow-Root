import { motion } from 'framer-motion';

export default function MoonGlow({ className = '', size = 'lg' }) {
  const sizes = {
    sm: 'h-48 w-48',
    md: 'h-72 w-72',
    lg: 'h-[420px] w-[420px]',
    xl: 'h-[560px] w-[560px]',
  };

  return (
    <motion.div
      className={`pointer-events-none absolute ${sizes[size]} ${className}`}
      animate={{ scale: [1, 1.04, 1], opacity: [0.7, 0.9, 0.7] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 rounded-full bg-moon-glow blur-2xl" />
      <div className="absolute inset-[15%] rounded-full bg-gradient-to-br from-cream via-gold-light/30 to-gold/20 blur-xl" />
      <div className="absolute inset-[25%] rounded-full bg-gradient-to-br from-cream to-gold-light/40 shadow-glow" />
      {[
        { top: '28%', left: '35%' },
        { top: '45%', left: '55%' },
        { top: '38%', left: '62%' },
        { top: '52%', left: '40%' },
        { top: '32%', left: '48%' },
        { top: '48%', left: '58%' },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-cream"
          style={{ top: pos.top, left: pos.left }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
    </motion.div>
  );
}
