"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, ArrowRight, Compass, Terminal } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Sparse, clean, unevenly distributed star field matching the deep space image
function StarField() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(220 * 3);
    const col = new Float32Array(220 * 3);
    const palette = [
      new THREE.Color("#FFFFFF"),
      new THREE.Color("#E2E8F0"),
      new THREE.Color("#93C5FD"),
      new THREE.Color("#F8FAFC"),
    ];

    for (let i = 0; i < 220; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;

      const color = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.003;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

export default function LandingSection() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: "-50px" });

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section ref={sectionRef} className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 pt-28 pb-16 sm:pb-20 sm:px-10 bg-[#030509]">
      {/* 3D Sparse Stars Canvas (No circles or giant planets) */}
      {isMounted && (
        <div className="pointer-events-none absolute inset-0 z-0 h-full w-full">
          <Canvas
            frameloop={isInView ? "always" : "never"}
            camera={{ position: [0, 0, 7], fov: 50 }}
            gl={{ antialias: !isMobile, alpha: true, powerPreference: "high-performance" }}
            dpr={[1, isMobile ? 1.2 : 1.75]}
          >
            <ambientLight intensity={0.8} />
            <StarField />
          </Canvas>
        </div>
      )}

      {/* Main Hero Content matching exact fonts, layout & button style of image */}
      <div className="relative z-10 flex flex-col items-center max-w-6xl text-center">
        {/* Flex layout: On mobile (flex-col), Heading is top (order-1), video is below (order-2). On desktop (md:flex-row), Video is left (order-1), Heading is right (order-2). */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 w-full">
          {/* Responsive Small Horizontal Video Player (~100px width) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="order-2 md:order-1 flex-shrink-0 w-[110px] sm:w-[130px] aspect-video rounded-xl overflow-hidden border border-white/20 bg-white/[0.05] shadow-2xl relative group cursor-pointer hover:border-white/40"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
            <div className="absolute bottom-1 right-1.5 flex items-center gap-1 text-[8px] font-inter font-bold tracking-widest uppercase text-white/80 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </div>
          </motion.div>

          {/* Crisp High-Contrast Sans-Serif Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="order-1 md:order-2 font-jakarta text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl xl:text-[92px] leading-[1.08] text-center md:text-left"
          >
            Build Beyond <br className="hidden sm:block" />
            <span className="bg-gradient-to-b from-slate-200 via-slate-400 to-slate-500 bg-clip-text text-transparent">
              Boundaries.
            </span>
          </motion.h1>
        </div>

        {/* Clean Paragraph Typography matching image text style & color */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-6 max-w-2xl font-inter text-lg sm:text-xl md:text-2xl font-normal leading-relaxed text-slate-300"
        >
          For dreamers, builders, and innovators who choose to create their own path.
        </motion.p>

        {/* Interactive Buttons matching exact image pill + right circular arrow icon badge */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl"
        >
          {/* Main glossy white/silver pill button with dark circular arrow badge on right */}
          <a
            href="#techpass"
            className="group relative inline-flex items-center gap-4 rounded-full bg-gradient-to-b from-white via-slate-100 to-slate-300 pl-7 pr-2 py-2 font-inter text-sm font-semibold tracking-wide text-neutral-950 shadow-lg border border-white/80 transition-all duration-300 hover:scale-105"
          >
            <span>Claim TechPass Now</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="h-4 w-4" />
            </div>
          </a>

          {/* Secondary clean button */}
          <a
            href="#universe"
            className="group relative inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.04] px-7 py-3.5 font-inter text-sm font-semibold tracking-wide text-slate-300 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
          >
            <span>Explore Universe</span>
          </a>
        </motion.div>

        {/* Subtle Feature Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.7 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-3 text-xs font-inter font-medium text-slate-400"
        >
          <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 backdrop-blur-md">
            <Terminal className="h-3.5 w-3.5 text-slate-300" />
            <span>AI & AUTOMATION</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            <span>STARTUP INCUBATOR</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-aurora-cyan" />
            <span>ZERO-TO-ONE BUILDING</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
