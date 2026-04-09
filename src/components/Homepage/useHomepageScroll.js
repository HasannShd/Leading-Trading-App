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

      ScrollTrigger.matchMedia({
        '(min-width: 901px)': () => {
          const storyTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: '.js-story-pin',
              start: 'top top',
              end: '+=1800',
              scrub: 1,
              pin: true,
              anticipatePin: 1,
            },
          });

          storyTimeline
            .fromTo(
              '.js-story-shell',
              { autoAlpha: 0.84, y: 24 },
              { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' },
              0
            )
            .to('.js-story-progress-fill', { scaleY: 0.34, duration: 1.1, ease: 'none' }, 0)
            .to('.js-story-copy-intro', { autoAlpha: 0, y: -32, duration: 0.9, ease: 'power2.inOut' }, 0.8)
            .to('.js-story-panel-medical', { autoAlpha: 1, y: 0, scale: 1, duration: 1.1, ease: 'power2.out' }, 0.8)
            .fromTo('.js-story-copy-medical', { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 1)
            .to('.js-story-progress-fill', { scaleY: 0.68, duration: 1.1, ease: 'none' }, 1.8)
            .to('.js-story-copy-medical', { autoAlpha: 0, y: -32, duration: 0.9, ease: 'power2.inOut' }, 2.05)
            .to('.js-story-panel-medical', { autoAlpha: 0.16, y: -14, scale: 0.985, duration: 0.9, ease: 'power2.inOut' }, 2.05)
            .to('.js-story-panel-industrial', { autoAlpha: 1, y: 0, scale: 1, duration: 1.1, ease: 'power2.out' }, 2.1)
            .fromTo('.js-story-copy-industrial', { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 2.22)
            .to('.js-story-progress-fill', { scaleY: 1, duration: 1, ease: 'none' }, 3);
        },
        '(max-width: 900px)': () => {
          gsap.set('.js-story-progress-fill', { clearProps: 'all' });
          gsap.set(['.js-story-panel-medical', '.js-story-panel-industrial', '.js-story-copy-medical', '.js-story-copy-industrial'], {
            clearProps: 'all',
          });
        },
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
