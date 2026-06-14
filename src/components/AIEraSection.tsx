import React, { useRef, useState, useCallback } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Reveal, SectionHeader, Pills } from "./ui";

/* ─── Static data ──────────────────────────────────────────────── */

const TRAD_STEPS = [
  "Requirements Review",
  "Manual Test Design",
  "Script Development",
  "Execution & Debugging",
  "Maintenance",
];

const AI_STEPS = [
  "Requirements Analysis",
  "AI-Assisted Test Generation",
  "Automation Development",
  "Review & Refinement",
  "Continuous Validation",
];

const METRICS = [
  {
    icon: "🎯",
    label: "Better Coverage",
    tooltip: "AI helps identify happy paths, edge cases, and negative scenarios.",
  },
  {
    icon: "⚡",
    label: "Faster Feedback",
    tooltip: "Accelerates test creation and validation cycles.",
  },
  {
    icon: "🔍",
    label: "Smarter Analysis",
    tooltip: "Transforms requirements into actionable insights.",
  },
  {
    icon: "🧩",
    label: "Reusable Automation",
    tooltip: "Generates maintainable and scalable test assets.",
  },
  {
    icon: "🚀",
    label: "Higher Productivity",
    tooltip: "Allows engineers to focus on quality and innovation.",
  },
];

const TECH_CHIPS = [
  "Claude Code",
  "ChatGPT",
  "GitHub Copilot",
  "Python",
  "Robot Framework",
  "Playwright",
  "REST APIs",
  "CI/CD",
];

/* Pre-defined particle positions — avoids recomputation on each render */
const CARD_PARTICLES = [
  { left: "8%", top: "16%", size: 2.5, dur: 4.1, delay: 0 },
  { left: "26%", top: "63%", size: 2.0, dur: 6.3, delay: 1.4 },
  { left: "54%", top: "27%", size: 3.5, dur: 5.0, delay: 2.6 },
  { left: "74%", top: "73%", size: 2.0, dur: 7.1, delay: 0.8 },
  { left: "88%", top: "43%", size: 2.5, dur: 4.8, delay: 2.0 },
  { left: "40%", top: "86%", size: 2.0, dur: 5.9, delay: 3.3 },
];

/* ─── WorkflowStep ─────────────────────────────────────────────── */

function WorkflowStep({
  label,
  index,
  isLast,
  isAI,
}: {
  label: string;
  index: number;
  isLast: boolean;
  isAI: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const reduced = useReducedMotion();

  return (
    <div ref={ref}>
      <motion.div
        className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 transition-colors duration-300 ${
          isAI
            ? "border-gold/25 bg-gold/[0.07] hover:border-gold/45 hover:bg-gold/[0.12]"
            : "border-line/60 bg-card/50 hover:border-line hover:bg-card"
        }`}
        initial={reduced ? { opacity: 1 } : { opacity: 0, x: isAI ? 14 : -14 }}
        animate={inView ? { opacity: 1, x: 0 } : undefined}
        transition={{ duration: 0.42, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      >
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[0.58rem] font-bold ${
            isAI ? "bg-gold/20 text-gold" : "bg-line/40 text-ink-soft"
          }`}
        >
          {index + 1}
        </span>
        <span
          className={`flex-1 text-[0.78rem] leading-snug ${
            isAI ? "text-ink" : "text-ink-soft/80"
          }`}
        >
          {label}
        </span>
        {isAI && (
          <motion.span
            className="h-2 w-2 shrink-0 rounded-full bg-gold/70"
            animate={
              reduced
                ? {}
                : { opacity: [0.3, 1, 0.3], scale: [0.8, 1.25, 0.8] }
            }
            transition={{
              duration: 2.1,
              repeat: Infinity,
              delay: index * 0.28,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>
      {!isLast && (
        <div
          className={`mx-auto my-[3px] h-3 w-px ${
            isAI ? "bg-gold/35" : "bg-line/45"
          }`}
        />
      )}
    </div>
  );
}

/* ─── ComparisonCard ───────────────────────────────────────────── */

function ComparisonCard({
  isAI,
  steps,
  footerBadge,
}: {
  isAI: boolean;
  steps: string[];
  footerBadge: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const reduced = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), {
    stiffness: 380,
    damping: 38,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), {
    stiffness: 380,
    damping: 38,
  });

  const handleMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reduced) return;
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      mx.set((e.clientX - rect.left) / rect.width - 0.5);
      my.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [reduced, mx, my]
  );

  const handleLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <motion.div
      ref={ref}
      style={reduced ? {} : { rotateX, rotateY, transformPerspective: 1200 }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: 0.65,
        delay: isAI ? 0.18 : 0,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`relative flex flex-col overflow-hidden rounded-2xl border p-5 backdrop-blur-sm transition-shadow duration-500 ${
        isAI
          ? "border-gold/30 bg-[radial-gradient(ellipse_at_top_right,rgba(212,168,71,0.09)_0%,transparent_60%)] hover:shadow-[0_20px_60px_rgba(212,168,71,0.13)]"
          : "border-line/60 bg-card/70 hover:shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
      }`}
    >
      {/* Background floating particles — plain motion.span, no hooks in loop */}
      {!reduced &&
        CARD_PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className={`pointer-events-none absolute rounded-full ${
              isAI ? "bg-gold" : "bg-ink"
            }`}
            style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
            animate={{
              opacity: [0, isAI ? 0.32 : 0.1, 0],
              y: [0, -22, 0],
            }}
            transition={{
              duration: p.dur,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

      {/* Card header */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <span
            className={`mb-1.5 block font-mono text-[0.57rem] uppercase tracking-[0.22em] ${
              isAI ? "text-gold" : "text-ink-soft/55"
            }`}
          >
            {isAI ? "AI-Augmented" : "Traditional"}
          </span>
          <h3
            className={`font-display text-xl font-semibold leading-tight ${
              isAI ? "text-ink" : "text-ink-soft"
            }`}
          >
            {isAI ? "AI-Augmented QA" : "Traditional QA"}
          </h3>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 font-mono text-[0.57rem] uppercase tracking-wider ${
            isAI
              ? "border-gold/30 bg-gold/15 text-gold"
              : "border-line/50 bg-line/20 text-ink-soft"
          }`}
        >
          {isAI ? "Modern" : "Legacy"}
        </span>
      </div>

      {/* Workflow steps */}
      <div className="flex-1">
        {steps.map((step, i) => (
          <WorkflowStep
            key={step}
            label={step}
            index={i}
            isLast={i === steps.length - 1}
            isAI={isAI}
          />
        ))}
      </div>

      {/* Footer badge */}
      <div
        className={`mt-5 rounded-lg border px-3 py-2.5 text-center font-mono text-[0.63rem] font-medium tracking-wide ${
          isAI
            ? "border-gold/25 bg-gradient-to-r from-gold/15 to-forest/15 text-gold"
            : "border-line/40 bg-line/15 text-ink-soft"
        }`}
      >
        {footerBadge}
      </div>

      {/* Breathing glow overlay — AI card only */}
      {isAI && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background:
              "radial-gradient(ellipse at 65% 0%, rgba(212,168,71,0.13) 0%, transparent 55%)",
          }}
          animate={reduced ? {} : { opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </motion.div>
  );
}

/* ─── FlowArrow ────────────────────────────────────────────────── */

function FlowArrow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  return (
    <div
      ref={ref}
      className="hidden lg:flex items-center justify-center"
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 120" className="h-52 w-16" fill="none" overflow="visible">
        <defs>
          <linearGradient id="arrowLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.08" />
            <stop offset="55%" stopColor="var(--gold)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="1" />
          </linearGradient>
          <filter id="arrowGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Dashed track */}
        <path
          d="M8,60 L56,60"
          stroke="var(--gold)"
          strokeOpacity="0.12"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />

        {/* Animated main line */}
        <motion.path
          d="M8,60 L52,60"
          stroke="url(#arrowLineGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={reduced ? {} : { pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : undefined}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Arrowhead */}
        <motion.path
          d="M46,53 L56,60 L46,67"
          stroke="var(--gold)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={reduced ? {} : { opacity: 0, scale: 0.4 }}
          animate={inView ? { opacity: 1, scale: 1 } : undefined}
          style={{ transformOrigin: "51px 60px" }}
          transition={{ duration: 0.35, delay: 0.82, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Flowing particles */}
        {!reduced &&
          [
            { delay: 0.5, r: 2.5, op: 0.9 },
            { delay: 1.1, r: 1.8, op: 0.6 },
            { delay: 1.7, r: 2.0, op: 0.75 },
          ].map(({ delay, r, op }, i) => (
            <motion.circle
              key={i}
              cy="60"
              r={r}
              fill="var(--gold)"
              animate={
                inView
                  ? { cx: [8, 56], opacity: [0, op, op, 0] }
                  : { cx: [8], opacity: [0] }
              }
              transition={{ duration: 1.55, delay, repeat: Infinity, ease: "linear" }}
            />
          ))}

        {/* Pulsing glow at tip */}
        {!reduced && (
          <motion.circle
            cx="56"
            cy="60"
            r="9"
            fill="var(--gold)"
            filter="url(#arrowGlow)"
            animate={
              inView
                ? { opacity: [0, 0.32, 0], scale: [0.6, 2.2, 0.6] }
                : { opacity: 0 }
            }
            style={{ transformOrigin: "56px 60px" }}
            transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          />
        )}

        {/* Label */}
        <text
          x="32"
          y="86"
          textAnchor="middle"
          fill="var(--gold)"
          fillOpacity="0.45"
          fontFamily="var(--font-mono)"
          fontSize="5.5"
          letterSpacing="2"
        >
          EVOLUTION
        </text>
      </svg>
    </div>
  );
}

/* ─── ImpactMetric ─────────────────────────────────────────────── */

function ImpactMetric({
  icon,
  label,
  tooltip,
  index,
}: {
  icon: string;
  label: string;
  tooltip: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      className="group relative cursor-default"
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.45, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      role="button"
      aria-expanded={hovered}
      aria-label={`${label}: ${tooltip}`}
    >
      <motion.div
        className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center backdrop-blur-sm transition-colors duration-300 ${
          hovered
            ? "border-gold/50 bg-gold/[0.09]"
            : "border-line/50 bg-card/60"
        }`}
        animate={reduced ? {} : { scale: hovered ? 1.04 : 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <span className="text-2xl leading-none" role="img" aria-hidden="true">
          {icon}
        </span>
        <span
          className={`font-mono text-[0.59rem] font-semibold uppercase tracking-[0.15em] transition-colors duration-200 ${
            hovered ? "text-gold" : "text-ink-soft"
          }`}
        >
          {label}
        </span>
        {!reduced && (
          <motion.span
            className="h-1 w-1 rounded-full bg-gold"
            animate={{ opacity: hovered ? 1 : 0.25, scale: hovered ? 2.0 : 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute bottom-full left-1/2 z-20 mb-3 w-52 -translate-x-1/2 rounded-xl border border-gold/20 bg-card/95 px-3.5 py-3 text-center shadow-2xl backdrop-blur-md"
            initial={{ opacity: 0, y: 8, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.17, ease: "easeOut" }}
          >
            <p className="text-[0.72rem] leading-[1.55] text-ink-soft">
              {tooltip}
            </p>
            {/* Caret */}
            <span
              className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent"
              style={{ borderTopColor: "rgba(212,168,71,0.22)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main export ──────────────────────────────────────────────── */

export default function AIEraSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* Ambient background gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% -5%, rgba(212,168,71,0.055) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {/* Section header */}
        <SectionHeader
          eyebrow="Quality Engineering"
          title="Quality Engineering in the AI Era"
          align="center"
        />
        <Reveal delay={0.12}>
          <p className="mx-auto mt-3 max-w-2xl text-center text-[0.85rem] italic leading-[1.7] text-ink-soft">
            "How AI is transforming software quality while keeping engineers at the center."
          </p>
        </Reveal>

        {/* Before vs After comparison */}
        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_5rem_1fr] lg:items-stretch">
          <ComparisonCard
            isAI={false}
            steps={TRAD_STEPS}
            footerBadge="Time-intensive"
          />
          <FlowArrow />
          <ComparisonCard
            isAI={true}
            steps={AI_STEPS}
            footerBadge="Faster · Smarter · Higher Coverage"
          />
        </div>

        {/* Impact metrics */}
        <div className="mt-14">
          <Reveal>
            <p className="mb-5 text-center font-mono text-[0.59rem] uppercase tracking-[0.22em] text-ink-soft/55">
              Impact Metrics — Hover to Explore
            </p>
          </Reveal>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {METRICS.map((m, i) => (
              <ImpactMetric key={m.label} icon={m.icon} label={m.label} tooltip={m.tooltip} index={i} />
            ))}
          </div>
        </div>

        {/* Engineering philosophy card */}
        <Reveal className="mt-12" delay={0.1}>
          <div className="relative overflow-hidden rounded-2xl border border-gold/25 bg-[radial-gradient(ellipse_at_center,rgba(212,168,71,0.06)_0%,transparent_70%)] p-8 backdrop-blur-sm sm:p-10">
            {/* Corner accents */}
            <span className="pointer-events-none absolute left-0 top-0 h-12 w-12 rounded-tl-2xl border-l-2 border-t-2 border-gold/25" />
            <span className="pointer-events-none absolute bottom-0 right-0 h-12 w-12 rounded-br-2xl border-b-2 border-r-2 border-gold/25" />

            <blockquote className="text-center">
              <p className="mx-auto max-w-3xl font-display text-[1.05rem] italic leading-[1.75] text-ink sm:text-[1.15rem]">
                "AI does not replace quality engineers—it amplifies expertise,
                accelerates feedback, and enables teams to deliver better
                software faster."
              </p>
            </blockquote>

            <div className="mt-7 flex justify-center">
              <Pills items={TECH_CHIPS} label="AI & Testing Technologies" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
