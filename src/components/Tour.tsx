'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, TextPlugin, useGSAP);

const steps = [
  { title: 'Connect your tools', body: 'Two clicks per app. Orbit indexes everything securely in minutes.' },
  { title: 'Ask in plain English', body: 'Get answers with sources from across your whole workspace.' },
  { title: 'Let Orbit do the rest', body: 'Turn answers into actions: tickets, summaries, follow-ups.' },
];
const apps = ['Slack', 'Gmail', 'Notion', 'Linear', 'Google Drive', 'HubSpot'];
const prompt = 'Which customers mentioned slow exports this month?';
const answer = 'Three accounts raised it: Northwind (2 tickets), Quanta (Slack thread on the 12th) and Halcyon (sales call). All on the legacy CSV exporter.';
const tasks = ['Create Linear issue: "Speed up CSV export"', 'Draft reply to 3 customers', 'Post summary in #product', 'Schedule follow-up for Friday'];

/** Pinned, scroll-scrubbed product tour: tools switch on, a question types itself, the answer streams, tasks tick off. */
export default function Tour() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const items = gsap.utils.toArray<HTMLElement>('.tour-step');
    let current = -1;
    const setStep = (i: number) => {
      if (i === current) return;
      current = i;
      items.forEach((el, j) => el.classList.toggle('is-active', j === i));
    };
    setStep(0);
    gsap.set('.tour-panel:not(:first-child)', { autoAlpha: 0, y: 20 });

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root.current, start: 'top top', end: '+=300%', pin: true, scrub: 0.8,
        onUpdate: (s) => setStep(s.progress < 0.36 ? 0 : s.progress < 0.7 ? 1 : 2),
      },
    });
    tl.to('.tg', { backgroundColor: '#6c5ce7', duration: 0.15, stagger: 0.15 }, 0)
      .to('.tg-knob', { x: 16, duration: 0.15, stagger: 0.15 }, 0)
      .to('.app-status', { text: { value: 'Synced', delimiter: ' ' }, color: '#00d4ff', duration: 0.01, stagger: 0.15 }, 0.14)
      .to('.tour-panel-1', { autoAlpha: 0, y: -20, duration: 0.25 }, 1.15)
      .to('.tour-panel-2', { autoAlpha: 1, y: 0, duration: 0.25 }, 1.3)
      .to('.typed', { text: prompt, duration: 0.6 }, 1.5)
      .to('.thinking', { autoAlpha: 1, duration: 0.05 }, 2.1)
      .to('.thinking', { autoAlpha: 0, duration: 0.05 }, 2.3)
      .to('.ans-word', { opacity: 1, filter: 'blur(0px)', duration: 0.05, stagger: 0.02 }, 2.3)
      .to('.tour-panel-2', { autoAlpha: 0, y: -20, duration: 0.25 }, 3.2)
      .to('.tour-panel-3', { autoAlpha: 1, y: 0, duration: 0.25 }, 3.35)
      .to('.tick', { strokeDashoffset: 0, duration: 0.15, stagger: 0.2 }, 3.6)
      .to('.task-row', { opacity: 1, duration: 0.15, stagger: 0.2 }, 3.6)
      .to('.prog', { scaleX: 1, duration: 0.8 }, 3.6)
      .to({}, { duration: 0.4 });
  }, { scope: root });

  return (
    <section id="tour" ref={root} className="relative">
      <div className="mx-auto grid min-h-[100svh] max-w-6xl items-center gap-10 px-4 py-24 md:grid-cols-[1fr_1.4fr] md:py-0">
        <div>
          <p className="eyebrow">How it works</p>
          <h2 className="mt-5 text-4xl font-semibold leading-[1] tracking-[-0.04em] sm:text-5xl">From question to <span className="text-gradient">done</span>, in seconds.</h2>
          <ol className="mt-10 space-y-3">
            {steps.map((s, i) => (
              <li key={s.title} className="tour-step rounded-2xl border border-transparent p-4 opacity-40 transition-all duration-500 [&.is-active]:border-white/10 [&.is-active]:bg-white/5 [&.is-active]:opacity-100">
                <p className="font-mono text-xs text-cyan">0{i + 1}</p>
                <h3 className="mt-1 font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-mute">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="panel relative overflow-hidden bg-space-2/70 shadow-[0_40px_120px_-40px_rgba(108,92,231,.7)]" aria-label="Orbit app preview">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            {['#ff5f57', '#febc2e', '#28c840'].map((c) => <span key={c} className="h-3 w-3 rounded-full" style={{ background: c }} />)}
            <span className="ml-3 font-mono text-xs text-mute">orbit.app/workspace</span>
          </div>
          <div className="relative h-[400px] p-5 sm:p-7">
            {/* 1 · Connect */}
            <div className="tour-panel tour-panel-1 absolute inset-5 sm:inset-7">
              <p className="text-sm font-semibold">Integrations</p>
              <ul className="mt-4 space-y-2.5">
                {apps.map((a) => (
                  <li key={a} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.03] px-4 py-2.5 text-sm">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/10 font-mono text-[11px]">{a.slice(0, 2)}</span>
                    <span className="flex-1">{a}</span>
                    <span className="app-status font-mono text-[11px] text-mute">Not connected</span>
                    <span className="tg relative h-5 w-9 rounded-full bg-white/15"><span className="tg-knob absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-ice" /></span>
                  </li>
                ))}
              </ul>
            </div>
            {/* 2 · Ask */}
            <div className="tour-panel tour-panel-2 absolute inset-5 flex flex-col sm:inset-7">
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-violet/40 px-4 py-3 text-sm"><span className="typed" />&#8203;<span className="ml-0.5 inline-block h-4 w-px animate-pulse bg-ice align-middle" /></div>
              <div className="mt-4 flex max-w-[90%] gap-3">
                <span className="mt-1 h-7 w-7 shrink-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,#c9b8ff,#6c5ce7_50%,#1b1650)] shadow-[0_0_14px_rgba(108,92,231,.9)]" />
                <div className="relative rounded-2xl rounded-bl-sm bg-white/[.06] px-4 py-3 text-sm leading-relaxed">
                  <span className="thinking invisible absolute left-4 top-3 font-mono text-xs text-cyan opacity-0">Searching 6 sources…</span>
                  {answer.split(' ').map((w, i) => <span key={i} className="ans-word opacity-0 [filter:blur(4px)]">{w} </span>)}
                </div>
              </div>
              <div className="mt-auto flex flex-wrap gap-2 font-mono text-[11px] text-mute">
                {['Zendesk #4812', 'Slack · #customers', 'Gong · call 03/12'].map((s) => <span key={s} className="rounded-full border border-white/10 px-2.5 py-1">↗ {s}</span>)}
              </div>
            </div>
            {/* 3 · Act */}
            <div className="tour-panel tour-panel-3 absolute inset-5 flex flex-col sm:inset-7">
              <p className="text-sm font-semibold">Orbit is handling it</p>
              <ul className="mt-4 space-y-3">
                {tasks.map((t) => (
                  <li key={t} className="task-row flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-sm opacity-40">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.2)" strokeWidth="1.5" />
                      <path className="tick" d="M7 12.5l3.2 3.2L17 9" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
                    </svg>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <div className="flex justify-between font-mono text-xs text-mute"><span>4 tasks automated</span><span className="text-cyan">≈ 2h 14m saved</span></div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="prog h-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-violet to-cyan" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
