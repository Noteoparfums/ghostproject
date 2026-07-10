import { useEffect } from 'react';
import type { RefObject } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

interface FocusTrapOptions {
  initialFocus?: string;
  restoreFocus?: boolean;
}

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      !element.hidden &&
      element.getAttribute('aria-hidden') !== 'true' &&
      (element.offsetParent !== null || element === document.activeElement)
  );
}

export function useFocusTrap<T extends HTMLElement>(
  ref: RefObject<T | null>,
  active: boolean,
  options: FocusTrapOptions = {}
) {
  const { initialFocus, restoreFocus = true } = options;

  useEffect(() => {
    if (!active || !ref.current) return;

    const container = ref.current;
    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusables = getFocusableElements(container);
      if (focusables.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey) {
        if (activeElement === first || !container.contains(activeElement)) {
          last.focus();
          event.preventDefault();
        }
      } else if (activeElement === last || !container.contains(activeElement)) {
        first.focus();
        event.preventDefault();
      }
    };

    const animationFrame = window.requestAnimationFrame(() => {
      const preferred = initialFocus
        ? container.querySelector<HTMLElement>(initialFocus)
        : null;
      const target = preferred || getFocusableElements(container)[0] || container;
      target.focus();
    });

    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      document.removeEventListener('keydown', handleKeyDown, true);
      if (restoreFocus && previouslyFocused?.isConnected) {
        window.requestAnimationFrame(() => previouslyFocused.focus());
      }
    };
  }, [ref, active, initialFocus, restoreFocus]);
}
export default useFocusTrap;
