import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Animates a number from 0 → target using GSAP when the element enters the viewport.
 * Returns a ref to attach to the element that should display the number.
 *
 * @param {number} target   Final value to count up to
 * @param {object} options
 * @param {number} options.duration  Animation duration in seconds (default 1.4)
 * @param {number} options.decimals  Decimal places to show (default 0)
 */
export function useCountUp(target, { duration = 1.4, decimals = 0 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !Number.isFinite(target) || target <= 0) return;

    // Respect reduced-motion preference — just show the final value
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = decimals > 0 ? target.toFixed(decimals) : String(target);
      return;
    }

    let tween = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const counter = { val: 0 };
        tween = gsap.to(counter, {
          val: target,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = decimals > 0
              ? counter.val.toFixed(decimals)
              : Math.round(counter.val).toString();
          },
          onComplete: () => {
            el.textContent = decimals > 0
              ? target.toFixed(decimals)
              : String(target);
          },
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      tween?.kill();
    };
  }, [target, duration, decimals]);

  return ref;
}
