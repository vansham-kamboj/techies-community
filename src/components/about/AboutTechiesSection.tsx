"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Code2,
  Cpu,
  Rocket,
  Video,
  Palette,
  Users,
  Sparkles,
  Terminal,
  Activity,
  ShieldCheck,
  Zap,
  Globe,
  GitBranch,
} from "lucide-react";

const FEATURE_PILLS = [
  { label: "Coding", icon: Code2 },
  { label: "AI & Automation", icon: Cpu },
  { label: "Startups", icon: Rocket },
  { label: "Content Creation", icon: Video },
  { label: "Design", icon: Palette },
  { label: "Community", icon: Users },
];

const STATS_DATA = [
  { label: "Community Members", value: "14,000+" },
  { label: "Events Organized", value: "120+" },
  { label: "Workshops", value: "85+" },
  { label: "Projects Built", value: "300+" },
];

export default function AboutTechiesSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for subtle right-side visual reaction
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Parallax layers
  const layer1X = useTransform(smoothX, [-300, 300], [-12, 12]);
  const layer1Y = useTransform(smoothY, [-300, 300], [-12, 12]);

  const layer2X = useTransform(smoothX, [-300, 300], [15, -15]);
  const layer2Y = useTransform(smoothY, [-300, 300], [15, -15]);

  const layer3X = useTransform(smoothX, [-300, 300], [-25, 25]);
  const layer3Y = useTransform(smoothY, [-300, 300], [-25, 25]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden py-14 sm:py-16 px-6 sm:px-10 bg-[#030509] border-t border-white/[0.06]"
    >
      {/* Top transition easing out of Techies Universe galaxy */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#030509] via-[#030509]/80 to-transparent z-10" />

      {/* Main Asymmetrical Container - compact gap and single screen fit */}
      <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column (5 columns on desktop): Heading, description, feature pills, statistics */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="col-span-1 lg:col-span-5 flex flex-col items-start text-left"
        >
          {/* Top Label */}
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-slate-300 tracking-wider uppercase mb-3">
            <Sparkles className="h-3 w-3 text-slate-400" />
            <span>ABOUT TECHIES</span>
          </div>

          {/* Compact Main Heading */}
          <h2 className="font-jakarta text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-snug">
            Where Dreamers, Builders &amp; Innovators <br className="hidden sm:block" />
            <span className="text-slate-300">Shape What&apos;s Next.</span>
          </h2>

          {/* Description */}
          <p className="mt-3 font-inter text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-lg">
            We are not a traditional student club or a passive study group. Techies Community is an autonomous engineering ecosystem built for creators who choose to forge their own paths. Here, we design, code, and scale breakthrough zero-to-one technologies across global domains.
          </p>

          {/* Feature Pills / Floating Cards (Compact & Zero Glow) */}
          <div className="mt-4 flex flex-wrap items-center gap-2 max-w-lg">
            {FEATURE_PILLS.map((pill, idx) => {
              const Icon = pill.icon;
              return (
                <motion.div
                  key={pill.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.05 * idx }}
                  whileHover={{ scale: 1.04, y: -1 }}
                  className="group relative flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/[0.07] cursor-default"
                >
                  <Icon className="h-3 w-3 text-slate-400 transition-transform duration-300 group-hover:rotate-12" />
                  <span className="font-inter text-xs font-semibold text-slate-200 tracking-wide">
                    {pill.label}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Compact Embedded Statistics Cards */}
          <div className="mt-6 w-full grid grid-cols-2 gap-3 max-w-lg">
            {STATS_DATA.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + 0.08 * idx }}
                className="group relative rounded-xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div className="font-jakarta text-xl sm:text-2xl font-bold tracking-tight text-white inline-block">
                  {stat.value}
                </div>
                <div className="mt-0.5 font-inter text-xs font-medium text-slate-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column (7 columns on desktop): Compact Visual Composition (No Glows) */}
        <div className="col-span-1 lg:col-span-7 relative h-[360px] sm:h-[420px] lg:h-[460px] w-full flex items-center justify-center">
          {/* Abstract Network / Orbital Rings Base (Clean dashed lines, zero shadow/glow) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Outer Animated Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-full border border-dashed border-white/10 opacity-50"
            />
            {/* Middle Animated Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
              className="absolute w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] rounded-full border border-white/[0.08] opacity-70"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-white" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-2 w-2 rounded-full bg-slate-400" />
            </motion.div>
            {/* Inner Core Ring */}
            <div className="absolute w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] rounded-full border border-white/15 bg-white/[0.01] backdrop-blur-xl flex items-center justify-center">
              <div className="h-12 w-12 rounded-full border border-white/20 flex items-center justify-center bg-white/[0.03]">
                <Globe className="h-6 w-6 text-white/80" />
              </div>
            </div>
          </div>

          {/* SVG Connecting Network Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-white/15 fill-none z-10">
            <line x1="20%" y1="30%" x2="50%" y2="50%" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="80%" y1="25%" x2="50%" y2="50%" strokeWidth="1" />
            <line x1="75%" y1="75%" x2="50%" y2="50%" strokeWidth="1" strokeDasharray="6 4" />
            <line x1="25%" y1="75%" x2="50%" y2="50%" strokeWidth="1" />
          </svg>

          {/* Layer 1: Top Left Floating Card (System Architecture & Protocol) */}
          <motion.div
            style={{ x: layer1X, y: layer1Y }}
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            whileHover={{ scale: 1.03, zIndex: 30 }}
            className="absolute top-4 left-1 sm:top-8 sm:left-4 w-56 sm:w-64 rounded-xl border border-white/15 bg-white/[0.04] p-3.5 backdrop-blur-xl transition-colors hover:border-white/25 z-20"
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="font-jakarta text-[11px] font-bold uppercase tracking-wider text-white">
                  AUTONOMY PROTOCOL
                </span>
              </div>
              <Terminal className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <div className="mt-2.5 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-inter text-slate-300">
                <span>Distributed Guild Nodes</span>
                <span className="font-mono font-bold text-white">ACTIVE</span>
              </div>
              <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  whileInView={{ width: "94%" }}
                  transition={{ duration: 1.0, delay: 0.4 }}
                  className="h-full rounded-full bg-slate-300"
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
                <span>LATENCY: &lt;12ms</span>
                <span>SYSTEM: OK</span>
              </div>
            </div>
          </motion.div>

          {/* Layer 2: Top Right Floating Badge (Swarms & Live Activity) */}
          <motion.div
            style={{ x: layer2X, y: layer2Y }}
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            whileHover={{ scale: 1.03, zIndex: 30 }}
            className="absolute top-10 right-1 sm:top-12 sm:right-4 w-52 sm:w-60 rounded-xl border border-white/15 bg-[#060a12]/90 p-3.5 backdrop-blur-xl transition-colors hover:border-white/25 z-20"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 border border-white/15 text-white">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="font-jakarta text-[11px] font-bold text-white tracking-tight">
                  LIVE BUILD MATRIX
                </div>
                <div className="font-inter text-[10px] text-slate-400">
                  Global Hackathons &amp; Sprints
                </div>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-inter text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                Swarms Deployed
              </span>
              <span className="font-mono font-bold text-white">42 Active</span>
            </div>
          </motion.div>

          {/* Layer 3: Bottom Center/Right Compact Telemetry Card */}
          <motion.div
            style={{ x: layer3X, y: layer3Y }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
            whileHover={{ scale: 1.02, zIndex: 30 }}
            className="absolute bottom-4 right-2 sm:bottom-6 sm:right-6 w-64 sm:w-72 rounded-xl border border-white/15 bg-white/[0.04] p-4 backdrop-blur-xl transition-all hover:border-white/25 z-20"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-white" />
                <span className="font-jakarta text-[11px] font-bold tracking-tight text-white">
                  ZERO-TO-ONE ARCHITECTURE
                </span>
              </div>
              <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-slate-300 border border-white/15">
                V2.6.0
              </span>
            </div>
            <p className="font-inter text-[11px] text-slate-300 leading-relaxed">
              Every member receives access to high-concurrency cloud clusters, mentor code reviews, and direct investor channels.
            </p>
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-slate-300" />
                High-Agency Only
              </span>
              <span className="text-white font-semibold underline decoration-white/30">
                Read Manifesto
              </span>
            </div>
          </motion.div>

          {/* Layer 4: Bottom Left Floating Node Badge */}
          <motion.div
            style={{ x: layer1X, y: layer2Y }}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.45 }}
            whileHover={{ scale: 1.05 }}
            className="absolute bottom-8 left-2 sm:bottom-12 sm:left-6 rounded-xl border border-white/15 bg-[#060a12]/90 px-3.5 py-2.5 backdrop-blur-xl flex items-center gap-2.5 z-20"
          >
            <div className="h-7 w-7 rounded-md bg-white/10 flex items-center justify-center text-white border border-white/15">
              <GitBranch className="h-3.5 w-3.5" />
            </div>
            <div>
              <div className="font-jakarta text-[11px] font-bold text-white">
                100% Open Source
              </div>
              <div className="font-inter text-[9px] text-slate-400">
                Shared Knowledge Base
              </div>
            </div>
          </motion.div>

          {/* Floating Parallax Particles (Clean white dots, zero glow/shadow) */}
          {[...Array(6)].map((_, idx) => (
            <motion.div
              key={idx}
              animate={{
                y: [0, -12, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 4 + idx,
                repeat: Infinity,
                ease: "easeInOut",
                delay: idx * 0.6,
              }}
              className="absolute h-1 w-1 rounded-full bg-white/60 pointer-events-none"
              style={{
                top: `${20 + (idx * 13) % 65}%`,
                left: `${15 + (idx * 17) % 70}%`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
