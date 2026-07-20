"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  Filter,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Mail,
  Calendar,
  Building2,
  Sparkles,
  ArrowUpDown,
  LayoutGrid,
  Table as TableIcon,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
} from "lucide-react";
import { FaInstagram, FaLinkedin, FaGithub, FaWhatsapp } from "react-icons/fa6";
import { ConnectionRecord } from "./ConnectionsExportImport";

interface ConnectionsTableProps {
  connections: ConnectionRecord[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectAll: (allIds: string[]) => void;
  onClearSelection: () => void;
  onDeleteSingle: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
}

export default function ConnectionsTable({
  connections,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
  onDeleteSingle,
  onBulkDelete,
}: ConnectionsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name-asc" | "name-desc" | "org">("newest");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewProfileModal, setViewProfileModal] = useState<ConnectionRecord | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const pageSize = 10;

  // Extract all unique expertise tags across contacts
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    connections.forEach((c) => {
      if (Array.isArray(c.expertise)) {
        c.expertise.forEach((t) => {
          const clean = t.trim();
          if (clean) tagsSet.add(clean);
        });
      }
    });
    return ["ALL", ...Array.from(tagsSet).sort()];
  }, [connections]);

  // Filter & Sort
  const filteredAndSorted = useMemo(() => {
    let result = [...connections];

    // Search query (name, college, designation, techpassId)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          (c.name && c.name.toLowerCase().includes(q)) ||
          (c.organization && c.organization.toLowerCase().includes(q)) ||
          (c.designation && c.designation.toLowerCase().includes(q)) ||
          (c.techpassId && c.techpassId.toLowerCase().includes(q)) ||
          (c.email && c.email.toLowerCase().includes(q))
      );
    }

    // Tag filter
    if (selectedTag && selectedTag !== "ALL") {
      result = result.filter((c) => Array.isArray(c.expertise) && c.expertise.includes(selectedTag));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.scannedAt || 0).getTime() - new Date(a.scannedAt || 0).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.scannedAt || 0).getTime() - new Date(b.scannedAt || 0).getTime();
      }
      if (sortBy === "name-asc") {
        return (a.name || "").localeCompare(b.name || "");
      }
      if (sortBy === "name-desc") {
        return (b.name || "").localeCompare(a.name || "");
      }
      if (sortBy === "org") {
        return (a.organization || "").localeCompare(b.organization || "");
      }
      return 0;
    });

    return result;
  }, [connections, searchQuery, selectedTag, sortBy]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / pageSize));
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSorted.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSorted, currentPage, pageSize]);

  // Reset pagination if search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTag, sortBy]);

  const handleCopyWhatsapp = (phone: string, id: string) => {
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isAllPaginatedSelected =
    paginatedData.length > 0 && paginatedData.every((item) => selectedIds.has(item.id));

  return (
    <div className="space-y-6">
      {/* Top Filter & Search Toolbar */}
      <div className="flex flex-col gap-4 rounded-3xl border border-white/15 bg-white/[0.03] p-5 backdrop-blur-xl md:flex-row md:items-center md:justify-between shadow-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Name, College, ID, Role..."
            className="w-full rounded-2xl border border-white/15 bg-white/5 pl-11 pr-4 py-2.5 font-inter text-xs sm:text-sm text-white placeholder-white/40 focus:border-white/60 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Tag Selector */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="rounded-xl border border-white/15 bg-neutral-900 px-3 py-2 font-inter text-xs text-white focus:outline-none"
            >
              {allTags.map((t) => (
                <option key={t} value={t}>
                  {t === "ALL" ? "All Expertise" : `#${t}`}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-xl border border-white/15 bg-neutral-900 px-3 py-2 font-inter text-xs text-white focus:outline-none"
            >
              <option value="newest">Newest Scans</option>
              <option value="oldest">Oldest Scans</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="org">College / Company</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex rounded-xl border border-white/15 bg-white/5 p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-inter text-xs font-semibold transition-all ${
                viewMode === "table" ? "bg-white/20 text-white shadow" : "text-white/60 hover:text-white"
              }`}
            >
              <TableIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-inter text-xs font-semibold transition-all ${
                viewMode === "grid" ? "bg-white/20 text-white shadow" : "text-white/60 hover:text-white"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Selection Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between rounded-2xl border border-white/30 bg-white/10 px-5 py-3.5 font-inter text-xs text-white shadow-xl backdrop-blur-xl animate-fade-in">
          <div className="flex items-center gap-2 font-bold">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-neutral-950 text-xs font-extrabold">
              {selectedIds.size}
            </span>
            <span>contact{selectedIds.size > 1 ? "s" : ""} selected</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onBulkDelete(Array.from(selectedIds))}
              className="flex items-center gap-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 px-3.5 py-1.5 font-bold text-rose-300 hover:bg-rose-500/30 transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Selected</span>
            </button>
            <button
              onClick={onClearSelection}
              className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 font-semibold text-white/80 hover:bg-white/20 hover:text-white transition-all"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area: Table vs Grid */}
      {filteredAndSorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02] p-16 text-center text-white/50">
          <Sparkles className="h-12 w-12 text-slate-400 mb-3" />
          <h4 className="font-jakarta text-lg font-bold text-white">No contacts found</h4>
          <p className="mt-1 font-inter text-xs max-w-sm text-slate-400">
            {searchQuery || selectedTag !== "ALL"
              ? "No scanned connections match your current search and filters."
              : "You haven't scanned any TechPass QR codes yet. Click 'Scan QR' above to add your first builder contact!"}
          </p>
        </div>
      ) : viewMode === "table" ? (
        <div className="overflow-x-auto rounded-3xl border border-white/15 bg-white/[0.03] shadow-2xl backdrop-blur-xl">
          <table className="w-full text-left font-inter text-xs text-slate-300">
            <thead className="border-b border-white/10 bg-white/5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
              <tr>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={isAllPaginatedSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onSelectAll(paginatedData.map((d) => d.id));
                      } else {
                        onClearSelection();
                      }
                    }}
                    className="h-4 w-4 rounded border-white/20 bg-neutral-800 text-white accent-white focus:ring-0"
                  />
                </th>
                <th className="p-4">Builder Profile</th>
                <th className="p-4">TechPass ID</th>
                <th className="p-4">Designation</th>
                <th className="p-4">College / Company</th>
                <th className="p-4">Expertise</th>
                <th className="p-4">Network Links</th>
                <th className="p-4">Scan Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {paginatedData.map((c) => {
                const isSelected = selectedIds.has(c.id);
                return (
                  <tr
                    key={c.id}
                    className={`transition-colors hover:bg-white/[0.06] ${isSelected ? "bg-white/[0.08]" : ""}`}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(c.id)}
                        className="h-4 w-4 rounded border-white/20 bg-neutral-800 text-white accent-white focus:ring-0"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white/10 flex items-center justify-center font-jakarta font-extrabold text-white">
                          {c.profilePhoto ? (
                            <img src={c.profilePhoto} alt={c.name} className="h-full w-full object-cover" />
                          ) : (
                            c.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <span
                            onClick={() => setViewProfileModal(c)}
                            className="font-jakarta font-bold text-white text-sm hover:text-slate-300 cursor-pointer transition-colors block"
                          >
                            {c.name}
                          </span>
                          {c.isLegacy && (
                            <span className="inline-block rounded bg-white/10 border border-white/20 px-1.5 py-0.2 text-[8px] font-bold text-slate-300 uppercase">
                              Legacy Format
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-200">{c.techpassId}</td>
                    <td className="p-4 font-medium text-slate-300 truncate max-w-[140px]">{c.designation || "-"}</td>
                    <td className="p-4 font-medium text-slate-300 truncate max-w-[160px]">{c.organization || "-"}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {Array.isArray(c.expertise) && c.expertise.length > 0 ? (
                          c.expertise.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-slate-200"
                            >
                              #{tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-white/40">-</span>
                        )}
                        {Array.isArray(c.expertise) && c.expertise.length > 3 && (
                          <span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] text-white/60">
                            +{c.expertise.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {c.whatsapp && (
                          <button
                            onClick={() => handleCopyWhatsapp(c.whatsapp, c.id)}
                            title="Copy WhatsApp Number"
                            className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                              copiedId === c.id ? "bg-emerald-500 text-neutral-950" : "bg-white/10 text-white hover:bg-emerald-500 hover:text-neutral-950"
                            }`}
                          >
                            {copiedId === c.id ? <Check className="h-3.5 w-3.5" /> : <FaWhatsapp className="h-3.5 w-3.5" />}
                          </button>
                        )}
                        {c.linkedin && (
                          <a
                            href={c.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-neutral-950 transition-colors"
                            title="LinkedIn"
                          >
                            <FaLinkedin className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {c.github && (
                          <a
                            href={c.github}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-neutral-950 transition-colors"
                            title="GitHub"
                          >
                            <FaGithub className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {c.instagram && (
                          <a
                            href={c.instagram}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-neutral-950 transition-colors"
                            title="Instagram"
                          >
                            <FaInstagram className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {c.email && (
                          <a
                            href={`mailto:${c.email}`}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-neutral-950 transition-colors"
                            title="Send Email"
                          >
                            <Mail className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-white/60">
                      {c.scannedAt ? new Date(c.scannedAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewProfileModal(c)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white hover:bg-white/20 transition-colors"
                          title="View Profile Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteSingle(c.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition-colors"
                          title="Delete Contact"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid View Mode */
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedData.map((c) => {
            const isSelected = selectedIds.has(c.id);
            return (
              <div
                key={c.id}
                className={`group relative flex flex-col justify-between rounded-[28px] border p-6 transition-all shadow-xl backdrop-blur-2xl ${
                  isSelected ? "border-white/50 bg-white/[0.08]" : "border-white/15 bg-white/[0.04] hover:border-white/30"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(c.id)}
                        className="h-4 w-4 rounded border-white/20 bg-neutral-800 text-white accent-white focus:ring-0"
                      />
                      <span className="font-mono text-xs font-bold text-slate-300">{c.techpassId}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setViewProfileModal(c)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                        title="View Profile Details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteSingle(c.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition-colors"
                        title="Delete Contact"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3.5">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-white/10 flex items-center justify-center font-jakarta font-extrabold text-white text-lg">
                      {c.profilePhoto ? (
                        <img src={c.profilePhoto} alt={c.name} className="h-full w-full object-cover" />
                      ) : (
                        c.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <h4
                        onClick={() => setViewProfileModal(c)}
                        className="font-jakarta text-base font-extrabold text-white truncate hover:text-slate-300 cursor-pointer transition-colors"
                      >
                        {c.name}
                      </h4>
                      <p className="font-inter text-xs font-bold text-slate-300 truncate">{c.designation || "-"}</p>
                      <p className="font-inter text-xs text-slate-400 truncate mt-0.5">@ {c.organization || "-"}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(c.expertise) && c.expertise.length > 0 ? (
                        c.expertise.map((tag, i) => (
                          <span
                            key={i}
                            className="rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 font-inter text-[10px] font-semibold text-slate-200"
                          >
                            #{tag}
                          </span>
                        ))
                      ) : (
                        <span className="font-inter text-xs text-white/40 italic">No expertise tags</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="flex items-center gap-2">
                    {c.whatsapp && (
                      <button
                        onClick={() => handleCopyWhatsapp(c.whatsapp, c.id)}
                        title="Copy WhatsApp Number"
                        className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                          copiedId === c.id ? "bg-emerald-500 text-neutral-950" : "bg-white/10 text-white hover:bg-emerald-500 hover:text-neutral-950"
                        }`}
                      >
                        {copiedId === c.id ? <Check className="h-3.5 w-3.5" /> : <FaWhatsapp className="h-3.5 w-3.5" />}
                      </button>
                    )}
                    {c.linkedin && (
                      <a
                        href={c.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-neutral-950 transition-colors"
                      >
                        <FaLinkedin className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {c.github && (
                      <a
                        href={c.github}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-neutral-950 transition-colors"
                      >
                        <FaGithub className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {c.instagram && (
                      <a
                        href={c.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-neutral-950 transition-colors"
                      >
                        <FaInstagram className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {c.email && (
                      <a
                        href={`mailto:${c.email}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-neutral-950 transition-colors"
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>

                  <span className="font-inter text-[10px] text-white/50">
                    {c.scannedAt ? new Date(c.scannedAt).toLocaleDateString() : "-"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-4 font-inter text-xs text-slate-400">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredAndSorted.length)} of {filteredAndSorted.length} connections
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white disabled:opacity-30 hover:bg-white/20 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-bold text-white px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white disabled:opacity-30 hover:bg-white/20 transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* View Profile Modal (rendered via portal directly to document.body at z-[9999999]) */}
      {isMounted && viewProfileModal && createPortal(
        <div style={{ zIndex: 9999999 }} className="fixed inset-0 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-[32px] border border-white/20 bg-[#060a17] p-6 sm:p-8 shadow-2xl text-white my-auto">
            <button
              onClick={() => setViewProfileModal(null)}
              className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-white/10 flex items-center justify-center font-jakarta font-extrabold text-2xl text-white">
                {viewProfileModal.profilePhoto ? (
                  <img
                    src={viewProfileModal.profilePhoto}
                    alt={viewProfileModal.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  viewProfileModal.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-widest">
                  ID: {viewProfileModal.techpassId}
                </span>
                <h3 className="font-jakarta text-2xl font-extrabold text-white">{viewProfileModal.name}</h3>
                <p className="font-inter text-sm font-bold text-slate-300">{viewProfileModal.designation || "-"}</p>
              </div>
            </div>

            <div className="mt-6 space-y-4 font-inter text-xs">
              <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white/5 p-4 border border-white/10">
                <div>
                  <span className="text-white/50 block font-semibold mb-0.5">Organization / College:</span>
                  <span className="font-bold text-white">{viewProfileModal.organization || "-"}</span>
                </div>
                <div>
                  <span className="text-white/50 block font-semibold mb-0.5">Scanned Date:</span>
                  <span className="font-bold text-white">
                    {viewProfileModal.scannedAt ? new Date(viewProfileModal.scannedAt).toLocaleString() : "-"}
                  </span>
                </div>
                <div>
                  <span className="text-white/50 block font-semibold mb-0.5">WhatsApp Contact:</span>
                  <span className="font-bold text-white">{viewProfileModal.whatsapp || "-"}</span>
                </div>
                <div>
                  <span className="text-white/50 block font-semibold mb-0.5">Email Address:</span>
                  <span className="font-bold text-white">{viewProfileModal.email || "-"}</span>
                </div>
              </div>

              <div>
                <span className="text-white/50 block font-semibold mb-2 uppercase tracking-wider text-[10px]">
                  Expertise Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(viewProfileModal.expertise) && viewProfileModal.expertise.length > 0 ? (
                    viewProfileModal.expertise.map((tag, i) => (
                      <span
                        key={i}
                        className="rounded-lg border border-white/15 bg-white/10 px-3 py-1 font-semibold text-slate-200"
                      >
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-white/40 italic">No tags listed.</span>
                  )}
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <span className="text-white/50 block font-semibold mb-2 uppercase tracking-wider text-[10px]">
                  Direct Network Profiles
                </span>
                <div className="flex flex-wrap gap-3">
                  {viewProfileModal.whatsapp && (
                    <a
                      href={`https://wa.me/${viewProfileModal.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-4 py-2 font-bold text-emerald-300 hover:bg-emerald-500/30 transition-colors"
                    >
                      <FaWhatsapp className="h-4 w-4" />
                      <span>Chat WhatsApp</span>
                    </a>
                  )}
                  {viewProfileModal.linkedin && (
                    <a
                      href={viewProfileModal.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-4 py-2 font-bold text-white hover:bg-white/20 transition-colors"
                    >
                      <FaLinkedin className="h-4 w-4" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {viewProfileModal.github && (
                    <a
                      href={viewProfileModal.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-4 py-2 font-bold text-white hover:bg-white/20 transition-colors"
                    >
                      <FaGithub className="h-4 w-4" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {viewProfileModal.instagram && (
                    <a
                      href={viewProfileModal.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-4 py-2 font-bold text-white hover:bg-white/20 transition-colors"
                    >
                      <FaInstagram className="h-4 w-4" />
                      <span>Instagram</span>
                    </a>
                  )}
                  {viewProfileModal.email && (
                    <a
                      href={`mailto:${viewProfileModal.email}`}
                      className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-4 py-2 font-bold text-white hover:bg-white/20 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Send Email</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
