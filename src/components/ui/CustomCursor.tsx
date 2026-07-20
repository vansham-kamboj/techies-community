"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function CustomCursor() {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 450, mass: 0.4 };
  const trailX = useSpring(cursorX, springConfig);
  const trailY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only disable custom cursor on actual small mobile screens (< 768px)
    // Avoid checking `pointer: coarse` alone because Windows laptops with touchscreens report pointer:coarse!
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);

    if (window.innerWidth < 768) return;

    const moveCursor = (e: MouseEvent) => {
      if (!isVisible && e.clientX > 0 && e.clientY > 0) {
        setIsVisible(true);
      }
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.closest("button") ||
        target.closest("a") ||
        target.getAttribute("role") === "button" ||
        target.classList.contains("interactive") ||
        target.classList.contains("cursor-pointer");

      setIsHovered(!!isInteractive);
    };

    const handleClick = (e: MouseEvent) => {
      const newRipple: Ripple = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };
      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 700);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", checkScreen);
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("click", handleClick);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isMobile) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[999999] overflow-hidden transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Primary crisp white dot */}
      <motion.div
        className="fixed top-0 left-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      />

      {/* Trailing Clean Ring */}
      <motion.div
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-white/[0.05] backdrop-blur-[1px]"
        style={{
          x: trailX,
          y: trailY,
        }}
        animate={{
          width: isHovered ? 48 : 32,
          height: isHovered ? 48 : 32,
          borderColor: isHovered ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.35)",
          backgroundColor: isHovered ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.05)",
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 350 }}
      />

      {/* Ripple effects on click */}
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="fixed -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-white/15"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: 90, height: 90, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
