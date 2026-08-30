"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Lenis from "lenis";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { MastheadMark } from "@/components/masthead-mark";

const DATE_STAMPS = ["MAR 4 1923", "JUL 19 1961", "OCT 2 1988", "AUG 30 2026"];
const WELCOME_TEXT = "WELCOME TO NEWS VAULT";
const DATELINE_CHAR_MS = 55;
const DATELINE_PAUSE_MS = 400;

type IntroPhase = "dateline" | "pause" | "welcome";

// Exactly one scene is active at a time, chosen by a hard scroll-progress
// threshold rather than soft overlapping ranges — this is what keeps scenes
// from ever being simultaneously visible, and lets the last scene (cta) just
// hold forever once reached, with no upper bound to fall back out of.
type SceneKey = "intro" | "stamp" | "masthead" | "tagline" | "cta";

const SCENE_THRESHOLDS: [SceneKey, number][] = [
  ["intro", 0],
  ["stamp", 0.05],
  ["masthead", 0.3],
  ["tagline", 0.55],
  ["cta", 0.78],
];

function sceneForProgress(progress: number): SceneKey {
  let current: SceneKey = "intro";
  for (const [scene, threshold] of SCENE_THRESHOLDS) {
    if (progress >= threshold) current = scene;
  }
  return current;
}

function todaysDateline() {
  return new Date()
    .toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    .toUpperCase();
}

function TypewriterCursor() {
  return <span aria-hidden="true" className="typewriter-cursor" />;
}

// Sequenced title card: today's date types out, pauses, then "WELCOME TO
// NEWS VAULT" fades/drops into place. Time-based (not scroll-linked) so it
// plays once on load; the scene's visibility is driven by SceneKey.
function useTypewriterIntro(enabled: boolean) {
  const datelineText = useMemo(() => todaysDateline(), []);
  const [phase, setPhase] = useState<IntroPhase>("dateline");
  const [datelineChars, setDatelineChars] = useState(0);

  useEffect(() => {
    if (!enabled || phase !== "dateline") return;
    if (datelineChars >= datelineText.length) {
      setPhase("pause");
      return;
    }
    const t = setTimeout(() => setDatelineChars((c) => c + 1), DATELINE_CHAR_MS);
    return () => clearTimeout(t);
  }, [enabled, phase, datelineChars, datelineText]);

  useEffect(() => {
    if (!enabled || phase !== "pause") return;
    const t = setTimeout(() => setPhase("welcome"), DATELINE_PAUSE_MS);
    return () => clearTimeout(t);
  }, [enabled, phase]);

  return {
    phase,
    dateline: datelineText.slice(0, datelineChars),
  };
}

function StaticLanding() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
        Vol. I &middot; An Archive of Record
      </p>
      <MastheadMark size="large" asLink={false} />
      <p className="max-w-md text-lg text-ink-muted">
        Every story, filed exactly where it happened, not where it was written.
      </p>
      <Link
        href="/vault"
        className="inline-block border-2 border-ink bg-ink px-8 py-4 font-mono text-sm uppercase tracking-widest text-paper transition-colors hover:bg-transparent hover:text-ink"
      >
        Check the Vault &rarr;
      </Link>
    </div>
  );
}

export function LandingExperience() {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [stampIndex, setStampIndex] = useState(0);
  const [activeScene, setActiveScene] = useState<SceneKey>("intro");
  const intro = useTypewriterIntro(!prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let frame: number;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setStampIndex((i) => (i + 1) % DATE_STAMPS.length);
    }, 260);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setActiveScene(sceneForProgress(progress));
  });

  if (prefersReducedMotion) {
    return <StaticLanding />;
  }

  const isActive = (scene: SceneKey) => activeScene === scene;

  return (
    <div ref={containerRef} className="relative h-[420vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isActive("intro") ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className={`absolute flex flex-col items-center gap-4 text-center ${isActive("intro") ? "" : "pointer-events-none"}`}
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-muted">
            {intro.dateline}
            {intro.phase === "dateline" && <TypewriterCursor />}
          </p>
          {intro.phase === "welcome" && (
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="font-display text-3xl font-black uppercase tracking-wide text-ink sm:text-5xl"
            >
              {WELCOME_TEXT}
            </motion.h1>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: isActive("stamp") ? 1 : 0, y: isActive("stamp") ? 0 : -12 }}
          transition={{ duration: 0.4 }}
          className="absolute font-mono text-sm uppercase tracking-[0.3em] text-ink-muted"
          aria-hidden="true"
        >
          {DATE_STAMPS[stampIndex]}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: isActive("masthead") ? 1 : 0, scale: isActive("masthead") ? 1 : 0.92 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`absolute flex flex-col items-center ${isActive("masthead") ? "" : "pointer-events-none"}`}
        >
          <MastheadMark size="large" asLink={false} />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isActive("masthead") ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-4 h-[3px] w-64 origin-center bg-ink sm:w-96"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: isActive("tagline") ? 1 : 0, y: isActive("tagline") ? 0 : 16 }}
          transition={{ duration: 0.4 }}
          className="absolute max-w-md text-center text-lg text-ink-muted sm:text-xl"
        >
          Every story, filed exactly where it happened, not where it was written.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: isActive("cta") ? 1 : 0, y: isActive("cta") ? 0 : 24 }}
          transition={{ duration: 0.4 }}
          className={`absolute flex flex-col items-center gap-6 ${isActive("cta") ? "" : "pointer-events-none"}`}
        >
          <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
            Vol. I &middot; An Archive of Record
          </span>
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">News Vault</h2>
          <Link
            href="/vault"
            className="inline-block border-2 border-ink bg-ink px-8 py-4 font-mono text-sm uppercase tracking-widest text-paper transition-colors hover:bg-transparent hover:text-ink"
          >
            Check the Vault &rarr;
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isActive("intro") ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-10 flex flex-col items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ink-faint"
          aria-hidden="true"
        >
          <span>Scroll</span>
          <span className="block h-8 w-px bg-ink-faint" />
        </motion.div>
      </div>
    </div>
  );
}
