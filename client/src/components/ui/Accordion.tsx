import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/cn';

export interface AccordionProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  disabled?: boolean;
}

export function Accordion({
  title,
  children,
  defaultOpen = false,
  className,
  disabled = false,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const reducedMotion = useReducedMotion();
  const id = useId();
  const triggerId = `${id}-trigger`;
  const panelId = `${id}-panel`;

  const toggle = () => {
    if (!disabled) {
      setIsOpen((previous) => !previous);
    }
  };

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-card text-card-foreground',
        disabled && 'opacity-60',
        className
      )}
      data-disabled={disabled || undefined}
      data-state={isOpen ? 'open' : 'closed'}
    >
      <button
        id={triggerId}
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        disabled={disabled}
        className="flex min-h-11 w-full items-center justify-between gap-4 px-5 py-3 text-left text-sm font-semibold transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:cursor-not-allowed"
      >
        <span>{title}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
            isOpen && 'rotate-180',
            reducedMotion && 'transition-none'
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={triggerId}
            initial={reducedMotion ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
            animate={reducedMotion ? { opacity: 1, height: 'auto' } : { opacity: 1, height: 'auto' }}
            exit={reducedMotion ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2, ease: 'easeInOut' }}
          >
            <div className="border-t border-border px-5 pb-5 pt-4 text-sm text-muted-foreground">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default Accordion;
