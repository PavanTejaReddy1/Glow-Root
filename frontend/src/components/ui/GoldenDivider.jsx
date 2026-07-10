import { motion } from 'framer-motion';

export default function GoldenDivider({ className = '' }) {
  return (
    <motion.div
      className={`flex items-center justify-center gap-4 ${className}`}
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60" />
      <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60" />
    </motion.div>
  );
}
