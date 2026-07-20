import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export interface ConnectionRecord {
  id: string; // Internal record ID or techpassId
  techpassId: string;
  name: string;
  designation: string;
  organization: string;
  expertise: string[];
  whatsapp: string;
  instagram: string;
  linkedin: string;
  github: string;
  email: string;
  profilePhoto: string;
  scannedAt: string; // ISO date string
  isLegacy?: boolean;
}

export const getExportFilename = (extension: "xlsx" | "csv" = "xlsx") => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `techies-connections-${year}-${month}-${day}.${extension}`;
};

export const exportToExcel = (connections: ConnectionRecord[], filename?: string) => {
  if (connections.length === 0) return;
  const targetName = filename || getExportFilename("xlsx");

  const rows = connections.map((c) => ({
    "TechPass ID": c.techpassId || "N/A",
    "Full Name": c.name || "Unknown",
    "Designation": c.designation || "-",
    "College / Company": c.organization || "-",
    "Expertise Tags": Array.isArray(c.expertise) ? c.expertise.join(", ") : "",
    "WhatsApp": c.whatsapp || "-",
    "Email": c.email || "-",
    "LinkedIn": c.linkedin || "-",
    "GitHub": c.github || "-",
    "Instagram": c.instagram || "-",
    "Scan Timestamp": c.scannedAt ? new Date(c.scannedAt).toLocaleString() : "-",
    "Legacy Format": c.isLegacy ? "Yes" : "No",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Connections");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, targetName);
};

export const exportToCSV = (connections: ConnectionRecord[], filename?: string) => {
  if (connections.length === 0) return;
  const targetName = filename || getExportFilename("csv");

  const rows = connections.map((c) => ({
    "TechPass ID": c.techpassId || "N/A",
    "Full Name": c.name || "Unknown",
    "Designation": c.designation || "-",
    "College / Company": c.organization || "-",
    "Expertise Tags": Array.isArray(c.expertise) ? c.expertise.join(", ") : "",
    "WhatsApp": c.whatsapp || "-",
    "Email": c.email || "-",
    "LinkedIn": c.linkedin || "-",
    "GitHub": c.github || "-",
    "Instagram": c.instagram || "-",
    "Scan Timestamp": c.scannedAt ? new Date(c.scannedAt).toLocaleString() : "-",
    "Legacy Format": c.isLegacy ? "Yes" : "No",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const csvContent = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  saveAs(blob, targetName);
};

export const importFromFile = async (
  file: File,
  currentConnections: ConnectionRecord[]
): Promise<{ merged: ConnectionRecord[]; addedCount: number; skippedCount: number }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet);

        const existingIds = new Set(
          currentConnections.map((c) => (c.techpassId ? c.techpassId.toLowerCase() : ""))
        );
        const existingPhones = new Set(
          currentConnections.map((c) => (c.whatsapp ? c.whatsapp.replace(/[^0-9]/g, "") : ""))
        );

        let addedCount = 0;
        let skippedCount = 0;
        const newEntries: ConnectionRecord[] = [];

        for (const row of rows) {
          const name = String(row["Full Name"] || row["name"] || row["Name"] || "Imported Builder").trim();
          const cleanName = name.toLowerCase();
          const techpassId = String(row["TechPass ID"] || row["techpassId"] || row["ID"] || "").trim();
          const cleanId = techpassId.toLowerCase();
          const whatsapp = String(row["WhatsApp"] || row["whatsapp"] || row["Phone"] || "").trim();
          const cleanPhone = whatsapp.replace(/[^0-9]/g, "");

          // Check if duplicate (require identical name plus ID/Phone match)
          const isDuplicate = [...currentConnections, ...newEntries].some((c) => {
            const existingName = (c.name || "").trim().toLowerCase();
            if (existingName !== cleanName) return false;
            const existingId = (c.techpassId || "").trim().toLowerCase();
            const existingPhone = c.whatsapp ? c.whatsapp.replace(/[^0-9]/g, "") : "";
            return (
              (cleanId && cleanId !== "n/a" && existingId === cleanId) ||
              (cleanPhone && cleanPhone !== "14155552671" && existingPhone === cleanPhone)
            );
          });

          if (isDuplicate) {
            skippedCount++;
            continue;
          }

          if (techpassId && techpassId !== "N/A") existingIds.add(techpassId.toLowerCase());
          if (cleanPhone) existingPhones.add(cleanPhone);

          const rawTags = row["Expertise Tags"] || row["expertise"] || row["Skills"] || "";
          const expertise = typeof rawTags === "string" ? rawTags.split(",").map((s) => s.trim()).filter(Boolean) : Array.isArray(rawTags) ? rawTags : [];

          const newRecord: ConnectionRecord = {
            id: techpassId || `IMP-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            techpassId: techpassId || `TECH-${Math.floor(1000 + Math.random() * 9000)}`,
            name: String(row["Full Name"] || row["name"] || row["Name"] || "Imported Builder").trim(),
            designation: String(row["Designation"] || row["designation"] || row["Role"] || "Builder").trim(),
            organization: String(row["College / Company"] || row["organization"] || row["Company"] || "Community").trim(),
            expertise,
            whatsapp: whatsapp !== "-" ? whatsapp : "",
            instagram: String(row["Instagram"] || row["instagram"] || "").trim(),
            linkedin: String(row["LinkedIn"] || row["linkedin"] || "").trim(),
            github: String(row["GitHub"] || row["github"] || "").trim(),
            email: String(row["Email"] || row["email"] || "").trim(),
            profilePhoto: "",
            scannedAt: row["Scan Timestamp"] || new Date().toISOString(),
            isLegacy: row["Legacy Format"] === "Yes" || row["isLegacy"] === true,
          };

          newEntries.push(newRecord);
          addedCount++;
        }

        resolve({
          merged: [...newEntries, ...currentConnections],
          addedCount,
          skippedCount,
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};
