import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Motion from '@/components/Motion';
import Nav from '@/components/Nav';
import CommandPalette from '@/components/CommandPalette';
import OrbCanvas from '@/components/orb/OrbCanvas';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Orbit AI | Your work, on autopilot',
  description: 'Orbit connects your tools, answers questions about your work and handles the busywork. Free for 14 days.',
  icons: { icon: '/icon.svg' },
  openGraph: { title: 'Orbit AI | Your work, on autopilot', description: 'The AI assistant that connects your whole workspace.' },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Runs before first paint: marks that JS animations will run, so the hero can pre-hide without a flash. */}
        <script dangerouslySetInnerHTML={{ __html: "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <OrbCanvas />
        <Motion />
        <Nav />
        {children}
        <CommandPalette />
      </body>
    </html>
  );
}
