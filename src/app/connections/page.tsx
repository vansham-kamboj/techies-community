import React from "react";
import type { Metadata } from "next";
import ConnectionsHub from "@/components/connections/ConnectionsHub";

export const metadata: Metadata = {
  title: "Connections Hub | Techies Community",
  description: "Your private, 100% client-side networking matrix for scanning and storing TechPass digital identities.",
};

export default function ConnectionsPage() {
  return (
    <main className="min-h-screen bg-[#030509] text-white selection:bg-white/20 selection:text-white">
      <ConnectionsHub />
    </main>
  );
}
