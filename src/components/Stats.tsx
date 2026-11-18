'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, useGSAP);

const stats = [
  ['4,000+', 'teams on Orbit'],
  ['12M', 'questions answered'],
  ['5.2h', 'saved per person, weekly'],
  ['99.99%', 'uptime, last 12 months'],
];

/** Numbers that decode into place when they scroll into view. */
export default function Stats() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.utils.toArray<HTMLElement>('.stat').forEach((el, i) => {
      gsap.to(el, { duration: 1.6, delay: i * 0.12, scrambleText: { text: el.dataset.v!, chars: '0123456789', speed: 0.5 }, scrollTrigger: { trigger: root.current, start: 'top 80%', once: true } });
    });
  }, { scope: root });

  return (
    <section ref={root} className="mx-auto max-w-6xl px-4 py-20">
      <dl className="panel grid grid-cols-2 divide-white/10 md:grid-cols-4 md:divide-x">
        {stats.map(([v, l]) => (
          <div key={l} className="p-6 text-center sm:p-8">
            <dt className="sr-only">{l}</dt>
            <dd className="stat font-mono text-4xl font-semibold tracking-tight sm:text-5xl" data-v={v}>{v}</dd>
            <dd className="mt-2 text-sm text-mute">{l}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
