import { useEffect, useRef } from 'react';
import './Cursor.css';

/**
 * Custom cinematic cursor — only renders on pointer:fine devices (laptop/desktop).
 * Hides the native cursor and replaces it with a small dot + a lagging ring.
 * The ring enlarges when hovering over interactive elements (links / buttons).
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Only show on devices with a precise pointer (mouse/trackpad)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Signal to CSS that cursor is ready so we can hide the native one
    document.body.classList.add('cursor-ready');

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let rafId = null;
    let visible = false;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!visible) {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
        visible = true;
      }

      // Dot follows instantly
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    };

    // Ring follows with smooth lag
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(animateRing);
    };

    // Use event delegation — works for dynamically added elements too
    const onInteractEnter = (e) => {
      if (e.target.closest('a, button, [role="button"], input, textarea, select, label')) {
        ring.classList.add('cursor-ring--hover');
        dot.classList.add('cursor-dot--hover');
      }
    };
    const onInteractLeave = (e) => {
      if (e.target.closest('a, button, [role="button"], input, textarea, select, label')) {
        ring.classList.remove('cursor-ring--hover');
        dot.classList.remove('cursor-dot--hover');
      }
    };

    const onMouseDown = () => ring.classList.add('cursor-ring--click');
    const onMouseUp = () => ring.classList.remove('cursor-ring--click');

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onInteractEnter, { passive: true });
    document.addEventListener('mouseout', onInteractLeave, { passive: true });
    document.addEventListener('mousedown', onMouseDown, { passive: true });
    document.addEventListener('mouseup', onMouseUp, { passive: true });

    rafId = requestAnimationFrame(animateRing);

    return () => {
      document.body.classList.remove('cursor-ready');
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onInteractEnter);
      document.removeEventListener('mouseout', onInteractLeave);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
}
