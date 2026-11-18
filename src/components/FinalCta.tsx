'use client';

import { useState } from 'react';
import { Logo } from './Nav';

export default function FinalCta() {
  const [joined, setJoined] = useState<number | null>(null);
  return (
    <>
      <section id="cta" className="relative flex min-h-[100svh] flex-col items-center justify-center px-4 py-28 text-center [text-shadow:0_2px_24px_rgba(10,11,30,.9)]">
        <p className="eyebrow" data-reveal>Get started</p>
        <h2 data-split className="mt-6 max-w-4xl text-6xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-8xl">Ready for <span className="text-gradient">liftoff?</span></h2>
        <p className="mt-6 max-w-md text-lg text-mute" data-reveal>Join 4,000+ teams who stopped searching and started shipping.</p>
        {joined ? (
          <div className="panel mt-10 bg-space/85 px-8 py-6" role="status">
            <p className="text-lg font-semibold">You&apos;re on the list 🚀</p>
            <p className="mt-1 text-sm text-mute">You&apos;re <b className="text-cyan">#{joined.toLocaleString()}</b>. We&apos;ll email your invite within 48 hours.</p>
          </div>
        ) : (
          <form className="mt-10 flex w-full max-w-md flex-col gap-2 sm:flex-row" data-reveal
                onSubmit={(e) => { e.preventDefault(); setJoined(1200 + Math.floor(Math.random() * 300)); }}>
            <label htmlFor="cta-email" className="sr-only">Work email</label>
            <input id="cta-email" required type="email" placeholder="you@company.com" className="h-12 w-full shrink-0 rounded-full sm:w-auto sm:flex-1 border border-white/15 bg-space/50 px-5 text-sm outline-none backdrop-blur placeholder:text-mute focus:border-violet" />
            <button className="btn h-12">Join the waitlist</button>
          </form>
        )}
      </section>
      <footer className="border-t border-white/10 bg-space/80 backdrop-blur">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 text-sm sm:grid-cols-2 md:grid-cols-4">
          <div><Logo /><p className="mt-3 text-mute">Your work, on autopilot.</p></div>
          <div className="space-y-2 text-mute"><p className="font-semibold text-ice">Product</p><p>Features</p><p>Integrations</p><p>Changelog</p></div>
          <div className="space-y-2 text-mute"><p className="font-semibold text-ice">Company</p><p>About</p><p>Careers</p><p>Security</p></div>
          <div className="space-y-2 text-mute"><p className="font-semibold text-ice">Contact</p><p>hello@orbit-ai.example</p><p>San Francisco · Remote</p></div>
        </div>
        <p className="border-t border-white/10 px-4 py-6 text-center font-mono text-xs text-mute">© {new Date().getFullYear()} Orbit AI. A portfolio concept: fictional company, testimonials and metrics.</p>
      </footer>
    </>
  );
}
