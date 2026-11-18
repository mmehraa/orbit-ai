'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { scrollToId } from './Motion';

interface Cmd { id: string; label: string; hint: string; group: string; run: () => void }

/** ⌘K / Ctrl+K command palette: jump to sections, flip billing, copy email. Fully keyboard driven. */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState('');
  const input = useRef<HTMLInputElement>(null);

  const commands = useMemo<Cmd[]>(() => [
    { id: 'features', label: 'Go to Features', hint: 'Section', group: 'Navigate', run: () => scrollToId('features') },
    { id: 'tour', label: 'Take the product tour', hint: 'Section', group: 'Navigate', run: () => scrollToId('tour') },
    { id: 'pricing', label: 'See pricing', hint: 'Section', group: 'Navigate', run: () => scrollToId('pricing') },
    { id: 'faq', label: 'Read the FAQ', hint: 'Section', group: 'Navigate', run: () => scrollToId('faq') },
    { id: 'cta', label: 'Join the waitlist', hint: 'Section', group: 'Navigate', run: () => scrollToId('cta') },
    { id: 'top', label: 'Back to top', hint: 'Section', group: 'Navigate', run: () => scrollToId('top') },
    { id: 'billing', label: 'Toggle monthly / yearly pricing', hint: 'Action', group: 'Actions', run: () => { window.dispatchEvent(new Event('orbit:billing')); scrollToId('pricing'); } },
    { id: 'email', label: 'Copy sales email', hint: 'Action', group: 'Actions', run: () => { navigator.clipboard?.writeText('hello@orbit-ai.example'); flash('Copied hello@orbit-ai.example'); } },
  ], []);

  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(''), 2200); }

  const list = commands.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o); }
      if (e.key === 'Escape') setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('orbit:palette', onOpen);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('orbit:palette', onOpen); };
  }, []);

  // The input is always mounted (only faded out), so it can take focus immediately and no keystrokes are lost.
  useEffect(() => { if (open) { setQ(''); setActive(0); input.current?.focus(); } else input.current?.blur(); }, [open]);
  useEffect(() => setActive(0), [q]);

  const run = (c?: Cmd) => { if (!c) return; setOpen(false); setTimeout(c.run, 120); };

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(list.length - 1, a + 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    if (e.key === 'Enter') { e.preventDefault(); run(list[active]); }
  };

  return (
    <>
      <div className={`fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[18vh] transition-opacity duration-200 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`} aria-hidden={!open}>
        <div className="absolute inset-0 bg-space/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <div role="dialog" aria-modal="true" aria-label="Command palette"
             className={`panel relative w-full max-w-lg overflow-hidden bg-space-2/90 shadow-[0_30px_80px_-20px_rgba(108,92,231,.6)] transition-transform duration-300 ${open ? 'scale-100' : 'scale-95'}`}>
          <div className="flex items-center gap-3 border-b border-white/10 px-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-mute" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
            <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onListKey} placeholder="Type a command or search…"
                   className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-mute" aria-label="Search commands" aria-controls="cmd-list" aria-activedescendant={list[active] ? `cmd-${list[active]!.id}` : undefined} />
            <kbd className="rounded border border-white/15 px-1.5 py-0.5 font-mono text-[10px] text-mute">ESC</kbd>
          </div>
          <ul id="cmd-list" role="listbox" className="max-h-80 overflow-y-auto p-2" data-lenis-prevent>
            {list.length === 0 && <li className="px-3 py-6 text-center text-sm text-mute">No results for “{q}”</li>}
            {list.map((c, i) => (
              <li key={c.id} id={`cmd-${c.id}`} role="option" aria-selected={i === active}
                  onMouseEnter={() => setActive(i)} onClick={() => run(c)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors ${i === active ? 'bg-violet/25 text-ice' : 'text-ice/80'}`}>
                <span>{c.label}</span><span className="font-mono text-[11px] text-mute">{c.hint}</span>
              </li>
            ))}
          </ul>
          <p className="flex gap-4 border-t border-white/10 px-4 py-2.5 font-mono text-[11px] text-mute"><span>↑↓ navigate</span><span>↵ run</span><span>⌘K toggle</span></p>
        </div>
      </div>
      <div role="status" className={`fixed bottom-6 left-1/2 z-[101] -translate-x-1/2 rounded-full bg-ice px-4 py-2 text-sm font-semibold text-space transition-all duration-300 ${toast ? 'opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}>{toast}</div>
    </>
  );
}
