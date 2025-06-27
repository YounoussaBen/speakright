import { FeaturesShowcaseSection } from '@/components/features-showcase-section';
import { HeroSection } from '@/components/hero-section';
import { TechnologySection } from '@/components/technology-section';
import { TryItNowSection } from '@/components/try-it-now-section';

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
