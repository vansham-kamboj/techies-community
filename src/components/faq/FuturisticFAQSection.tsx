"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  Plus,
  Minus,
  Users,
  Calendar,
  Key,
  Shield,
  Wrench,
  Rocket,
} from "lucide-react";

export type FAQCategory =
  | "Community"
  | "Events"
  | "Membership"
  | "TechPass"
  | "Workshops"
  | "Opportunities";

interface FAQItem {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
}

const CATEGORIES: { label: FAQCategory; icon: React.ComponentType<{ className?: string }> }[] = [
  { label: "Community", icon: Users },
  { label: "Events", icon: Calendar },
  { label: "Membership", icon: Shield },
  { label: "TechPass", icon: Key },
  { label: "Workshops", icon: Wrench },
  { label: "Opportunities", icon: Rocket },
];

const FAQ_DATA: FAQItem[] = [
  // Community
  {
    id: "comm-1",
    category: "Community",
    question: "What makes Techies Community different from traditional college clubs or study groups?",
    answer:
      "Unlike passive university clubs restricted by academic bureaucracy, Techies Community is an autonomous, high-agency engineering matrix. We prioritize zero-to-one product building, live production deployments, and real-world collaboration over textbook lectures and theoretical exams.",
  },
  {
    id: "comm-2",
    category: "Community",
    question: "Do I need to be a senior computer science student to join?",
    answer:
      "Absolutely not. We care strictly about your agency, curiosity, and drive to build. Whether you are a freshman writing your first Python script or a self-taught engineer exploring distributed systems, you are welcome as long as you choose to create rather than merely consume.",
  },
  {
    id: "comm-3",
    category: "Community",
    question: "How do members communicate and collaborate daily?",
    answer:
      "Our daily operations run inside a verified Discord server and Guild matrix where members form specialized 'build swarms,' share raw technical feedback, conduct live code review arenas, and pair program on open-source repositories.",
  },
  {
    id: "comm-4",
    category: "Community",
    question: "Can I start or lead a local Techies chapter at my university or city?",
    answer:
      "Yes! We run a decentralized chapter model. Once you demonstrate active contribution and understanding of our core tenets, you can apply for Chapter Lead authorization to host live meetups, hackathons, and workshops in your region with our full infrastructure backing.",
  },

  // Events
  {
    id: "evt-1",
    category: "Events",
    question: "What types of events does Techies Community organize throughout the year?",
    answer:
      "We host 48-Hour Build-A-Thons, AI Agent Sprints, High-Concurrency System Bootcamps, Research Paper Teardowns (deconstructing DeepMind/OpenAI architectures), and exclusive founder/CTO fireside chats.",
  },
  {
    id: "evt-2",
    category: "Events",
    question: "Are your hackathons open to external participants or strictly internal?",
    answer:
      "Major flagship hackathons and global build challenges are open to the worldwide developer ecosystem, but active verified TechPass holders receive priority registration, dedicated cloud compute grants, and direct mentor office hours.",
  },
  {
    id: "evt-3",
    category: "Events",
    question: "How do virtual and physical hybrid meetups function across different time zones?",
    answer:
      "We operate across global nodes. Live workshops and sprints are streamed simultaneously to virtual swarms with interactive Q&A channels, and all codebases, architecture diagrams, and recordings are permanently archived in our open knowledge base.",
  },
  {
    id: "evt-4",
    category: "Events",
    question: "How are winning projects judged during internal build sprints?",
    answer:
      "Projects are evaluated by experienced engineers and founders based on three non-negotiable criteria: production readiness (does it run without crashing?), engineering novelty (is the architecture elegant?), and zero-to-one impact.",
  },

  // Membership
  {
    id: "mem-1",
    category: "Membership",
    question: "Is there any financial cost or hidden fee required to become a member?",
    answer:
      "No. Techies Community is 100% free for passionate builders. We believe talent is distributed globally and financial friction should never prevent high-agency creators from accessing world-class peers and infrastructure.",
  },
  {
    id: "mem-2",
    category: "Membership",
    question: "How do I maintain active verification status within the community?",
    answer:
      "Active verification requires consistent creation. You maintain your standing by pushing open-source commits, participating in build sprints, reviewing peers' code, or sharing verified technical research in our daily engineering channels.",
  },
  {
    id: "mem-3",
    category: "Membership",
    question: "What happens if I need to take a break due to exams or personal projects?",
    answer:
      "Your membership status transitions gracefully to 'Sabbatical' mode. Your TechPass ID remains valid, and you can jump right back into active build swarms whenever your schedule allows.",
  },
  {
    id: "mem-4",
    category: "Membership",
    question: "What is the vetting process for joining specialized core engineering teams?",
    answer:
      "To join core specialized squads (such as our Production RAG architecture team or Rust Systems core), members submit working code samples or complete a brief practical technical challenge reviewed by senior domain leads.",
  },

  // TechPass
  {
    id: "pass-1",
    category: "TechPass",
    question: "What exactly is the futuristic TechPass identity card generator on this site?",
    answer:
      "TechPass is our signature digital credential identity card. When you claim your TechPass on this website, it dynamically generates an unique, verifiable pass complete with your custom QR connection code, domain badges, and holographic verification.",
  },
  {
    id: "pass-2",
    category: "TechPass",
    question: "How does the built-in QR Scanner work for networking at events?",
    answer:
      "Your TechPass features a live QR connection system (`/connections`). When attending meetups or hackathons, you can instantly scan another member's pass to exchange verified profiles, view their open-source tech stack, and save them directly to your digital connection matrix.",
  },
  {
    id: "pass-3",
    category: "TechPass",
    question: "Can I customize the domain roles and skills shown on my TechPass card?",
    answer:
      "Yes! You can select your primary and secondary engineering domains (e.g., AI & Automation, Full-Stack Systems, UI/UX Design, or Cybersecurity) and showcase your verified GitHub handle and project links.",
  },
  {
    id: "pass-4",
    category: "TechPass",
    question: "Is my TechPass credential stored securely in local storage?",
    answer:
      "Yes, all your generated identity data and scanned peer connections are stored locally on your device with offline resilience, allowing you to access your digital pass seamlessly even in high-density event venues with poor cellular reception.",
  },

  // Workshops
  {
    id: "work-1",
    category: "Workshops",
    question: "Who teaches the technical workshops and domain deep-dives?",
    answer:
      "Our workshops are led by working software engineers, startup CTOs, active open-source maintainers, and senior community members who have shipped production systems at scale.",
  },
  {
    id: "work-2",
    category: "Workshops",
    question: "What topics are covered in the AI & Automation and Development workshops?",
    answer:
      "Topics range from fine-tuning open-weight LLMs (`Llama 3`, `DeepSeek`), building hybrid semantic RAG pipelines with vector databases, and multi-agent LangGraph orchestration, to memory-safe Rust system design, Go concurrency, and React 19 / Next.js App Router architectures.",
  },
  {
    id: "work-3",
    category: "Workshops",
    question: "Are starter codebases and repositories provided before each session?",
    answer:
      "Always. Every workshop includes an interactive GitHub repository with pre-configured Docker environments and clear step-by-step documentation so you can code along live without environment setup headaches.",
  },
  {
    id: "work-4",
    category: "Workshops",
    question: "Can I propose and host a workshop if I have deep expertise in a specific tool or language?",
    answer:
      "We encourage it! If you have mastered a framework, system design pattern, or design workflow, you can submit a workshop proposal to our curriculum leads and teach a global live cohort.",
  },

  // Opportunities
  {
    id: "opp-1",
    category: "Opportunities",
    question: "Does Techies Community help members land engineering jobs and internships?",
    answer:
      "Yes. Our verified talent network is actively monitored by startup founders, engineering hiring managers, and venture capital partners looking for high-agency engineers who can build and ship without hand-holding.",
  },
  {
    id: "opp-2",
    category: "Opportunities",
    question: "How does the Startup Incubator and zero-to-one building support work?",
    answer:
      "If you and your build swarm develop a breakthrough project during a sprint, our incubator channel provides architecture guidance, cloud compute credits, legal startup basics, and direct warm introductions to pre-seed and seed-stage tech investors.",
  },
  {
    id: "opp-3",
    category: "Opportunities",
    question: "Can I receive open-source sponsorship grants or hardware support for my project?",
    answer:
      "Yes! Outstanding open-source tools and high-impact infrastructure projects built within the community are eligible for micro-grants, cloud hosting sponsorship, and dedicated community spotlighting to accelerate adoption.",
  },
  {
    id: "opp-4",
    category: "Opportunities",
    question: "Are there mentorship opportunities to pair program with senior engineers?",
    answer:
      "Our mentorship model revolves around collaborative code reviews and live debugging sessions. Instead of formal lecture calls, you work shoulder-to-shoulder with senior architects on real production codebases.",
  },
];

export default function FuturisticFAQSection() {
  const [activeCategory, setActiveCategory] = useState<FAQCategory>("Community");
  const [openCardId, setOpenCardId] = useState<string | null>("comm-1");

  const filteredFAQs = FAQ_DATA.filter((item) => item.category === activeCategory);

  const toggleCard = (id: string) => {
    setOpenCardId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="relative min-h-[85vh] w-full py-14 sm:py-16 px-6 sm:px-10 bg-[#030509] border-t border-white/[0.06] overflow-hidden">
      {/* Main Two-Column Layout (40% / 60% on desktop) - compact gap and sizing */}
      <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column (5 columns = ~40%): Label, Compact Heading, Text, Category Switchers */}
        <div className="col-span-1 lg:col-span-5 flex flex-col items-start text-left lg:sticky lg:top-24">
          {/* Eyebrow Label */}
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-slate-300 tracking-wider uppercase mb-3">
            <HelpCircle className="h-3 w-3 text-slate-400" />
            <span>GOT QUESTIONS?</span>
          </div>

          {/* Compact Main Heading */}
          <h2 className="font-jakarta text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-snug">
            Everything You <br className="hidden sm:block" />
            Need To Know <br className="hidden sm:block" />
            <span className="text-slate-300">About Techies.</span>
          </h2>

          {/* Supporting Text */}
          <p className="mt-3 font-inter text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-md">
            Explore our high-agency culture, decentralized chapter model, TechPass digital credential perks, and zero-to-one engineering philosophy.
          </p>

          {/* Category Switcher Tabs - Compact & Clean */}
          <div className="mt-5 flex flex-wrap lg:flex-col gap-2 w-full">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => {
                    setActiveCategory(cat.label);
                    // Automatically open first item of newly selected category
                    const firstItem = FAQ_DATA.find((i) => i.category === cat.label);
                    if (firstItem) setOpenCardId(firstItem.id);
                  }}
                  className={`group relative flex items-center gap-2.5 px-3.5 py-2 rounded-lg font-inter text-xs sm:text-sm font-semibold transition-all duration-300 text-left cursor-pointer focus:outline-none ${
                    isActive
                      ? "text-white bg-white/[0.08] border border-white/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent"
                  }`}
                >
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
                      isActive ? "bg-white text-neutral-950" : "bg-white/[0.05] text-slate-300"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="tracking-wide">{cat.label}</span>
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column (7 columns = ~60%): Expandable Compact FAQ Cards (Zero Glow) */}
        <div className="col-span-1 lg:col-span-7 flex flex-col gap-3 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-3"
            >
              {filteredFAQs.map((faq, idx) => {
                const isOpen = openCardId === faq.id;
                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className={`group relative overflow-hidden rounded-xl border transition-all duration-300 backdrop-blur-md ${
                      isOpen
                        ? "border-white/25 bg-white/[0.05]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.03]"
                    }`}
                  >
                    {/* Clean solid white indicator line along left border when open (no glow) */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "100%", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 top-0 bottom-0 w-1 bg-white z-20"
                        />
                      )}
                    </AnimatePresence>

                    {/* Question Header Button */}
                    <button
                      onClick={() => toggleCard(faq.id)}
                      className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-left cursor-pointer focus:outline-none"
                    >
                      <span
                        className={`font-jakarta text-sm sm:text-base font-bold tracking-tight transition-colors ${
                          isOpen ? "text-white" : "text-slate-200 group-hover:text-white"
                        }`}
                      >
                        {faq.question}
                      </span>
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 ${
                          isOpen
                            ? "border-white/30 bg-white text-neutral-950 rotate-180"
                            : "border-white/10 bg-white/[0.04] text-slate-300 group-hover:border-white/20"
                        }`}
                      >
                        {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      </div>
                    </button>

                    {/* Expandable Answer Content */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-0.5 font-inter text-xs sm:text-sm text-slate-300/90 leading-relaxed border-t border-white/[0.06]">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
