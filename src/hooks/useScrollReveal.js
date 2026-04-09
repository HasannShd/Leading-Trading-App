import { useEffect } from 'react';

const OBSERVER_OPTIONS = {
  root: null,
  rootMargin: '0px 0px -10% 0px',
  threshold: 0.16,
};

export const useScrollReveal = (rootRef, enabled = true) => {
  useEffect(() => {
    const root = rootRef?.current;
    if (!enabled || !root) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      root.querySelectorAll('.animate-on-scroll').forEach((item) => item.classList.add('is-visible'));
      return undefined;
    }

    const observed = new WeakSet();

    const revealIfInView = (item) => {
      const rect = item.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const revealBoundary = viewportHeight * 0.92;

      if (rect.top < revealBoundary && rect.bottom > 0) {
        item.classList.add('is-visible');
        return true;
      }

      return false;
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, OBSERVER_OPTIONS);

    const hydrateItems = () => {
      root.querySelectorAll('.animate-stagger').forEach((container) => {
        const step = container.getAttribute('data-stagger-step') || '140ms';
        container.style.setProperty('--reveal-step', step);

        const staggerItems = Array.from(container.querySelectorAll('.animate-on-scroll'));
        staggerItems.forEach((item, index) => {
          item.style.setProperty('--reveal-index', String(index));
        });
      });

      root.querySelectorAll('.animate-on-scroll').forEach((item) => {
        if (!item.style.getPropertyValue('--reveal-index')) {
          item.style.setProperty('--reveal-index', '0');
        }

        if (item.classList.contains('is-visible')) {
          return;
        }

        if (revealIfInView(item)) {
          return;
        }

        if (!item.classList.contains('is-visible') && !observed.has(item)) {
          observer.observe(item);
          observed.add(item);
        }
      });
    };

    hydrateItems();

    const mutationObserver = new MutationObserver(() => {
      hydrateItems();
    });

    mutationObserver.observe(root, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [enabled, rootRef]);
};
