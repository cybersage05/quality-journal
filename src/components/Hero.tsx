import { Suspense, lazy, useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import type { Theme } from "../hooks/useTheme";
import { MarginNote } from "./decor";

const HillScene = lazy(() => import("./HillScene"));

const TYPED_LINE =
  "5+ years across firmware validation, system integration and test automation.";

function TypedLine({ start }: { start: boolean }) {
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? TYPED_LINE.length : 0);

  useEffect(() => {
    if (reduced || !start) return;
    const step = 2500 / TYPED_LINE.length;
    const id = setInterval(() => {
      setN((v) => {
        if (v >= TYPED_LINE.length) {
          clearInterval(id);
          return v;
        }
        return v + 1;
      });
    }, step);
    return () => clearInterval(id);
  }, [reduced, start]);

  return (
    <p className="font-mono text-[0.8rem] leading-6 text-ink sm:text-sm" aria-label={TYPED_LINE}>
      <span aria-hidden="true">
        {TYPED_LINE.slice(0, n)}
        <span className="type-cursor text-gold">|</span>
      </span>
    </p>
  );
}

/* Floating system annotation pinned to a landmark in the painting */
function SystemTag({
  label,
  icon,
  className,
  delay = "0s",
}: {
  label: string;
  icon: ReactNode;
  className?: string;
  delay?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`float-bob pointer-events-none absolute hidden flex-col items-center gap-1.5 lg:flex ${className ?? ""}`}
      style={{ animationDelay: delay }}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-white/80 bg-white/15 text-white shadow-[0_2px_12px_rgba(20,40,56,0.25)] backdrop-blur-[2px]">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          {icon}
        </svg>
      </span>
      <span className="rounded-full bg-[#142838]/55 px-2.5 py-0.5 font-mono text-[0.58rem] tracking-[0.22em] text-white backdrop-blur-[2px]">
        {label}
      </span>
    </div>
  );
}

const badges = ["Work Permit Holder", "Open to Relocation", "Available in 1 Month"];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

export default function Hero({ theme, started }: { theme: Theme; started: boolean }) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 900], [0, reduced ? 0 : 140]);

  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* The painted valley — telecom tower, observatory, factory, village */}
      <motion.div aria-hidden="true" className="absolute inset-0" style={{ y: imgY }}>
        <img
          src={`${import.meta.env.BASE_URL}landscape.webp`}
          alt=""
          fetchPriority="high"
          className="h-[115%] w-full object-cover object-[center_38%] transition-[filter] duration-500 dark:brightness-[.45] dark:saturate-[.75] dark:hue-rotate-[10deg]"
        />
        {/* legibility wash — left side */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/18 to-transparent dark:from-[#142838]/72 dark:via-[#142838]/28" />
        {/* atmospheric depth — warm haze in the mid-distance */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_110%_55%_at_55%_42%,transparent_38%,rgba(239,232,214,0.16)_100%)] dark:bg-[radial-gradient(ellipse_110%_55%_at_55%_42%,transparent_38%,rgba(20,40,56,0.22)_100%)]" />
        {/* sky depth — subtle top-edge veil */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-sky/12 to-transparent dark:from-[#142838]/30 dark:to-transparent" />
        {/* paper rise from below */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-paper" />
      </motion.div>

      {/* living particles over the painting — petals & faint fireflies */}
      <div aria-hidden="true" className="absolute inset-0">
        <Suspense fallback={null}>
          <HillScene theme={theme} reduced={!!reduced} imageMode />
        </Suspense>
      </div>

      {/* system annotations pinned to the painting's landmarks */}
      <SystemTag
        label="TELECOM SYSTEMS"
        className="right-[9%] top-[22%]"
        icon={<g><path d="M12 21V9M8 21h8" /><path d="M5 7a9 9 0 0 1 14 0M7.5 9.5a5.5 5.5 0 0 1 9 0" /></g>}
      />
      <SystemTag
        label="CLOUD INFRASTRUCTURE"
        className="right-[30%] top-[10%]"
        delay="-2.5s"
        icon={<path d="M8 19a5 5 0 0 1 1-9.9A6.5 6.5 0 0 1 21.5 11 4.5 4.5 0 0 1 21 19z" />}
      />
      <SystemTag
        label="QUALITY ENGINEERING"
        className="bottom-[26%] right-[18%]"
        delay="-4s"
        icon={<g><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><path d="M9 12l2.2 2.2L15.5 10" /></g>}
      />

      <motion.div
        variants={stagger}
        initial={reduced ? "show" : "hidden"}
        animate={started ? "show" : undefined}
        className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-32 pt-28 sm:px-8"
      >
        <motion.p variants={item} className="eyebrow">
          Software QA &amp; Test Engineer
        </motion.p>

        <motion.h1
          variants={item}
          className="mt-5 max-w-2xl font-display text-[2.3rem] font-semibold leading-[1.1] tracking-wide text-ink sm:text-5xl lg:text-6xl"
        >
          Building{" "}
          <span className="relative inline-block italic text-forest">
            quality
            <svg
              viewBox="0 0 120 12"
              className="absolute -bottom-1 left-0 w-full"
              aria-hidden="true"
            >
              <motion.path
                d="M3 9C30 4 70 3 117 7"
                fill="none"
                stroke="var(--gold)"
                strokeWidth="2.2"
                strokeLinecap="round"
                initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
                animate={started ? { pathLength: 1 } : undefined}
                transition={{ delay: 0.9, duration: 0.7, ease: "easeOut" }}
              />
            </svg>
          </span>{" "}
          into every release.
        </motion.h1>

        <motion.div variants={item} className="mt-5 max-w-xl">
          <TypedLine start={started} />
        </motion.div>

        <motion.p
          variants={item}
          className="mt-5 flex items-center gap-2 text-sm text-ink"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="var(--terracotta)" aria-hidden="true">
            <path d="M8 1a5 5 0 0 0-5 5c0 3.6 5 9 5 9s5-5.4 5-9a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
          </svg>
          Bangkok, Thailand
        </motion.p>

        <motion.ul variants={item} className="mt-6 flex flex-wrap gap-2" aria-label="Availability">
          {badges.map((b) => (
            <li
              key={b}
              className="rounded-full border border-line bg-card/85 px-3.5 py-1.5 font-mono text-[0.66rem] tracking-wider text-ink-soft backdrop-blur-[2px]"
            >
              {b}
            </li>
          ))}
        </motion.ul>

        <motion.div variants={item} className="mt-8 flex flex-wrap gap-4">
          <a
            href="#experience"
            className="rounded-full bg-forest px-7 py-3 text-sm font-medium tracking-wide text-paper transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(61,107,79,0.35)] dark:text-ink"
          >
            View Experience
          </a>
          <a
            href="https://github.com/cybersage05"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-forest/50 bg-card/80 px-7 py-3 text-sm font-medium tracking-wide text-forest backdrop-blur-[2px] transition-colors duration-300 hover:bg-forest/10"
          >
            GitHub
          </a>
        </motion.div>
      </motion.div>

      <MarginNote className="bottom-16 left-1/2 hidden translate-x-6 sm:flex" arrow="left">
        the journey begins here
      </MarginNote>

      <a
        href="#stats"
        aria-label="Scroll to content"
        className="chevron-bob absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-ink-soft"
      >
        <svg viewBox="0 0 20 12" className="h-3 w-5" aria-hidden="true">
          <path
            d="M2 2l8 8 8-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </a>
    </section>
  );
}
