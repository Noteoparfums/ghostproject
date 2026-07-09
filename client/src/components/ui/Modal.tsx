import {   useEffect, useRef  } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { cn } from '../../lib/cn';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Modal({ open, onClose, title, children, size = 'md', className }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  
  // Trap focus inside modal
  useFocusTrap(modalRef, open);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Escape key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-5xl',
  };

  const backdropVariants = reducedMotion 
    ? { open: { opacity: 1 }, closed: { opacity: 0 } }
    : { open: { opacity: 1 }, closed: { opacity: 0 } };

  const modalVariants = reducedMotion
    ? { open: { scale: 1, y: 0 }, closed: { scale: 1, y: 0 } }
    : {
        open: { scale: 1, y: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 300 } as any },
        closed: { scale: 0.95, y: 20, opacity: 0, transition: { duration: 0.2 } as any },
      };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 max-sm:p-0">
          {/* Backdrop overlay */}
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            variants={modalVariants}
            initial="closed"
            animate="open"
            exit="closed"
            role="dialog"
            aria-modal="true"
            className={cn(
              'relative flex flex-col w-full h-auto max-h-[90vh] shadow-2xl rounded-2xl border bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-900 overflow-hidden',
              'max-sm:h-full max-sm:max-h-full max-sm:rounded-none max-sm:border-none',
              sizeClasses[size],
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-900 shrink-0">
              {title ? (
                <h3 className="text-base font-bold dark:text-zinc-100 text-zinc-800">
                  {title}
                </h3>
              ) : (
                <div />
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-6 overflow-y-auto min-w-0">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
export default Modal;
