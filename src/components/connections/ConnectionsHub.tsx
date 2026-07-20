"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Users,
  Building2,
  Calendar,
  Sparkles,
  QrCode,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  AlertTriangle,
  Plus,
  FileText,
  FileSpreadsheet,
  X,
} from "lucide-react";
import { ConnectionRecord, exportToExcel, exportToCSV, importFromFile } from "./ConnectionsExportImport";
import { createPortal } from "react-dom";
import QRScannerComponent from "./QRScannerComponent";
import ConnectionsTable from "./ConnectionsTable";

const STORAGE_KEY = "techies_connections";

export default function ConnectionsHub() {
  const [connections, setConnections] = useState<ConnectionRecord[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setConnections(parsed);
        }
      } catch (err) {
        console.error("Failed to parse techies_connections from localStorage", err);
      }
    }
  }, []);

  // Save to localStorage whenever connections change
  const saveToStorage = (newConnections: ConnectionRecord[]) => {
    setConnections(newConnections);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConnections));
  };

  const handleScanSuccess = (record: ConnectionRecord) => {
    const updated = [record, ...connections];
    saveToStorage(updated);
    showToast(`Verified & Saved: ${record.name} (${record.techpassId})`);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = (allIds: string[]) => {
    setSelectedIds(new Set(allIds));
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleDeleteSingle = (id: string) => {
    const target = connections.find((c) => c.id === id);
    const updated = connections.filter((c) => c.id !== id);
    saveToStorage(updated);
    selectedIds.delete(id);
    setSelectedIds(new Set(selectedIds));
    if (target) showToast(`Deleted "${target.name}" from your connections.`);
  };

  const handleBulkDelete = (ids: string[]) => {
    const updated = connections.filter((c) => !ids.includes(c.id));
    saveToStorage(updated);
    setSelectedIds(new Set());
    showToast(`Deleted ${ids.length} contact(s).`);
  };

  const handleClearAllData = () => {
    saveToStorage([]);
    setSelectedIds(new Set());
    setShowClearConfirm(false);
    showToast("Cleared all networking connections.");
  };

  const handleRefresh = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setConnections(parsed);
          showToast("Refreshed connections from local storage.");
        }
      } catch (err) {
        showToast("Error loading local storage.");
      }
    } else {
      showToast("Storage is clean.");
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast("Importing & checking for duplicates...");
      const { merged, addedCount, skippedCount } = await importFromFile(file, connections);
      saveToStorage(merged);
      showToast(`Imported ${addedCount} new contact(s). Skipped ${skippedCount} duplicate(s).`);
    } catch (err) {
      console.error("Import error", err);
      showToast("Failed to parse file. Make sure it is a valid CSV or Excel spreadsheet.");
    } finally {
      if (importInputRef.current) importInputRef.current.value = "";
    }
  };

  // Analytics Metrics Calculation
  const analytics = useMemo(() => {
    const total = connections.length;

    // Unique colleges / companies
    const orgsSet = new Set<string>();
    connections.forEach((c) => {
      const clean = (c.organization || "").trim().toLowerCase();
      if (clean && clean !== "-" && clean !== "community") orgsSet.add(clean);
    });
    const totalOrgs = orgsSet.size;

    // Scans today & this month
    const now = new Date();
    const todayStr = now.toDateString();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let scansToday = 0;
    let scansThisMonth = 0;
    const tagCounter: Record<string, number> = {};

    connections.forEach((c) => {
      if (c.scannedAt) {
        const d = new Date(c.scannedAt);
        if (d.toDateString() === todayStr) scansToday++;
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) scansThisMonth++;
      }
      if (Array.isArray(c.expertise)) {
        c.expertise.forEach((t) => {
          const clean = t.trim();
          if (clean) tagCounter[clean] = (tagCounter[clean] || 0) + 1;
        });
      }
    });

    let topTag = "None";
    let maxCount = 0;
    Object.entries(tagCounter).forEach(([tag, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topTag = tag;
      }
    });

    // Recently scanned users (top 5)
    const recentUsers = connections.slice(0, 5);

    return {
      total,
      totalOrgs,
      scansToday,
      scansThisMonth,
      topTag,
      recentUsers,
    };
  }, [connections]);

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-12 overflow-hidden">
      {/* Background Image & Ambient Lights to maintain website design theme */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        <img
          src="/techpass-bg.png"
          alt=""
          className="h-full w-full object-cover mix-blend-screen opacity-95 scale-105"
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }}
        />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-slate-300/[0.04] blur-[140px] rounded-full pointer-events-none" />
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-24 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-white/30 bg-[#060a17]/95 px-5 py-3.5 font-inter text-xs sm:text-sm font-bold text-white shadow-2xl backdrop-blur-2xl animate-fade-in">
          <Sparkles className="h-4 w-4 text-slate-200" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header & Main Actions */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2 w-2 rounded-full bg-white animate-pulse" />
            <span className="font-inter text-xs font-bold tracking-widest text-slate-300 uppercase">
              100% Client-Side CRM • Zero Backend
            </span>
          </div>
          <h1 className="font-jakarta text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Connections <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Hub</span>
          </h1>
          <p className="mt-3 font-inter text-sm sm:text-base text-slate-300 max-w-2xl font-normal">
            Your personal networking matrix. Scan TechPass QR codes at meetups, workshops, and hackathons to save and organize builder contacts directly inside your browser.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsScannerOpen(!isScannerOpen)}
            className="flex items-center gap-2.5 rounded-2xl bg-white px-6 py-3.5 font-inter text-sm font-extrabold text-neutral-950 shadow-xl transition-all hover:bg-slate-200 hover:scale-105"
          >
            <QrCode className="h-4 w-4" />
            <span>{isScannerOpen ? "Close Scanner" : "Scan QR Code"}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportToExcel(connections)}
              disabled={connections.length === 0}
              className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3.5 font-inter text-xs font-bold text-white shadow-md transition-all hover:bg-white/20 hover:border-white disabled:opacity-40"
              title="Export to Excel (.xlsx)"
            >
              <FileSpreadsheet className="h-4 w-4 text-slate-200" />
              <span>Export Excel</span>
            </button>

            <button
              onClick={() => exportToCSV(connections)}
              disabled={connections.length === 0}
              className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3.5 font-inter text-xs font-bold text-white shadow-md transition-all hover:bg-white/20 hover:border-white disabled:opacity-40"
              title="Export to CSV"
            >
              <FileText className="h-4 w-4 text-slate-200" />
              <span>CSV</span>
            </button>
          </div>

          <button
            onClick={() => importInputRef.current?.click()}
            className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3.5 font-inter text-xs font-bold text-white shadow-md transition-all hover:bg-white/20 hover:border-white"
            title="Import contacts from Excel or CSV"
          >
            <Upload className="h-4 w-4 text-slate-300" />
            <span>Import</span>
          </button>
          <input
            ref={importInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleImportFile}
            className="hidden"
          />

          <button
            onClick={handleRefresh}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-white hover:bg-white/10 transition-colors"
            title="Refresh from Storage"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          {connections.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition-colors"
              title="Clear All Data"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* QR Scanner Modal Overlay (rendered via portal directly to document.body outside main stacking context so navbar/footer never cover it) */}
      {isMounted && isScannerOpen && createPortal(
        <div style={{ zIndex: 9999999 }} className="fixed inset-0 flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-xl animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-[28px] sm:rounded-[36px] border border-white/20 bg-[#060a17] p-4 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-white shrink-0">
                  <QrCode className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <h3 className="font-jakarta text-lg sm:text-xl font-extrabold text-white">Scan TechPass QR</h3>
                  <p className="font-inter text-[11px] sm:text-xs text-slate-300">Scan via live camera or capture photo right inside your browser</p>
                </div>
              </div>
              <button
                onClick={() => setIsScannerOpen(false)}
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <QRScannerComponent
              existingConnections={connections}
              onScanSuccess={(record) => {
                handleScanSuccess(record);
                setIsScannerOpen(false);
              }}
              onClose={() => setIsScannerOpen(false)}
            />
          </div>
        </div>,
        document.body
      )}

      {/* Client-Side Analytics Dashboard Cards */}
      <div className="relative z-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-[28px] border border-white/15 bg-white/[0.04] p-6 shadow-xl backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <span className="font-inter text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Connections
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 font-jakarta text-3xl font-extrabold text-white">{analytics.total}</p>
          <span className="mt-1 block font-inter text-[11px] text-slate-400">Stored in localStorage</span>
        </div>

        <div className="rounded-[28px] border border-white/15 bg-white/[0.04] p-6 shadow-xl backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <span className="font-inter text-xs font-bold uppercase tracking-wider text-slate-400">
              Colleges & Companies
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 font-jakarta text-3xl font-extrabold text-white">{analytics.totalOrgs}</p>
          <span className="mt-1 block font-inter text-[11px] text-slate-400">Unique organizations</span>
        </div>

        <div className="rounded-[28px] border border-white/15 bg-white/[0.04] p-6 shadow-xl backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <span className="font-inter text-xs font-bold uppercase tracking-wider text-slate-400">
              Scans Today
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 font-jakarta text-3xl font-extrabold text-white">{analytics.scansToday}</p>
          <span className="mt-1 block font-inter text-[11px] text-slate-300 font-semibold">
            +{analytics.scansThisMonth} this month
          </span>
        </div>

        <div className="rounded-[28px] border border-white/15 bg-white/[0.04] p-6 shadow-xl backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <span className="font-inter text-xs font-bold uppercase tracking-wider text-slate-400">
              Top Expertise Tag
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 font-jakarta text-2xl font-extrabold text-white truncate">
            {analytics.topTag !== "None" ? `#${analytics.topTag}` : "None"}
          </p>
          <span className="mt-1 block font-inter text-[11px] text-slate-400">Most common skill</span>
        </div>

        <div className="rounded-[28px] border border-white/15 bg-white/[0.04] p-6 shadow-xl backdrop-blur-2xl flex flex-col justify-between">
          <div>
            <span className="font-inter text-xs font-bold uppercase tracking-wider text-slate-400">
              Recent Scans
            </span>
            <div className="mt-3 flex items-center -space-x-2 overflow-hidden">
              {analytics.recentUsers.length > 0 ? (
                analytics.recentUsers.map((u, idx) => (
                  <div
                    key={idx}
                    className="inline-block h-8 w-8 rounded-full border-2 border-[#060a17] bg-neutral-800 flex items-center justify-center font-jakarta text-xs font-bold text-white shadow"
                    title={`${u.name} (${u.techpassId})`}
                  >
                    {u.profilePhoto ? (
                      <img src={u.profilePhoto} alt={u.name} className="h-full w-full rounded-full object-cover" />
                    ) : (
                      u.name.charAt(0).toUpperCase()
                    )}
                  </div>
                ))
              ) : (
                <span className="font-inter text-xs text-white/40 italic">No recent scans</span>
              )}
            </div>
          </div>
          <span className="mt-2 block font-inter text-[11px] text-slate-400">Latest activity feed</span>
        </div>
      </div>

      {/* Main Searchable Table / Grid CRM */}
      <div className="relative z-10">
        <ConnectionsTable
          connections={connections}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onClearSelection={handleClearSelection}
          onDeleteSingle={handleDeleteSingle}
          onBulkDelete={handleBulkDelete}
        />
      </div>

      {/* Clear All Confirmation Modal (rendered via portal directly to document.body at z-[9999999]) */}
      {isMounted && showClearConfirm && createPortal(
        <div style={{ zIndex: 9999999 }} className="fixed inset-0 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="w-full max-w-md rounded-[28px] sm:rounded-[32px] border border-rose-500/40 bg-[#060a17] p-6 sm:p-8 text-center shadow-2xl my-auto">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="font-jakarta text-xl sm:text-2xl font-bold text-white">Clear All Connections?</h3>
            <p className="mt-2 font-inter text-xs text-slate-300">
              This will permanently delete all {connections.length} networking contacts from your device&apos;s localStorage (`techies_connections`). This action cannot be undone unless you have exported an Excel/CSV backup.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="w-full sm:w-auto rounded-xl border border-white/20 bg-white/10 px-6 py-2.5 font-inter text-xs font-bold text-white hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAllData}
                className="w-full sm:w-auto rounded-xl bg-rose-500 px-6 py-2.5 font-inter text-xs font-bold text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
