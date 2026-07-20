"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AnimatedPhraseProps {
  words: string[];
  progress: MotionValue<number>;
  phraseStart: number;
  phraseEnd: number;
  gradient?: boolean;
  size?: "large" | "normal";
  wordsPerLine?: number;
}

function AnimatedPhrase({ words, progress, phraseStart, phraseEnd, gradient = false, size = "large", wordsPerLine }: AnimatedPhraseProps) {
  // Calculate distinct, strictly increasing intervals for the phrase lifecycle
  const revealDuration = (phraseEnd - phraseStart) * 0.65;
  const fadeOutDuration = (phraseEnd - phraseStart) * 0.25;
  const wordStep = revealDuration / Math.max(1, words.length);

  const phrasePeakStart = phraseStart + revealDuration;
  const phrasePeakEnd = Math.max(phrasePeakStart + 0.005, phraseEnd - fadeOutDuration);

  const textClasses =
    size === "large"
      ? "text-2xl sm:text-4xl md:text-5xl lg:text-6xl gap-x-2.5 sm:gap-x-4 gap-y-2"
      : "text-lg sm:text-2xl md:text-3xl lg:text-4xl gap-x-2 sm:gap-x-3 gap-y-1.5 sm:gap-y-2 max-w-4xl";

  return (
    <div className={`flex flex-wrap items-center justify-center text-center pointer-events-none ${textClasses}`}>
      {words.map((word, index) => {
        // Calculate strictly increasing points for each word
        const wStart = phraseStart + index * wordStep;
        const wPeak = Math.max(wStart + 0.002, wStart + wordStep * 0.8);
        const wFadeOutStart = Math.max(wPeak + 0.002, phrasePeakEnd);
        const wFadeOutEnd = Math.max(wFadeOutStart + 0.002, phraseEnd);
        const wBeforeStart = Math.max(0, wStart - 0.001);

        // Guaranteed strictly monotonically increasing offsets starting from pure 0
        const opacity = useTransform(progress, [wBeforeStart, wStart, wPeak, wFadeOutStart, wFadeOutEnd], [0, 0.15, 1, 1, 0]);
        const filter = useTransform(
          progress,
          [wBeforeStart, wStart, wPeak, wFadeOutStart, wFadeOutEnd],
          ["blur(12px)", "blur(10px)", "blur(0px)", "blur(0px)", "blur(14px)"]
        );
        const scale = useTransform(progress, [wBeforeStart, wStart, wPeak, wFadeOutStart, wFadeOutEnd], [0.85, 0.9, 1, 1, 1.05]);
        const y = useTransform(progress, [wBeforeStart, wStart, wPeak, wFadeOutStart, wFadeOutEnd], [25, 20, 0, 0, -20]);

        return (
          <React.Fragment key={index}>
            {wordsPerLine && index > 0 && index % wordsPerLine === 0 && (
              <div className="w-full h-0 basis-full" />
            )}
            <motion.span
              style={{ opacity, filter, scale, y }}
              className={`font-jakarta font-extrabold tracking-tight leading-snug sm:leading-normal ${
                gradient
                  ? "bg-gradient-to-b from-slate-200 via-slate-400 to-slate-500 bg-clip-text text-transparent"
                  : "text-white"
              }`}
            >
              {word}
            </motion.span>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function PathLessChosenSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const phrase1Words = ["Some", "follow", "instructions."];
  const phrase2Words = ["Some", "follow", "trends."];
  const phrase3Words = ["And", "some", "choose", "to", "build."];
  const phrase4Words = [
    "Techies",
    "is",
    "for",
    "the",
    "ones",
    "who",
    "believe",
    "there",
    "is",
    "more",
    "to",
    "life",
    "than",
    "simply",
    "following",
    "the",
    "expected",
    "path.",
  ];

  const finalBadgeOpacity = useTransform(scrollYProgress, [0.71, 0.76, 0.94, 0.99], [0, 1, 1, 0]);
  const finalBadgeY = useTransform(scrollYProgress, [0.71, 0.76], [20, 0]);

  return (
    <section ref={containerRef} id="story" className="relative h-[260vh] w-full bg-[#030509]">
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden px-6 sm:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff06_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

        <div className="relative z-10 flex max-w-5xl flex-col items-center justify-center text-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatedPhrase words={phrase1Words} progress={scrollYProgress} phraseStart={0.02} phraseEnd={0.22} size="large" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatedPhrase words={phrase2Words} progress={scrollYProgress} phraseStart={0.25} phraseEnd={0.45} size="large" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatedPhrase words={phrase3Words} progress={scrollYProgress} phraseStart={0.48} phraseEnd={0.68} gradient={true} size="large" />
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
            <motion.div
              style={{ opacity: finalBadgeOpacity, y: finalBadgeY }}
              className="mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 font-inter text-xs font-bold uppercase tracking-widest text-white/90 backdrop-blur-md shadow-lg"
            >
              <Sparkles className="h-3.5 w-3.5 text-white" />
              <span>THE PATH LESS CHOSEN</span>
            </motion.div>

            <AnimatedPhrase words={phrase4Words} progress={scrollYProgress} phraseStart={0.72} phraseEnd={0.96} size="normal" wordsPerLine={3} />
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-inter text-[10px] uppercase tracking-widest text-white/40 font-semibold">
            SCROLL TO EXPERIENCE THE MANIFESTO
          </span>
          <div className="h-12 w-[2px] rounded-full bg-white/10 overflow-hidden">
            <motion.div
              style={{ scaleY: scrollYProgress }}
              className="h-full w-full origin-top bg-gradient-to-b from-white via-slate-300 to-slate-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
