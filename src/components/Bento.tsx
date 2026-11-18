'use client';

import { useRef } from 'react';

/* Feature grid. Each card has its own tiny looping animation, and a glowing border that follows the cursor. */

function ChatDemo() {
  return (
    <div className="mt-6 space-y-2 text-left text-xs">
      <p className="ml-auto w-fit rounded-2xl rounded-br-sm bg-violet/40 px-3 py-2">What did we ship last sprint?</p>
      <div className="relative w-4/5 rounded-2xl rounded-bl-sm bg-white/10 px-3 py-2">
        <span className="chat-typing absolute left-3 top-2.5 flex gap-1">{[0, 1, 2].map((i) => <i key={i} className="h-1.5 w-1.5 rounded-full bg-mute" style={{ animationDelay: `${i * 0.15}s` }} />)}</span>
        <span className="chat-answer block">14 issues closed: new billing page, faster search and 3 bug fixes. Summary sent to #eng.</span>
      </div>
    </div>
  );
}

function SummaryDemo() {
  return (
    <div className="mt-6 space-y-2">
      {[100, 90, 95, 70].map((w, i) => <div key={i} className="summary-line h-2 rounded-full bg-white/15" style={{ width: `${w}%`, animationDelay: `${i * 0.1}s` }} />)}
      <div className="summary-result h-2 w-3/5 rounded-full bg-gradient-to-r from-violet to-cyan" />
    </div>
  );
}

function OrbitDemo() {
  const apps = ['Sl', 'Gm', 'No', 'Li', 'Dr', 'Hu'];
  return (
    <div className="relative mx-auto mt-4 h-40 w-40">
      <div className="absolute inset-0 rounded-full border border-dashed border-white/15" />
      <div className="absolute inset-8 rounded-full border border-dashed border-white/10" />
      <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#c9b8ff,#6c5ce7_50%,#1b1650)] shadow-[0_0_30px_rgba(108,92,231,.8)]" />
      <div className="orbit absolute inset-0">
        {apps.map((a, i) => (
          <span key={a} className="absolute left-1/2 top-1/2 -ml-4 -mt-4 grid h-8 w-8 place-items-center rounded-lg border border-white/15 bg-space-2 font-mono text-[10px]"
                style={{ transform: `rotate(${i * 60}deg) translate(80px) rotate(-${i * 60}deg)` }}>
            <span className="counter-orbit">{a}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function ChartDemo() {
  return (
    <div className="mt-6 flex h-28 items-end gap-2">
      {[40, 65, 50, 80, 60, 95, 75].map((h, i) => (
        <div key={i} className="bar flex-1 origin-bottom rounded-t-md bg-gradient-to-t from-violet/40 to-cyan" style={{ height: `${h}%`, animationDelay: `${i * 0.12}s` }} />
      ))}
    </div>
  );
}

function ShieldDemo() {
  return (
    <div className="relative mx-auto mt-4 h-32 w-28 overflow-hidden">
      <svg viewBox="0 0 24 28" className="h-full w-full" fill="none" stroke="url(#sg)" strokeWidth="1.2" aria-hidden="true">
        <defs><linearGradient id="sg" x1="0" x2="1"><stop stopColor="#6c5ce7" /><stop offset="1" stopColor="#00d4ff" /></linearGradient></defs>
        <path d="M12 1l10 4v8c0 6.5-4.3 11.5-10 14C6.3 24.5 2 19.5 2 13V5z" />
        <path d="M8 14l3 3 5-6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="scan absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-cyan/30 to-transparent" />
    </div>
  );
}

function SpeedDemo() {
  return (
    <div className="relative mx-auto mt-4 grid h-32 w-32 place-items-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,.1)" strokeWidth="6" fill="none" />
        <circle cx="50" cy="50" r="42" stroke="url(#gg)" strokeWidth="6" fill="none" strokeLinecap="round" pathLength="100" className="gauge" />
        <defs><linearGradient id="gg"><stop stopColor="#6c5ce7" /><stop offset="1" stopColor="#00d4ff" /></linearGradient></defs>
      </svg>
      <p className="font-mono text-2xl font-semibold">128<span className="text-xs text-mute">ms</span></p>
    </div>
  );
}

const cards = [
  { title: 'Ask anything', body: 'Questions across Slack, docs and tickets, answered in plain English with sources.', demo: <ChatDemo />, span: 'md:col-span-2' },
  { title: 'Auto-summaries', body: 'Long threads and meetings boiled down to what matters.', demo: <SummaryDemo />, span: '' },
  { title: '200+ integrations', body: 'Connect your stack in two clicks. No engineers needed.', demo: <OrbitDemo />, span: 'md:row-span-2' },
  { title: 'Live insights', body: 'Spot trends in your work before they become problems.', demo: <ChartDemo />, span: '' },
  { title: 'Private by design', body: 'Your data never trains our models. SOC 2 Type II and GDPR ready.', demo: <ShieldDemo />, span: '' },
  { title: 'Ridiculously fast', body: 'Median answer time of 128 ms on our edge network.', demo: <SpeedDemo />, span: 'md:col-span-2 lg:col-span-1' },
];

export default function Bento() {
  const grid = useRef<HTMLDivElement>(null);
  // One listener for the whole grid: each card gets the cursor position relative to itself.
  const onMove = (e: React.PointerEvent) => {
    grid.current?.querySelectorAll<HTMLElement>('.glow').forEach((c) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--x', `${e.clientX - r.left}px`);
      c.style.setProperty('--y', `${e.clientY - r.top}px`);
    });
  };

  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-28 md:py-40">
      <div className="max-w-2xl">
        <p className="eyebrow" data-reveal>Features</p>
        <h2 data-split className="mt-5 text-5xl font-semibold leading-[1] tracking-[-0.04em] sm:text-6xl">One assistant. <span className="text-gradient">Every tool.</span></h2>
        <p className="mt-5 text-lg text-mute" data-reveal>Orbit sits on top of the apps you already use and turns scattered information into answers and actions.</p>
      </div>
      <div ref={grid} onPointerMove={onMove} className="mt-14 grid auto-rows-[minmax(260px,auto)] gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <article key={c.title} data-reveal className={`glow panel flex flex-col overflow-hidden p-6 ${c.span}`}>
            <h3 className="text-lg font-semibold">{c.title}</h3>
            <p className="mt-1.5 text-sm text-mute">{c.body}</p>
            <div className="mt-auto">{c.demo}</div>
          </article>
        ))}
      </div>
      <style>{`
        .chat-typing i { animation: bounce 1s infinite; }
        .chat-typing { animation: typing 6s infinite; }
        .chat-answer { animation: answer 6s infinite; }
        @keyframes bounce { 50% { transform: translateY(-3px); opacity: .5; } }
        @keyframes typing { 0%, 30% { opacity: 1; } 35%, 100% { opacity: 0; } }
        @keyframes answer { 0%, 33% { opacity: 0; filter: blur(4px); } 40%, 92% { opacity: 1; filter: blur(0); } 100% { opacity: 0; } }
        .summary-line { animation: collapse 5s ease-in-out infinite; transform-origin: left; }
        .summary-result { animation: result 5s ease-in-out infinite; transform-origin: left; }
        @keyframes collapse { 0%, 25% { transform: scaleX(1); opacity: 1; } 45%, 85% { transform: scaleX(.15); opacity: .15; } 100% { transform: scaleX(1); opacity: 1; } }
        @keyframes result { 0%, 35% { transform: scaleX(0); } 55%, 85% { transform: scaleX(1); } 100% { transform: scaleX(0); } }
        .orbit { animation: spin 18s linear infinite; }
        .counter-orbit { display: inline-block; animation: spin 18s linear infinite reverse; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .bar { animation: grow 3s ease-in-out infinite alternate; }
        @keyframes grow { from { transform: scaleY(.25); } to { transform: scaleY(1); } }
        .scan { animation: scan 2.4s ease-in-out infinite; top: -2rem; }
        @keyframes scan { to { top: 100%; } }
        .gauge { stroke-dasharray: 100; animation: gauge 3s cubic-bezier(.22,1,.36,1) infinite; }
        @keyframes gauge { 0% { stroke-dashoffset: 100; } 60%, 100% { stroke-dashoffset: 12; } }
      `}</style>
    </section>
  );
}
