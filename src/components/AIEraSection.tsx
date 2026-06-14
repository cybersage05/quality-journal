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

/* ─── Data ─────────────────────────────────────────────────────── */

const TRAD_STEPS = [
  { label: "Requirements Review",   pct: 42 },
  { label: "Manual Test Design",    pct: 35 },
  { label: "Script Development",    pct: 50 },
  { label: "Execution & Debugging", pct: 38 },
  { label: "Maintenance",           pct: 30 },
];

const AI_STEPS = [
  { label: "Requirements Analysis",       pct: 100 },
  { label: "AI-Assisted Test Generation", pct: 100 },
  { label: "Automation Development",      pct: 100 },
  { label: "Review & Refinement",         pct: 100 },
  { label: "Continuous Validation",       pct: 100 },
];

const METRICS = [
  { icon: "🎯", label: "Better Coverage",      tooltip: "AI helps identify happy paths, edge cases, and negative scenarios." },
  { icon: "⚡", label: "Faster Feedback",      tooltip: "Accelerates test creation and validation cycles." },
  { icon: "🔍", label: "Smarter Analysis",     tooltip: "Transforms requirements into actionable insights." },
  { icon: "🧩", label: "Reusable Automation",  tooltip: "Generates maintainable and scalable test assets." },
  { icon: "🚀", label: "Higher Productivity",  tooltip: "Allows engineers to focus on quality and innovation." },
];

const TECH_CHIPS = [
  "Claude Code", "ChatGPT", "GitHub Copilot", "Python",
  "Robot Framework", "Playwright", "REST APIs", "CI/CD",
];

/* Floating chars for the transform beam */
const BEAM_CHARS = [
  { char: "01", top: "8%",  delay: 0.0 },
  { char: "AI", top: "21%", delay: 0.8 },
  { char: "fn", top: "34%", delay: 1.6 },
  { char: "ML", top: "64%", delay: 0.4 },
  { char: "if", top: "77%", delay: 1.2 },
  { char: "∑λ", top: "90%", delay: 2.0 },
];

/* ─── TerminalStep ──────────────────────────────────────────────── */

function TerminalStep({
  label, pct, index, isLast, isAI,
}: {
  label: string; pct: number;
  index: number; isLast: boolean; isAI: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const reduced = useReducedMotion();

  return (
    <div ref={ref}>
      <motion.div
        className={`flex items-center gap-2 rounded-lg px-2.5 py-2 transition-colors duration-200 ${
          isAI
            ? "hover:bg-sky-400/[0.07] hover:border-sky-400/20 border border-transparent"
            : "hover:bg-white/[0.04] hover:border-white/10 border border-transparent"
        }`}
        initial={reduced ? { opacity: 1 } : { opacity: 0, x: isAI ? 10 : -10 }}
        animate={inView ? { opacity: 1, x: 0 } : undefined}
        transition={{ duration: 0.38, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Status LED */}
        <motion.span
          className={`h-[6px] w-[6px] shrink-0 rounded-full ${
            isAI ? "bg-sky-400" : "bg-slate-600"
          }`}
          animate={
            isAI && !reduced
              ? { opacity: [0.35, 1, 0.35], scale: [0.8, 1.3, 0.8] }
              : {}
          }
          transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.28, ease: "easeInOut" }}
        />

        {/* Label */}
        <span className={`flex-1 font-mono text-[0.7rem] leading-none ${
          isAI ? "text-slate-200" : "text-slate-500"
        }`}>
          {!isAI && <span className="mr-1 text-slate-700">$</span>}
          {label}
        </span>

        {/* Progress bar */}
        <div className="h-[5px] w-14 shrink-0 overflow-hidden rounded-full bg-white/[0.07]">
          <motion.div
            className={`h-full w-full rounded-full ${
              isAI ? "bg-sky-400" : "bg-slate-700"
            }`}
            style={{ transformOrigin: "left center" }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: pct / 100 } : undefined}
            transition={{ duration: 0.75, delay: index * 0.1 + 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </motion.div>

      {!isLast && (
        <div className={`ml-[18px] my-[2px] h-3 w-px ${isAI ? "bg-sky-400/20" : "bg-white/[0.07]"}`} />
      )}
    </div>
  );
}

/* ─── LegacyCard ────────────────────────────────────────────────── */

function LegacyCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 380, damping: 40 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), { stiffness: 380, damping: 40 });

  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }, [reduced, mx, my]);

  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  return (
    <motion.div
      ref={ref}
      style={reduced ? {} : { rotateX, rotateY, transformPerspective: 1200 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b1120]"
    >
      {/* Scanline CRT overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 rounded-2xl opacity-50"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.016) 3px, rgba(255,255,255,0.016) 4px)",
        }}
      />

      <div className="relative z-20 flex flex-col p-5">
        {/* Terminal header bar */}
        <div className="mb-4 flex items-center gap-1.5 border-b border-white/[0.07] pb-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28ca41]/30" />
          <span className="ml-2 flex-1 font-mono text-[0.56rem] uppercase tracking-[0.2em] text-slate-600">
            legacy-qa-v1.0.0
          </span>
          <span className="rounded border border-red-500/20 bg-red-500/[0.08] px-1.5 py-0.5 font-mono text-[0.5rem] text-red-500/70">
            MANUAL
          </span>
        </div>

        {/* Title */}
        <div className="mb-4">
          <p className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-slate-600">
            01 / Before
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold text-slate-400">
            Traditional QA
          </h3>
          <p className="mt-0.5 font-mono text-[0.6rem] text-slate-700">
            Sequential · Human-driven · Bottlenecked
          </p>
        </div>

        {/* Steps */}
        <div className="flex-1">
          {TRAD_STEPS.map((step, i) => (
            <TerminalStep
              key={step.label}
              {...step}
              index={i}
              isLast={i === TRAD_STEPS.length - 1}
              isAI={false}
            />
          ))}
        </div>

      </div>
    </motion.div>
  );
}

/* ─── AICard ────────────────────────────────────────────────────── */

function AICard() {
  const ref = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 380, damping: 40 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), { stiffness: 380, damping: 40 });

  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }, [reduced, mx, my]);

  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  return (
    /* Gear ring wrapper */
    <div ref={wrapRef} className="relative" onPointerMove={onMove} onPointerLeave={onLeave}>
      {/* Highlight glow behind card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-24px] -z-10 rounded-3xl"
        style={{
          background: "radial-gradient(ellipse at center, rgba(56,189,248,0.13) 0%, transparent 68%)",
        }}
      />

      {/* Outer gear ring — slow clockwise, GPU: transform only */}
      {!reduced && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-[-3px] rounded-[19px] will-change-transform"
          style={{ border: "2px dashed rgba(56,189,248,0.45)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Inner gear ring — slow counter-clockwise */}
      {!reduced && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-[-6px] rounded-[22px] will-change-transform"
          style={{ border: "1.5px dashed rgba(56,189,248,0.18)" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
      )}

      <motion.div
        ref={ref}
        style={reduced ? {} : { rotateX, rotateY, transformPerspective: 1200 }}
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.62, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col overflow-hidden rounded-2xl border border-sky-400/20 bg-[#030a16]"
      >
        {/* Dot-grid ambient background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-25"
          style={{
            backgroundImage: "radial-gradient(rgba(56,189,248,0.12) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        {/* Top blue haze */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-28 rounded-t-2xl"
          style={{ background: "linear-gradient(to bottom, rgba(56,189,248,0.07), transparent)" }}
        />

        <div className="relative flex flex-col p-5">
          {/* Terminal header */}
          <div className="mb-4 flex items-center gap-1.5 border-b border-sky-400/[0.12] pb-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]/40" />
            <motion.span
              className="h-2.5 w-2.5 rounded-full bg-sky-400"
              animate={reduced ? {} : { opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="ml-2 flex-1 font-mono text-[0.56rem] uppercase tracking-[0.2em] text-sky-400/50">
              ai-qa-core — active
            </span>
            <motion.span
              className="rounded border border-sky-400/30 bg-sky-400/10 px-1.5 py-0.5 font-mono text-[0.5rem] text-sky-400"
              animate={reduced ? {} : { opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              AI LIVE
            </motion.span>
          </div>

          {/* Title */}
          <div className="mb-4">
            <p className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-sky-400/50">
              02 / After
            </p>
            <h3 className="mt-1 font-display text-xl font-semibold text-slate-100">
              AI-Augmented QA
            </h3>
            <p className="mt-0.5 font-mono text-[0.6rem] text-sky-400/40">
              Intelligent · Automated · Continuous
            </p>
          </div>

          {/* Steps */}
          <div className="flex-1">
            {AI_STEPS.map((step, i) => (
              <TerminalStep
                key={step.label}
                {...step}
                index={i}
                isLast={i === AI_STEPS.length - 1}
                isAI={true}
              />
            ))}
          </div>

        </div>
      </motion.div>
    </div>
  );
}

/* ─── TransformBeam ─────────────────────────────────────────────── */

function TransformBeam() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  return (
    <div
      ref={ref}
      className="hidden lg:flex relative flex-col items-center justify-center"
      aria-hidden="true"
    >
      {/* Vertical glow spine */}
      <motion.div
        className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(212,168,71,0.3) 25%, rgba(212,168,71,0.65) 50%, rgba(212,168,71,0.3) 75%, transparent 100%)",
        }}
        initial={reduced ? {} : { opacity: 0 }}
        animate={inView ? { opacity: 1 } : undefined}
        transition={{ duration: 0.8 }}
      />

      {/* Floating code chars */}
      {!reduced &&
        BEAM_CHARS.map(({ char, top, delay }, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 select-none font-mono text-[0.46rem] text-gold/40"
            style={{ top }}
            animate={{ opacity: [0, 0.75, 0], y: [0, -8, -18] }}
            transition={{ duration: 3.8, delay, repeat: Infinity, ease: "easeOut" }}
          >
            {char}
          </motion.span>
        ))}

      {/* Center diamond badge */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        {/* Expanding pulse rings */}
        {!reduced && (
          <>
            <motion.div
              className="absolute h-14 w-14 rounded-full border border-gold/25"
              animate={{ scale: [1, 1.9, 1], opacity: [0.55, 0, 0.55] }}
              transition={{ duration: 3.0, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
              className="absolute h-14 w-14 rounded-full border border-gold/15"
              animate={{ scale: [1, 2.6, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 3.0, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
            />
          </>
        )}

        {/* Rotated diamond */}
        <motion.div
          className="relative flex h-12 w-12 rotate-45 items-center justify-center rounded-xl border border-gold/50 bg-[#060e08] shadow-[0_0_28px_rgba(212,168,71,0.28)]"
          initial={reduced ? {} : { scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : undefined}
          transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="-rotate-45 text-lg leading-none">⚡</span>
        </motion.div>

        {/* Label */}
        <motion.span
          className="mt-1.5 font-mono text-[0.48rem] uppercase tracking-[0.22em] text-gold/45"
          initial={reduced ? {} : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ delay: 0.85 }}
        >
          TRANSFORM
        </motion.span>
      </div>

      {/* Horizontal flowing particles */}
      {!reduced && (
        <svg
          className="absolute top-1/2 left-0 w-full -translate-y-1/2 overflow-visible"
          viewBox="0 0 80 10"
          fill="none"
        >
          {[
            { delay: 0.3, r: 2.5, op: 0.9 },
            { delay: 1.0, r: 1.8, op: 0.6 },
            { delay: 1.7, r: 2.1, op: 0.75 },
          ].map(({ delay, r, op }, i) => (
            <motion.circle
              key={i}
              cy="5"
              r={r}
              fill="var(--gold)"
              animate={
                inView
                  ? { cx: [-4, 84], opacity: [0, op, op, 0] }
                  : { cx: [-4], opacity: [0] }
              }
              transition={{ duration: 1.55, delay, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </svg>
      )}
    </div>
  );
}

/* ─── ImpactMetric ──────────────────────────────────────────────── */

function ImpactMetric({
  icon, label, tooltip, index,
}: {
  icon: string; label: string; tooltip: string; index: number;
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
          hovered ? "border-gold/50 bg-gold/[0.09]" : "border-line/50 bg-card/60"
        }`}
        animate={reduced ? {} : { scale: hovered ? 1.04 : 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <span className="text-2xl leading-none" role="img" aria-hidden="true">
          {icon}
        </span>
        <span
          className={`font-mono text-[0.59rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-200 ${
            hovered ? "text-gold" : "text-ink-soft"
          }`}
        >
          {label}
        </span>
        {!reduced && (
          <motion.span
            className="h-[3px] w-[3px] rounded-full bg-gold"
            animate={{ opacity: hovered ? 1 : 0.25, scale: hovered ? 2.2 : 1 }}
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
            <p className="text-[0.72rem] leading-[1.55] text-ink-soft">{tooltip}</p>
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

/* ─── Main export ───────────────────────────────────────────────── */

export default function AIEraSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* Ambient section glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(212,168,71,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {/* Header */}
        <SectionHeader
          eyebrow="Next-Gen Engineering"
          title="AI Based QA"
          align="center"
        />
        <Reveal delay={0.12}>
          <p className="mx-auto mt-3 max-w-xl text-center text-[0.85rem] italic leading-[1.7] text-ink-soft">
            "How AI is transforming software quality while keeping engineers at the center."
          </p>
        </Reveal>

        {/* Comparison grid */}
        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_6rem_1fr] lg:items-stretch">
          <LegacyCard />
          <TransformBeam />
          <AICard />
        </div>

        {/* Impact metrics */}
        <div className="mt-14">
          <Reveal>
            <p className="mb-5 text-center font-mono text-[0.58rem] uppercase tracking-[0.22em] text-ink-soft/55">
              Impact Metrics — Hover to Explore
            </p>
          </Reveal>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {METRICS.map((m, i) => (
              <ImpactMetric
                key={m.label}
                icon={m.icon}
                label={m.label}
                tooltip={m.tooltip}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* Philosophy card */}
        <Reveal className="mt-12" delay={0.1}>
          <div className="relative overflow-hidden rounded-2xl border border-gold/25 bg-[radial-gradient(ellipse_at_center,rgba(212,168,71,0.06)_0%,transparent_70%)] p-8 backdrop-blur-sm sm:p-10">
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
