"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Sparkles, ShieldCheck, X } from "lucide-react";

interface EasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EasterEggModal({ isOpen, onClose }: EasterEggModalProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const playSciFiChime = () => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(120, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 1.2);
      gain1.gain.setValueAtTime(0.3, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 1.5);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.3);
      osc2.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.9);
      gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.3);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.4);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.3);
      osc2.stop(ctx.currentTime + 1.4);
    } catch {
      // Audio context restricted
    }
  };

  useEffect(() => {
    if (isOpen) {
      playSciFiChime();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      alpha: number;
    }

    const particles: Particle[] = [];
    const colors = ["#A855F7", "#06B6D4", "#3B82F6", "#6366F1"];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: width / 2,
        y: height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 3 + 1,
        alpha: 1,
      });
    }

    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.015;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      if (particles.length > 0) {
        animationId = requestAnimationFrame(render);
      }
    };
    render();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#030509]/90 backdrop-blur-2xl"
          />

          <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-10 h-full w-full" />

          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 25 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 25 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative z-20 w-full max-w-lg overflow-hidden rounded-[32px] border border-white/20 bg-white/[0.04] p-8 text-white shadow-2xl backdrop-blur-2xl"
          >
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 font-inter text-xs font-bold text-slate-300 uppercase tracking-widest">
                <Sparkles className="h-4 w-4 text-white" />
                <span>SECRET EASTER EGG UNLOCKED</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="rounded-full border border-white/10 bg-white/5 p-2.5 text-white/70 transition-colors hover:text-white"
                  title="Toggle Sound"
                >
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>
                <button
                  onClick={onClose}
                  className="rounded-full border border-white/10 bg-white/5 p-2.5 text-white/70 transition-colors hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <h3 className="mt-6 font-jakarta text-3xl font-extrabold tracking-tight text-white">
              Welcome to the <span className="bg-gradient-to-b from-slate-200 via-slate-400 to-slate-500 bg-clip-text text-transparent">Core Matrix.</span>
            </h3>

            <p className="mt-4 font-inter text-sm leading-relaxed text-slate-300 font-normal">
              You discovered the hidden gateway by interacting with our emblem. Techies Community isn't just about code, startups, or AI—it's an ethos of perpetual curiosity, exploration, and building what others only imagine.
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 font-inter text-xs">
              <div className="flex items-center gap-2 text-white font-bold mb-1.5">
                <ShieldCheck className="h-4 w-4 text-white" />
                <span>FOUNDERS&apos; DIRECTIVE #01</span>
              </div>
              <p className="text-slate-300 leading-relaxed font-normal">
                &quot;Never accept the default parameters of life. Question systems, reverse engineer complexity, and engineer solutions that leave an enduring mark.&quot;
              </p>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={onClose}
                className="rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-200 px-7 py-3 font-inter text-xs font-bold tracking-wider text-neutral-950 shadow-md transition-all hover:scale-105"
              >
                RETURN TO UNIVERSE
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
