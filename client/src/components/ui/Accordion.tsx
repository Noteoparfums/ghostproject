import {   useState  } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/cn';

export interface AccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function Accordion({ title, children, defaultOpen = false, className }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const reducedMotion = useReducedMotion();

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <div className={cn('border rounded-xl dark:border-zinc-900 border-zinc-200 overflow-hidden bg-white dark:bg-zinc-950/20', className)}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        className="flex items-center justify-between w-full px-5 py-4 text-left font-semibold text-sm dark:text-zinc-200 text-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-zinc-400 dark:text-zinc-500 transition-transform duration-200',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={reducedMotion ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
            animate={reducedMotion ? { opacity: 1, height: 'auto' } : { opacity: 1, height: 'auto' }}
            exit={reducedMotion ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <div className="px-5 pb-5 pt-1 text-sm dark:text-zinc-400 text-zinc-600 border-t dark:border-zinc-900 border-zinc-100">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default Accordion;
