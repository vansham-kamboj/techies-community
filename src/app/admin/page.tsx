"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Lock,
  Search,
  RefreshCw,
  Download,
  LogOut,
  Trash2,
  Eye,
  Copy,
  Check,
  ExternalLink,
  X,
  Users,
  Award,
  Calendar,
  Layers,
  FileSpreadsheet,
} from "lucide-react";
import {
  checkAdminSession,
  adminLogin,
  adminLogout,
  getTechPassCards,
  deleteTechPassCard,
  getScannedConnections,
  deleteScannedConnection,
  DbTechPassCard,
} from "@/app/actions/techpass";
import { ConnectionRecord } from "@/components/connections/ConnectionsExportImport";
import TechPassCard, { TechPassData } from "@/components/techpass/TechPassCard";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<"directory" | "connections">("directory");
  const [cards, setCards] = useState<DbTechPassCard[]>([]);
  const [connections, setConnections] = useState<ConnectionRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingCards, setLoadingCards] = useState(false);
  const [loadingConnections, setLoadingConnections] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [selectedCard, setSelectedCard] = useState<DbTechPassCard | null>(null);
  const modalCardRef = useRef<HTMLDivElement>(null);

  // Check admin session on mount
  useEffect(() => {
    async function initAuth() {
      const auth = await checkAdminSession();
      setIsAuthenticated(auth);
      if (auth) {
        fetchCards();
      }
    }
    initAuth();
  }, []);

  const fetchCards = async (query?: string) => {
    const q = query !== undefined ? query : searchQuery;
    setLoadingCards(true);
    setLoadingConnections(true);
    const [cardsRes, connRes] = await Promise.all([
      getTechPassCards(q),
      getScannedConnections(q),
    ]);
    if (cardsRes.success) setCards(cardsRes.cards);
    if (connRes.success) setConnections(connRes.connections);
    setLoadingCards(false);
    setLoadingConnections(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    const res = await adminLogin(passwordInput);
    setLoginLoading(false);
    if (res.success) {
      setIsAuthenticated(true);
      setPasswordInput("");
      fetchCards();
    } else {
      setLoginError(res.error || "Login failed.");
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    setIsAuthenticated(false);
    setCards([]);
    setConnections([]);
  };

  const handleDelete = async (techId: string) => {
    if (!window.confirm(`Are you sure you want to delete TechPass card ${techId}?`)) return;
    const res = await deleteTechPassCard(techId);
    if (res.success) {
      setCards((prev) => prev.filter((c) => c.tech_id !== techId));
    } else {
      alert(res.error || "Failed to delete card.");
    }
  };

  const handleDeleteConnection = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete scanned connection ${id}?`)) return;
    const res = await deleteScannedConnection(id);
    if (res.success) {
      setConnections((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert(res.error || "Failed to delete connection.");
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    if (activeTab === "directory") {
      if (cards.length === 0) return;
      const headers = [
        "Tech ID",
        "Full Name",
        "Designation",
        "College / Company",
        "Expertise Tags",
        "Email",
        "WhatsApp",
        "GitHub",
        "LinkedIn",
        "Instagram",
        "Created At",
      ];
      const rows = cards.map((c) => [
        c.tech_id,
        `"${(c.full_name || "").replace(/"/g, '""')}"`,
        `"${(c.designation || "").replace(/"/g, '""')}"`,
        `"${(c.college_company || "").replace(/"/g, '""')}"`,
        `"${(c.expertise_tags || []).join(", ")}"`,
        c.email || "",
        c.whatsapp || "",
        c.github || "",
        c.linkedin || "",
        c.instagram || "",
        c.created_at || "",
      ]);

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `techies_techpass_cards_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      if (connections.length === 0) return;
      const headers = [
        "Record ID",
        "Contact Tech ID",
        "Scanned By (User ID)",
        "Name",
        "Designation",
        "Organization",
        "Expertise",
        "Email",
        "WhatsApp",
        "GitHub",
        "LinkedIn",
        "Instagram",
        "Scanned At",
      ];
      const rows = connections.map((c) => [
        c.id,
        c.techpassId || "",
        c.userTechId || "",
        `"${(c.name || "").replace(/"/g, '""')}"`,
        `"${(c.designation || "").replace(/"/g, '""')}"`,
        `"${(c.organization || "").replace(/"/g, '""')}"`,
        `"${(c.expertise || []).join(", ")}"`,
        c.email || "",
        c.whatsapp || "",
        c.github || "",
        c.linkedin || "",
        c.instagram || "",
        c.scannedAt || "",
      ]);

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `techies_scanned_connections_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Convert DbTechPassCard to TechPassData for modal preview
  const convertToCardData = (c: DbTechPassCard): TechPassData => ({
    profilePhoto: c.profile_photo || "",
    fullName: c.full_name || "Anonymous",
    designation: c.designation || "",
    collegeCompany: c.college_company || "",
    expertiseTags: c.expertise_tags || [],
    instagram: c.instagram || "",
    linkedin: c.linkedin || "",
    github: c.github || "",
    whatsapp: c.whatsapp || "",
    email: c.email || "",
    techId: c.tech_id || "TECH-0000",
    createdAt: c.created_at || new Date().toISOString(),
  });

  // Calculate quick metrics
  const totalCards = cards.length;
  const topInstitution = React.useMemo(() => {
    const counts: Record<string, number> = {};
    cards.forEach((c) => {
      if (c.college_company) counts[c.college_company] = (counts[c.college_company] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0] ? `${sorted[0][0]} (${sorted[0][1]})` : "None yet";
  }, [cards]);

  const topTag = React.useMemo(() => {
    const counts: Record<string, number> = {};
    cards.forEach((c) => {
      (c.expertise_tags || []).forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0] ? `#${sorted[0][0]} (${sorted[0][1]})` : "None yet";
  }, [cards]);

  const totalConnections = connections.length;
  const topConnOrg = React.useMemo(() => {
    const counts: Record<string, number> = {};
    connections.forEach((c) => {
      if (c.organization) counts[c.organization] = (counts[c.organization] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0] ? `${sorted[0][0]} (${sorted[0][1]})` : "None yet";
  }, [connections]);

  const topConnTag = React.useMemo(() => {
    const counts: Record<string, number> = {};
    connections.forEach((c) => {
      (c.expertise || []).forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0] ? `#${sorted[0][0]} (${sorted[0][1]})` : "None yet";
  }, [connections]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#030509] text-white">
        <RefreshCw className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#030509] px-6 py-12 text-white selection:bg-white/20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full rounded-2xl border border-white/15 bg-[#060a12] p-8 shadow-2xl backdrop-blur-2xl"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 border border-white/15 text-white mb-6">
            <Shield className="h-6 w-6 text-white" />
          </div>

          <h1 className="font-jakarta text-2xl font-bold tracking-tight text-white">
            Admin Command Matrix
          </h1>
          <p className="mt-2 font-inter text-sm text-slate-400 leading-relaxed">
            Enter your administrative credentials to access the verified TechPass database and NeonDB cloud telemetry.
          </p>

          <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block font-inter text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Authorization Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter access key..."
                  required
                  className="w-full rounded-xl border border-white/15 bg-white/[0.03] pl-10 pr-4 py-3 font-inter text-sm text-white placeholder-white/30 focus:border-white/40 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {loginError && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-300 font-inter">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full rounded-xl border border-white/25 bg-white py-3 font-inter text-sm font-bold text-neutral-950 transition-all hover:bg-slate-200 disabled:opacity-50 cursor-pointer"
            >
              {loginLoading ? "Verifying Access..." : "Enter Command Matrix"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <a
              href="/"
              className="font-inter text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Return to Techies Community Website
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#030509] text-white px-6 sm:px-10 py-8">
      {/* Top Header Navigation */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/15 text-white">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-jakarta text-lg sm:text-xl font-bold tracking-tight text-white">
              Techies Command Matrix
            </h1>
            <p className="font-inter text-xs text-slate-400">
              NeonDB PostgreSQL Cloud Management • Verified TechPass Directory
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <button
            onClick={() => fetchCards()}
            disabled={loadingCards}
            title="Refresh database records"
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2 font-inter text-xs font-semibold text-slate-200 transition-colors hover:border-white/30 hover:bg-white/[0.08]"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loadingCards ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            title="Export CSV spreadsheet"
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.08] px-3.5 py-2 font-inter text-xs font-semibold text-white transition-colors hover:bg-white/[0.12]"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleLogout}
            title="Logout of admin access"
            className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 font-inter text-xs font-semibold text-rose-300 transition-colors hover:bg-rose-500/20"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8">
        {/* Tab Navigation */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.08]">
          <button
            onClick={() => setActiveTab("directory")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 font-inter text-xs font-bold transition-all ${
              activeTab === "directory"
                ? "bg-white text-neutral-950 shadow-md"
                : "border border-white/15 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>TechPass Directory ({totalCards})</span>
          </button>

          <button
            onClick={() => setActiveTab("connections")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 font-inter text-xs font-bold transition-all ${
              activeTab === "connections"
                ? "bg-white text-neutral-950 shadow-md"
                : "border border-white/15 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Scanned Connections ({totalConnections})</span>
          </button>
        </div>

        {/* Quick Telemetry Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border border-white/10 bg-[#060a12] p-5">
            <div className="flex items-center justify-between text-slate-400 font-inter text-xs">
              <span>{activeTab === "directory" ? "Total Registered Cards" : "Total Cloud Connections"}</span>
              <Users className="h-4 w-4 text-slate-300" />
            </div>
            <div className="mt-2 font-jakarta text-3xl font-bold text-white">
              {activeTab === "directory" ? totalCards : totalConnections}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#060a12] p-5">
            <div className="flex items-center justify-between text-slate-400 font-inter text-xs">
              <span>{activeTab === "directory" ? "Top Institution / University" : "Top Organization"}</span>
              <Award className="h-4 w-4 text-slate-300" />
            </div>
            <div className="mt-2 font-jakarta text-lg font-bold text-white truncate">
              {activeTab === "directory" ? topInstitution : topConnOrg}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#060a12] p-5">
            <div className="flex items-center justify-between text-slate-400 font-inter text-xs">
              <span>{activeTab === "directory" ? "Most Popular Tag" : "Top Connection Tag"}</span>
              <Layers className="h-4 w-4 text-slate-300" />
            </div>
            <div className="mt-2 font-jakarta text-lg font-bold text-white truncate">
              {activeTab === "directory" ? topTag : topConnTag}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                fetchCards(e.target.value);
              }}
              placeholder="Search by name, Tech ID, college, or tags..."
              className="w-full rounded-xl border border-white/15 bg-[#060a12] pl-10 pr-4 py-2.5 font-inter text-sm text-white placeholder-white/30 focus:border-white/40 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  fetchCards("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="font-inter text-xs text-slate-400 self-end sm:self-center">
            Showing <strong className="text-white">{activeTab === "directory" ? cards.length : connections.length}</strong> record(s) directly from NeonDB
          </div>
        </div>

        {/* TechPass Directory Table */}
        {activeTab === "directory" && (
        <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-[#060a12]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] font-inter text-xs font-semibold uppercase text-slate-300">
                <th className="px-5 py-4">Tech ID</th>
                <th className="px-5 py-4">Profile</th>
                <th className="px-5 py-4">Designation &amp; Institution</th>
                <th className="px-5 py-4">Expertise Tags</th>
                <th className="px-5 py-4">Contact &amp; Socials</th>
                <th className="px-5 py-4">Registered</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] font-inter text-sm text-slate-200">
              {cards.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    {loadingCards ? (
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Querying NeonDB records...</span>
                      </div>
                    ) : (
                      "No TechPass cards found in database matching your criteria."
                    )}
                  </td>
                </tr>
              ) : (
                cards.map((card) => (
                  <tr key={card.tech_id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-4 whitespace-nowrap font-mono font-bold text-white">
                      <div className="flex items-center gap-2">
                        <span>{card.tech_id}</span>
                        <button
                          onClick={() => handleCopyId(card.tech_id)}
                          title="Copy ID"
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          {copiedId === card.tech_id ? <Check className="h-3 w-3 text-slate-200" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {card.profile_photo ? (
                          <img
                            src={card.profile_photo}
                            alt={card.full_name}
                            className="h-10 w-10 rounded-full object-cover border border-white/20"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/15 text-white font-bold text-sm">
                            {card.full_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-white">{card.full_name}</div>
                          <div className="text-xs text-slate-400">{card.email || "No email"}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{card.designation || "Builder"}</div>
                      <div className="text-xs text-slate-400">{card.college_company || "Independent"}</div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(card.expertise_tags || []).slice(0, 4).map((tag, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-white/[0.06] border border-white/10 px-2 py-0.5 text-xs text-slate-300"
                          >
                            #{tag}
                          </span>
                        ))}
                        {(card.expertise_tags || []).length > 4 && (
                          <span className="text-xs text-slate-400 self-center">
                            +{(card.expertise_tags || []).length - 4}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-400">
                        {card.github && (
                          <a href={card.github} target="_blank" rel="noreferrer" title="GitHub" className="hover:text-white">
                            GH
                          </a>
                        )}
                        {card.linkedin && (
                          <a href={card.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" className="hover:text-white">
                            LI
                          </a>
                        )}
                        {card.instagram && (
                          <a href={card.instagram} target="_blank" rel="noreferrer" title="Instagram" className="hover:text-white">
                            IG
                          </a>
                        )}
                        {card.whatsapp && (
                          <span title={`WhatsApp: ${card.whatsapp}`} className="text-slate-300 font-mono text-xs">
                            📱
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-400">
                      {card.created_at ? new Date(card.created_at).toLocaleDateString() : "Unknown"}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCard(card)}
                          title="Preview Holographic Card"
                          className="rounded-lg border border-white/15 bg-white/[0.05] p-2 text-slate-300 hover:border-white/30 hover:text-white transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(card.tech_id)}
                          title="Delete card"
                          className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2 text-rose-300 hover:border-rose-500/40 hover:bg-rose-500/20 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        )}

        {/* Scanned Connections Table */}
        {activeTab === "connections" && (
        <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-[#060a12]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] font-inter text-xs font-semibold uppercase text-slate-300">
                <th className="px-5 py-4">Record ID</th>
                <th className="px-5 py-4">Scanned By</th>
                <th className="px-5 py-4">Contact Profile</th>
                <th className="px-5 py-4">Designation &amp; Organization</th>
                <th className="px-5 py-4">Expertise Tags</th>
                <th className="px-5 py-4">Socials</th>
                <th className="px-5 py-4">Scanned At</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] font-inter text-sm text-slate-200">
              {connections.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                    {loadingConnections ? (
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Querying NeonDB scanned connections...</span>
                      </div>
                    ) : (
                      "No scanned connection records found in NeonDB matching your criteria."
                    )}
                  </td>
                </tr>
              ) : (
                connections.map((conn) => (
                  <tr key={conn.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-4 whitespace-nowrap font-mono text-xs font-bold text-white">
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[100px]">{conn.id}</span>
                        <button
                          onClick={() => handleCopyId(conn.id)}
                          title="Copy ID"
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          {copiedId === conn.id ? <Check className="h-3 w-3 text-slate-200" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap font-mono text-xs text-slate-300">
                      <span className="rounded bg-white/10 px-2 py-1 border border-white/15 font-bold text-white">
                        {conn.userTechId || "TECH-ANON"}
                      </span>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{conn.name || "Anonymous"}</span>
                          {conn.techpassId && (
                            <span className="rounded bg-white/[0.06] border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
                              {conn.techpassId}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400">{conn.email || "No email"}</div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{conn.designation || "Builder"}</div>
                      <div className="text-xs text-slate-400">{conn.organization || "Independent"}</div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(conn.expertise || []).slice(0, 4).map((tag, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-white/[0.06] border border-white/10 px-2 py-0.5 text-xs text-slate-300"
                          >
                            #{tag}
                          </span>
                        ))}
                        {(conn.expertise || []).length > 4 && (
                          <span className="text-xs text-slate-400 self-center">
                            +{(conn.expertise || []).length - 4}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-400">
                        {conn.github && (
                          <a href={conn.github} target="_blank" rel="noreferrer" title="GitHub" className="hover:text-white">
                            GH
                          </a>
                        )}
                        {conn.linkedin && (
                          <a href={conn.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" className="hover:text-white">
                            LI
                          </a>
                        )}
                        {conn.instagram && (
                          <a href={conn.instagram} target="_blank" rel="noreferrer" title="Instagram" className="hover:text-white">
                            IG
                          </a>
                        )}
                        {conn.whatsapp && (
                          <span title={`WhatsApp: ${conn.whatsapp}`} className="text-slate-300 font-mono text-xs">
                            📱
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-400">
                      {conn.scannedAt ? new Date(conn.scannedAt).toLocaleDateString() : "Unknown"}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDeleteConnection(conn.id)}
                        title="Delete connection record"
                        className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2 text-rose-300 hover:border-rose-500/40 hover:bg-rose-500/20 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Holographic Card Modal Preview */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full rounded-2xl border border-white/20 bg-[#060a12] p-6 shadow-2xl flex flex-col items-center"
            >
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute right-4 top-4 rounded-lg bg-white/10 p-1.5 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mb-4 font-jakarta text-base font-bold text-white flex items-center gap-2">
                <span>TECHPASS HOLOGRAM INSPECTOR</span>
                <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-xs text-slate-300 border border-white/15">
                  {selectedCard.tech_id}
                </span>
              </div>

              <div className="py-2">
                <TechPassCard
                  data={convertToCardData(selectedCard)}
                  theme={(selectedCard.theme as any) || "aurora-violet"}
                  cardRef={modalCardRef}
                />
              </div>

              <div className="mt-6 flex gap-3 w-full justify-center">
                <button
                  onClick={() => setSelectedCard(null)}
                  className="rounded-xl border border-white/20 bg-white/10 px-6 py-2.5 font-inter text-xs font-bold text-white hover:bg-white/20 transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
