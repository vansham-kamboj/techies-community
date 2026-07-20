"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import EasterEggModal from "@/components/ui/EasterEggModal";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoClick = () => {
    const nextClicks = logoClicks + 1;
    if (nextClicks >= 5) {
      setIsEasterEggOpen(true);
      setLogoClicks(0);
    } else {
      setLogoClicks(nextClicks);
    }
  };

  const navLinks = [
    { name: "TechPass", href: "/#techpass" },
    { name: "Events", href: "/#highlights" },
    { name: "Connections Hub", href: "/connections" },
    { name: "Contact Us", href: "/#techpass" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#030509]/90 backdrop-blur-xl border-b border-white/10 shadow-xl py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-10 flex items-center justify-between w-full">
          {/* Left: Clean Sans-Serif Logo exactly inspired by image */}
          <div className="flex items-center">
            <a
              href="/"
              onClick={(e) => {
                if (window.location.pathname === "/") {
                  e.preventDefault();
                  handleLogoClick();
                }
              }}
              className="group relative flex items-center gap-2.5 text-left focus:outline-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Techies Community Logo"
                className="h-5 sm:h-[22px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="font-jakarta text-xl sm:text-2xl font-bold tracking-tight text-white transition-opacity group-hover:opacity-90">
                Techies<span className="text-slate-400 font-normal">Community</span>
              </span>

              {logoClicks > 0 && logoClicks < 5 && (
                <span className="absolute -bottom-4 left-0 text-[10px] font-inter font-semibold text-slate-400 animate-pulse">
                  [{5 - logoClicks} more for Easter Egg]
                </span>
              )}
            </a>
          </div>

          {/* Center: Navigation Links matching user requested concise items */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-inter text-sm font-semibold text-slate-300/90 transition-colors hover:text-white tracking-wide"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right: Direct button to TechPass */}
          <div className="hidden items-center md:flex">
            <a
              href="/#techpass"
              className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-b from-white via-slate-100 to-slate-200 pl-6 pr-1.5 py-1.5 font-inter text-sm font-semibold text-neutral-950 shadow-md transition-all hover:scale-105"
            >
              <span>Claim TechPass</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-white transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white md:hidden"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-4 right-4 mt-2 flex flex-col gap-4 rounded-3xl border border-white/15 bg-[#030509]/95 p-6 shadow-2xl backdrop-blur-2xl md:hidden"
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-inter text-base font-semibold text-white/90 transition-colors hover:text-white"
                >
                  {link.name}
                </a>
              ))}
              <div className="my-2 h-[1px] w-full bg-white/10" />
              <a
                href="/#techpass"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-3 rounded-full bg-gradient-to-b from-white via-slate-100 to-slate-200 pl-6 pr-2 py-2.5 font-inter text-sm font-semibold text-neutral-950 shadow-md"
              >
                <span>Claim TechPass</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-white">
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <EasterEggModal isOpen={isEasterEggOpen} onClose={() => setIsEasterEggOpen(false)} />
    </>
  );
}
