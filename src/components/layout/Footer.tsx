"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { FaInstagram, FaLinkedin, FaGithub, FaDiscord, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const [currentYear, setCurrentYear] = React.useState<number>(2026);

  React.useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const socialLinks = [
    { name: "Instagram", icon: FaInstagram, href: "https://instagram.com" },
    { name: "X / Twitter", icon: FaXTwitter, href: "https://twitter.com" },
    { name: "Discord", icon: FaDiscord, href: "https://discord.com" },
    { name: "LinkedIn", icon: FaLinkedin, href: "https://linkedin.com" },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#030509] pt-20 pb-6 text-white border-t border-white/[0.08]">
      {/* Ambient top gradient — blends page content into footer */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-transparent via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 section-ambient opacity-60" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8">
        {/* Top Main Grid */}
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-start">
          {/* Left Column: Brand + Subscribe */}
          <div className="flex flex-col max-w-lg gap-6">
            {/* Brand mark */}
            <div>
              <a href="/" className="group inline-flex items-center gap-2.5 font-jakarta text-xl font-bold tracking-tight text-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Techies Community Logo"
                  className="h-5 sm:h-[22px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <span>
                  Techies<span className="text-slate-400 font-normal">Community</span>
                </span>
              </a>
              <p className="mt-2 font-inter text-sm text-slate-400 leading-relaxed max-w-xs">
                For dreamers, builders, and innovators who choose to create their own path.
              </p>
            </div>

            {/* Subscribe Form */}
            <div>
              <h3 className="font-jakarta text-base font-bold tracking-tight text-white mb-3">
                Stay in the loop
              </h3>
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row items-stretch gap-2.5">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 font-inter text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 backdrop-blur-md transition-colors"
                />
                <button
                  type="submit"
                  className="btn-primary pl-6 pr-2 py-2 whitespace-nowrap"
                >
                  <span>Subscribe</span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-white shadow-inner">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Quick Links & Follow Us */}
          <div className="flex flex-wrap gap-12 sm:gap-20">
            {/* Quick Links */}
            <div className="flex flex-col gap-3">
              <span className="font-inter text-xs font-bold uppercase tracking-widest text-white/40 mb-1">
                Quick Links
              </span>
              <a href="/#story" className="font-inter text-sm text-white/70 transition-colors hover:text-white">
                About Us
              </a>
              <a href="/#universe" className="font-inter text-sm text-white/70 transition-colors hover:text-white">
                Tech Universe
              </a>
              <a href="/#roadmap" className="font-inter text-sm text-white/70 transition-colors hover:text-white">
                Community Journey
              </a>
              <a href="/#highlights" className="font-inter text-sm text-white/70 transition-colors hover:text-white">
                Highlights
              </a>
              <a href="/connections" className="font-inter text-sm text-white/70 transition-colors hover:text-white">
                Connections Hub
              </a>
            </div>

            {/* Follow Us */}
            <div className="flex flex-col gap-3">
              <span className="font-inter text-xs font-bold uppercase tracking-widest text-white/40 mb-1">
                Follow Us
              </span>
              <div className="pt-1 border-t border-white/[0.07]" />
              <div className="flex items-center gap-2.5">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-all hover:scale-110 hover:border-white/30 hover:bg-white hover:text-neutral-950 shadow-sm"
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row — Privacy / Copyright */}
        <div className="mt-14 flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-t border-white/[0.07] pt-6">
          <div className="flex items-center gap-6 font-inter text-xs text-white/40">
            <a href="#privacy" className="hover:text-white/70 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-white/70 transition-colors">
              Terms &amp; Services
            </a>
          </div>

          <p className="font-inter text-xs text-white/40">
            &copy; {currentYear} Techies Community. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* Massive Watermark */}
      <div className="w-full overflow-hidden flex justify-center select-none pointer-events-none mt-8">
        <h2 className="font-jakarta font-black text-[19vw] sm:text-[21vw] leading-[0.75] tracking-tighter uppercase bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-transparent bg-clip-text text-transparent">
          TECHIES
        </h2>
      </div>
    </footer>
  );
}
