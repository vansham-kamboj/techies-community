"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Terminal,
  Compass,
  Cpu,
  Flame,
  ArrowRight,
  CheckCircle2,
  Code2,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface ManifestoPillar {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  quote: string;
  description: string;
  keyPrinciples: string[];
  icon: React.ComponentType<{ className?: string }>;
  codeSnippet: string;
  badge: string;
}

const MANIFESTO_PILLARS: ManifestoPillar[] = [
  {
    id: "unmapped",
    number: "01",
    title: "Beyond Instructions",
    subtitle: "We reject the waiting room of permission.",
    quote: "Most people wait for a syllabus, a tutorial, or a roadmap. We thrive in the unmapped territory where real breakthroughs happen.",
    description:
      "True innovation cannot be found in standardized textbooks. When faced with an undocumented API, a broken compiler, or an unattempted architecture, we don't wait for somebody else to publish a guide. We dive deep into the source code, inspect the kernel, and engineer the solution ourselves.",
    keyPrinciples: [
      "No permission required to start experimenting",
      "Deconstruct broken systems instead of complaining about them",
      "Learn by building production-grade prototypes from Day 1",
    ],
    icon: Compass,
    badge: "AUTONOMOUS MINDSET",
    codeSnippet: `// Standard approach: wait for tutorial
// Techies approach: inspect & build directly
async function exploreUnmappedDomain(idea: Idea) {
  const prototype = await buildFromScratch(idea);
  const feedback = await deployToUsers(prototype);
  return iterateUntilMastery(feedback);
}`,
  },
  {
    id: "enduring",
    number: "02",
    title: "Signal Over Hype",
    subtitle: "We build enduring systems, not fleeting trends.",
    quote: "Hype cycles come and go every few months. We focus on foundational principles, high-concurrency systems, and technologies that last.",
    description:
      "While the internet chases the buzzword of the week, we master the underlying mechanics: memory-safe Rust engineering, low-latency network protocols, distributed consensus, and clean mathematical models. When you understand the foundation, every new tool becomes effortless to master.",
    keyPrinciples: [
      "Master system primitives over superficial wrappers",
      "Prioritize sub-millisecond latency and architectural elegance",
      "Build tools that remain valuable across technological shifts",
    ],
    icon: Cpu,
    badge: "DEEP ENGINEERING",
    codeSnippet: `// Focus on core primitives and performance
struct AetherNode {
    id: UUID,
    consensus_state: Arc<Mutex<State>>,
    throughput_fps: u64,
}

impl AetherNode {
    pub fn verify_integrity(&self) -> bool { true }
}`,
  },
  {
    id: "ship",
    number: "03",
    title: "Zero to One Impact",
    subtitle: "Ideas are abundant; execution is the sole currency.",
    quote: "We don't just debate architecture in group chats. We write the code, deploy the swarms, and launch real products to real users.",
    description:
      "The ultimate test of any philosophy is whether it compiles and runs in the real world. Every member of our community is measured by what they ship. From weekend hackathon MVPs to high-star open-source repositories, we transform abstract imagination into tangible software.",
    keyPrinciples: [
      "Ship working software under tight constraints",
      "Embrace public feedback and rapid iteration loops",
      "Open-source our core tools to elevate the global ecosystem",
    ],
    icon: Flame,
    badge: "RELENTLESS EXECUTION",
    codeSnippet: `// Relentless shipping pipeline
const project = new TechiesProject({
  name: "Autonomous RAG Engine",
  status: "PRODUCTION_LIVE",
  latencyMs: 42,
  usersServed: 10420,
});
project.broadcastToCommunity();`,
  },
  {
    id: "sanctuary",
    number: "04",
    title: "Society of Builders",
    subtitle: "Surround yourself with obsessive, high-agency peers.",
    quote: "You become the average of the people you build with. Find the ones who stay up until midnight fixing a race condition simply out of curiosity.",
    description:
      "Building the future can be lonely when you are surrounded by passivity. Techies is a high-velocity sanctuary for passionate creators, researchers, and founders who push each other to higher standards without ego or corporate politics.",
    keyPrinciples: [
      "High-agency collaboration without hierarchy or bureaucracy",
      "Uncensored peer code reviews and architectural audits",
      "Radical generosity in sharing knowledge and opportunities",
    ],
    icon: Code2,
    badge: "COLLECTIVE EXCELLENCE",
    codeSnippet: `// The core syndicate bond
const guild = createGuild({
  members: ["AI Researchers", "Rust Systems Devs", "Spatial Designers"],
  culture: "Ego-Free & High-Velocity",
  mission: "Build Beyond Boundaries",
});`,
  },
];

export default function PathLessChosenSection() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const currentPillar = MANIFESTO_PILLARS[activeTab];
  const Icon = currentPillar.icon;

  return (
    <section id="story" className="relative w-full py-20 sm:py-28 px-4 sm:px-8 bg-[#030509] overflow-hidden">
      <div className="section-divider" />
      {/* Ambient glow overlay */}
      <div className="pointer-events-none absolute inset-0 section-ambient opacity-80" />

      {/* Subtle background noise grid */}
      <div className="pointer-events-none absolute inset-0 noise-bg opacity-30" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-5 flex justify-center"
          >
            <span className="section-eyebrow">
              <Sparkles className="h-3 w-3 text-slate-300 animate-pulse" />
              The Path Less Chosen
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-jakarta text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.12]"
          >
            We Don&apos;t Follow Predictions. <br className="hidden sm:block" />
            We <span className="headline-gradient">Build Them.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 font-inter text-base sm:text-lg text-slate-300 font-normal leading-relaxed"
          >
            For those who believe there is more to technology than simply following the expected path. Here is the four-part manifesto that drives everything we do.
          </motion.p>
        </div>

        {/* Interactive Manifesto Pillars Grid / Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Pillar Selector (4 cards) */}
          <div className="lg:col-span-5 flex flex-col gap-3.5">
            {MANIFESTO_PILLARS.map((pillar, index) => {
              const PillarIcon = pillar.icon;
              const isActive = activeTab === index;

              return (
                <button
                  key={pillar.id}
                  onClick={() => setActiveTab(index)}
                  className={`group relative text-left rounded-2xl border p-5 sm:p-6 transition-all duration-300 ${
                    isActive
                      ? "border-white/40 bg-white/[0.08] shadow-glass-lg backdrop-blur-xl scale-[1.02]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.05] backdrop-blur-md"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${
                          isActive
                            ? "border-white/30 bg-white/15 text-white shadow-md"
                            : "border-white/10 bg-white/5 text-slate-400 group-hover:text-white group-hover:border-white/20"
                        }`}
                      >
                        <PillarIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-inter text-[11px] font-bold tracking-widest text-slate-400">
                            PILLAR {pillar.number}
                          </span>
                          {isActive && (
                            <span className="h-1.5 w-1.5 rounded-full bg-aurora-cyan animate-pulse shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
                          )}
                        </div>
                        <h3 className={`font-jakarta text-lg font-bold transition-colors ${isActive ? "text-white" : "text-slate-200"}`}>
                          {pillar.title}
                        </h3>
                      </div>
                    </div>

                    <ArrowRight
                      className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
                        isActive ? "text-white translate-x-1" : "text-slate-500 group-hover:text-slate-300"
                      }`}
                    />
                  </div>
                  <p className="mt-2.5 font-inter text-xs sm:text-sm text-slate-400 line-clamp-1 pl-14.5">
                    {pillar.subtitle}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Column: Deep-Dive Active Pillar Display */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPillar.id}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="rounded-[32px] border border-white/15 bg-white/[0.04] p-6 sm:p-10 shadow-glass-lg backdrop-blur-2xl flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge & Number */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1 font-inter text-xs font-bold tracking-wider text-white">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      {currentPillar.badge}
                    </span>
                    <span className="font-jakarta text-sm font-black tracking-widest text-slate-500">
                      TENET #{currentPillar.number} OF 04
                    </span>
                  </div>

                  {/* Title & Quote */}
                  <h3 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {currentPillar.title}
                  </h3>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-neutral-950/60 p-5 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-white via-slate-300 to-slate-600" />
                    <p className="font-jakarta text-base sm:text-lg italic font-semibold text-slate-200 leading-relaxed pl-3">
                      &ldquo;{currentPillar.quote}&rdquo;
                    </p>
                  </div>

                  {/* Detailed Explanation */}
                  <p className="mt-6 font-inter text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
                    {currentPillar.description}
                  </p>

                  {/* Key Principles Checklist */}
                  <div className="mt-6 space-y-3">
                    <h4 className="font-inter text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Zap className="h-3.5 w-3.5 text-white" />
                      <span>Core Operational Principles</span>
                    </h4>
                    <div className="grid grid-cols-1 gap-2.5 pt-1">
                      {currentPillar.keyPrinciples.map((principle, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-xs sm:text-sm text-slate-200"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{principle}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Interactive Code Terminal Preview */}
                <div className="mt-8 rounded-2xl border border-white/15 bg-[#030509]/90 overflow-hidden shadow-inner">
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 bg-white/[0.03]">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                      <span className="ml-2 font-inter text-[11px] font-mono font-semibold text-slate-400">
                        manifesto_{currentPillar.id}.ts
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-inter font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                      <Terminal className="h-3 w-3" />
                      <span>TECHIES KERNEL</span>
                    </div>
                  </div>
                  <pre className="p-4 overflow-x-auto font-mono text-xs sm:text-sm text-slate-300 leading-relaxed selection:bg-white/20">
                    <code>{currentPillar.codeSnippet}</code>
                  </pre>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom CTA to join / claim TechPass */}
        <div className="mt-14 sm:mt-16 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#techpass"
            className="group btn-primary pl-7 pr-2.5 py-2.5 shadow-lg"
          >
            <span>Claim Your Builder Identity</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="h-4 w-4" />
            </div>
          </a>
          <a
            href="#universe"
            className="btn-secondary px-7 py-3 shadow-md"
          >
            <span>Explore The 6 Domains</span>
          </a>
        </div>
      </div>
    </section>
  );
}
