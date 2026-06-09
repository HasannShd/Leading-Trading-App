import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

/**
 * Cinematic curtain reveal: on every route change a dark overlay sweeps off
 * the screen (upward) revealing the new page beneath it.
 */
export default function PageTransition() {
  const overlayRef = useRef(null);
  const frameRef = useRef(0);
  const location = useLocation();
  const previousPathRef = useRef(location.pathname);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const previousPath = previousPathRef.current;
    previousPathRef.current = location.pathname;

    const resetOverlay = () => {
      overlay.classList.remove('page-transition--reveal');
      overlay.style.opacity = '0';
      overlay.style.visibility = 'hidden';
    };

    const isProductPath = (path = '') => path.startsWith('/product/');
    if (previousPath !== location.pathname && isProductPath(previousPath) && isProductPath(location.pathname)) {
      resetOverlay();
      return undefined;
    }

    try {
      resetOverlay();
      cancelAnimationFrame(frameRef.current);
      frameRef.current = window.requestAnimationFrame(() => {
        if (!overlayRef.current?.isConnected) return;
        void overlayRef.current.offsetHeight;
        overlayRef.current.style.opacity = '1';
        overlayRef.current.style.visibility = 'visible';
        overlayRef.current.classList.add('page-transition--reveal');
      });
    } catch (error) {
      console.error('Page transition animation failed', error);
      return undefined;
    }

    const handleAnimationEnd = () => resetOverlay();
    overlay.addEventListener('animationend', handleAnimationEnd, { once: true });

    const id = setTimeout(() => {
      try {
        resetOverlay();
      } catch (error) {
        console.error('Page transition cleanup failed', error);
      }
    }, 800);

    return () => {
      overlay.removeEventListener('animationend', handleAnimationEnd);
      clearTimeout(id);
      cancelAnimationFrame(frameRef.current);
    };
  }, [location.pathname]);

  return (
    <div
      className="page-transition-overlay"
      ref={overlayRef}
      aria-hidden="true"
    />
  );
}
