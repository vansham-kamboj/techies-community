"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import LazyVideo from "@/components/ui/LazyVideo";

function StarField({ count = 280 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const twinkleRef = useRef(0);

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const palette = [
      new THREE.Color("#FFFFFF"),
      new THREE.Color("#E2E8F0"),
      new THREE.Color("#93C5FD"),
      new THREE.Color("#67E8F9"),
      new THREE.Color("#F8FAFC"),
    ];

    for (let i = 0; i < count; i++) {
      const depth = Math.random();
      pos[i * 3] = (Math.random() - 0.5) * 32;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14 - depth * 4;

      const color = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
      sz[i] = 0.03 + depth * 0.06 + Math.random() * 0.02;
    }
    return { positions: pos, colors: col, sizes: sz };
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.002;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.02;
    }
    twinkleRef.current += delta;
    if (materialRef.current) {
      materialRef.current.opacity = 0.65 + Math.sin(twinkleRef.current * 1.2) * 0.15;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.05}
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
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
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 pt-28 pb-16 sm:pb-20 sm:px-10 section-gradient-bg"
    >
      {/* CSS starfield layers — always rendered, zero GPU cost */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="starfield-layer starfield-layer--far" />
        <div className="starfield-layer starfield-layer--mid" />
        <div className="starfield-layer starfield-layer--near" />
        <div className="twinkle-stars" />
      </div>

      {/* Aurora mesh + vignette */}
      <div className="pointer-events-none absolute inset-0 z-0 aurora-mesh" />
      <div className="pointer-events-none absolute inset-0 z-0 aurora-vignette" />

      {/* WebGL stars — desktop only for extra depth */}
      {isMounted && !isMobile && (
        <div className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-80">
          <Canvas
            frameloop={isInView ? "always" : "never"}
            camera={{ position: [0, 0, 7], fov: 50 }}
            gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
            dpr={[1, 1.35]}
          >
            <StarField count={180} />
          </Canvas>
        </div>
      )}

      {/* Bottom fade into next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#030509] to-transparent z-[1]" />

      <div className="relative z-10 flex flex-col items-center max-w-6xl text-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="order-2 md:order-1 flex-shrink-0 w-[110px] sm:w-[130px] aspect-video rounded-xl overflow-hidden glass-border-gradient shadow-glass-lg relative group cursor-pointer hover:shadow-aurora-glow transition-shadow duration-500"
          >
            <LazyVideo
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
              className="h-full w-full"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
            <div className="absolute bottom-1 right-1.5 flex items-center gap-1 text-[8px] font-inter font-bold tracking-widest uppercase text-white/80 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm border border-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
              LIVE
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="order-1 md:order-2 font-jakarta text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl xl:text-[92px] leading-[1.08] text-center md:text-left"
          >
            Build Beyond <br className="hidden sm:block" />
            <span className="headline-gradient">Boundaries.</span>
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-6 max-w-2xl font-inter text-lg sm:text-xl md:text-2xl font-normal leading-relaxed text-slate-300/90"
        >
          For dreamers, builders, and innovators who choose to create their own path.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl"
        >
          <a href="#techpass" className="group btn-primary pl-7 pr-2 py-2">
            <span>Claim TechPass Now</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white transition-transform group-hover:translate-x-0.5 shadow-inner">
              <ArrowRight className="h-4 w-4" />
            </div>
          </a>

          <a href="#universe" className="btn-secondary px-7 py-3.5">
            <span>Explore Universe</span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.7 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-3 text-xs font-inter font-medium text-slate-400"
        >
          <div className="flex items-center gap-2 rounded-xl glass-surface px-3.5 py-2">
            <Terminal className="h-3.5 w-3.5 text-slate-300" />
            <span>AI & AUTOMATION</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl glass-surface px-3.5 py-2">
            <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
            <span>STARTUP INCUBATOR</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl glass-surface px-3.5 py-2">
            <span className="h-2 w-2 rounded-full bg-aurora-cyan shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
            <span>ZERO-TO-ONE BUILDING</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
