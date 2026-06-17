import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { RiskRadar } from "@/components/landing/RiskRadar";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main>
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <RiskRadar />
      <CTA />
      <Footer />
    </main>
  );
}
