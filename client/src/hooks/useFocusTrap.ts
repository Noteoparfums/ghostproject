import { useEffect } from 'react';
import type { RefObject } from 'react';

const FOCUSABLE_SELECTOR = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

export function useFocusTrap<T extends HTMLElement>(ref: RefObject<T | null>, active: boolean) {
  useEffect(() => {
    if (!active || !ref.current) return;

    const el = ref.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusables = el.querySelectorAll(FOCUSABLE_SELECTOR);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusables[0] as HTMLElement;
      const last = focusables[focusables.length - 1] as HTMLElement;
      const activeEl = document.activeElement;

      if (e.shiftKey) {
        // Shift + Tab: Wrap from first to last
        if (activeEl === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        // Tab: Wrap from last to first
        if (activeEl === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    // Focus on the first element on mount
    const focusables = el.querySelectorAll(FOCUSABLE_SELECTOR);
    if (focusables.length > 0) {
      (focusables[0] as HTMLElement).focus();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [ref, active]);
}
export default useFocusTrap;
