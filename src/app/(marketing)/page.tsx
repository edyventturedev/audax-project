import { Hero } from "@/components/landing/Hero";
import { PromoBanner } from "@/components/landing/PromoBanner";
import { BusinessHighlights } from "@/components/landing/BusinessHighlights";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { WhyAudax } from "@/components/landing/WhyAudax";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PromoBanner />
      <BusinessHighlights />
      <HowItWorks />
      <WhyAudax />
      <FinalCTA />
    </>
  );
}
