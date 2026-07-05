import { Hero } from "@/components/landing/Hero";
import { ServicesShowcase } from "@/components/landing/ServicesShowcase";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { WhyAudax } from "@/components/landing/WhyAudax";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesShowcase />
      <HowItWorks />
      <WhyAudax />
      <FinalCTA />
    </>
  );
}
