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

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    try {
      overlay.classList.remove('page-transition--reveal');
      cancelAnimationFrame(frameRef.current);
      frameRef.current = window.requestAnimationFrame(() => {
        if (!overlayRef.current?.isConnected) return;
        void overlayRef.current.offsetHeight;
        overlayRef.current.classList.add('page-transition--reveal');
      });
    } catch (error) {
      console.error('Page transition animation failed', error);
      return undefined;
    }

    const id = setTimeout(() => {
      try {
        overlayRef.current?.classList.remove('page-transition--reveal');
      } catch (error) {
        console.error('Page transition cleanup failed', error);
      }
    }, 700);

    return () => {
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
