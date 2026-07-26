import { motion } from 'framer-motion';

/**
 * Reusable glass-morphism card with gold hover glow. Every interactive
 * card on the Home page and beyond is built from this primitive.
 */
export default function GlassCard({
  children,
  className = '',
  onClick,
  gold = false,
  as: Component = motion.div,
  ...rest
}) {
  return (
    <Component
      onClick={onClick}
      whileHover={{ y: -6, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`${gold ? 'glass-gold' : 'glass'} rounded-3xl p-6 md:p-8 cursor-pointer
        hover:border-gold/50 transition-colors duration-500 ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
}
