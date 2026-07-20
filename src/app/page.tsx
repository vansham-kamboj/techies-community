import React from "react";
import LandingSection from "@/components/hero/LandingSection";
import TechiesUniverseSection from "@/components/universe/TechiesUniverseSection";
import PathLessChosenSection from "@/components/storytelling/PathLessChosenSection";
import TechPassSection from "@/components/techpass/TechPassSection";
import CommunityJourneySection from "@/components/journey/CommunityJourneySection";
import CommunityHighlightsSection from "@/components/highlights/CommunityHighlightsSection";

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-[#030509] text-white selection:bg-white/20 selection:text-white">
      {/* 1. Hero Landing Section */}
      <LandingSection />

      {/* 2. Signature 3D Techies Universe Galaxy Section */}
      <TechiesUniverseSection />

      {/* 3. Cinematic Scroll Storytelling Section */}
      <PathLessChosenSection />

      {/* 4. Futuristic TechPass Identity Card Generator */}
      <TechPassSection />

      {/* 5. Interactive Roadmap & Community Journey */}
      <CommunityJourneySection />

      {/* 6. Premium Community Highlights & Showcase */}
      <CommunityHighlightsSection />
    </div>
  );
}
