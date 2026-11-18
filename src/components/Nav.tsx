'use client';

import { useEffect, useState } from 'react';
import { scrollToId } from './Motion';

const links = [['Features', 'features'], ['Product', 'tour'], ['Pricing', 'pricing'], ['FAQ', 'faq']] as const;

export function Logo() {
  return (
    <span className="flex items-center gap-2 text-lg font-semibold tracking-tight">
      <span className="relative h-6 w-6 rounded-full bg-[radial-gradient(circle_at_35%_30%,#c9b8ff,#6c5ce7_45%,#0a0b1e_75%)] shadow-[0_0_18px_rgba(108,92,231,.9)]">
        <span className="absolute inset-[-4px] rounded-full border border-violet/50" />
      </span>
      Orbit
    </span>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mac, setMac] = useState(true);
  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.platform));
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <div className={`mx-auto flex max-w-6xl items-center gap-4 rounded-full px-4 py-2.5 transition-all duration-500 ${scrolled ? 'panel bg-space/60' : ''}`}>
        <a href="#" onClick={(e) => { e.preventDefault(); scrollToId('top'); }} aria-label="Orbit home"><Logo /></a>
        <nav className="ml-6 hidden gap-1 md:flex" aria-label="Main">
          {links.map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollToId(id); }} className="rounded-full px-3 py-1.5 text-sm text-mute transition-colors hover:bg-white/5 hover:text-ice">{label}</a>
          ))}
        </nav>
        <button onClick={() => window.dispatchEvent(new Event('orbit:palette'))} className="ml-auto hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-mute transition-colors hover:text-ice sm:flex" aria-label="Open command palette">
          Search <kbd className="rounded border border-white/15 px-1 font-mono">{mac ? '⌘' : 'Ctrl'} K</kbd>
        </button>
        <a href="#cta" onClick={(e) => { e.preventDefault(); scrollToId('cta'); }} className="btn ml-auto !px-4 !py-2 sm:ml-0">Get started</a>
      </div>
    </header>
  );
}
