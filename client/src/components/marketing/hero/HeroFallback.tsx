import { motion, useReducedMotion } from 'framer-motion';

export function HeroFallback() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.img
      src="/brand/briefloom-hero-fallback.svg"
      alt="Briefloom — copy planes woven into a coordinated campaign"
      className="w-full max-w-xl mx-auto select-none"
      draggable={false}
      animate={prefersReducedMotion ? {} : { y: [0, -8, 0] }}
      transition={prefersReducedMotion ? {} : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}
export default HeroFallback;
