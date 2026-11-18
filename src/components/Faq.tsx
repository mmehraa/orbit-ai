const faqs = [
  ['Does Orbit train on my data?', 'Never. Your data is encrypted, isolated per workspace and never used to train models: ours or anyone else’s.'],
  ['Which tools does Orbit connect to?', 'Over 200, including chat, email, docs, ticketing, CRM and cloud storage. New integrations ship every week.'],
  ['Does it respect existing permissions?', 'Yes. Orbit only shows people what they could already see in the original tool. Permissions sync in real time.'],
  ['How long does setup take?', 'Most teams are answering questions within ten minutes. Enterprise SSO setup usually takes under an hour.'],
  ['Can I cancel anytime?', 'Yes. Monthly plans cancel instantly, and yearly plans are refunded pro rata in the first 30 days.'],
];

export default function Faq() {
  return (
    <section id="faq" className="mx-auto grid max-w-6xl gap-10 px-4 py-28 md:grid-cols-[1fr_1.5fr]">
      <div>
        <p className="eyebrow" data-reveal>FAQ</p>
        <h2 data-split className="mt-5 text-5xl font-semibold leading-[1] tracking-[-0.04em]">Questions, <span className="text-gradient">answered.</span></h2>
        <p className="mt-4 text-mute" data-reveal>Tip: press <kbd className="rounded border border-white/15 px-1.5 font-mono text-xs">⌘ K</kbd> anywhere to jump around.</p>
      </div>
      <div className="space-y-3">
        {faqs.map(([q, a]) => (
          <details key={q} className="group panel px-6 py-1 open:bg-white/[.06]" data-reveal>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold [&::-webkit-details-marker]:hidden">
              {q}
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/15 text-mute transition-transform duration-300 group-open:rotate-45">+</span>
            </summary>
            <p className="pb-5 text-sm leading-relaxed text-mute">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
