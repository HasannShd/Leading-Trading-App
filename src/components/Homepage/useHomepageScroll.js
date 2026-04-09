import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '../../hooks/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

export const useHomepageScroll = (rootRef, enabled = true) => {
  useScrollReveal(rootRef, enabled);

  useLayoutEffect(() => {
    const root = rootRef?.current;
    if (!enabled || !root) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return undefined;

    const ctx = gsap.context(() => {
      const hero = root.querySelector('.home-hero');
      const heroOrb = root.querySelector('.hero-orb');

      if (heroOrb) {
        gsap.fromTo(
          heroOrb,
          { opacity: 0.35, scale: 1.18 },
          { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' }
        );
      }

      if (hero) {
        gsap.utils.toArray(hero.querySelectorAll('[data-hero-parallax="slow"]')).forEach((element) => {
          gsap.to(element, {
            yPercent: -8,
            ease: 'none',
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.8,
            },
          });
        });

        gsap.utils.toArray(hero.querySelectorAll('[data-hero-parallax="fast"]')).forEach((element) => {
          gsap.to(element, {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.8,
            },
          });
        });
      }

      const workflowFill = root.querySelector('.workflow-stage__line-fill');
      const workflowSection = root.querySelector('.workflow-stage');

      if (workflowFill && workflowSection) {
        gsap.fromTo(
          workflowFill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: workflowSection,
              start: 'top 60%',
              end: 'bottom 70%',
              scrub: 0.9,
            },
          }
        );
      }

      gsap.utils.toArray(root.querySelectorAll('[data-parallax="soft"]')).forEach((element) => {
        gsap.to(element, {
          yPercent: -6,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        });
      });

      gsap.utils.toArray(root.querySelectorAll('[data-parallax="lift"]')).forEach((element) => {
        gsap.to(element, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.85,
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [enabled, rootRef]);
};
