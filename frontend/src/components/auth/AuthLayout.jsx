import { motion } from 'framer-motion';

export default function AuthLayout({ children }) {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #F8F2E8 0%, #EFE3D1 50%, #F8F2E8 100%)'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[450px]"
      >
        {children}
      </motion.div>
    </div>
  );
}
