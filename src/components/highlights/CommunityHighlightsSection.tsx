"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Calendar,
  Users,
  Trophy,
  ArrowUpRight,
  Code2,
  Terminal,
  Cpu,
  Radio,
  Share2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play as PlayIcon,
} from "lucide-react";

export type HighlightCategory = "All" | "Workshops" | "Hackathons" | "Meetups" | "Projects" | "Collaborations";

interface PlanetConfig {
  gradient: string;
  ringColor: string;
  ringGlow: string;
  orbGlow: string;
  type: "mars" | "moon" | "purple-blue";
}

interface HighlightCardData {
  id: string;
  category: HighlightCategory;
  title: string;
  dateOrMetric: string;
  description: string;
  tags: string[];
  planet: PlanetConfig;
  icon: React.ComponentType<{ className?: string }>;
  attendees?: string;
}

const HIGHLIGHTS_DATA: HighlightCardData[] = [
  {
    id: "h-1",
    category: "Hackathons",
    title: "Omni-Builder 48H GenAI Sprint",
    dateOrMetric: "NEXT SPRINT: OCT 14-16",
    description:
      "Our flagship semi-annual hackathon where 300+ builders race to construct autonomous AI agents, voice assistants, and developer infrastructure with $15,000 in equity-free prizes.",
    tags: ["Hackathon", "AI Swarms", "$15k Prize Pool"],
    planet: {
      type: "mars",
      gradient: "from-slate-100 via-slate-300 to-slate-400",
      ringColor: "border-white/40",
      ringGlow: "shadow-md",
      orbGlow: "shadow-lg",
    },
    icon: Trophy,
    attendees: "340+ Builders Registered",
  },
  {
    id: "h-2",
    category: "Workshops",
    title: "Deep-Dive: Fine-Tuning Llama 3 for Edge Devices",
    dateOrMetric: "LIVE MASTERCLASS RECORDING",
    description:
      "A 3-hour intensive masterclass led by senior ML engineers on Quantized Low-Rank Adaptation (QLoRA), synthetic data generation, and serving models at edge speed.",
    tags: ["Workshop", "LLMs", "PyTorch", "QLoRA"],
    planet: {
      type: "moon",
      gradient: "from-white via-slate-200 to-slate-400",
      ringColor: "border-white/40",
      ringGlow: "shadow-md",
      orbGlow: "shadow-lg",
    },
    icon: Cpu,
    attendees: "520+ Active Learners",
  },
  {
    id: "h-3",
    category: "Meetups",
    title: "Midnight Builders Summit & Founders Dinner",
    dateOrMetric: "MONTHLY IN-PERSON & HYBRID",
    description:
      "No agendas, no corporate badges. Just 50 hand-selected founders and engineers gathering around midnight to demo unreleased prototypes and debate system architecture.",
    tags: ["Meetup", "Founders Only", "Uncensored Demos"],
    planet: {
      type: "purple-blue",
      gradient: "from-slate-200 via-slate-400 to-slate-600",
      ringColor: "border-white/40",
      ringGlow: "shadow-md",
      orbGlow: "shadow-lg",
    },
    icon: Users,
    attendees: "50 Seats (Application Required)",
  },
  {
    id: "h-4",
    category: "Projects",
    title: "Aether Engine: Rust-Powered Web3 Storage",
    dateOrMetric: "FEATURED OPEN-SOURCE PROJECT",
    description:
      "Built entirely by 4 undergraduate members of our Core Node, Aether achieves 10x faster local indexing for decentralized data and recently crossed 1,400 GitHub stars.",
    tags: ["Open Source", "Rust", "1.4k Stars"],
    planet: {
      type: "mars",
      gradient: "from-white via-slate-300 to-slate-500",
      ringColor: "border-white/40",
      ringGlow: "shadow-md",
      orbGlow: "shadow-lg",
    },
    icon: Code2,
    attendees: "1,420+ GitHub Stars",
  },
  {
    id: "h-5",
    category: "Collaborations",
    title: "Techies x Vercel AI SDK Research Syndicate",
    dateOrMetric: "ACTIVE PARTNERSHIP",
    description:
      "A joint research collaboration where top student builders gain early alpha access to next-generation streaming AI protocols and co-author production templates.",
    tags: ["Partnership", "Vercel", "AI SDK"],
    planet: {
      type: "purple-blue",
      gradient: "from-slate-100 via-slate-300 to-slate-500",
      ringColor: "border-white/40",
      ringGlow: "shadow-md",
      orbGlow: "shadow-lg",
    },
    icon: Share2,
    attendees: "18 Core Student Researchers",
  },
  {
    id: "h-6",
    category: "Workshops",
    title: "Zero-to-One: Glassmorphism & Spatial Web UI",
    dateOrMetric: "UPCOMING MASTERCLASS",
    description:
      "Master the art of creating cinematic web experiences using React Three Fiber, Framer Motion, and design tokens without sacrificing 60fps performance.",
    tags: ["Workshop", "UI/UX", "3D Web"],
    planet: {
      type: "moon",
      gradient: "from-white via-slate-200 to-slate-400",
      ringColor: "border-white/40",
      ringGlow: "shadow-md",
      orbGlow: "shadow-lg",
    },
    icon: Terminal,
    attendees: "410+ RSVPed",
  },
];

export default function CommunityHighlightsSection() {
  const [selectedTab, setSelectedTab] = useState<HighlightCategory>("All");
  const [isPaused, setIsPaused] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const animFrameRef = useRef<number | null>(null);

  const categories: HighlightCategory[] = [
    "All",
    "Workshops",
    "Hackathons",
    "Meetups",
    "Projects",
    "Collaborations",
  ];

  const filteredHighlights =
    selectedTab === "All"
      ? HIGHLIGHTS_DATA
      : HIGHLIGHTS_DATA.filter((h) => h.category === selectedTab);

  // Duplicate items to form a dense 12-item or 18-item 3D cylinder ring like Netflix 3D
  const carouselItems = [...filteredHighlights, ...filteredHighlights];
  const M = carouselItems.length;

  // Auto-scroll loop along the cylinder
  const animateScroll = useCallback(() => {
    if (!isPaused && M > 0) {
      setScrollProgress((prev) => (prev + 0.0035) % M);
    }
    animFrameRef.current = requestAnimationFrame(animateScroll);
  }, [isPaused, M]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(animateScroll);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [animateScroll]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Reset progress when category changes
  useEffect(() => {
    setScrollProgress(0);
  }, [selectedTab]);

  const handlePrev = () => {
    setScrollProgress((prev) => (Math.round(prev - 1) + M) % M);
  };

  const handleNext = () => {
    setScrollProgress((prev) => Math.round(prev + 1) % M);
  };

  const handleCardClick = (idx: number) => {
    setScrollProgress(idx);
  };

  return (
    <section id="highlights" className="relative w-full py-16 sm:py-20 px-4 sm:px-8 bg-[#030509] overflow-hidden">
      {/* Header */}
      <div className="relative z-10 mx-auto max-w-4xl text-center mb-10">
        <h2 className="font-jakarta text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
          Community{" "}
          <span className="bg-gradient-to-b from-slate-200 via-slate-400 to-slate-500 bg-clip-text text-transparent">
            Highlights
          </span>
        </h2>

        <p className="mt-4 font-inter text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
          Explore our high-velocity hackathons, deep-dive technical workshops, and flagship open-source builds arranged along a cinematic 3D cylinder.
        </p>

        {/* Category Filter Tabs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedTab(cat)}
              className={`rounded-full border px-5 py-2 font-inter text-xs font-bold tracking-wider transition-all duration-300 ${
                selectedTab === cat
                  ? "border-white bg-white/20 text-white shadow-md scale-105"
                  : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Arc Cylinder Stage */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative z-10 mx-auto w-full max-w-[1400px] py-6 px-2"
      >
        {/* Navigation Controls Bar */}
        <div className="mb-8 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-2 font-inter text-xs font-semibold text-slate-400">
            <span className="inline-block h-2 w-2 rounded-full bg-white/60 animate-ping" />
            <span>{isPaused ? "PAUSED ON HOVER (CLICK ANY CARD TO BRING TO CENTER)" : "AUTO-ROTATING 3D CYLINDER ARC"}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/80 transition-all hover:border-white hover:bg-white/15 hover:text-white"
              aria-label={isPaused ? "Resume Carousel" : "Pause Carousel"}
            >
              {isPaused ? <PlayIcon className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={handlePrev}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/80 transition-all hover:border-white hover:bg-white/15 hover:text-white"
              aria-label="Previous Highlight"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/80 transition-all hover:border-white hover:bg-white/15 hover:text-white"
              aria-label="Next Highlight"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 3D Cylindrical Arc Stage Container */}
        <div
          className="relative flex h-[460px] sm:h-[560px] w-full items-center justify-center overflow-visible"
          style={{ perspective: "1500px", transformStyle: "preserve-3d" }}
        >
          {carouselItems.map((card, idx) => {
            const Icon = card.icon;
            const { gradient, ringColor, ringGlow, orbGlow } = card.planet;

            // Calculate wrapped slot relative to scrollProgress (0 = leftmost big foreground, 1, 2, 3, 4 = receding to the right)
            let slot = (((idx - scrollProgress) % M) + M) % M;
            if (slot > M - 2.5) {
              slot = slot - M; // Wrap exiting cards to negative slots so they smoothly glide off to the left
            }

            // Don't render cards that are too deep on the right or off screen left
            if (slot > 5.5 || slot < -1.5) return null;

            const isForeground = Math.abs(slot) < 0.35;

            // 3D Perspective Depth Math (Fully Responsive):
            // Leftmost (slot=0) is large, popped forward, and active.
            // On mobile, active card (slot=0) sits near center (-25px) so it never gets cut off on the left!
            const translateX = isMobile ? -25 + slot * 175 : -380 + slot * 280;
            const translateZ = slot < 0 ? slot * (isMobile ? 100 : 160) : -Math.pow(slot, 1.25) * (isMobile ? 110 : 160) + (isForeground ? (isMobile ? 30 : 60) : 0);
            const rotateY = slot < 0 ? (isMobile ? 20 : 30) : -Math.min(45, slot * (isMobile ? 14 : 18));
            const scale = slot < 0 ? Math.max(0.7, (isMobile ? 1.02 : 1.08) + slot * 0.3) : Math.max(0.55, (isMobile ? 1.02 : 1.08) - slot * (isMobile ? 0.15 : 0.125));
            const opacity = slot < 0 ? Math.max(0, 1 + slot * 1.1) : Math.max(0.2, 1 - slot * 0.18);
            const zIndex = Math.round((6 - slot) * 100);
            const cardWidth = isMobile ? "295px" : "360px";
            const cardHeight = isMobile ? "410px" : "460px";

            return (
              <div
                key={`${card.id}-${idx}`}
                onClick={() => handleCardClick(idx)}
                style={{
                  position: "absolute",
                  width: cardWidth,
                  height: cardHeight,
                  transform: `translate3d(${translateX}px, 0px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity: opacity,
                  zIndex: zIndex,
                  transformStyle: "preserve-3d",
                  cursor: isForeground ? "default" : "pointer",
                  transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease",
                }}
                className="group flex flex-col justify-between rounded-[32px] border border-white/15 bg-white/[0.04] p-6 sm:p-7 backdrop-blur-2xl shadow-2xl hover:border-white/40"
              >
                {/* Floating Top Pill Badge matching 'Recently added' in Netflix 3D */}
                <div
                  style={{ transform: "translateZ(30px)" }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap rounded-full border border-white/20 bg-neutral-900/95 px-3.5 py-1 font-inter text-[11px] font-bold tracking-wider text-slate-200 shadow-xl backdrop-blur-md"
                >
                  {card.category.toUpperCase()} • {card.dateOrMetric}
                </div>

                {/* Top section: Planet Hero & Icon */}
                <div className="mt-2">
                  <div className="relative mb-6 flex items-center justify-between">
                    {/* Planet Orb with Futuristic Ring */}
                    <div className="relative flex items-center justify-center h-18 w-18">
                      <div className={`absolute inset-0 rounded-full blur-xl opacity-40 ${orbGlow}`} />

                      {/* Sci-Fi Orbiting Ring */}
                      <div
                        className={`absolute h-22 w-22 rounded-full border ${ringColor} ${ringGlow} transition-transform duration-700 group-hover:rotate-45 group-hover:scale-105`}
                        style={{ transform: "rotateX(65deg) rotateY(20deg)" }}
                      />

                      {/* Bright Glowing Planet Center */}
                      <div
                        className={`relative h-12 w-12 rounded-full bg-gradient-to-tr ${gradient} shadow-lg transition-transform duration-500 group-hover:scale-110 flex items-center justify-center`}
                      >
                        <Icon className="h-5 w-5 text-neutral-950 drop-shadow-sm" />
                      </div>
                    </div>

                    <div className="flex items-center gap-1 font-inter text-xs font-semibold text-slate-400">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{card.id.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Clean Minimal Title */}
                  <h3 className="font-jakarta text-2xl font-bold tracking-tight text-white group-hover:text-slate-200 transition-colors">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 font-inter text-xs sm:text-sm font-normal leading-relaxed text-slate-300 line-clamp-3">
                    {card.description}
                  </p>
                </div>

                {/* Bottom section: Tags & Action Button */}
                <div className="mt-6 border-t border-white/[0.08] pt-5 flex flex-col gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {card.tags.slice(0, 3).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 font-inter text-[11px] font-medium text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Center Action Button floating right below card when active (like 'Play' button in Netflix 3D) */}
                  <div className="flex items-center justify-between">
                    {isForeground ? (
                      <a
                        href="#techpass"
                        style={{ transform: "translateZ(40px)" }}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-white via-slate-100 to-slate-200 px-5 py-2 font-inter text-xs font-bold text-neutral-950 shadow-lg transition-all hover:scale-105"
                      >
                        <PlayIcon className="h-3.5 w-3.5 fill-neutral-950 text-neutral-950" />
                        <span>EXPLORE HIGHLIGHT</span>
                      </a>
                    ) : (
                      <span className="font-inter text-[11px] font-semibold text-slate-400/80 group-hover:text-white transition-colors">
                        Click to Bring to Left Foreground →
                      </span>
                    )}

                    <a
                      href="#techpass"
                      aria-label={`Explore ${card.title}`}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-white/80 transition-all duration-300 hover:scale-110 hover:border-white hover:bg-white hover:text-neutral-950 shadow-sm"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main button at the bottom matching TechPass physical pill shape */}
      <div className="relative z-10 mt-14 flex justify-center">
        <a
          href="#techpass"
          className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-200 px-9 py-4 font-inter text-sm font-bold tracking-wide text-neutral-950 shadow-md transition-all duration-300 hover:scale-105"
        >
          <span>CLAIM TECHPASS FOR FUTURE EVENTS</span>
          <ArrowRight className="h-4 w-4 text-neutral-950 transition-transform group-hover:translate-x-1.5" />
        </a>
      </div>
    </section>
  );
}


