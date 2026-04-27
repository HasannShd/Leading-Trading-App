import { getLenis } from './lenis';

const SCROLL_RESET_SELECTORS = [
  '.app-main',
  '.portal-shell',
  '.portal-content',
  '.portal-admin-main',
  '.portal-admin-app-shell',
  '.staff-order-history-list',
  '.portal-split-detail-list',
];

export const resetPageScroll = () => {
  if (typeof window === 'undefined') return;

  const lenis = getLenis();
  lenis?.scrollTo?.(0, { immediate: true, force: true });

  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  document.documentElement.scrollLeft = 0;
  document.body.scrollTop = 0;
  document.body.scrollLeft = 0;

  document.querySelectorAll(SCROLL_RESET_SELECTORS.join(',')).forEach((element) => {
    element.scrollTop = 0;
    element.scrollLeft = 0;
  });
};

export const schedulePageScrollReset = () => {
  if (typeof window === 'undefined') return () => {};

  resetPageScroll();
  const firstFrame = window.requestAnimationFrame(resetPageScroll);
  const secondFrame = window.requestAnimationFrame(() => {
    window.requestAnimationFrame(resetPageScroll);
  });
  const timeout = window.setTimeout(resetPageScroll, 80);

  return () => {
    window.cancelAnimationFrame(firstFrame);
    window.cancelAnimationFrame(secondFrame);
    window.clearTimeout(timeout);
  };
};
