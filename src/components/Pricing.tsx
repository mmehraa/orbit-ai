'use client';

import { useEffect, useState } from 'react';
import { scrollToId } from './Motion';

/** One odometer digit: a column of 0-9 that rolls to the right number. */
function Digit({ d }: { d: number }) {
  return (
    <span className="relative inline-block h-[1em] overflow-hidden leading-none">
      <span className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(.34,1.56,.64,1)]" style={{ transform: `translateY(-${d * 10}%)` }}>
        {Array.from({ length: 10 }, (_, i) => <span key={i} className="h-[1em]">{i}</span>)}
      </span>
    </span>
  );
}

function Price({ value }: { value: number }) {
  const digits = String(value).split('').map(Number);
  return (
    <span className="inline-flex items-start font-mono text-6xl font-semibold tracking-tight" aria-label={`$${value}`}>
      <span className="mr-1 mt-1 text-2xl text-mute">$</span>
      {digits.map((d, i) => <Digit key={i} d={d} />)}
    </span>
  );
}

const plans = [
  { name: 'Starter', monthly: 0, yearly: 0, blurb: 'For individuals trying Orbit.', features: ['3 integrations', '100 questions / month', '7-day history', 'Community support'], cta: 'Start free' },
  { name: 'Pro', monthly: 24, yearly: 19, blurb: 'For small teams moving fast.', features: ['Unlimited integrations', 'Unlimited questions', 'Agents & automations', 'Priority support'], cta: 'Start 14-day trial', featured: true },
  { name: 'Team', monthly: 49, yearly: 39, blurb: 'For companies that need control.', features: ['Everything in Pro', 'SSO & SCIM', 'Admin analytics', 'Dedicated success manager'], cta: 'Talk to sales' },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(true);
  useEffect(() => {
    const flip = () => setYearly((y) => !y);
    window.addEventListener('orbit:billing', flip);
    return () => window.removeEventListener('orbit:billing', flip);
  }, []);

  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-28 md:py-40">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow" data-reveal>Pricing</p>
        <h2 data-split className="mt-5 text-5xl font-semibold leading-[1] tracking-[-0.04em] sm:text-6xl">Simple pricing. <span className="text-gradient">Serious leverage.</span></h2>
        <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1.5 text-sm" role="group" aria-label="Billing period" data-reveal>
          {[false, true].map((y) => (
            <button key={String(y)} onClick={() => setYearly(y)} aria-pressed={yearly === y}
                    className={`rounded-full px-4 py-2 font-semibold transition-colors ${yearly === y ? 'bg-ice text-space' : 'text-mute hover:text-ice'}`}>
              {y ? 'Yearly' : 'Monthly'}{y && <span className="ml-2 rounded-full bg-cyan/20 px-2 py-0.5 text-[11px] text-cyan">−20%</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <article key={p.name} data-reveal className={`panel flex flex-col p-7 ${p.featured ? 'conic bg-violet/10 shadow-[0_30px_100px_-30px_rgba(108,92,231,.8)]' : ''}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              {p.featured && <span className="rounded-full bg-gradient-to-r from-violet to-cyan px-2.5 py-1 text-[11px] font-semibold">Most popular</span>}
            </div>
            <p className="mt-1 text-sm text-mute">{p.blurb}</p>
            <p className="mt-6 flex items-end gap-2"><Price value={yearly ? p.yearly : p.monthly} /><span className="mb-1 text-sm text-mute">/ user / mo</span></p>
            <p className="mt-1 h-5 font-mono text-xs text-mute">{p.monthly > 0 ? (yearly ? `billed $${p.yearly * 12} yearly` : 'billed monthly') : 'free forever'}</p>
            <ul className="mt-6 space-y-2.5 text-sm">
              {p.features.map((f) => <li key={f} className="flex gap-2"><span className="text-cyan">✓</span>{f}</li>)}
            </ul>
            <button onClick={() => scrollToId('cta')} className={`mt-8 ${p.featured ? 'btn' : 'btn-ghost'}`}>{p.cta}</button>
          </article>
        ))}
      </div>
    </section>
  );
}
