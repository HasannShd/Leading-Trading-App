import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

/**
 * Cinematic curtain reveal: on every route change a dark overlay sweeps off
 * the screen (upward) revealing the new page beneath it.
 */
export default function PageTransition() {
  const overlayRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    // Remove any lingering class first, then force reflow so the animation replays
    overlay.classList.remove('page-transition--reveal');
    // eslint-disable-next-line no-unused-expressions
    overlay.offsetHeight; // reflow
    overlay.classList.add('page-transition--reveal');

    const id = setTimeout(() => {
      overlay.classList.remove('page-transition--reveal');
    }, 700);

    return () => clearTimeout(id);
  }, [location.pathname]);

  return (
    <div
      className="page-transition-overlay"
      ref={overlayRef}
      aria-hidden="true"
    />
  );
}
