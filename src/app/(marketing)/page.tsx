import { Hero } from "@/components/landing/Hero";
import { BusinessHighlights } from "@/components/landing/BusinessHighlights";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { WhyAudax } from "@/components/landing/WhyAudax";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BusinessHighlights />
      <HowItWorks />
      <WhyAudax />
      <FinalCTA />
    </>
  );
}
