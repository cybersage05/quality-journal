import { Suspense, lazy, useEffect, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { ReactNode } from "react";
import type { Theme } from "../hooks/useTheme";
import { usePointer } from "../hooks/usePointer";
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

/* ── Clickable landmark over the painting (Easter-egg navigation) ──────────── */
type LayerStyle = { x: MotionValue<number>; y: MotionValue<number> };

function Landmark({
  targetId,
  label,
  stat,
  icon,
  position,
  layer,
  reduced,
  children,
}: {
  targetId: string;
  label: string;
  stat: string;
  icon: ReactNode;
  position: string;
  layer: LayerStyle;
  reduced: boolean;
  children?: ReactNode;
}) {
  const go = (e: React.MouseEvent) => {
    e.preventDefault();
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <motion.div
      className={`pointer-events-none absolute z-[6] hidden lg:block ${position}`}
      style={layer}
    >
      <a
        href={`#${targetId}`}
        onClick={go}
        aria-label={`${label} — open section`}
        className="group pointer-events-auto relative flex flex-col items-center gap-1.5 outline-none"
      >
        {/* decorative effect layer (waves / glow / steam) */}
        {children}

        {/* icon medallion */}
        <motion.span
          whileHover={reduced ? undefined : { scale: 1.14 }}
          whileFocus={reduced ? undefined : { scale: 1.14 }}
          transition={{ type: "spring", stiffness: 320, damping: 20 }}
          className="relative z-[2] flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-white/80 bg-white/15 text-white shadow-[0_2px_12px_rgba(20,40,56,0.3)] backdrop-blur-[2px] transition-colors duration-300 group-hover:border-gold group-hover:bg-gold/25 group-focus-visible:border-gold"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {icon}
          </svg>
        </motion.span>

        {/* always-on label */}
        <span className="z-[2] rounded-full bg-[#142838]/55 px-2.5 py-0.5 font-mono text-[0.58rem] tracking-[0.22em] text-white backdrop-blur-[2px]">
          {label}
        </span>

        {/* stat revealed on hover / focus */}
        <span className="pointer-events-none absolute -bottom-6 z-[2] whitespace-nowrap rounded-full bg-gold/90 px-2.5 py-0.5 font-mono text-[0.55rem] tracking-[0.14em] text-[#2e3a30] opacity-0 shadow-md transition-all duration-300 group-hover:-bottom-7 group-hover:opacity-100 group-focus-visible:-bottom-7 group-focus-visible:opacity-100">
          {stat}
        </span>
      </a>
    </motion.div>
  );
}

/* Telecom signal waves — concentric rings rippling from the tower */
function SignalWaves({ reduced }: { reduced: boolean }) {
  if (reduced) return null;
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="signal-ping absolute left-1/2 top-6 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70"
          style={{ animationDelay: `${i * 1.3}s` }}
        />
      ))}
    </span>
  );
}

/* Observatory — soft dome glow plus a slow radar sweep */
function Observatory({ reduced }: { reduced: boolean }) {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]">
      <span className="soft-glow absolute left-1/2 top-6 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.85),transparent)]" />
      {!reduced && (
        <span
          className="radar-sweep absolute left-1/2 top-6 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, color-mix(in srgb, var(--sky-deep) 55%, transparent), transparent 55deg)",
            maskImage: "radial-gradient(closest-side, transparent 18%, #000 20%, #000 95%, transparent)",
            WebkitMaskImage:
              "radial-gradient(closest-side, transparent 18%, #000 20%, #000 95%, transparent)",
            opacity: 0.5,
          }}
        />
      )}
    </span>
  );
}

/* Factory — soft steam puffs rising above the icon */
function Steam({ reduced }: { reduced: boolean }) {
  if (reduced) return null;
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="steam absolute top-0 h-3 w-3 rounded-full bg-white/70 blur-[3px]"
          style={{ left: `${36 + i * 9}%`, animationDelay: `${i * 1.4}s` }}
        />
      ))}
    </span>
  );
}

/* Village — warm windows softly glowing at the doorstep of the icon */
function Windows({ reduced }: { reduced: boolean }) {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute -bottom-1 left-1/2 z-[1] flex -translate-x-1/2 gap-1">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`h-1 w-1 rounded-full bg-amber-200/90 ${reduced ? "" : "deco-blink"}`}
          style={{ animationDelay: `${i * 0.7}s` }}
        />
      ))}
    </span>
  );
}

/* Floating technology marker — drifts, enlarges and labels on hover */
function TechIcon({
  label,
  icon,
  position,
  delay,
  reduced,
}: {
  label: string;
  icon: ReactNode;
  position: string;
  delay: string;
  reduced: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute z-[6] hidden lg:block ${position}`}
    >
      <div
        className={`group pointer-events-auto relative flex items-center justify-center ${reduced ? "" : "float-bob"}`}
        style={{ animationDelay: delay }}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/55 bg-white/15 text-white shadow-[0_2px_10px_rgba(20,40,56,0.25)] backdrop-blur-[2px] transition-transform duration-300 group-hover:scale-125">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            {icon}
          </svg>
        </span>
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#142838]/60 px-2 py-0.5 font-mono text-[0.5rem] tracking-[0.18em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {label}
        </span>
      </div>
    </div>
  );
}

/* Animated quality shield — pulses softly, checkmark draws on hover */
function QualityShield({ reduced }: { reduced: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="group pointer-events-auto absolute bottom-[30%] right-[44%] z-[6] hidden h-12 w-12 lg:block"
    >
      {!reduced && (
        <span className="soft-glow absolute inset-0 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--gold)_70%,transparent),transparent)]" />
      )}
      <svg viewBox="0 0 24 24" className="relative h-12 w-12 drop-shadow-[0_2px_6px_rgba(20,40,56,0.3)]">
        <path
          d="M12 2.5l7.5 3v6.2c0 4.7-3.2 8-7.5 9.3-4.3-1.3-7.5-4.6-7.5-9.3V5.5z"
          fill="rgba(255,255,255,0.16)"
          stroke="var(--gold)"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <motion.path
          d="M8.4 12.2l2.6 2.6 4.6-5"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: reduced ? 1 : 0.18 }}
          whileInView={reduced ? undefined : { pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4, duration: 0.7, ease: "easeOut" }}
        />
      </svg>
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

/* tech-icon glyphs */
const techGlyphs = {
  aws: <path d="M4 14c3 2 13 2 16 0M6 17c2 1.5 10 1.5 12 0M7 11l2-5 2 4 2-5 2 6" />,
  api: <g><path d="M8 7l-4 5 4 5M16 7l4 5-4 5" /><path d="M13 6l-2 12" /></g>,
  sql: <g><ellipse cx="12" cy="6" rx="7" ry="2.6" /><path d="M5 6v12c0 1.5 3 2.6 7 2.6s7-1.1 7-2.6V6M5 12c0 1.5 3 2.6 7 2.6s7-1.1 7-2.6" /></g>,
  docker: <g><rect x="3" y="10" width="3" height="3" /><rect x="7" y="10" width="3" height="3" /><rect x="11" y="10" width="3" height="3" /><rect x="7" y="6" width="3" height="3" /><path d="M3 13c0 4 3 6 7 6 5 0 8-3 9-7 1 .5 2 .3 3-.5-1-1.5-2.5-1.2-3-1" /></g>,
};

export default function Hero({ theme, started }: { theme: Theme; started: boolean }) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const { x: px, y: py } = usePointer();

  /* scroll parallax of the painting */
  const imgScrollY = useTransform(scrollY, [0, 900], [0, reduced ? 0 : 140]);
  /* cursor parallax — whole scene drifts ≤ ~14px */
  const imgX = useTransform(px, [-0.5, 0.5], [14, -14]);
  const imgPointerY = useTransform(py, [-0.5, 0.5], [10, -10]);

  /* depth layers (far → near move progressively more) */
  const midX = useTransform(px, [-0.5, 0.5], [18, -18]);
  const midY = useTransform(py, [-0.5, 0.5], [12, -12]);
  const nearX = useTransform(px, [-0.5, 0.5], [28, -28]);
  const nearY = useTransform(py, [-0.5, 0.5], [18, -18]);

  /* sun rays drift opposite the cursor */
  const sunX = useTransform(px, [-0.5, 0.5], [-28, 28]);
  const sunY = useTransform(py, [-0.5, 0.5], [-18, 18]);

  const mid = { x: midX, y: midY };
  const near = { x: nearX, y: nearY };

  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* The painted valley — scroll parallax (outer) + cursor parallax (inner) */}
      <motion.div aria-hidden="true" className="absolute inset-0" style={{ y: imgScrollY }}>
        <motion.div className="absolute inset-[-3%]" style={{ x: imgX, y: imgPointerY }}>
          <img
            src={`${import.meta.env.BASE_URL}landscape.webp`}
            alt=""
            fetchPriority="high"
            className="h-[118%] w-full object-cover object-[center_38%] transition-[filter] duration-500 dark:brightness-[.45] dark:saturate-[.75] dark:hue-rotate-[10deg]"
          />
        </motion.div>

        {/* cursor-reactive sunlight */}
        <motion.div
          className={`absolute inset-0 ${reduced ? "" : "daylight"}`}
          style={{
            x: sunX,
            y: sunY,
            background:
              "radial-gradient(40% 50% at 62% 26%, rgba(255,247,224,0.55), transparent 70%)",
            mixBlendMode: "screen",
          }}
        />

        {/* legibility wash — left side */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/18 to-transparent dark:from-[#142838]/72 dark:via-[#142838]/28" />
        {/* atmospheric depth — warm haze in the mid-distance */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_110%_55%_at_55%_42%,transparent_38%,rgba(239,232,214,0.16)_100%)] dark:bg-[radial-gradient(ellipse_110%_55%_at_55%_42%,transparent_38%,rgba(20,40,56,0.22)_100%)]" />
        {/* sky depth — subtle top-edge veil */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-sky/12 to-transparent dark:from-[#142838]/30 dark:to-transparent" />
        {/* paper rise from below */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-paper" />

        {/* river shimmer — light sliding along the water */}
        {!reduced && (
          <div className="absolute bottom-[20%] left-[34%] h-20 w-44 -rotate-[18deg] overflow-hidden opacity-70">
            <div className="river-shimmer h-full w-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)] blur-[2px]" />
          </div>
        )}
      </motion.div>

      {/* living particles over the painting — drifting leaves (no insects) */}
      <div aria-hidden="true" className="absolute inset-0 z-[2]">
        <Suspense fallback={null}>
          <HillScene theme={theme} reduced={!!reduced} imageMode />
        </Suspense>
      </div>

      {/* ── Interactive landmarks (Easter-egg navigation) ── */}
      <Landmark
        targetId="architecture"
        label="TELECOM"
        stat="Ericsson · AT&T · 10M+ subscribers"
        position="right-[8%] top-[15%]"
        layer={mid}
        reduced={!!reduced}
        icon={<g><path d="M12 21V9M8 21h8" /><path d="M5 7a9 9 0 0 1 14 0M7.5 9.5a5.5 5.5 0 0 1 9 0" /></g>}
      >
        <SignalWaves reduced={!!reduced} />
      </Landmark>

      <Landmark
        targetId="projects"
        label="PROJECTS"
        stat="IronPDF QA · OldPhonePad"
        position="right-[21%] top-[40%]"
        layer={mid}
        reduced={!!reduced}
        icon={<g><circle cx="12" cy="11" r="6" /><path d="M12 5V2M16.5 13.5l2 2" /></g>}
      >
        <Observatory reduced={!!reduced} />
      </Landmark>

      <Landmark
        targetId="experience"
        label="CAL-COMP"
        stat="Firmware validation · NPI"
        position="right-[10%] bottom-[22%]"
        layer={near}
        reduced={!!reduced}
        icon={<g><path d="M3 21V9l9-5 9 5v12" /><path d="M7 21v-8h10v8M7 17h10" /></g>}
      >
        <Steam reduced={!!reduced} />
      </Landmark>

      <Landmark
        targetId="timeline"
        label="JOURNEY"
        stat="5+ years · 3 companies"
        position="right-[34%] bottom-[16%]"
        layer={near}
        reduced={!!reduced}
        icon={<g><path d="M3 21h18M5 21V8l5-4 5 4v13M9 21v-5h2v5M14 11h3v10" /></g>}
      >
        <Windows reduced={!!reduced} />
      </Landmark>

      {/* floating technology markers in the sky */}
      <motion.div className="absolute inset-0" style={mid}>
        <TechIcon label="AWS" icon={techGlyphs.aws} position="right-[40%] top-[14%]" delay="0s" reduced={!!reduced} />
        <TechIcon label="API" icon={techGlyphs.api} position="right-[15%] top-[30%]" delay="-2s" reduced={!!reduced} />
        <TechIcon label="SQL" icon={techGlyphs.sql} position="right-[28%] top-[24%]" delay="-3.5s" reduced={!!reduced} />
        <TechIcon label="DOCKER" icon={techGlyphs.docker} position="right-[6%] top-[36%]" delay="-1.2s" reduced={!!reduced} />
      </motion.div>

      {/* animated quality shield */}
      <QualityShield reduced={!!reduced} />

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

        <motion.p
          variants={item}
          aria-hidden="true"
          className="mt-6 hidden font-mono text-[0.6rem] tracking-[0.2em] text-ink-soft/70 lg:block"
        >
          ✦ tip — the valley is alive · hover &amp; click the tower, observatory, factory and village
        </motion.p>
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
