import Hero from '@/components/Hero';
import Bento from '@/components/Bento';
import Tour from '@/components/Tour';
import Stats from '@/components/Stats';
import Wall from '@/components/Wall';
import Pricing from '@/components/Pricing';
import Faq from '@/components/Faq';
import FinalCta from '@/components/FinalCta';

export default function Home() {
  return (
    <main>
      <Hero />
      <Bento />
      <Tour />
      <Stats />
      <Wall />
      <Pricing />
      <Faq />
      <FinalCta />
    </main>
  );
}
