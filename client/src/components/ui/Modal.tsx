import { useEffect, useId, useRef } from 'react';
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
  ariaLabel?: string;
  ariaDescribedBy?: string;
  initialFocus?: string;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

let bodyLockCount = 0;
let originalBodyOverflow = '';
let originalBodyPaddingRight = '';
const modalLayers: HTMLElement[] = [];
const originalBodyStates = new Map<HTMLElement, { inert: boolean; ariaHidden: string | null }>();

function syncBodyInertState() {
  const topLayer = modalLayers.at(-1);
  Array.from(document.body.children).forEach((child) => {
    if (!(child instanceof HTMLElement)) return;
    if (!originalBodyStates.has(child)) {
      originalBodyStates.set(child, {
        inert: child.inert,
        ariaHidden: child.getAttribute('aria-hidden'),
      });
    }
    const original = originalBodyStates.get(child);
    if (!original) return;
    if (child === topLayer) {
      child.inert = original.inert;
      if (original.ariaHidden === null) child.removeAttribute('aria-hidden');
      else child.setAttribute('aria-hidden', original.ariaHidden);
    } else {
      child.inert = true;
      child.setAttribute('aria-hidden', 'true');
    }
  });

  if (!topLayer) {
    originalBodyStates.forEach((state, element) => {
      element.inert = state.inert;
      if (state.ariaHidden === null) element.removeAttribute('aria-hidden');
      else element.setAttribute('aria-hidden', state.ariaHidden);
    });
    originalBodyStates.clear();
  }
}

function lockBody(layer: HTMLElement) {
  if (bodyLockCount === 0) {
    originalBodyOverflow = document.body.style.overflow;
    originalBodyPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }
  bodyLockCount += 1;
  modalLayers.push(layer);
  syncBodyInertState();
}

function unlockBody(layer: HTMLElement) {
  const layerIndex = modalLayers.lastIndexOf(layer);
  if (layerIndex >= 0) modalLayers.splice(layerIndex, 1);
  bodyLockCount = Math.max(0, bodyLockCount - 1);
  if (bodyLockCount === 0) {
    document.body.style.overflow = originalBodyOverflow;
    document.body.style.paddingRight = originalBodyPaddingRight;
  }
  syncBodyInertState();
}

function isTopLayer(layer: HTMLElement | null) {
  return Boolean(layer && modalLayers.at(-1) === layer);
}

export function Modal({
  open,
  onClose,
  title,
  ariaLabel,
  ariaDescribedBy,
  initialFocus,
  closeOnBackdrop = true,
  closeOnEscape = true,
  children,
  size = 'md',
  className,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const reducedMotion = useReducedMotion();
  useFocusTrap(modalRef, open, { initialFocus });

  useEffect(() => {
    const layer = modalRef.current?.parentElement;
    if (!open || !layer) return;
    lockBody(layer);
    return () => unlockBody(layer);
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const layer = modalRef.current?.parentElement || null;
      if (event.key === 'Escape' && open && closeOnEscape && isTopLayer(layer)) {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [closeOnEscape, open, onClose]);

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
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => {
              const layer = modalRef.current?.parentElement || null;
              if (closeOnBackdrop && isTopLayer(layer)) onClose();
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          <motion.div
            ref={modalRef}
            variants={modalVariants}
            initial="closed"
            animate="open"
            exit="closed"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-label={title ? undefined : ariaLabel || 'Dialog'}
            aria-describedby={ariaDescribedBy}
            tabIndex={-1}
            className={cn(
              'relative flex flex-col w-full h-auto max-h-[90vh] shadow-2xl rounded-2xl border bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-900 overflow-hidden',
              'max-sm:h-full max-sm:max-h-full max-sm:rounded-none max-sm:border-none',
              sizeClasses[size],
              className
            )}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-900 shrink-0">
              {title ? (
                <h2 id={titleId} className="text-base font-bold dark:text-zinc-100 text-zinc-800">
                  {title}
                </h2>
              ) : (
                <div />
              )}
              <button
                onClick={onClose}
                className="min-h-11 min-w-11 p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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
