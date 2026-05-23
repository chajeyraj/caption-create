import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeaturedSection } from "@/components/FeaturedSection";
import { CategorySection } from "@/components/CategorySection";
import { Footer } from "@/components/Footer";
import { CursorGlow } from "@/components/CursorGlow";
import { SectionDivider } from "@/components/SectionDivider";

const Index = () => {
  useEffect(() => {
    document.title = "CaptionCrafter — Unleash Your Words";
  }, []);

  return (
    <div className="min-h-screen">
      {/* Ambient cursor glow — only on desktop (pointer: fine) */}
      <CursorGlow />

      <Navbar />
      <Hero />

      {/* Animated gradient thread between sections */}
      <SectionDivider color="both" />

      <FeaturedSection />

      <SectionDivider color="violet" />

      <CategorySection />

      <SectionDivider color="amber" />

      <Footer />
    </div>
  );
};

export default Index;
