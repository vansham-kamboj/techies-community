"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Float, Sphere, Torus, Stars } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Sparkles,
  Cpu,
  Code2,
  Rocket,
  Video,
  Palette,
  ShieldAlert,
  X,
  CheckCircle2,
  Wrench,
  Layers,
  ArrowRight,
} from "lucide-react";

export interface NodeData {
  id: string;
  title: string;
  shortDesc: string;
  color: string;
  glowColor: string;
  icon: React.ComponentType<{ className?: string }>;
  position: [number, number, number];
  introduction: string;
  whatMembersLearn: string[];
  featuredActivities: string[];
  tools: string[];
  sampleProjects: { name: string; desc: string }[];
  opportunities: string[];
}

const UNIVERSE_NODES: NodeData[] = [
  {
    id: "ai-automation",
    title: "AI & Automation",
    shortDesc: "LLM Systems, Agentic Workflows & Production RAG Architecture",
    color: "#E2E8F0",
    glowColor: "rgba(226, 232, 240, 0.8)",
    icon: Cpu,
    position: [4.5, 1.2, 0],
    introduction:
      "In 2026, artificial intelligence is no longer about simple prompt engineering—it is about architecting resilient, autonomous, and secure production systems. This domain trains engineers in Retrieval-Augmented Generation (RAG), multi-agent orchestration, MLOps pipelines, and fine-tuning open-weight models to solve complex real-world enterprise problems.",
    whatMembersLearn: [
      "Architecting production-grade RAG applications using vector databases and hybrid search strategies",
      "Designing multi-agent autonomous loops and agentic workflows with Python, LangChain, and n8n",
      "Fine-tuning open-weight small language models (Llama 3, DeepSeek, Mistral) for domain-specific accuracy",
      "MLOps deployment, latency optimization, model evaluation, and adversarial prompt robustness",
    ],
    featuredActivities: [
      "Weekly AI Agent Build-A-Thons & Live Production RAG Sprints",
      "Research Paper Teardowns: Deconstructing latest architectures from DeepMind & OpenAI",
      "Autonomous Workflow Show-and-Tell: Automating complex enterprise engineering pipelines",
    ],
    tools: ["Python", "PyTorch", "LangChain / LangGraph", "n8n", "HuggingFace", "Vector DBs (Qdrant/Pinecone)", "Vertex AI / AWS SageMaker"],
    sampleProjects: [
      {
        name: "OmniAgent-X",
        desc: "An autonomous agentic OS tool that ingests live technical documentation, runs tests, and generates verified production code fixes.",
      },
      {
        name: "HyperRAG Core",
        desc: "A hybrid semantic-keyword RAG pipeline handling 10M+ tokens with sub-200ms latency and zero-hallucination guardrails.",
      },
    ],
    opportunities: [
      "AI Systems Engineer & Agentic Workflow Architect roles at high-growth tech firms",
      "MLOps & Data Pipeline contracts with enterprises scaling GenAI infrastructure",
      "Open-source AI infrastructure grants and direct collaboration with senior ML researchers",
    ],
  },
  {
    id: "development",
    title: "Development",
    shortDesc: "Full-Stack Systems, Rust/Go Performance & Cloud Native Architecture",
    color: "#CBD5E1",
    glowColor: "rgba(203, 213, 225, 0.8)",
    icon: Code2,
    position: [2.2, -1.5, 3.8],
    introduction:
      "Full-stack development in 2026 demands deep system-level mastery. Employers prioritize engineers who understand the complete architecture—from memory-safe Rust system components and high-concurrency Go microservices to modern Next.js App Router frontends, containerized Docker environments, and real-time database pipelines.",
    whatMembersLearn: [
      "Advanced full-stack engineering with Next.js App Router, React 19, and strict TypeScript",
      "Memory-safe system development and high-concurrency backend services using Rust and Go",
      "Database internals, query optimization, connection pooling, and Redis/PostgreSQL caching layers",
      "Cloud-native DevOps, Docker containerization, automated CI/CD pipelines, and zero-downtime deployment",
    ],
    featuredActivities: [
      "48-Hour Full-Stack Production & Systems Sprints",
      "High-Concurrency System Design Bootcamps: Architecting for 100,000+ simultaneous WebSocket streams",
      "Code Review Arenas: Rigorous peer audits focusing on memory safety, clean code, and sub-millisecond latency",
    ],
    tools: ["TypeScript", "Next.js / React 19", "Rust (Axum/Actix)", "Go", "PostgreSQL / Redis", "Docker", "AWS / Vercel"],
    sampleProjects: [
      {
        name: "HyperSync Engine",
        desc: "A custom distributed WebSocket synchronization layer built in Rust and Go with instant offline CRDT resolution.",
      },
      {
        name: "Nebula Cloud Edge",
        desc: "A high-performance serverless routing proxy handling authentication and caching at the network edge.",
      },
    ],
    opportunities: [
      "Full-Stack Systems Architect & Backend Engineer roles at top product companies",
      "Lead developer infrastructure contracts and open-source fellowship grants",
      "Fast-track technical interviews and 1-on-1 mentorship with staff engineers across major tech firms",
    ],
  },
  {
    id: "startups",
    title: "Startups",
    shortDesc: "Zero-to-One Product Validation, YC SAFE Mechanics & Growth Engine",
    color: "#F1F5F9",
    glowColor: "rgba(241, 245, 249, 0.8)",
    icon: Rocket,
    position: [-2.2, 1.8, 3.8],
    introduction:
      "The Startups domain transforms technical builders into formidable venture-backed founders. We focus on rigorous customer discovery, rapid 7-day MVP engineering, unit economics, go-to-market (GTM) loops, and navigating standard Y Combinator (YC) fundraising terms before scaling.",
    whatMembersLearn: [
      "Customer discovery interviews, problem validation, and identifying deep, urgent enterprise market pains",
      "Rapidly shipping production-ready MVPs and setting up real-time product telemetry with PostHog and Supabase",
      "Go-to-market (GTM) engineering, viral product-led growth (PLG) loops, and B2B sales motion design",
      "Venture financing mechanics, Y Combinator SAFE notes, cap table architecture, and seed fundraising strategies",
    ],
    featuredActivities: [
      "Techies Founder Pitch Night: Present validated traction directly to active seed venture capitalists and angel investors",
      "Unit Economics & Cap Table Teardowns: Deconstructing actual startup term sheets and revenue models",
      "72-Hour Zero-to-One Launchpad: From raw idea and landing page to paying customers over a single weekend",
    ],
    tools: ["PostHog Analytics", "Supabase", "Stripe Billing", "Linear", "Figma", "Notion / YC SAFE Templates", "Vercel"],
    sampleProjects: [
      {
        name: "DevBilling Infrastructure",
        desc: "Usage-based developer API billing infrastructure that validated customer demand and reached $5,000 MRR in college.",
      },
      {
        name: "CampusTalent AI",
        desc: "A hyper-local student builder matchmaking marketplace connecting technical co-founders across top universities.",
      },
    ],
    opportunities: [
      "Direct warm introductions to pre-seed, seed, and YC-affiliated venture capital partners",
      "Access to over $50,000 in startup infrastructure credits across AWS, Stripe, Notion, PostHog, and GitHub",
      "Co-founder matching with complementary technical and business growth leaders",
    ],
  },
  {
    id: "content-creation",
    title: "Content Creation",
    shortDesc: "Developer Relations (DevRel), Technical Storytelling & Brand Authority",
    color: "#94A3B8",
    glowColor: "rgba(148, 163, 184, 0.8)",
    icon: Video,
    position: [-4.5, -1.2, 0],
    introduction:
      "In the modern technology economy, code without distribution is invisible. The Content Creation and DevRel domain empowers engineers to bridge complex technical architecture and global developer ecosystems. You learn to articulate vision, produce cinematic technical deep-dives, and build personal authority across YouTube, X, and technical publications.",
    whatMembersLearn: [
      "Cinematic video production, dynamic pacing, and visual storytelling for complex engineering concepts",
      "Writing viral technical essays, system architecture breakdowns, and comprehensive developer documentation",
      "Developer Relations (DevRel) strategies: building highly engaged open-source communities and technical newsletters",
      "Monetizing technical authority via sponsorships, advisory roles, and educational digital products",
    ],
    featuredActivities: [
      "Technical Creator Masterclasses: Scripting, animating, and structuring high-retention 100k-view engineering videos",
      "Live Podcast & Teardown Studio: Interviewing legendary tech founders and senior system architects",
      "Thumbnail, Hook & Psychology Workshops: Mastering digital click-through rates and technical communication",
    ],
    tools: ["DaVinci Resolve", "OBS Studio", "Figma", "Descript", "Substack / Beehiiv", "Premiere Pro"],
    sampleProjects: [
      {
        name: "The Architecture Chronicles",
        desc: "A viral video docu-series breaking down the distributed database engineering and failover logic of Netflix and Uber.",
      },
      {
        name: "ByteSized Engineering",
        desc: "A daily high-signal technical digest read by over 15,000 software engineers and students worldwide.",
      },
    ],
    opportunities: [
      "Developer Advocate & Developer Relations (DevRel) roles at top developer tooling companies",
      "Paid brand sponsorships, technical writing contracts, and media passes to global tech conventions",
      "Collaborative crossover productions with leading technical YouTubers and industry educators",
    ],
  },
  {
    id: "design",
    title: "Design",
    shortDesc: "Spatial UI/UX, Design Systems Governance & 3D Interactive Web",
    color: "#E2E8F0",
    glowColor: "rgba(226, 232, 240, 0.8)",
    icon: Palette,
    position: [-2.2, 1.5, -3.8],
    introduction:
      "Where rigorous engineering intersects with sensory aesthetics. In 2026, design has shifted from flat static mockups to spatial 3D environments, living design systems, and AI-ready token architectures. This domain trains designers to build tactile, high-performance interfaces that bridge human emotion and multi-platform logic.",
    whatMembersLearn: [
      "Architecting enterprise-grade, living design systems using advanced Figma variables, tokens, and governance rules",
      "Designing spatial 3D web experiences and depth-aware interfaces with Three.js, Spline 3D, and Blender",
      "Micro-interaction choreography, physics-based motion transitions, and sensory haptic feedback",
      "Accessibility compliance (WCAG 2.2), user psychology, and conducting empirical usability testing laboratories",
    ],
    featuredActivities: [
      "Design-to-Code Wars: Replicating futuristic sci-fi interfaces and spatial HUDs with pixel-perfect accuracy",
      "Advanced Figma Token & Variable Governance Bootcamps for scalable multi-platform design systems",
      "Live UI Critiques: Roast and polish sessions with staff product designers from leading consumer apps",
    ],
    tools: ["Figma (Variables/Tokens)", "Three.js / React Three Fiber", "Spline 3D", "Blender", "Framer / Rive", "After Effects"],
    sampleProjects: [
      {
        name: "Aether Design System",
        desc: "A comprehensive glassmorphism token library with 400+ interactive variables adopted by 12 community startups.",
      },
      {
        name: "Spatial Horizon HUD",
        desc: "An experimental 3D spatial computing interface built with Three.js and real-time gesture responsiveness.",
      },
    ],
    opportunities: [
      "Product Designer & Design Systems Architect roles at premier consumer and enterprise design studios",
      "High-budget spatial UI/UX contracts for emerging Web3, AI, and AR/VR hardware platforms",
      "Lead UX design positions on flagship open-source software and community product launches",
    ],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    shortDesc: "Offensive Penetration Testing, Cloud Security & AI Red Teaming",
    color: "#64748B",
    glowColor: "rgba(100, 116, 139, 0.8)",
    icon: ShieldAlert,
    position: [2.2, -1.5, -3.8],
    introduction:
      "The guardians of critical digital infrastructure. As AI and cloud architectures expand, defending systems against sophisticated automated adversaries is paramount. This domain trains ethical hackers, penetration testers, smart contract auditors, and AI Red Team researchers to proactively uncover and patch critical vulnerabilities.",
    whatMembersLearn: [
      "Offensive web application penetration testing, network mapping, and cloud infrastructure exploitation",
      "Reverse engineering binary executables, kernel-level analysis, and automated threat modeling",
      "Smart contract security auditing, cryptographic protocols, and zero-knowledge vulnerability analysis",
      "AI Red Teaming: simulating semi-autonomous adversarial attack workflows against AI endpoints and pipelines",
    ],
    featuredActivities: [
      "Weekly Capture The Flag (CTF) Tournaments & Hack-The-Box Competitive Leagues",
      "Live Red Team vs Blue Team Enterprise Infrastructure Defense & Attack Simulations",
      "Live Bug Bounty Labs: Hunting real-world vulnerabilities on sanctioned enterprise bug bounty programs",
    ],
    tools: ["Burp Suite Pro", "Metasploit", "Kali Linux", "Ghidra", "Wireshark", "Nmap", "Rust/Python Security Tooling"],
    sampleProjects: [
      {
        name: "Sentinel Zero Scanner",
        desc: "An automated cloud vulnerability scanner detecting API key leakage, CORS misconfigurations, and privilege escalations.",
      },
      {
        name: "CryptoShield Audit Engine",
        desc: "A static analysis vulnerability detector identifying reentrancy and logic flaws in DeFi smart contracts.",
      },
    ],
    opportunities: [
      "Penetration Tester, Security Analyst & AI Red Team Researcher roles at leading cybersecurity firms",
      "Direct admission into private Bug Bounty syndicates with high-payout vulnerability rewards",
      "Sponsored attendance and participation at international security conventions including DEF CON and Black Hat",
    ],
  },
];

// 3D Core Platinum/Obsidian Central Sphere
function TechiesCore({ onHover, isModalOpen, isMobile }: { onHover: (hovered: boolean) => void; isModalOpen: boolean; isMobile?: boolean }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.03; // Much slower rotation
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.05;
      ring1Ref.current.rotation.y += delta * 0.03;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.06;
      ring2Ref.current.rotation.z += delta * 0.02;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x -= delta * 0.04;
      ring3Ref.current.rotation.z -= delta * 0.05;
    }
  });

  return (
    <group
      onPointerOver={(e) => {
        if (isModalOpen) return;
        e.stopPropagation();
        onHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        if (isModalOpen) return;
        e.stopPropagation();
        onHover(false);
        document.body.style.cursor = "default";
      }}
    >
      <Sphere ref={coreRef} args={[1.35, 64, 64]}>
        <meshPhysicalMaterial
          color="#f8fafc"
          metalness={0.95}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          reflectivity={1}
        />
      </Sphere>

      {/* Orbiting Platinum & Slate Rings around Core */}
      <Torus ref={ring1Ref} args={[1.85, 0.005, 32, 128]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.75} />
      </Torus>
      <Torus ref={ring2Ref} args={[2.25, 0.004, 32, 128]}>
        <meshBasicMaterial color="#cbd5e1" transparent opacity={0.5} />
      </Torus>
      <Torus ref={ring3Ref} args={[2.65, 0.003, 32, 128]}>
        <meshBasicMaterial color="#64748b" transparent opacity={0.6} />
      </Torus>

      <Html position={[0, -2.0, 0]} center distanceFactor={12} style={{ display: isModalOpen || isMobile ? "none" : "block" }}>
        <div className="pointer-events-none whitespace-nowrap rounded-full border border-white/15 bg-[#030509]/80 px-3.5 py-1 font-inter text-[11px] font-bold tracking-widest text-slate-200 shadow-xl backdrop-blur-xl">
          TECHIES CORE <span className="text-white">●</span>
        </div>
      </Html>
    </group>
  );
}

// 3D Orbiting Node (Metallic / Platinum Spheres with fine orbital rings)
function OrbitingNode({
  node,
  isSelected,
  isModalOpen,
  onSelect,
  isMobile,
}: {
  node: NodeData;
  isSelected: boolean;
  isModalOpen: boolean;
  onSelect: (node: NodeData) => void;
  isMobile?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    timeRef.current += delta;
    const time = timeRef.current;
    if (groupRef.current && !isSelected && !isModalOpen) {
      // Slower, peaceful orbital speed
      const angle = time * 0.03 + (UNIVERSE_NODES.indexOf(node) * Math.PI * 2) / 6;
      const radius = 4.6;
      groupRef.current.position.x = Math.cos(angle) * radius;
      groupRef.current.position.z = Math.sin(angle) * radius;
      groupRef.current.position.y = node.position[1] + Math.sin(time * 0.5 + node.position[0]) * 0.2;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.004; // Very slow spin
      const scale = hovered ? 1.2 : isSelected ? 1.3 : 1 + Math.sin(time * 1.5) * 0.04;
      meshRef.current.scale.setScalar(scale);
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 3 + Math.sin(time * 0.5) * 0.05;
      ringRef.current.rotation.z += 0.005;
    }
  });

  const Icon = node.icon;

  return (
    <group ref={groupRef} position={node.position}>
      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
        {/* Node Sphere - sleek and compact */}
        <Sphere
          ref={meshRef}
          args={[0.42, 32, 32]}
          onClick={(e) => {
            if (isModalOpen) return;
            e.stopPropagation();
            onSelect(node);
          }}
          onPointerOver={(e) => {
            if (isModalOpen) return;
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={(e) => {
            if (isModalOpen) return;
            e.stopPropagation();
            setHovered(false);
            document.body.style.cursor = "default";
          }}
        >
          <meshPhysicalMaterial
            color={node.color}
            roughness={0.15}
            metalness={0.85}
            clearcoat={1}
            clearcoatRoughness={0.1}
            reflectivity={1}
          />
        </Sphere>

        {/* Equatorial Metallic Ring */}
        <Torus ref={ringRef} args={[0.66, 0.004, 16, 64]}>
          <meshPhysicalMaterial color="#ffffff" metalness={0.9} roughness={0.1} transparent opacity={hovered || isSelected ? 0.9 : 0.4} />
        </Torus>

        {/* Always keep Html components mounted to maintain exact hook ordering across renders & HMR */}
        <Html position={[0, 0, 0]} center distanceFactor={13} style={{ display: isModalOpen || isMobile ? "none" : "block" }}>
          <div
            onClick={(e) => {
              if (isModalOpen) return;
              e.stopPropagation();
              onSelect(node);
            }}
            onPointerOver={() => {
              if (!isModalOpen) setHovered(true);
            }}
            onPointerOut={() => {
              if (!isModalOpen) setHovered(false);
            }}
            className={`group flex cursor-pointer items-center justify-center rounded-full border transition-all duration-300 ${
              hovered || isSelected
                ? "h-12 w-12 border-white bg-white/15 shadow-2xl scale-110 backdrop-blur-xl"
                : "h-9 w-9 border-white/20 bg-[#030509]/80 shadow-md backdrop-blur-xl"
            }`}
          >
            <Icon
              className={`transition-all duration-300 ${
                hovered || isSelected ? "h-5 w-5 text-white" : "h-4 w-4 text-slate-300"
              }`}
            />
          </div>
        </Html>

        <Html position={[0, isMobile ? -0.65 : -0.85, 0]} center distanceFactor={13} style={{ display: isModalOpen ? "none" : "block" }}>
          <div
            onClick={(e) => {
              if (isModalOpen) return;
              e.stopPropagation();
              onSelect(node);
            }}
            className={`cursor-pointer whitespace-nowrap rounded-full border px-2.5 py-0.5 font-inter text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${
              hovered || isSelected
                ? "border-white bg-white/15 text-white scale-105 shadow-xl backdrop-blur-xl"
                : "border-white/15 bg-[#030509]/85 text-slate-200 shadow-md backdrop-blur-xl hover:border-white hover:text-white"
            }`}
          >
            {node.title}
          </div>
        </Html>
      </Float>
    </group>
  );
}

function CameraController({ selectedNode }: { selectedNode: NodeData | null }) {
  const { camera } = useThree();
  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const targetLookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (selectedNode) {
      targetPos.set(selectedNode.position[0] * 0.65, selectedNode.position[1] * 0.65 + 0.5, 6.5);
      targetLookAt.set(selectedNode.position[0], selectedNode.position[1], selectedNode.position[2]);
    } else {
      targetPos.set(0, 0, 11);
      targetLookAt.set(0, 0, 0);
    }
    camera.position.lerp(targetPos, 0.04);
  });

  return null;
}

export default function TechiesUniverseSection() {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [coreHovered, setCoreHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: "-50px" });

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section ref={sectionRef} id="universe" className="relative w-full py-16 sm:py-20 px-4 sm:px-8 bg-[#030509]">
      {/* Section Header */}
      <div className="relative z-10 mx-auto max-w-4xl text-center mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-jakarta text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl"
        >
          The Techies <span className="bg-gradient-to-b from-slate-200 via-slate-400 to-slate-500 bg-clip-text text-transparent">Universe</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-3 font-inter text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal"
        >
          Click or hover on any orbiting node to unlock our interactive dossier of domains, hardcoded curriculum, and high-leverage opportunities.
        </motion.p>
      </div>

      {/* 3D Canvas Area */}
      <div
        className={`relative mx-auto h-[520px] sm:h-[640px] w-full max-w-7xl rounded-[32px] border border-white/[0.08] bg-[#030509] shadow-2xl overflow-hidden flex items-center justify-center ${
          selectedNode ? "pointer-events-none" : ""
        }`}
      >
        <div className="absolute top-6 left-8 z-10 hidden sm:flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 font-inter text-xs text-slate-300 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-white" />
          <span>Click node or sphere to zoom & view panel. Drag to rotate galaxy.</span>
        </div>

        {isMounted ? (
          <Canvas
            frameloop={isInView ? "always" : "never"}
            camera={{ position: [0, 0, 11], fov: 50 }}
            gl={{ antialias: !isMobile, alpha: true, powerPreference: "high-performance" }}
            dpr={[1, isMobile ? 1.2 : 1.75]}
          >
            <ambientLight intensity={0.75} />
            <pointLight position={[10, 10, 10]} intensity={2.0} color="#ffffff" />
            <pointLight position={[-10, -10, -10]} intensity={1.5} color="#cbd5e1" />
            <pointLight position={[0, 15, 0]} intensity={1.0} color="#f8fafc" />
            
            {/* Very slow moving stars */}
            <Stars radius={120} depth={60} count={isMobile ? 180 : 350} factor={2.5} saturation={0} fade speed={0.1} />

            <CameraController selectedNode={selectedNode} />

            <TechiesCore onHover={setCoreHovered} isModalOpen={selectedNode !== null} isMobile={isMobile} />

            {UNIVERSE_NODES.map((node) => (
              <OrbitingNode
                key={node.id}
                node={node}
                isSelected={selectedNode?.id === node.id}
                isModalOpen={selectedNode !== null}
                onSelect={(n) => setSelectedNode(n)}
                isMobile={isMobile}
              />
            ))}

            <OrbitControls
              enablePan={false}
              enableZoom={true}
              maxDistance={16}
              minDistance={5}
              autoRotate={!selectedNode && !coreHovered}
              autoRotateSpeed={0.08}
            />
          </Canvas>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
            <div className="h-12 w-12 rounded-full border-2 border-white border-t-transparent animate-spin" />
            <span className="font-inter text-xs tracking-widest uppercase font-semibold">INITIALIZING GALAXY CORE...</span>
          </div>
        )}

        {selectedNode && (
          <button
            onClick={() => setSelectedNode(null)}
            className="absolute top-6 right-8 z-20 pointer-events-auto flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-4 py-2 font-inter text-xs font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-white/10 backdrop-blur-md"
          >
            <X className="h-4 w-4 text-white" />
            <span>RESET UNIVERSE VIEW</span>
          </button>
        )}
      </div>

      {/* Frosted Glass Node Modal Panel Overlay (rendered directly to body so it sits outside stacking context and above Navbar) */}
      {isMounted &&
        createPortal(
          <AnimatePresence>
            {selectedNode && (
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                style={{ zIndex: 9999999 }}
                className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 pointer-events-auto overflow-y-auto"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedNode(null)}
                  className="fixed inset-0 bg-[#030509]/90 backdrop-blur-md"
                />

                <div className="relative z-10 flex max-h-[82vh] sm:max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-[36px] border border-white/20 bg-[#0a0f1d] shadow-2xl backdrop-blur-2xl">
                  <div className="flex items-center justify-between border-b border-white/[0.1] bg-white/[0.03] px-6 sm:px-8 py-5">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-white/15 shadow-lg bg-white/[0.05]">
                        {React.createElement(selectedNode.icon, {
                          className: "h-6 w-6 sm:h-7 sm:w-7 text-white",
                        })}
                      </div>
                      <div>
                        <h3 className="font-jakarta text-xl sm:text-2xl font-bold tracking-tight text-white">
                          {selectedNode.title}
                        </h3>
                        <p className="font-inter text-[11px] sm:text-xs font-semibold text-slate-300">
                          {selectedNode.shortDesc}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNode(null);
                      }}
                      className="rounded-full border border-white/15 bg-white/10 p-2.5 sm:p-3 text-white transition-all hover:scale-110 hover:border-white hover:bg-white hover:text-neutral-950 cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="overflow-y-auto p-6 sm:p-8 space-y-6 sm:space-y-8">
                    <div>
                      <h4 className="flex items-center gap-2 font-inter text-xs font-bold uppercase tracking-widest text-slate-300">
                        <Layers className="h-4 w-4 text-white" />
                        <span>Domain Introduction</span>
                      </h4>
                      <p className="mt-2 font-inter text-xs sm:text-base leading-relaxed text-slate-300 font-normal">
                        {selectedNode.introduction}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 sm:p-6 backdrop-blur-md">
                        <h4 className="flex items-center gap-2 font-inter text-xs font-bold uppercase tracking-widest text-slate-300">
                          <CheckCircle2 className="h-4 w-4 text-white" />
                          <span>What Members Master</span>
                        </h4>
                        <ul className="mt-3 space-y-2.5">
                          {selectedNode.whatMembersLearn.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 font-normal">
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 sm:p-6 backdrop-blur-md">
                        <h4 className="flex items-center gap-2 font-inter text-xs font-bold uppercase tracking-widest text-slate-300">
                          <Wrench className="h-4 w-4 text-white" />
                          <span>Core Tools & Tech Stack</span>
                        </h4>
                        <div className="mt-3.5 flex flex-wrap gap-2">
                          {selectedNode.tools.map((tool, idx) => (
                            <span
                              key={idx}
                              className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 font-inter text-xs font-semibold text-slate-200 shadow-sm"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="flex items-center gap-2 font-inter text-xs font-bold uppercase tracking-widest text-white/90">
                        <Sparkles className="h-4 w-4 text-white" />
                        <span>Featured Community Activities</span>
                      </h4>
                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {selectedNode.featuredActivities.map((act, idx) => (
                          <div
                            key={idx}
                            className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 transition-all hover:border-white/20"
                          >
                            <div className="font-inter text-xs font-bold text-slate-400">0{idx + 1}</div>
                            <p className="mt-1.5 text-xs sm:text-sm font-medium text-slate-300">{act}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="flex items-center gap-2 font-inter text-xs font-bold uppercase tracking-widest text-slate-300">
                        <Cpu className="h-4 w-4 text-white" />
                        <span>Flagship Member Projects</span>
                      </h4>
                      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {selectedNode.sampleProjects.map((proj, idx) => (
                          <div
                            key={idx}
                            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 transition-all hover:border-white/20"
                          >
                            <h5 className="font-inter text-sm sm:text-base font-bold text-white">{proj.name}</h5>
                            <p className="mt-1 font-inter text-xs sm:text-sm leading-relaxed text-slate-300 font-normal">{proj.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.1] bg-white/[0.03] px-6 sm:px-8 py-4 sm:py-5">
                    <span className="font-inter text-[11px] sm:text-xs text-white/50 uppercase tracking-wider font-semibold">
                      NODE ID: {selectedNode.id.toUpperCase()}-CURRICULUM
                    </span>
                    <a
                      href="#techpass"
                      onClick={() => setSelectedNode(null)}
                      className="w-full sm:w-auto rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-200 px-6 sm:px-8 py-2.5 sm:py-3 font-inter text-xs font-bold tracking-wider text-neutral-950 shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <span>CLAIM PASS FOR THIS NODE</span>
                      <ArrowRight className="h-3.5 w-3.5 text-neutral-950" />
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}
