'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

let lenis: Lenis | null = null;

/** Smooth-scroll to a section id (used by nav links and the command palette). */
export function scrollToId(id: string) {
  const el = id === 'top' ? document.body : document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: id === 'top' ? 0 : -80, duration: 1.6 });
  else el.scrollIntoView({ behavior: 'smooth' });
}

/** Lenis smooth scroll + shared reveal animations ([data-split] headings, [data-reveal] blocks). */
export default function Motion() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    lenis = new Lenis({ lerp: 0.09 });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (t: number) => lenis?.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    let ctx: gsap.Context | undefined;
    document.fonts.ready.then(() => {
      ctx = gsap.context(() => {
        document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
          SplitText.create(el, {
            type: 'words,lines', mask: 'lines', linesClass: 'split-line', autoSplit: true,
            onSplit: (s) => {
              gsap.set(el, { visibility: 'visible' });
              // background-clip:text doesn't reach transformed child words, so give gradient words their own gradient.
              s.words.forEach((w) => { if (w.parentElement?.closest('.text-gradient')) w.classList.add('text-gradient'); });
              return gsap.from(s.words, { yPercent: 110, opacity: 0, filter: 'blur(8px)', duration: 1.1, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
            },
          });
        });
        const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]');
        gsap.set(reveals, { y: 40, opacity: 0, filter: 'blur(6px)' });
        ScrollTrigger.batch(reveals, {
          start: 'top 90%', once: true,
          onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'expo.out', stagger: 0.08 }),
        });
      });
      ScrollTrigger.refresh();
    });
    return () => { ctx?.revert(); gsap.ticker.remove(raf); lenis?.destroy(); lenis = null; };
  }, []);
  return null;
}
