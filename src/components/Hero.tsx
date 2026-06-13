import { Suspense, lazy, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Theme } from "../hooks/useTheme";
import { Birds, Cloud, Dragonfly, MarginNote, PineCluster } from "./decor";

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
    <p className="font-mono text-[0.8rem] leading-6 text-ink-soft sm:text-sm" aria-label={TYPED_LINE}>
      <span aria-hidden="true">
        {TYPED_LINE.slice(0, n)}
        <span className="type-cursor text-gold">|</span>
      </span>
    </p>
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

  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* Watercolor sky wash — deep blue overhead melting into paper */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-sky-deep via-sky to-paper"
      />

      {/* Living sky — haze plus painted clouds in three depths */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div className="cloud absolute left-[8%] top-[12%] h-24 w-72 rounded-full bg-white/40 blur-3xl dark:bg-white/[0.04]" />
        <div className="cloud absolute right-[12%] top-[24%] h-20 w-96 rounded-full bg-white/30 blur-3xl [animation-delay:-20s] dark:bg-white/[0.03]" />
        <Cloud className="cloud-cross absolute left-0 top-[9%] w-40 sm:w-56" opacity={0.85} />
        <Cloud className="cloud-cross absolute left-0 top-[26%] w-28 blur-[1px] sm:w-40 [animation-delay:-60s] [animation-duration:200s]" opacity={0.6} />
        <Cloud className="cloud float-bob absolute right-[6%] top-[16%] w-36 sm:w-52" opacity={0.75} />
        <Cloud className="cloud absolute left-[18%] top-[34%] w-24 blur-[2px] sm:w-36 [animation-delay:-35s]" opacity={0.45} />
      </div>

      {/* Pale watercolor sun */}
      <div
        aria-hidden="true"
        className="absolute right-[14%] top-[14%] h-24 w-24 rounded-full bg-gold/30 blur-xl sm:h-32 sm:w-32"
      />

      {/* Three.js hills + fireflies */}
      <div aria-hidden="true" className="absolute inset-0">
        <Suspense fallback={null}>
          <HillScene theme={theme} reduced={!!reduced} />
        </Suspense>
      </div>

      {/* Midground — distant birds over the hills */}
      <Birds className="right-[8%] top-[18%] h-12 w-32 sm:right-[22%] sm:h-16 sm:w-44" />
      <Birds className="left-[12%] top-[30%] hidden h-10 w-24 opacity-70 sm:block" />

      {/* Foreground — pines anchoring the corners, meadow ahead of the hills */}
      <PineCluster className="absolute -right-6 bottom-6 z-[5] hidden opacity-90 lg:block" />
      <PineCluster className="absolute -left-10 bottom-2 z-[5] hidden scale-75 opacity-60 xl:block" />
      <Dragonfly className="hover-drift absolute bottom-[30%] right-[10%] z-[5] hidden h-9 w-14 lg:block" />

      <motion.div
        variants={stagger}
        initial={reduced ? "show" : "hidden"}
        animate={started ? "show" : undefined}
        className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24 pt-28 sm:px-8"
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
          className="mt-5 flex items-center gap-2 text-sm text-ink-soft"
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
              className="rounded-full border border-line bg-card/80 px-3.5 py-1.5 font-mono text-[0.66rem] tracking-wider text-ink-soft"
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
            className="rounded-full border border-forest/50 bg-card/70 px-7 py-3 text-sm font-medium tracking-wide text-forest transition-colors duration-300 hover:bg-forest/10"
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
