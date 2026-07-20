"use client";

import React, { useEffect, useState } from "react";
import { Shield, QrCode, Globe, CheckCircle2, Award } from "lucide-react";
import { FaInstagram, FaLinkedin, FaGithub, FaWhatsapp } from "react-icons/fa6";

export interface TechPassData {
  profilePhoto: string; // Base64 or URL
  fullName: string;
  designation: string;
  collegeCompany: string;
  expertiseTags: string[];
  instagram: string;
  linkedin: string;
  github: string;
  whatsapp: string;
  techId: string;
  email?: string;
  createdAt?: string;
}

export type TechPassTheme = "aurora-violet" | "neon-cyan" | "electric-blue" | "holographic";

interface TechPassCardProps {
  data: TechPassData;
  theme: TechPassTheme;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export default function TechPassCard({ data, theme, cardRef }: TechPassCardProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [issuedDate, setIssuedDate] = useState<string>("ISSUED: ACTIVE");

  useEffect(() => {
    setIssuedDate(
      `ISSUED: ${new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase()}`
    );
  }, []);

  useEffect(() => {
    const generateQr = async () => {
      try {
        const qrcodeMod = await import("qrcode");
        const QRCode = qrcodeMod.default || qrcodeMod;

        // Data Validation & Formatting
        const cleanNumber = (data.whatsapp || "").trim().replace(/[^0-9+]/g, "");
        const formattedWhatsapp = cleanNumber
          ? (cleanNumber.startsWith("+") ? cleanNumber : `+${cleanNumber}`)
          : "";

        const payload = {
          techpassId: (data.techId || "").trim(),
          name: (data.fullName || "").trim(),
          designation: (data.designation || "").trim(),
          organization: (data.collegeCompany || "").trim(),
          expertise: Array.isArray(data.expertiseTags)
            ? data.expertiseTags.map((t) => t.trim()).filter(Boolean)
            : [],
          instagram: (data.instagram || "").trim(),
          linkedin: (data.linkedin || "").trim(),
          github: (data.github || "").trim(),
          whatsapp: formattedWhatsapp,
          email: (data.email || "").trim(),
          createdAt: data.createdAt || new Date().toISOString(),
        };

        const qrText = JSON.stringify(payload);

        const url = await QRCode.toDataURL(qrText, {
          width: 220,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error("Error generating QR code", err);
      }
    };
    generateQr();
  }, [data]);

  const themeMap: Record<
    TechPassTheme,
    {
      cardBg: string;
      border: string;
      glow: string;
      badgeBg: string;
      textHighlight: string;
      tagClass: string;
      accentDot: string;
      orbGlow: string;
    }
  > = {
    "aurora-violet": {
      cardBg: "bg-gradient-to-br from-slate-800/40 via-[#060a17]/95 to-slate-900/80",
      border: "border-slate-300/40",
      glow: "shadow-2xl shadow-slate-950/90",
      badgeBg: "from-slate-200 to-slate-400 text-slate-900 font-bold border-slate-300/60",
      textHighlight: "bg-gradient-to-r from-slate-200 via-white to-slate-400 bg-clip-text text-transparent font-bold",
      tagClass: "border-slate-400/30 bg-slate-300/10 text-slate-200",
      accentDot: "bg-slate-300",
      orbGlow: "from-slate-400/15 via-slate-600/10 to-transparent",
    },
    "neon-cyan": {
      cardBg: "bg-gradient-to-br from-white/[0.14] via-[#060a17]/90 to-white/[0.05]",
      border: "border-white/40",
      glow: "shadow-2xl shadow-black",
      badgeBg: "from-white via-slate-100 to-white text-neutral-950 font-extrabold border-white",
      textHighlight: "text-white font-extrabold tracking-wide",
      tagClass: "border-white/35 bg-white/10 text-white font-semibold",
      accentDot: "bg-white",
      orbGlow: "from-white/15 via-slate-300/10 to-transparent",
    },
    "electric-blue": {
      cardBg: "bg-gradient-to-br from-[#0c1322]/95 via-[#030509]/95 to-[#080d1a]/95",
      border: "border-slate-600/50",
      glow: "shadow-2xl shadow-black",
      badgeBg: "from-slate-700 via-slate-800 to-slate-900 text-slate-200 border-slate-600/60",
      textHighlight: "text-slate-300 font-bold",
      tagClass: "border-slate-700/60 bg-slate-800/40 text-slate-300",
      accentDot: "bg-slate-400",
      orbGlow: "from-slate-700/20 via-slate-900/15 to-transparent",
    },
    holographic: {
      cardBg: "bg-gradient-to-br from-slate-400/25 via-[#060a17]/90 to-slate-500/20",
      border: "border-slate-200/50",
      glow: "shadow-2xl shadow-black/90",
      badgeBg: "from-slate-100 via-slate-300 to-slate-400 text-slate-950 font-extrabold border-slate-300",
      textHighlight: "bg-gradient-to-r from-slate-100 via-slate-300 to-slate-400 bg-clip-text text-transparent font-bold",
      tagClass: "border-slate-300/40 bg-gradient-to-r from-slate-300/15 via-slate-400/15 to-slate-500/15 text-slate-100",
      accentDot: "bg-slate-200",
      orbGlow: "from-slate-300/20 via-slate-500/15 to-transparent",
    },
  };

  const currentTheme = themeMap[theme] || themeMap["aurora-violet"];

  return (
    <div
      ref={cardRef}
      className={`relative w-full max-w-[360px] sm:max-w-[400px] overflow-hidden rounded-[32px] border p-6 text-white backdrop-blur-2xl transition-all duration-500 ${currentTheme.cardBg} ${currentTheme.border} ${currentTheme.glow}`}
    >
      {/* Ambient background glowing orb inside card */}
      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br opacity-80 blur-2xl transition-all duration-500 ${currentTheme.orbGlow}`}
      />

      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-slate-800 to-slate-900 shadow-sm border border-white/20 p-1.5 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Techies" className="h-full w-full object-contain" />
          </div>
          <span className="font-inter text-sm font-extrabold tracking-wider text-white">
            TECHIES<span className="text-slate-400">.</span>
          </span>
        </div>

        <div className={`flex items-center gap-2 rounded-full border px-2.5 py-1 bg-gradient-to-r shadow-sm ${currentTheme.badgeBg}`}>
          <span className={`flex h-2 w-2 rounded-full ${currentTheme.accentDot}`} />
          <span className="font-inter text-[10px] font-extrabold tracking-widest uppercase">
            VERIFIED BUILDER
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-5 flex items-center gap-4">
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-white/[0.05] shadow-sm">
          {data.profilePhoto ? (
            <img src={data.profilePhoto} alt={data.fullName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-transparent text-white/50">
              <Shield className="h-8 w-8 text-white/60" />
              <span className="mt-1 font-inter text-[9px] uppercase tracking-wider font-semibold">NO PHOTO</span>
            </div>
          )}
        </div>

        <div className="flex flex-col overflow-hidden">
          <span className="font-inter text-[10px] tracking-widest text-white/50 uppercase font-semibold">
            ID: {data.techId || "TECH-0000"}
          </span>
          <h4 className="truncate font-jakarta text-xl font-extrabold text-white sm:text-2xl">
            {data.fullName || "Builder Name"}
          </h4>
          <p className={`truncate font-inter text-xs sm:text-sm ${currentTheme.textHighlight}`}>
            {data.designation || "Innovator & Creator"}
          </p>
          <span className="mt-0.5 truncate font-inter text-xs font-medium text-slate-300">
            @ {data.collegeCompany || "Community Universe"}
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-5">
        <span className="font-inter text-[10px] tracking-wider text-white/50 uppercase font-semibold">
          EXPERTISE MATRIX
        </span>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {data.expertiseTags && data.expertiseTags.length > 0 ? (
            data.expertiseTags.map((tag, idx) => (
              <span
                key={idx}
                className={`rounded-lg border px-2.5 py-1 font-inter text-[11px] font-semibold shadow-sm transition-all ${currentTheme.tagClass}`}
              >
                #{tag}
              </span>
            ))
          ) : (
            <span className="font-inter text-xs text-white/40 italic">No expertise tags added yet.</span>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
        <div className="flex flex-col">
          <span className="font-inter text-[10px] tracking-wider text-white/50 uppercase font-semibold">
            NETWORK LINK
          </span>
          <div className="mt-1.5 flex items-center gap-2.5">
            {data.github && (
              <a
                href={data.github}
                target="_blank"
                rel="noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-neutral-950 transition-colors"
                title="GitHub"
              >
                <FaGithub className="h-3.5 w-3.5" />
              </a>
            )}
            {data.linkedin && (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-neutral-950 transition-colors"
                title="LinkedIn"
              >
                <FaLinkedin className="h-3.5 w-3.5" />
              </a>
            )}
            {data.instagram && (
              <a
                href={data.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-neutral-950 transition-colors"
                title="Instagram"
              >
                <FaInstagram className="h-3.5 w-3.5" />
              </a>
            )}
            {data.whatsapp && (
              <a
                href={`https://wa.me/${data.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-neutral-950 transition-colors"
                title="WhatsApp Contact"
              >
                <FaWhatsapp className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
          <span className="mt-1 font-inter text-[9px] text-white/40 font-semibold">
            {issuedDate}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white p-1 shadow-md">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="TechPass QR" className="h-full w-full rounded object-contain" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[9px] font-inter font-semibold text-neutral-800">
                QR
              </div>
            )}
          </div>
          <span className="mt-1 font-inter text-[8px] tracking-widest text-slate-300 font-bold">
            SCAN MATRIX
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-white/[0.04] px-3 py-1.5 border border-white/10">
        <div className="flex items-center gap-1.5 font-inter text-[9px] text-white/80 font-semibold">
          <CheckCircle2 className="h-3 w-3 text-white" />
          <span>TECHIES NETWORK PASSPORT</span>
        </div>
        <span className="font-inter text-[9px] font-bold tracking-widest text-slate-300">
          [SECURE ID]
        </span>
      </div>
    </div>
  );
}
