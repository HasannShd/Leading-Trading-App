import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useHomepageScroll = (rootRef, enabled) => {
  useEffect(() => {
    if (!enabled || !rootRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.js-hero-copy',
        { autoAlpha: 0, y: 36 },
        { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.js-hero-stage',
        { autoAlpha: 0, y: 44, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 1.05, delay: 0.08, ease: 'power3.out' }
      );

      gsap.utils.toArray('.js-fade-up').forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 54 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 84%',
            },
          }
        );
      });

      gsap.utils.toArray('.js-story-chapter').forEach((element) => {
        const visual = element.querySelector('.js-story-visual');

        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 54 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.95,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 76%',
            },
          }
        );

        if (visual) {
          gsap.fromTo(
            visual,
            { y: 42 },
            {
              y: -18,
              ease: 'none',
              scrollTrigger: {
                trigger: element,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.8,
              },
            }
          );
        }
      });

      gsap.fromTo(
        '.js-logo-block',
        { autoAlpha: 0, y: 42 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.js-trust',
            start: 'top 72%',
          },
        }
      );

      gsap.fromTo(
        '.js-category-card',
        { autoAlpha: 0, y: 38 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.js-categories',
            start: 'top 76%',
          },
        }
      );

      gsap.fromTo(
        '.js-credibility-card',
        { autoAlpha: 0, y: 46 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.84,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.js-credibility',
            start: 'top 76%',
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [enabled, rootRef]);
};
