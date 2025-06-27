import { FeaturesShowcaseSection } from '@/components/home/features-showcase-section';
import { HeroSection } from '@/components/home/hero-section';
import { TechnologySection } from '@/components/home/technology-section';
import { TryItNowSection } from '@/components/home/try-it-now-section';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesShowcaseSection />
      <TechnologySection />
      <TryItNowSection />
    </>
  );
}
