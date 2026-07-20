import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Techies Community | Build Beyond Boundaries",
  description:
    "For dreamers, builders, and innovators who choose to create their own path. Enter a premium digital universe built for students and creators who engineer their own path.",
  keywords: [
    "Techies Community",
    "Builders",
    "Innovators",
    "Startups",
    "AI",
    "Content Creation",
    "Futuristic",
    "Digital Universe",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable} dark scroll-smooth`}
      suppressHydrationWarning
    >
      <body
        className="noise-bg min-h-screen bg-[#040711] text-white font-inter antialiased selection:bg-aurora-cyan selection:text-midnight-base"
        suppressHydrationWarning
      >
        <CustomCursor />
        <Navbar />
        <main className="relative z-10 overflow-x-clip">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
