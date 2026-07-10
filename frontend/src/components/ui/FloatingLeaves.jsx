import { motion } from 'framer-motion';

const LEAVES = [
  { x: '8%', y: '15%', size: 28, delay: 0, rotate: -15 },
  { x: '88%', y: '25%', size: 22, delay: 1.5, rotate: 20 },
  { x: '75%', y: '70%', size: 32, delay: 0.8, rotate: -8 },
  { x: '12%', y: '80%', size: 24, delay: 2.2, rotate: 12 },
  { x: '50%', y: '10%', size: 18, delay: 3, rotate: -25 },
];

export default function FloatingLeaves({ count = 5, className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {LEAVES.slice(0, count).map((leaf, i) => (
        <motion.div
          key={i}
          className="absolute opacity-[0.12]"
          style={{ left: leaf.x, top: leaf.y }}
          animate={{
            y: [0, -20, -8, -16, 0],
            rotate: [leaf.rotate, leaf.rotate + 5, leaf.rotate - 3, leaf.rotate + 2, leaf.rotate],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: leaf.delay,
          }}
        >
          <LeafIcon size={leaf.size} />
        </motion.div>
      ))}
    </div>
  );
}

function LeafIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C8 6 4 10 4 16c0 3 2 5 4 6 1-3 2-6 4-8 2 2 3 5 4 8 2-1 4-3 4-6 0-6-4-10-8-14Z"
        fill="#5B7F3A"
        opacity="0.8"
      />
      <path d="M12 2v20" stroke="#4A6630" strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}
