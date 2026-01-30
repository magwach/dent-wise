import CTA from "@/components/landing/cta";
import Footer from "@/components/landing/footer";
import Header from "@/components/landing/header";
import Hero from "@/components/landing/hero";
import HowItWorks from "@/components/landing/how.it.works";
import PricingSection from "@/components/landing/pricing.section";
import WhatToAsk from "@/components/landing/what.to.ask";

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <HowItWorks />
      <WhatToAsk />
      <PricingSection />
      <CTA />
      <Footer />
    </div>
  );
}
