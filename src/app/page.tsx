import React from "react";
import LandingSection from "@/components/hero/LandingSection";
import TechiesUniverseSection from "@/components/universe/TechiesUniverseSection";
import AboutTechiesSection from "@/components/about/AboutTechiesSection";
import TechPassSection from "@/components/techpass/TechPassSection";
import FuturisticFAQSection from "@/components/faq/FuturisticFAQSection";
import CommunityHighlightsSection from "@/components/highlights/CommunityHighlightsSection";

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-[#030509] text-white selection:bg-white/20 selection:text-white">
      {/* 1. Hero Landing Section */}
      <LandingSection />

      {/* 2. Signature 3D Techies Universe Galaxy Section */}
      <TechiesUniverseSection />

      {/* 3. Premium Asymmetrical About Techies Section */}
      <AboutTechiesSection />

      {/* 4. Futuristic TechPass Identity Card Generator */}
      <TechPassSection />

      {/* 5. Futuristic Expandable FAQ Experience */}
      <FuturisticFAQSection />

      {/* 6. Premium Community Highlights & Showcase */}
      <CommunityHighlightsSection />
    </div>
  );
}
