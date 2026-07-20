"use client";

import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, CameraOff, Upload, CheckCircle2, AlertCircle, Sparkles, X } from "lucide-react";
import { ConnectionRecord } from "./ConnectionsExportImport";

interface QRScannerComponentProps {
  existingConnections: ConnectionRecord[];
  onScanSuccess: (record: ConnectionRecord) => void;
  onClose?: () => void;
}

export default function QRScannerComponent({
  existingConnections,
  onScanSuccess,
  onClose,
}: QRScannerComponentProps) {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error" | "info" | "legacy"; text: string } | null>(
    null
  );
  const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const osCameraInputRef = useRef<HTMLInputElement>(null);

  const showStatus = (type: "success" | "error" | "info" | "legacy", text: string) => {
    setStatusMsg({ type, text });
    if (type !== "legacy" && type !== "error") {
      setTimeout(() => setStatusMsg(null), 5000);
    }
  };

  // Stop camera helper
  const stopCamera = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner", err);
      }
    }
    setIsCameraActive(false);
  };

  // Start live camera scan with explicit OS permission prompt
  const handleStartCamera = async () => {
    if (isCameraActive) {
      await stopCamera();
      return;
    }

    // 1. Check if browser supports mediaDevices
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showStatus(
        "error",
        "Your browser blocks live video streaming over non-HTTPS connections. Please tap the 'TAKE PHOTO (OS CAMERA)' button below right now to scan!"
      );
      return;
    }

    showStatus("info", "Requesting camera access from OS...");

    // 2. Explicitly ask OS/browser for camera access first so the native OS prompt pops up reliably on Android & iOS
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });
      // Permission granted! Stop the temporary prompt stream before handing over to Html5Qrcode
      stream.getTracks().forEach((track) => track.stop());
    } catch (permErr: any) {
      console.error("OS camera permission error:", permErr);
      showStatus(
        "error",
        "Camera access denied by OS/browser. Please allow camera permissions in browser site settings, or tap 'TAKE PHOTO (OS CAMERA)' below."
      );
      return;
    }

    // 3. Enumerate available camera devices now that OS permission is granted
    let availableDevices: { id: string; label: string }[] = [];
    try {
      availableDevices = await Html5Qrcode.getCameras();
      if (availableDevices && availableDevices.length > 0) {
        setCameras(availableDevices);
        // Prefer back/environment camera if label exists, otherwise use first camera
        const backCam = availableDevices.find((d) =>
          d.label.toLowerCase().includes("back") ||
          d.label.toLowerCase().includes("environment") ||
          d.label.toLowerCase().includes("rear")
        );
        if (backCam) {
          setSelectedCameraId(backCam.id);
        } else if (!selectedCameraId) {
          setSelectedCameraId(availableDevices[0].id);
        }
      }
    } catch (enumErr) {
      console.warn("Could not list camera devices after permission:", enumErr);
    }

    // 4. Initialize Html5Qrcode and start scanning
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode("qr-reader-container", {
        verbose: false,
        experimentalFeatures: { useBarCodeDetectorIfSupported: true },
      });
    }

    // Determine camera configuration: try exact deviceId if available, otherwise fallback to facingMode
    const targetCamId = selectedCameraId || (availableDevices.length > 0 ? availableDevices[0].id : "");
    const cameraConfig = targetCamId
      ? { deviceId: { exact: targetCamId } }
      : { facingMode: "environment" };

    setIsCameraActive(true);
    showStatus("info", "Starting live camera stream...");

    try {
      await scannerRef.current.start(
        cameraConfig,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleDecodedText(decodedText);
        },
        (error) => {
          // Silent ignore background scan misses
        }
      );
      showStatus("info", "Camera active! Point your camera at any TechPass QR code.");
    } catch (startErr) {
      console.warn("Initial camera start failed, trying fallback facingMode='environment'...", startErr);
      try {
        await scannerRef.current.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            handleDecodedText(decodedText);
          },
          () => {}
        );
        showStatus("info", "Camera active (Environment mode)! Point at any TechPass QR code.");
      } catch (fallbackErr) {
        console.error("Camera fallback start failed:", fallbackErr);
        setIsCameraActive(false);
        showStatus(
          "error",
          "Could not initialize live camera stream. Please use 'TAKE PHOTO (OS CAMERA)' right below."
        );
      }
    }
  };

  // Switch camera when user selects from dropdown
  useEffect(() => {
    if (isCameraActive && selectedCameraId && scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current
        .stop()
        .then(() => {
          return scannerRef.current?.start(
            { deviceId: { exact: selectedCameraId } },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => handleDecodedText(decodedText),
            () => {}
          );
        })
        .then(() => showStatus("info", "Switched camera device."))
        .catch((err) => console.error("Error switching camera:", err));
    }
  }, [selectedCameraId]);

  // Clean up scanner when component unmounts
  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleDecodedText = (decodedText: string) => {
    if (!decodedText) return;
    const cleanText = decodedText.trim();

    let newRecord: ConnectionRecord | null = null;
    let isLegacyFormat = false;

    // 1. Try parsing JSON object (Our TechPass QR format or any JSON profile)
    try {
      const parsed = JSON.parse(cleanText);
      if (parsed && typeof parsed === "object") {
        const techId = String(
          parsed.techpassId || parsed.techId || parsed.id || `TECH-${Math.floor(1000 + Math.random() * 9000)}`
        ).trim();
        newRecord = {
          id: techId,
          techpassId: techId,
          name: String(parsed.name || parsed.fullName || parsed.username || "Builder Profile").trim(),
          designation: String(parsed.designation || parsed.role || parsed.title || "Innovator").trim(),
          organization: String(parsed.organization || parsed.collegeCompany || parsed.company || "Community").trim(),
          expertise: Array.isArray(parsed.expertise)
            ? parsed.expertise
            : Array.isArray(parsed.expertiseTags)
            ? parsed.expertiseTags
            : [],
          whatsapp: String(parsed.whatsapp || parsed.phone || parsed.mobile || "").trim(),
          instagram: String(parsed.instagram || "").trim(),
          linkedin: String(parsed.linkedin || "").trim(),
          github: String(parsed.github || "").trim(),
          email: String(parsed.email || "").trim(),
          profilePhoto: String(parsed.profilePhoto || "").trim(),
          scannedAt: parsed.createdAt || new Date().toISOString(),
          isLegacy: false,
        };
      }
    } catch (err) {
      // Not JSON, continue to check URL, vCard, or plain text
    }

    // 2. Check if vCard format (BEGIN:VCARD)
    if (!newRecord && cleanText.toUpperCase().includes("BEGIN:VCARD")) {
      const nameMatch = cleanText.match(/FN:(.*)/i) || cleanText.match(/N:(.*)/i);
      const phoneMatch = cleanText.match(/TEL.*:(.*)/i);
      const orgMatch = cleanText.match(/ORG:(.*)/i);
      const titleMatch = cleanText.match(/TITLE:(.*)/i);
      const emailMatch = cleanText.match(/EMAIL.*:(.*)/i);

      const nameStr = nameMatch ? nameMatch[1].trim() : "vCard Contact";
      const phoneStr = phoneMatch ? phoneMatch[1].trim() : "";
      const fallbackId = phoneStr
        ? `TECH-VCARD-${phoneStr.replace(/[^0-9]/g, "").slice(-4)}`
        : `TECH-VCARD-${Math.floor(1000 + Math.random() * 9000)}`;

      newRecord = {
        id: fallbackId,
        techpassId: fallbackId,
        name: nameStr,
        designation: titleMatch ? titleMatch[1].trim() : "Builder",
        organization: orgMatch ? orgMatch[1].trim() : "Community",
        expertise: ["vCard Scan"],
        whatsapp: phoneStr,
        instagram: "",
        linkedin: "",
        github: "",
        email: emailMatch ? emailMatch[1].trim() : "",
        profilePhoto: "",
        scannedAt: new Date().toISOString(),
        isLegacy: false,
      };
    }

    // 3. Check if URL / Legacy WhatsApp Link / Website
    if (!newRecord && (cleanText.includes("wa.me/") || cleanText.startsWith("http://") || cleanText.startsWith("https://"))) {
      isLegacyFormat = cleanText.includes("wa.me/");
      const cleanPhone = cleanText.replace(/[^0-9]/g, "");
      const formattedWhatsapp = cleanPhone ? (cleanPhone.startsWith("91") ? `+${cleanPhone}` : `+91${cleanPhone}`) : "";
      const fallbackId = cleanPhone ? `TECH-LINK-${cleanPhone.slice(-4)}` : `TECH-LINK-${Math.floor(1000 + Math.random() * 9000)}`;

      newRecord = {
        id: fallbackId,
        techpassId: fallbackId,
        name: isLegacyFormat ? "WhatsApp Contact" : "Web QR Connection",
        designation: "Techies Community Member",
        organization: "Techies Universe",
        expertise: [isLegacyFormat ? "Legacy TechPass" : "Scanned URL"],
        whatsapp: formattedWhatsapp,
        instagram: "",
        linkedin: !isLegacyFormat && cleanText.includes("linkedin.com") ? cleanText : "",
        github: !isLegacyFormat && cleanText.includes("github.com") ? cleanText : "",
        email: "",
        profilePhoto: "",
        scannedAt: new Date().toISOString(),
        isLegacy: isLegacyFormat,
      };
      if (isLegacyFormat) {
        showStatus("legacy", "Legacy WhatsApp TechPass detected.");
      }
    }

    // 4. Universal Fallback: If raw phone number or plain text, never fail! Turn it into a record.
    if (!newRecord) {
      const isPhoneNumber = /^[+0-9\s()-]{7,16}$/.test(cleanText);
      const cleanPhone = cleanText.replace(/[^0-9]/g, "");
      const fallbackId = cleanPhone ? `TECH-${cleanPhone.slice(-4)}` : `TECH-${Math.floor(1000 + Math.random() * 9000)}`;

      newRecord = {
        id: fallbackId,
        techpassId: fallbackId,
        name: isPhoneNumber ? `Contact (${cleanText})` : cleanText.slice(0, 40),
        designation: isPhoneNumber ? "Mobile Contact" : "Scanned Profile",
        organization: "Techies Community",
        expertise: ["QR Scan"],
        whatsapp: isPhoneNumber ? (cleanPhone.startsWith("91") ? `+${cleanPhone}` : `+91${cleanPhone}`) : "",
        instagram: "",
        linkedin: "",
        github: "",
        email: "",
        profilePhoto: "",
        scannedAt: new Date().toISOString(),
        isLegacy: false,
      };
    }

    // Check Duplicate
    const isDuplicate = existingConnections.some(
      (c) =>
        (c.techpassId && c.techpassId.toLowerCase() === newRecord!.techpassId.toLowerCase()) ||
        (newRecord!.whatsapp && c.whatsapp && c.whatsapp.replace(/[^0-9]/g, "") === newRecord!.whatsapp.replace(/[^0-9]/g, ""))
    );

    if (isDuplicate) {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        try {
          navigator.vibrate([80, 50, 80]);
        } catch (e) {}
      }
      showStatus("error", `Duplicate contact: "${newRecord!.name}" (${newRecord!.techpassId}) is already in your Connections Hub.`);
      return;
    }

    // Success! Give haptic vibration on mobile
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate([150, 60, 150]);
      } catch (e) {}
    }

    onScanSuccess(newRecord!);
    if (!isLegacyFormat) {
      showStatus("success", `Scanned & saved: ${newRecord!.name} (${newRecord!.techpassId})`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    showStatus("info", "Decoding QR code from image...");

    try {
      // Stage 1: Try native BarcodeDetector directly if supported by browser (Fastest & Most Accurate for photos/screenshots)
      if ("BarcodeDetector" in window) {
        try {
          const detector = new (window as any).BarcodeDetector({ formats: ["qr_code"] });
          const bitmap = await createImageBitmap(file);
          const barcodes = await detector.detect(bitmap);
          if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
            handleDecodedText(barcodes[0].rawValue);
            return;
          }
        } catch (nativeErr) {
          console.warn("Native BarcodeDetector attempt failed, falling back to Html5Qrcode:", nativeErr);
        }
      }

      // Stage 2: Try Html5Qrcode.scanFile with showImage = false (full unscaled resolution offscreen)
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader-container", {
          verbose: false,
          experimentalFeatures: { useBarCodeDetectorIfSupported: true },
        });
      }
      try {
        const decodedText = await scannerRef.current.scanFile(file, false);
        handleDecodedText(decodedText);
        return;
      } catch (firstErr) {
        // Stage 3: If offscreen scan misses, try with rendered canvas scan (showImage = true)
        const decodedText = await scannerRef.current.scanFile(file, true);
        handleDecodedText(decodedText);
      }
    } catch (err) {
      console.error("File QR scan error", err);
      showStatus(
        "error",
        "Could not detect a QR code in this photo. Make sure the QR code is bright, well-lit, and has a visible white border."
      );
    } finally {
      setIsProcessingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (osCameraInputRef.current) osCameraInputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-[32px] border border-white/15 bg-white/[0.03] p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden text-white">
      <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-white shadow-sm">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-jakarta text-xl font-bold text-white flex items-center gap-2">
              <span>TechPass QR Scanner</span>
              <span className="rounded-full bg-white/15 px-2.5 py-0.5 font-inter text-[10px] font-bold text-white uppercase tracking-widest border border-white/20">
                LIVE
              </span>
            </h3>
            <p className="font-inter text-xs text-slate-400">
              Scan any builder&apos;s TechPass QR via live camera or OS camera capture
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Status Alert Banner */}
      {statusMsg && (
        <div
          className={`mb-6 flex items-center justify-between rounded-2xl border px-4 py-3 font-inter text-xs font-semibold shadow-lg backdrop-blur-md transition-all ${
            statusMsg.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
              : statusMsg.type === "error"
              ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
              : statusMsg.type === "legacy"
              ? "border-amber-500/40 bg-amber-500/15 text-amber-200"
              : "border-white/20 bg-white/10 text-white"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {statusMsg.type === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
            {statusMsg.type === "error" && <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />}
            {statusMsg.type === "legacy" && <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />}
            <span>{statusMsg.text}</span>
          </div>
          <button onClick={() => setStatusMsg(null)} className="text-white/60 hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Camera Reader Viewport */}
      <div className="mx-auto mb-4 sm:mb-6 flex flex-col items-center">
        <div
          className={`relative w-full max-w-[260px] sm:max-w-[340px] aspect-square rounded-2xl overflow-hidden border-2 bg-black/40 flex items-center justify-center transition-all ${
            isCameraActive ? "border-white/60 shadow-lg shadow-white/10" : "border-white/10"
          }`}
        >
          {/* Sibling overlay when camera is offline so React DOM never touches children inside #qr-reader-container */}
          {!isCameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 text-center text-white/50 pointer-events-none z-10 bg-[#060a17]/90 backdrop-blur-sm">
              <CameraOff className="h-8 w-8 sm:h-10 sm:w-10 mb-2 text-white/30" />
              <span className="font-inter text-xs font-medium">Live Stream Offline</span>
              <span className="font-inter text-[10px] text-white/40 mt-1 max-w-[200px]">
                Tap &apos;Start Live Camera&apos; or use &apos;OS Camera / Photo&apos; right below
              </span>
            </div>
          )}
          {/* Dedicated empty container controlled 100% by Html5Qrcode without React child conflicts */}
          <div id="qr-reader-container" className="w-full h-full"></div>
        </div>
      </div>

      {/* Controls: Camera Selection, Start/Stop, OS Camera Capture, and File Upload */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2.5 sm:gap-3 border-t border-white/10 pt-4 sm:pt-6">
        {cameras.length > 1 && isCameraActive && (
          <select
            value={selectedCameraId}
            onChange={(e) => setSelectedCameraId(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-white/20 bg-white/10 px-3 py-2 font-inter text-xs text-white focus:outline-none"
          >
            {cameras.map((c) => (
              <option key={c.id} value={c.id} className="bg-neutral-900 text-white">
                {c.label || `Camera ${c.id.substring(0, 5)}...`}
              </option>
            ))}
          </select>
        )}

        {/* 1. Live WebRTC Camera Stream */}
        <button
          onClick={handleStartCamera}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-inter text-xs font-bold transition-all shadow-md ${
            isCameraActive
              ? "bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30"
              : "bg-white text-neutral-950 hover:bg-slate-200 hover:scale-105"
          }`}
        >
          {isCameraActive ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
          <span>{isCameraActive ? "STOP LIVE CAMERA" : "START LIVE CAMERA"}</span>
        </button>

        {/* 2. Direct OS Native Camera Launch (capture="environment") */}
        <button
          onClick={() => osCameraInputRef.current?.click()}
          disabled={isProcessingFile}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 font-inter text-xs font-bold text-white transition-all hover:bg-white/20 hover:border-white shadow-md disabled:opacity-50"
        >
          <Camera className="h-4 w-4 text-slate-200" />
          <span>{isProcessingFile ? "PROCESSING..." : "TAKE PHOTO (OS CAMERA)"}</span>
        </button>
        <input
          ref={osCameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* 3. Upload from Gallery/File */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessingFile}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 font-inter text-xs font-bold text-white transition-all hover:bg-white/20 hover:border-white shadow-md disabled:opacity-50"
        >
          <Upload className="h-4 w-4 text-slate-200" />
          <span>{isProcessingFile ? "PROCESSING..." : "UPLOAD PHOTO"}</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}
