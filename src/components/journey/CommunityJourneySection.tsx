"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  BookOpen,
  Hammer,
  Rocket,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Gift,
  ArrowRight,
} from "lucide-react";

interface Milestone {
  id: number;
  step: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  glowClass: string;
  borderClass: string;
  description: string;
  opportunities: string[];
  benefits: string[];
}

const ROADMAP_STEPS: Milestone[] = [
  {
    id: 1,
    step: "01",
    title: "Explore",
    subtitle: "Navigate the Digital Horizon & Discover Your Domain",
    icon: Compass,
    color: "#E2E8F0",
    glowClass: "shadow-2xl",
    borderClass: "border-white/25",
    description:
      "Your journey begins by breaking out of the academic silo. In the Explore phase, members get an immersive tour across all 6 universe domains—from AI swarms and zero-to-one startups to spatial 3D UI design and kernel-level cybersecurity.",
    opportunities: [
      "Domain Discovery Bootcamps & 101 Teardowns",
      "Shadowing senior student architects during live coding sessions",
      "Curated learning maps and beginner-friendly sandbox repositories",
    ],
    benefits: [
      "Access to our private Discord & Guild matrix",
      "Starter TechPass ID badge with 'Explorer' status",
      "Weekly newsletter breaking down industry trends and insider tools",
    ],
  },
  {
    id: 2,
    step: "02",
    title: "Learn",
    subtitle: "Master High-Leverage Architecture & Production Tooling",
    icon: BookOpen,
    color: "#CBD5E1",
    glowClass: "shadow-2xl",
    borderClass: "border-white/25",
    description:
      "Transition from surface-level tutorials to building production-grade infrastructure. Here, we pair you with domain leads who challenge you with real engineering problems, code reviews, and architectural deep dives.",
    opportunities: [
      "Intensive 6-week Domain Guild fellowships",
      "Peer code reviews and live refactoring workshops",
      "Hands-on practice with enterprise stacks (Next.js, PyTorch, Rust, Docker)",
    ],
    benefits: [
      "1-on-1 mentorship sessions with staff-level student builders",
      "Free access to paid educational resources and API tokens",
      "Verified skill endorsement chips on your digital TechPass",
    ],
  },
  {
    id: 3,
    step: "03",
    title: "Build",
    subtitle: "Forge Disruptive MVPs & Open-Source Infrastructure",
    icon: Hammer,
    color: "#F8FAFC",
    glowClass: "shadow-2xl",
    borderClass: "border-white/25",
    description:
      "The defining moment of a Techies member. You stop consuming and begin creating. In the Build phase, you team up with complementary co-founders—designers, AI engineers, and full-stack devs—to build real products under extreme time constraints.",
    opportunities: [
      "48-Hour Weekend Hackathons with $10,000+ prize pools",
      "Co-founder matchmaking events to find your ideal technical/business partner",
      "Open-source bounties to contribute directly to flagship community projects",
    ],
    benefits: [
      "Over $50,000 in free startup credits (AWS, Stripe, Supabase, Notion)",
      "Beta testing syndicate: Instantly get 500+ student testers for your app",
      "Dedicated build room channels and automated CI/CD pipeline support",
    ],
  },
  {
    id: 4,
    step: "04",
    title: "Launch",
    subtitle: "Command Distribution, Fundraise & Scale to Millions",
    icon: Rocket,
    color: "#E2E8F0",
    glowClass: "shadow-2xl",
    borderClass: "border-white/25",
    description:
      "Bring your creation to the world stage. Whether pitching to seed venture capital partners, launching on Product Hunt, or publishing viral engineering breakdowns, the Launch phase transforms your project into a high-growth reality.",
    opportunities: [
      "Techies Demo Day: Pitch live to tier-1 seed VCs and active angel syndicates",
      "Product Hunt Launch War-Room with guaranteed front-page community boost",
      "Fast-track introductions to top accelerator programs (YC, Techstars)",
    ],
    benefits: [
      "Alumni network lifetime membership and angel investment access",
      "Media and PR coverage across major developer publications and YouTube shows",
      "Omni-Builder verification badge on your TechPass credential",
    ],
  },
];

export default function CommunityJourneySection() {
  const [activeStep, setActiveStep] = useState<number>(1);

  const currentMilestone = ROADMAP_STEPS.find((s) => s.id === activeStep) || ROADMAP_STEPS[0];
  const Icon = currentMilestone.icon;

  return (
    <section id="roadmap" className="relative w-full py-20 sm:py-28 px-4 sm:px-8 overflow-hidden bg-[#030509]">
      <div className="section-divider" />
      {/* Ambient glow overlay */}
      <div className="pointer-events-none absolute inset-0 section-ambient opacity-75" />

      {/* Section Header */}
      <div className="relative z-10 mx-auto max-w-4xl text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="mb-5 flex justify-center"
        >
          <span className="section-eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse" />
            Community Roadmap
          </span>
        </motion.div>

        {/* Crisp clean typography matching TechPass style */}
        <h2 className="font-jakarta text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
          The Community{" "}
          <span className="headline-gradient">
            Journey
          </span>
        </h2>

        <p className="mt-4 font-inter text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          We have engineered a systematic, high-leverage progression designed to transform curious explorers into industry-shaping founders and engineers.
        </p>
      </div>

      {/* Roadmap Navigation Path Bar */}
      <div className="relative z-10 mx-auto max-w-6xl mb-10">
        <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-white/10 rounded-full hidden sm:block">
          <motion.div
            className="h-full bg-gradient-to-r from-white via-slate-300 to-slate-500 shadow-[0_0_12px_rgba(255,255,255,0.1)] rounded-full"
            initial={{ width: "25%" }}
            animate={{ width: `${(activeStep / ROADMAP_STEPS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 relative z-10">
          {ROADMAP_STEPS.map((milestone) => {
            const MIcon = milestone.icon;
            const isActive = activeStep === milestone.id;

            return (
              <button
                key={milestone.id}
                onClick={() => setActiveStep(milestone.id)}
                className={`group flex flex-col items-center justify-center rounded-[28px] border p-6 text-center transition-all duration-300 ${
                  isActive
                    ? "border-white/30 bg-white/[0.08] shadow-xl scale-105 backdrop-blur-md"
                    : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05] backdrop-blur-md"
                }`}
              >
                <div
                  className={`mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl border transition-all ${
                    isActive
                      ? "border-white/30 bg-white/[0.12] shadow-md scale-110 text-white"
                      : "border-white/15 bg-white/[0.06] group-hover:border-white/25 text-slate-400"
                  }`}
                >
                  <MIcon className="h-6 w-6" />
                </div>

                <span className="font-inter text-[10px] font-bold tracking-widest uppercase text-slate-400">
                  PHASE {milestone.step}
                </span>
                <span
                  className={`mt-1.5 font-inter text-lg font-bold ${
                    isActive ? "text-white" : "text-slate-300"
                  }`}
                >
                  {milestone.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expanded Milestone Details Panel (Colorless Frosted Glass matching TechPass card) */}
      <div className="relative z-10 mx-auto max-w-6xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMilestone.id}
            initial={{ opacity: 0, y: 25, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="overflow-hidden rounded-[32px] border border-white/15 bg-white/[0.04] p-8 sm:p-12 backdrop-blur-2xl shadow-2xl"
          >
            <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
              {/* Left Column: Title & Description */}
              <div className="md:w-1/2 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.05] shadow-lg text-white">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div>
                    <span className="font-inter text-xs font-bold uppercase tracking-widest text-slate-400">
                      PHASE {currentMilestone.step} OF 04
                    </span>
                    <h3 className="font-jakarta text-3xl font-extrabold text-white">
                      {currentMilestone.title}
                    </h3>
                  </div>
                </div>

                <p className="font-inter text-base font-semibold text-slate-300">
                  {currentMilestone.subtitle}
                </p>

                <p className="font-inter text-sm sm:text-base leading-relaxed text-slate-300 font-normal">
                  {currentMilestone.description}
                </p>

                <div className="pt-4">
                  {/* Crisp physical/pill action button matching TechPass buttons */}
                  <button
                    onClick={() => {
                      if (activeStep < 4) setActiveStep(activeStep + 1);
                      else setActiveStep(1);
                    }}
                    className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-200 px-7 py-3.5 font-inter text-xs font-bold tracking-wider text-neutral-950 shadow-md transition-all hover:scale-105"
                  >
                    <span>{activeStep < 4 ? `PROCEED TO PHASE 0${activeStep + 1}` : "RECYCLE ROADMAP"}</span>
                    <ArrowRight className="h-4 w-4 text-neutral-950 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>

              {/* Right Column: Opportunities & Benefits Grid */}
              <div className="md:w-1/2 space-y-6">
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md">
                  <h4 className="flex items-center gap-2 font-inter text-xs font-bold uppercase tracking-widest text-slate-300">
                    <TrendingUp className="h-4 w-4 text-white" />
                    <span>Domain Opportunities</span>
                  </h4>
                  <ul className="mt-4 space-y-3">
                    {currentMilestone.opportunities.map((opp, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 font-normal">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-white shrink-0" />
                        <span>{opp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md">
                  <h4 className="flex items-center gap-2 font-inter text-xs font-bold uppercase tracking-widest text-slate-300">
                    <Gift className="h-4 w-4 text-white" />
                    <span>Exclusive Community Benefits</span>
                  </h4>
                  <ul className="mt-4 space-y-3">
                    {currentMilestone.benefits.map((ben, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 font-normal">
                        <Sparkles className="mt-0.5 h-4 w-4 text-white shrink-0" />
                        <span>{ben}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

