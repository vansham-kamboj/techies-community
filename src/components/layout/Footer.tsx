"use client";

import React from "react";
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
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8">
        {/* Top Main Grid */}
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-start">
          {/* Left Column: Subscribe Form */}
          <div className="flex flex-col max-w-lg">
            <h3 className="font-jakarta text-xl sm:text-2xl font-bold tracking-tight text-white mb-4">
              Subscribe for latest update
            </h3>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-wrap sm:flex-nowrap items-center gap-3">
              <input
                type="email"
                placeholder="Enter email to subscribe"
                className="w-full sm:w-auto flex-1 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 font-inter text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30 backdrop-blur-md"
              />
              <button
                type="submit"
                className="rounded-full bg-white px-6 py-3 font-inter text-sm font-bold text-neutral-950 transition-all hover:scale-105 hover:bg-slate-200 shadow-md whitespace-nowrap"
              >
                Subscribe Now
              </button>
            </form>
          </div>

          {/* Right Column: Quick Links & Follow Us */}
          <div className="flex flex-wrap gap-12 sm:gap-20">
            {/* Quick Links */}
            <div className="flex flex-col gap-3">
              <span className="font-inter text-sm text-white/50 font-normal mb-1">
                Quick Links
              </span>
              <a href="#story" className="font-inter text-sm text-white/80 transition-colors hover:text-white">
                About Us
              </a>
              <a href="#universe" className="font-inter text-sm text-white/80 transition-colors hover:text-white">
                Technology
              </a>
              <a href="#roadmap" className="font-inter text-sm text-white/80 transition-colors hover:text-white">
                Future Exploration
              </a>
              <a href="#highlights" className="font-inter text-sm text-white/80 transition-colors hover:text-white">
                Space Blog
              </a>
            </div>

            {/* Follow Us */}
            <div className="flex flex-col gap-3">
              <span className="font-inter text-sm text-white/50 font-normal mb-1">
                Follow Us
              </span>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:scale-110 hover:bg-white hover:text-neutral-950 shadow-sm"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Middle/Bottom Row of Links & Copyright before the Big Text */}
        <div className="mt-14 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-6 font-inter text-sm text-white/70">
            <a href="#privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-white transition-colors">
              Terms & Services
            </a>
          </div>

          <p className="font-inter text-sm text-white/50">
            &copy; {currentYear} Techies Community All Rights Reserved
          </p>
        </div>
      </div>

      {/* Massive Watermark Font across the Bottom ("write techies in big fonts") */}
      <div className="w-full overflow-hidden flex justify-center select-none pointer-events-none mt-10 pt-6 border-t border-white/[0.06]">
        <h1 className="font-jakarta font-black text-[19vw] sm:text-[21vw] leading-[0.75] tracking-tighter uppercase text-white/[0.08] bg-gradient-to-b from-white/20 via-white/[0.06] to-transparent bg-clip-text text-transparent">
          TECHIES
        </h1>
      </div>
    </footer>
  );
}

