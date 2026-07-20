"use client";

import React, { useRef, useEffect } from "react";
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
  const layer1X = useTransform(smoothX, [-300, 300], [-15, 15]);
  const layer1Y = useTransform(smoothY, [-300, 300], [-15, 15]);

  const layer2X = useTransform(smoothX, [-300, 300], [20, -20]);
  const layer2Y = useTransform(smoothY, [-300, 300], [20, -20]);

  const layer3X = useTransform(smoothX, [-300, 300], [-35, 35]);
  const layer3Y = useTransform(smoothY, [-300, 300], [-35, 35]);

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
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-24 sm:py-32 px-6 sm:px-10 section-gradient-bg border-t border-white/[0.06]"
    >
      {/* Top transition easing out of Techies Universe galaxy */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#030509] via-[#030509]/80 to-transparent z-10" />

      {/* Ambient aurora glow mesh */}
      <div className="pointer-events-none absolute inset-0 z-0 aurora-mesh opacity-60" />
      <div className="pointer-events-none absolute inset-0 z-0 aurora-vignette opacity-80" />

      {/* Main Asymmetrical Container */}
      <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column (5 columns on desktop): Heading, description, feature pills, statistics */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="col-span-1 lg:col-span-5 flex flex-col items-start text-left"
        >
          {/* Top Label */}
          <div className="section-eyebrow mb-5">
            <Sparkles className="h-3.5 w-3.5 text-slate-300 animate-pulse" />
            <span>ABOUT TECHIES</span>
          </div>

          {/* Main Heading */}
          <h2 className="font-jakarta text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            Where Dreamers, Builders &amp; Innovators <br className="hidden sm:block" />
            <span className="headline-gradient">Shape What&apos;s Next.</span>
          </h2>

          {/* Description */}
          <p className="mt-6 font-inter text-base sm:text-lg text-slate-300/90 leading-relaxed max-w-xl">
            We are not a traditional student club or a passive study group. Techies Community is a high-agency, autonomous engineering ecosystem built for creators who choose to forge their own paths. Here, we design, code, and scale breakthrough zero-to-one technologies collaboratively across global domains.
          </p>

          {/* Feature Pills / Floating Cards */}
          <div className="mt-8 flex flex-wrap items-center gap-2.5 max-w-lg">
            {FEATURE_PILLS.map((pill, idx) => {
              const Icon = pill.icon;
              return (
                <motion.div
                  key={pill.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * idx }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="group relative flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 backdrop-blur-xl transition-all duration-300 hover:border-white/35 hover:bg-white/[0.08] shadow-glass-sm cursor-default"
                >
                  <Icon className="h-3.5 w-3.5 text-slate-300 transition-transform duration-300 group-hover:rotate-12" />
                  <span className="font-inter text-xs font-semibold text-slate-200 tracking-wide">
                    {pill.label}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Compact Embedded Statistics Cards */}
          <div className="mt-12 w-full grid grid-cols-2 sm:grid-cols-2 gap-3.5 max-w-lg">
            {STATS_DATA.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + 0.1 * idx }}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-lg transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06] shadow-inner"
              >
                <div className="font-jakarta text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:scale-105 transition-transform duration-300 inline-block">
                  {stat.value}
                </div>
                <div className="mt-1 font-inter text-xs font-medium text-slate-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column (7 columns on desktop): Interactive Visual Composition */}
        <div className="col-span-1 lg:col-span-7 relative h-[480px] sm:h-[560px] lg:h-[640px] w-full flex items-center justify-center">
          {/* Abstract Network / Orbital Rings Base */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Outer Animated Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute w-[380px] h-[380px] sm:w-[500px] sm:h-[500px] rounded-full border border-dashed border-white/10 opacity-60"
            />
            {/* Middle Animated Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
              className="absolute w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] rounded-full border border-white/[0.08] opacity-80"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-2 w-2 rounded-full bg-slate-400" />
            </motion.div>
            {/* Inner Core Ring */}
            <div className="absolute w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] rounded-full border border-white/15 bg-white/[0.01] backdrop-blur-3xl flex items-center justify-center shadow-glass-lg">
              <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-white/10 to-transparent border border-white/20 flex items-center justify-center">
                <Globe className="h-8 w-8 text-white/80 animate-pulse" />
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

          {/* Layer 1: Top Left Floating Glass Card (System Architecture & Protocol) */}
          <motion.div
            style={{ x: layer1X, y: layer1Y }}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            whileHover={{ scale: 1.04, zIndex: 30 }}
            className="absolute top-6 left-2 sm:top-10 sm:left-6 w-64 sm:w-72 rounded-2xl border border-white/15 bg-white/[0.05] p-4.5 backdrop-blur-2xl shadow-glass-lg transition-colors hover:border-white/30 z-20"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                <span className="font-jakarta text-xs font-bold uppercase tracking-wider text-white">
                  AUTONOMY PROTOCOL
                </span>
              </div>
              <Terminal className="h-4 w-4 text-slate-400" />
            </div>
            <div className="mt-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-inter text-slate-300">
                <span>Distributed Guild Nodes</span>
                <span className="font-mono font-bold text-white">ACTIVE</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  whileInView={{ width: "94%" }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                  className="h-full rounded-full bg-gradient-to-r from-slate-300 to-white"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span>LATENCY: &lt;12ms</span>
                <span>SYSTEM RINGS: OK</span>
              </div>
            </div>
          </motion.div>

          {/* Layer 2: Top Right Floating Glass Badge (Swarms & Live Activity) */}
          <motion.div
            style={{ x: layer2X, y: layer2Y }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.35 }}
            whileHover={{ scale: 1.05, zIndex: 30 }}
            className="absolute top-12 right-2 sm:top-16 sm:right-6 w-60 sm:w-64 rounded-2xl border border-white/20 bg-[#060a12]/80 p-4 backdrop-blur-2xl shadow-glass-lg transition-colors hover:border-white/35 z-20"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 border border-white/15 text-white shadow-inner">
                <Activity className="h-5 w-5 text-white animate-pulse" />
              </div>
              <div>
                <div className="font-jakarta text-xs font-bold text-white tracking-tight">
                  LIVE BUILD MATRIX
                </div>
                <div className="font-inter text-[11px] text-slate-400">
                  Global Hackathons &amp; Sprints
                </div>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-inter text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                Swarms Deployed
              </span>
              <span className="font-mono font-bold text-white">42 Active</span>
            </div>
          </motion.div>

          {/* Layer 3: Bottom Center/Right Large Telemetry Card */}
          <motion.div
            style={{ x: layer3X, y: layer3Y }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5 }}
            whileHover={{ scale: 1.03, zIndex: 30 }}
            className="absolute bottom-6 right-4 sm:bottom-8 sm:right-10 w-72 sm:w-80 rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-5 backdrop-blur-2xl shadow-2xl transition-all hover:border-white/30 z-20"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-white" />
                <span className="font-jakarta text-xs font-bold tracking-tight text-white">
                  ZERO-TO-ONE ARCHITECTURE
                </span>
              </div>
              <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-300 border border-white/15">
                V2.6.0
              </span>
            </div>
            <p className="font-inter text-xs text-slate-300 leading-relaxed">
              Every member receives access to high-concurrency cloud clusters, mentor code reviews, and direct investor bridge channels.
            </p>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-amber-300" />
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
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.08 }}
            className="absolute bottom-12 left-4 sm:bottom-16 sm:left-10 rounded-2xl border border-white/20 bg-[#060a12]/90 px-4 py-3 backdrop-blur-xl shadow-glass-md flex items-center gap-3 z-20"
          >
            <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-white border border-white/15">
              <GitBranch className="h-4 w-4" />
            </div>
            <div>
              <div className="font-jakarta text-xs font-bold text-white">
                100% Open Source
              </div>
              <div className="font-inter text-[10px] text-slate-400">
                Shared Knowledge Base
              </div>
            </div>
          </motion.div>

          {/* Floating Parallax Particles */}
          {[...Array(6)].map((_, idx) => (
            <motion.div
              key={idx}
              animate={{
                y: [0, -15, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 4 + idx,
                repeat: Infinity,
                ease: "easeInOut",
                delay: idx * 0.7,
              }}
              className="absolute h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] pointer-events-none"
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
