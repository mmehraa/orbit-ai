'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { scrollToId } from './Motion';

gsap.registerPlugin(ScrambleTextPlugin);

const logos = ['Northwind', 'Lumen Labs', 'Parallax', 'Quanta', 'Halcyon', 'Vertex & Co', 'Meridian', 'Cobalt'];

/** Hero: the headline "decodes" from random glyphs, then the rest of the content rises in. */
export default function Hero() {
  const a = useRef<HTMLSpanElement>(null);
  const b = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const chars = '01<>/{}[]#*+=~ABCDEFXYZ';
    // Take over from the CSS pre-hide (html.js) without a flash: set start states, then lift the CSS rule.
    gsap.set(['.hero-in', '.hero-late'], { opacity: 0 });
    gsap.set([a.current, b.current], { opacity: 1 });
    document.documentElement.classList.add('hero-go');
    const tl = gsap.timeline({ delay: 0.15 });
    tl.fromTo('.hero-in', { y: 24, opacity: 0, filter: 'blur(8px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'expo.out', stagger: 0.08 })
      .to(a.current, { duration: 1.4, scrambleText: { text: a.current!.dataset.text!, chars, speed: 0.6, revealDelay: 0.2 } }, 0.1)
      .to(b.current, { duration: 1.6, scrambleText: { text: b.current!.dataset.text!, chars, speed: 0.6, revealDelay: 0.4 } }, 0.35)
      .fromTo('.hero-late', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.1 }, 0.9);
    return () => { tl.kill(); };
  }, []);

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col items-center justify-center px-4 pt-28 text-center">
      <p className="hero-in eyebrow"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" /> Orbit 2.0 is live: meet Agents</p>
      <h1 className="mt-7 max-w-5xl text-[13vw] font-semibold leading-[0.95] tracking-[-0.05em] sm:text-[8.5vw] lg:text-[7.4rem]">
        <span ref={a} data-text="Your work," className="block">Your work,</span>
        <span ref={b} data-text="on autopilot." className="text-gradient block pb-2">on autopilot.</span>
      </h1>
      <p className="hero-late mt-6 max-w-xl text-lg text-ice/75 [text-shadow:0_1px_14px_rgba(10,11,30,.95)]">Orbit connects your tools, answers questions about your work and quietly handles the busywork, so your team can focus on what matters.</p>
      <form className="hero-late mt-9 flex w-full max-w-md flex-col gap-2 sm:flex-row" onSubmit={(e) => { e.preventDefault(); scrollToId('cta'); }}>
        <label htmlFor="hero-email" className="sr-only">Work email</label>
        <input id="hero-email" type="email" placeholder="you@company.com" className="h-12 w-full shrink-0 rounded-full sm:w-auto sm:flex-1 border border-white/15 bg-white/5 px-5 text-sm outline-none backdrop-blur placeholder:text-mute focus:border-violet" />
        <button className="btn h-12">Start free →</button>
      </form>
      <p className="hero-late mt-3 font-mono text-xs text-mute">Free for 14 days · No credit card · SOC 2 Type II</p>

      <div className="hero-late mt-20 w-full max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-widest text-mute">Trusted by 4,000+ fast-moving teams</p>
        <div className="mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
          <div className="flex w-max animate-[marquee_35s_linear_infinite] gap-14">
            {[...logos, ...logos].map((l, i) => (
              <span key={i} className="whitespace-nowrap text-xl font-semibold tracking-tight text-ice/40" aria-hidden={i >= logos.length}>{l}</span>
            ))}
          </div>
        </div>
      </div>
      <style>{'@keyframes marquee { to { transform: translateX(-50%); } }'}</style>
    </section>
  );
}
