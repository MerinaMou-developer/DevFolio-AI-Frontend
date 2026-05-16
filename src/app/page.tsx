import { CtaSection } from "@/components/features/marketing/CtaSection";
import { FeaturesSection } from "@/components/features/marketing/FeaturesSection";
import { HeroSection } from "@/components/features/marketing/HeroSection";
import { HowItWorksSection } from "@/components/features/marketing/HowItWorksSection";
import { PricingSection } from "@/components/features/marketing/PricingSection";
import { TrustBar } from "@/components/features/marketing/TrustBar";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <FeaturesSection />
      <PricingSection />
      <HowItWorksSection />
      <CtaSection />
    </>
  );
}
