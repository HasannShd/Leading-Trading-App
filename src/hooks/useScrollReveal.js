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

    const items = Array.from(root.querySelectorAll('.animate-on-scroll'));
    if (items.length === 0) return undefined;

    const revealAll = () => {
      items.forEach((item) => item.classList.add('is-visible'));
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      revealAll();
      return undefined;
    }

    root.querySelectorAll('.animate-stagger').forEach((container) => {
      const step = container.getAttribute('data-stagger-step') || '140ms';
      container.style.setProperty('--reveal-step', step);

      const staggerItems = Array.from(container.querySelectorAll('.animate-on-scroll'));
      staggerItems.forEach((item, index) => {
        item.style.setProperty('--reveal-index', String(index));
      });
    });

    items.forEach((item) => {
      if (!item.style.getPropertyValue('--reveal-index')) {
        item.style.setProperty('--reveal-index', '0');
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, OBSERVER_OPTIONS);

    items.forEach((item) => {
      if (!item.classList.contains('is-visible')) {
        observer.observe(item);
      }
    });

    return () => observer.disconnect();
  }, [enabled, rootRef]);
};
