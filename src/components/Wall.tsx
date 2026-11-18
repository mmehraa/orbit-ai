const quotes = [
  ['Maya Chen', 'Head of Ops, Northwind', 'Orbit replaced three tools and about forty Slack messages a day. Our onboarding doc is now just "ask Orbit".'],
  ['Daniel Okoro', 'CTO, Quanta', 'The integrations took literally four minutes. The answers cite their sources, which is why my team actually trusts it.'],
  ['Sofia Ruiz', 'Founder, Halcyon', 'I asked "what did we promise customers last quarter?" and got a perfect list with links. Unreal.'],
  ['Leo Park', 'PM, Parallax', 'Weekly status reports went from a two-hour chore to a two-minute review.'],
  ['Amara Singh', 'Support Lead, Meridian', 'Tickets get triaged and summarised before I open my laptop. Response times are down 41%.'],
  ['Tom Becker', 'Eng Manager, Cobalt', 'Finally an AI tool that respects permissions. Security signed off in a day.'],
  ['Hana Ito', 'Designer, Lumen Labs', 'It found the one Figma comment from March that explained everything. I nearly cried.'],
  ['Chris Mendes', 'COO, Vertex & Co', 'We rolled it out to 300 people. Adoption was 90% in the first week. That never happens.'],
  ['Priya Nair', 'Sales Director, Quanta', 'Call notes, follow-ups and CRM updates now happen on their own. My reps are selling again.'],
];

function Card({ q }: { q: string[] }) {
  return (
    <figure className="panel mb-4 p-5">
      <blockquote className="text-sm leading-relaxed text-ice/90">“{q[2]}”</blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet to-cyan text-xs font-bold">{q[0]!.split(' ').map((p) => p[0]).join('')}</span>
        <span className="text-xs"><b className="block text-sm text-ice">{q[0]}</b><span className="text-mute">{q[1]}</span></span>
      </figcaption>
    </figure>
  );
}

/** Testimonial wall: three columns drifting upward at different speeds (pure CSS), paused on hover. */
export default function Wall() {
  const cols = [quotes.slice(0, 3), quotes.slice(3, 6), quotes.slice(6, 9)];
  return (
    <section className="mx-auto max-w-6xl px-4 py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow" data-reveal>Loved by teams</p>
        <h2 data-split className="mt-5 text-5xl font-semibold leading-[1] tracking-[-0.04em] sm:text-6xl">Don&apos;t take <span className="text-gradient">our word</span> for it.</h2>
      </div>
      <div className="relative mt-14 grid h-[620px] gap-4 overflow-hidden [mask-image:linear-gradient(transparent,#000_15%,#000_85%,transparent)] sm:grid-cols-2 lg:grid-cols-3">
        {cols.map((col, i) => (
          <div key={i} className={`wall-col ${i === 2 ? 'hidden lg:block' : i === 1 ? 'hidden sm:block' : ''}`} style={{ animationDuration: `${[38, 52, 44][i]}s` }}>
            {[...col, ...col].map((q, k) => <div key={k} aria-hidden={k >= col.length}><Card q={q} /></div>)}
          </div>
        ))}
      </div>
      <style>{`
        .wall-col { animation: wall linear infinite; }
        .wall-col:hover { animation-play-state: paused; }
        @keyframes wall { to { transform: translateY(-50%); } }
      `}</style>
    </section>
  );
}
