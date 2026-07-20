"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Upload,
  RefreshCw,
  Download,
  FileText,
  Share2,
  Check,
  Plus,
  X,
  Shield,
  Palette,
} from "lucide-react";
import TechPassCard, { TechPassData, TechPassTheme } from "@/components/techpass/TechPassCard";

export default function TechPassSection() {
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [theme, setTheme] = useState<TechPassTheme>("aurora-violet");
  const [customTagInput, setCustomTagInput] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<TechPassData>({
    profilePhoto: "",
    fullName: "Alex Vance",
    designation: "AI & Systems Architect",
    collegeCompany: "Stanford University",
    expertiseTags: ["AI", "Web Architecture", "UI/UX", "Startups"],
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    whatsapp: "14155552671",
    email: "alex@vance.ai",
    techId: "TECH-4831",
    createdAt: "2026-07-19T19:40:00.000Z",
  });

  useEffect(() => {
    // Stable ID and local profile handling
    const savedId = localStorage.getItem("techpass_my_id");
    const savedData = localStorage.getItem("techpass_my_data");

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (!savedId && parsed.techId) {
          localStorage.setItem("techpass_my_id", parsed.techId);
        }
        setFormData((prev) => ({
          ...prev,
          ...parsed,
          techId: savedId || parsed.techId || prev.techId,
          createdAt: parsed.createdAt || new Date().toISOString(),
        }));
      } catch (err) {
        console.error("Failed to parse saved TechPass data", err);
      }
    } else if (savedId) {
      setFormData((prev) => ({ ...prev, techId: savedId }));
    } else {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const newId = `TECH-${randomNum}`;
      localStorage.setItem("techpass_my_id", newId);
      setFormData((prev) => ({ ...prev, techId: newId, createdAt: new Date().toISOString() }));
    }
  }, []);

  useEffect(() => {
    if (formData.techId) {
      localStorage.setItem("techpass_my_data", JSON.stringify(formData));
    }
  }, [formData]);

  const generateRandomId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `TECH-${randomNum}`;
    localStorage.setItem("techpass_my_id", newId);
    setFormData((prev) => ({ ...prev, techId: newId }));
    showToast("Generated and saved new TechPass ID!");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setFormData((prev) => ({ ...prev, profilePhoto: ev.target!.result as string }));
        showToast("Profile picture updated!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim().replace(/^#/, "");
    if (!trimmed || formData.expertiseTags.includes(trimmed)) return;
    if (formData.expertiseTags.length >= 6) {
      showToast("Maximum 6 expertise tags allowed.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      expertiseTags: [...prev.expertiseTags, trimmed],
    }));
    setCustomTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      expertiseTags: prev.expertiseTags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleDownloadPNG = async () => {
    if (!cardRef.current) return;
    try {
      showToast("Generating high-resolution PNG...");
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, {
        backgroundColor: "#060a17",
        cacheBust: true,
        pixelRatio: 3,
        style: {
          transform: "scale(1)",
        },
      });
      const link = document.createElement("a");
      link.download = `${formData.techId || "TECHPASS"}-${formData.fullName.replace(/\s+/g, "_")}.png`;
      link.href = dataUrl;
      link.click();
      showToast("PNG downloaded successfully!");
    } catch (err) {
      console.error("Failed to generate PNG", err);
      showToast("Error generating PNG image.");
    }
  };

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    try {
      showToast("Generating printable PDF document...");
      const { toPng } = await import("html-to-image");
      const { default: jsPDF } = await import("jspdf");
      const dataUrl = await toPng(cardRef.current, {
        backgroundColor: "#060a17",
        cacheBust: true,
        pixelRatio: 3,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [100, 165],
      });

      pdf.addImage(dataUrl, "PNG", 5, 5, 90, 155);
      pdf.save(`${formData.techId || "TECHPASS"}-${formData.fullName.replace(/\s+/g, "_")}.pdf`);
      showToast("PDF downloaded successfully!");
    } catch (err) {
      console.error("Failed to generate PDF", err);
      showToast("Error generating PDF document.");
    }
  };

  const handleShareCard = async () => {
    const shareText = `Check out my official Techies Community TechPass (${formData.techId}) as a ${formData.designation} at ${formData.collegeCompany}! Build Beyond Boundaries.`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `TechPass | ${formData.fullName}`,
          text: shareText,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      showToast("TechPass details copied to clipboard!");
    }
  };

  const quickTags = ["AI", "Web", "UI/UX", "Startup", "Content", "Rust", "Cyber", "Cloud"];
  const themes: { id: TechPassTheme; name: string; colorClass: string }[] = [
    { id: "aurora-violet", name: "Silver Glass", colorClass: "from-slate-200 to-slate-400" },
    { id: "neon-cyan", name: "Pure Glass", colorClass: "from-slate-100 to-slate-300" },
    { id: "electric-blue", name: "Dark Frosted", colorClass: "from-slate-400 to-slate-600" },
    { id: "holographic", name: "Platinum Ring", colorClass: "from-white via-slate-300 to-slate-500" },
  ];

  return (
    <section id="techpass" className="relative w-full py-16 sm:py-20 px-4 sm:px-8 bg-[#030509] overflow-hidden">
      {/* Background Image with Screen Blend Mode */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <img
          src="/techpass-bg.png"
          alt="TechPass Space Background"
          className="w-full h-full object-cover mix-blend-screen opacity-95 scale-105"
        />
      </div>

      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-24 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-white/20 bg-[#030509]/95 px-5 py-3 font-inter text-xs font-semibold text-white shadow-xl backdrop-blur-xl"
        >
          <Check className="h-4 w-4 text-white" />
          <span>{toastMessage}</span>
        </motion.div>
      )}

      {/* Header */}
      <div className="relative z-10 mx-auto max-w-5xl text-center mb-10">
        {/* Flex layout: Heading on left (order-1), Video on right (order-2) */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 w-full">
          {/* Hero-style font & color split */}
          <h2 className="order-1 font-jakarta text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl text-center md:text-right">
            Forge Your <span className="bg-gradient-to-b from-slate-200 via-slate-400 to-slate-500 bg-clip-text text-transparent">TechPass</span>
          </h2>

          {/* Responsive Small Horizontal Video Player on Right Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="order-2 flex-shrink-0 w-[110px] sm:w-[130px] aspect-video rounded-xl overflow-hidden border border-white/20 bg-white/[0.05] shadow-2xl relative group cursor-pointer hover:border-white/40"
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
              <span className="h-1.5 w-1.5 rounded-full bg-aurora-cyan animate-pulse" />
              LIVE
            </div>
          </motion.div>
        </div>

        <p className="mt-4 font-inter text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
          Create your digital credential for our society of builders. All processing runs 100% locally in your browser — zero tracking, zero database.
        </p>
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
        {/* LEFT COLUMN: Builder Form (Blur bg card WITHOUT any color in the bg) */}
        <div className="lg:col-span-7 rounded-[32px] border border-white/15 bg-white/[0.04] p-8 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-8">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
            <h3 className="font-jakarta text-2xl font-bold text-white flex items-center gap-2.5">
              <Sparkles className="h-5 w-5 text-white" />
              <span>Identity Configuration</span>
            </h3>

            <button
              onClick={generateRandomId}
              className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 font-inter text-xs font-semibold text-slate-200 transition-colors hover:border-white hover:bg-white/10 hover:text-white"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{formData.techId}</span>
            </button>
          </div>

          <div>
            <label className="block font-inter text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Builder Profile Avatar
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-full border border-white/20 bg-white/[0.06] shadow-inner shrink-0">
                  {formData.profilePhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={formData.profilePhoto} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-inter text-xl font-bold text-white">
                      {formData.fullName.charAt(0) || "?"}
                    </div>
                  )}
                </div>
                <div className="sm:hidden">
                  <span className="block font-jakarta text-sm font-bold text-white">Profile Photo</span>
                  <span className="block font-inter text-[11px] text-slate-400">JPG, PNG or WEBP</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/15 px-5 py-2.5 font-inter text-xs font-bold text-white transition-all hover:bg-white hover:text-neutral-950 shadow-md cursor-pointer"
                >
                  <Upload className="h-4 w-4 shrink-0" />
                  <span>UPLOAD PHOTO</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                {formData.profilePhoto && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, profilePhoto: "" }))}
                    className="w-full sm:w-auto rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 font-inter text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block font-inter text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                placeholder="e.g., Alex Vance"
                className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 font-inter text-sm text-white placeholder-white/40 focus:border-white/40 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-inter text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Designation / Role
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData((prev) => ({ ...prev, designation: e.target.value }))}
                placeholder="e.g., AI Systems Architect"
                className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 font-inter text-sm text-white placeholder-white/40 focus:border-white/40 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-inter text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                College / Company / Incubator
              </label>
              <input
                type="text"
                value={formData.collegeCompany}
                onChange={(e) => setFormData((prev) => ({ ...prev, collegeCompany: e.target.value }))}
                placeholder="e.g., Stanford University / Y Combinator"
                className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 font-inter text-sm text-white placeholder-white/40 focus:border-white/40 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-inter text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
              Expertise Tags (Max 6)
            </label>

            <div className="flex flex-wrap gap-2 mb-3.5">
              {formData.expertiseTags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1 font-inter text-xs font-semibold text-slate-200"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-white/60 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3.5">
              <span className="font-inter text-xs text-white/50 font-medium self-center mr-1">QUICK ADD:</span>
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddTag(tag)}
                  className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-inter text-xs text-white/70 hover:border-white hover:text-white"
                >
                  +{tag}
                </button>
              ))}
            </div>

            <div className="flex gap-2.5">
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag(customTagInput);
                  }
                }}
                placeholder="Add custom tag (e.g., Solidity, Next.js)"
                className="flex-1 rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 font-inter text-sm text-white placeholder-white/40 focus:border-white/40 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleAddTag(customTagInput)}
                className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-inter text-xs font-bold text-white transition-colors hover:bg-white/20"
              >
                <Plus className="h-4 w-4" />
                <span>ADD</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-inter text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Instagram URL
              </label>
              <input
                type="url"
                value={formData.instagram}
                onChange={(e) => setFormData((prev) => ({ ...prev, instagram: e.target.value }))}
                placeholder="https://instagram.com/handle"
                className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 font-inter text-xs text-white placeholder-white/40 focus:border-white/40 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-inter text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData((prev) => ({ ...prev, linkedin: e.target.value }))}
                placeholder="https://linkedin.com/in/handle"
                className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 font-inter text-xs text-white placeholder-white/40 focus:border-white/40 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-inter text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData((prev) => ({ ...prev, github: e.target.value }))}
                placeholder="https://github.com/handle"
                className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 font-inter text-xs text-white placeholder-white/40 focus:border-white/40 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-inter text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                WhatsApp Number (for QR Code)
              </label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData((prev) => ({ ...prev, whatsapp: e.target.value }))}
                placeholder="e.g., +919999999999"
                className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 font-inter text-xs text-white placeholder-white/40 focus:border-white/40 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-inter text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="e.g., alex@vance.ai"
                className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 font-inter text-xs text-white placeholder-white/40 focus:border-white/40 focus:outline-none"
              />
            </div>
          </div>

          <div className="border-t border-white/[0.08] pt-6">
            <label className="block font-inter text-xs font-bold uppercase tracking-wider text-slate-300 mb-3.5 flex items-center gap-2">
              <Palette className="h-4 w-4 text-white" />
              <span>Select Card Accent Style</span>
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {themes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-xs font-semibold transition-all ${
                    theme === t.id
                      ? "border-white bg-white/20 text-white shadow-md scale-105"
                      : "border-white/10 bg-white/5 text-white/70 hover:border-white/30"
                  }`}
                >
                  <div className={`h-3.5 w-3.5 rounded-full bg-gradient-to-tr ${t.colorClass}`} />
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Card Preview & Exports */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="sticky top-28 flex flex-col items-center w-full">
            <div className="mb-5 flex items-center gap-2 font-inter text-xs font-bold uppercase tracking-widest text-slate-300">
              <span className="h-2 w-2 rounded-full bg-white" />
              <span>LIVE CARD PREVIEW</span>
            </div>

            <div className="w-full flex justify-center py-2">
              <TechPassCard data={formData} theme={theme} cardRef={cardRef} />
            </div>

            <div className="mt-8 grid w-full max-w-[380px] grid-cols-3 gap-3.5">
              <button
                onClick={handleDownloadPNG}
                className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/[0.05] p-4 font-inter text-xs font-bold text-white shadow-md transition-all hover:scale-105 hover:border-white hover:bg-white/10 backdrop-blur-md"
              >
                <Download className="h-5 w-5 text-white transition-transform group-hover:-translate-y-0.5" />
                <span>PNG CARD</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/[0.05] p-4 font-inter text-xs font-bold text-white shadow-md transition-all hover:scale-105 hover:border-white hover:bg-white/10 backdrop-blur-md"
              >
                <FileText className="h-5 w-5 text-white transition-transform group-hover:-translate-y-0.5" />
                <span>PDF DOC</span>
              </button>

              <button
                onClick={handleShareCard}
                className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/[0.05] p-4 font-inter text-xs font-bold text-white shadow-md transition-all hover:scale-105 hover:border-white hover:bg-white/10 backdrop-blur-md"
              >
                <Share2 className="h-5 w-5 text-white transition-transform group-hover:rotate-12" />
                <span>SHARE</span>
              </button>
            </div>
            <span className="mt-3.5 font-inter text-xs text-white/50 text-center font-normal">
              Generated cards belong entirely to you. Zero server storage.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
