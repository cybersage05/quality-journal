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

/* ─── Data ──────────────────────────────────────────────────────── */

const TRAD_STEPS = [
  { label: "Read & understand requirements", pct: 42 },
  { label: "Write test scenarios manually",  pct: 35 },
  { label: "Develop automation scripts",     pct: 50 },
  { label: "Debug & maintain scripts",       pct: 38 },
  { label: "Repetitive regression cycles",   pct: 30 },
];

const AI_STEPS = [
  { label: "Understand requirements instantly", pct: 100 },
  { label: "Generate test scenarios & cases",   pct: 100 },
  { label: "Create automation scripts",         pct: 100 },
  { label: "Review, refine & validate",         pct: 100 },
  { label: "Continuous AI-powered coverage",    pct: 100 },
];

const METRICS = [
  { icon: "🎯", label: "Better Coverage",     tooltip: "AI helps identify happy paths, edge cases, and negative scenarios." },
  { icon: "⚡", label: "Faster Feedback",     tooltip: "Accelerates test creation and validation cycles." },
  { icon: "🔍", label: "Smarter Analysis",    tooltip: "Transforms requirements into actionable insights." },
  { icon: "🧩", label: "Reusable Automation", tooltip: "Generates maintainable and scalable test assets." },
  { icon: "🚀", label: "Higher Productivity", tooltip: "Allows engineers to focus on quality and innovation." },
];

const TECH_CHIPS = [
  "Claude Code", "ChatGPT", "GitHub Copilot", "Python",
  "Robot Framework", "Playwright", "REST APIs", "CI/CD",
];

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
  label: string; pct: number; index: number; isLast: boolean; isAI: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const reduced = useReducedMotion();

  return (
    <div ref={ref}>
      <motion.div
        className={`flex items-center gap-2 rounded-lg px-2.5 py-2 transition-colors duration-200 ${
          isAI
            ? "border border-transparent hover:border-sky-400/20 hover:bg-sky-400/[0.07]"
            : "border border-transparent hover:border-white/10 hover:bg-white/[0.04]"
        }`}
        initial={reduced ? { opacity: 1 } : { opacity: 0, x: isAI ? 10 : -10 }}
        animate={inView ? { opacity: 1, x: 0 } : undefined}
        transition={{ duration: 0.38, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.span
          className={`h-[6px] w-[6px] shrink-0 rounded-full ${isAI ? "bg-sky-400" : "bg-slate-600"}`}
          animate={isAI && !reduced ? { opacity: [0.35, 1, 0.35], scale: [0.8, 1.3, 0.8] } : {}}
          transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.28, ease: "easeInOut" }}
        />
        <span className={`flex-1 font-mono text-[0.7rem] leading-none ${isAI ? "text-slate-200" : "text-slate-500"}`}>
          {!isAI && <span className="mr-1 text-slate-700">$</span>}
          {label}
        </span>
        <div className="h-[5px] w-14 shrink-0 overflow-hidden rounded-full bg-white/[0.07]">
          <motion.div
            className={`h-full w-full rounded-full ${isAI ? "bg-sky-400" : "bg-slate-700"}`}
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
      className="relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.04] backdrop-blur-sm"
    >
      {/* CRT scanline */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl opacity-40"
        style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.016) 3px, rgba(255,255,255,0.016) 4px)" }}
      />
      <div className="relative flex flex-col p-5">
        {/* Terminal header */}
        <div className="mb-4 flex items-center gap-1.5 border-b border-white/[0.07] pb-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28ca41]/30" />
          <span className="ml-2 flex-1 font-mono text-[0.56rem] uppercase tracking-[0.2em] text-slate-600">
            traditional-qa — v1.0.0
          </span>
          <span className="rounded border border-red-500/20 bg-red-500/[0.08] px-1.5 py-0.5 font-mono text-[0.5rem] text-red-500/70">
            MANUAL
          </span>
        </div>
        {/* Title */}
        <div className="mb-4">
          <p className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-slate-600">01 / Before</p>
          <h3 className="mt-1 font-display text-xl font-semibold text-slate-400">Traditional QA</h3>
          <p className="mt-0.5 font-mono text-[0.6rem] text-slate-700">Sequential · Human-driven · Bottlenecked</p>
        </div>
        {/* Steps */}
        <div className="flex-1">
          {TRAD_STEPS.map((step, i) => (
            <TerminalStep key={step.label} {...step} index={i} isLast={i === TRAD_STEPS.length - 1} isAI={false} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── AICard ─────────────────────────────────────────────────────── */

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
    <div ref={wrapRef} className="relative" onPointerMove={onMove} onPointerLeave={onLeave}>
      {/* Highlight glow behind */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-[-28px] -z-10 rounded-3xl"
        style={{ background: "radial-gradient(ellipse at center, rgba(56,189,248,0.16) 0%, transparent 68%)" }}
      />
      {/* Outer gear ring — slow CW */}
      {!reduced && (
        <motion.div aria-hidden="true"
          className="absolute inset-[-3px] rounded-[19px] will-change-transform"
          style={{ border: "2px dashed rgba(56,189,248,0.5)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
        />
      )}
      {/* Inner gear ring — slow CCW */}
      {!reduced && (
        <motion.div aria-hidden="true"
          className="absolute inset-[-6px] rounded-[22px] will-change-transform"
          style={{ border: "1.5px dashed rgba(56,189,248,0.2)" }}
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
        className="relative flex flex-col overflow-hidden rounded-2xl border border-sky-400/25 bg-sky-400/[0.05] backdrop-blur-sm"
      >
        {/* Dot grid */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl opacity-20"
          style={{ backgroundImage: "radial-gradient(rgba(56,189,248,0.15) 1px, transparent 1px)", backgroundSize: "18px 18px" }}
        />
        {/* Top haze */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-28 rounded-t-2xl"
          style={{ background: "linear-gradient(to bottom, rgba(56,189,248,0.08), transparent)" }}
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
            <span className="ml-2 flex-1 font-mono text-[0.56rem] uppercase tracking-[0.2em] text-sky-400/55">
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
            <p className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-sky-400/55">02 / After</p>
            <h3 className="mt-1 font-display text-xl font-semibold text-white">AI-Based QA</h3>
            <p className="mt-0.5 font-mono text-[0.6rem] text-sky-400/45">Intelligent · Automated · Continuous</p>
          </div>
          {/* Steps */}
          <div className="flex-1">
            {AI_STEPS.map((step, i) => (
              <TerminalStep key={step.label} {...step} index={i} isLast={i === AI_STEPS.length - 1} isAI={true} />
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
    <div ref={ref} className="hidden lg:flex relative flex-col items-center justify-center" aria-hidden="true">
      {/* Spine */}
      <motion.div
        className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
        style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(56,189,248,0.3) 25%, rgba(56,189,248,0.65) 50%, rgba(56,189,248,0.3) 75%, transparent 100%)" }}
        initial={reduced ? {} : { opacity: 0 }}
        animate={inView ? { opacity: 1 } : undefined}
        transition={{ duration: 0.8 }}
      />
      {/* Floating chars */}
      {!reduced && BEAM_CHARS.map(({ char, top, delay }, i) => (
        <motion.span key={i}
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 select-none font-mono text-[0.46rem] text-sky-400/40"
          style={{ top }}
          animate={{ opacity: [0, 0.75, 0], y: [0, -8, -18] }}
          transition={{ duration: 3.8, delay, repeat: Infinity, ease: "easeOut" }}
        >
          {char}
        </motion.span>
      ))}
      {/* Diamond badge */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        {!reduced && (
          <>
            <motion.div className="absolute h-14 w-14 rounded-full border border-sky-400/25"
              animate={{ scale: [1, 1.9, 1], opacity: [0.55, 0, 0.55] }}
              transition={{ duration: 3.0, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div className="absolute h-14 w-14 rounded-full border border-sky-400/15"
              animate={{ scale: [1, 2.6, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 3.0, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
            />
          </>
        )}
        <motion.div
          className="relative flex h-12 w-12 rotate-45 items-center justify-center rounded-xl border border-sky-400/50 bg-[#030a16] shadow-[0_0_28px_rgba(56,189,248,0.25)]"
          initial={reduced ? {} : { scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : undefined}
          transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="-rotate-45 text-lg leading-none">⚡</span>
        </motion.div>
        <motion.span
          className="mt-1.5 font-mono text-[0.48rem] uppercase tracking-[0.22em] text-sky-400/45"
          initial={reduced ? {} : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ delay: 0.85 }}
        >
          TRANSFORM
        </motion.span>
      </div>
      {/* Flowing particles */}
      {!reduced && (
        <svg className="absolute top-1/2 left-0 w-full -translate-y-1/2 overflow-visible" viewBox="0 0 80 10" fill="none">
          {[{ delay: 0.3, r: 2.5, op: 0.9 }, { delay: 1.0, r: 1.8, op: 0.6 }, { delay: 1.7, r: 2.1, op: 0.75 }].map(({ delay, r, op }, i) => (
            <motion.circle key={i} cy="5" r={r} fill="#38bdf8"
              animate={inView ? { cx: [-4, 84], opacity: [0, op, op, 0] } : { cx: [-4], opacity: [0] }}
              transition={{ duration: 1.55, delay, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </svg>
      )}
    </div>
  );
}

/* ─── ImpactMetric ──────────────────────────────────────────────── */

function ImpactMetric({ icon, label, tooltip, index }: {
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
          hovered ? "border-sky-400/50 bg-sky-400/[0.09]" : "border-white/[0.08] bg-white/[0.03]"
        }`}
        animate={reduced ? {} : { scale: hovered ? 1.04 : 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <span className="text-2xl leading-none" role="img" aria-hidden="true">{icon}</span>
        <span className={`font-mono text-[0.59rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-200 ${
          hovered ? "text-sky-400" : "text-slate-500"
        }`}>
          {label}
        </span>
        {!reduced && (
          <motion.span className="h-[3px] w-[3px] rounded-full bg-sky-400"
            animate={{ opacity: hovered ? 1 : 0.25, scale: hovered ? 2.2 : 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute bottom-full left-1/2 z-20 mb-3 w-52 -translate-x-1/2 rounded-xl border border-sky-400/20 bg-[#0d1a2e]/95 px-3.5 py-3 text-center shadow-2xl backdrop-blur-md"
            initial={{ opacity: 0, y: 8, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.17, ease: "easeOut" }}
          >
            <p className="text-[0.72rem] leading-[1.55] text-slate-300">{tooltip}</p>
            <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent"
              style={{ borderTopColor: "rgba(56,189,248,0.22)" }}
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
      {/* ── Intentional dark panel — works in both light & dark mode ── */}
      <div className="absolute inset-0 bg-[#040c1b]" aria-hidden="true" />

      {/* Fade edges so dark panel blends with surrounding page bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-20"
        style={{ background: "linear-gradient(to bottom, var(--paper), transparent)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
        style={{ background: "linear-gradient(to top, var(--paper), transparent)" }}
      />

      {/* Ambient glow orb */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(ellipse at center, rgba(56,189,248,0.055) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">

        {/* Section header — white text because section is always dark */}
        <div className="mb-10 text-center">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-sky-400">
            Next-Gen Engineering
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-wide text-white sm:text-4xl">
            AI Based QA
          </h2>
          <span className="mx-auto mt-3 block h-px w-16 bg-sky-400/55" />
          <p className="mx-auto mt-4 max-w-xl text-center text-[0.85rem] italic leading-[1.7] text-slate-400">
            "How AI is transforming software quality while keeping engineers at the center."
          </p>
        </div>

        {/* Comparison */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_6rem_1fr] lg:items-stretch">
          <LegacyCard />
          <TransformBeam />
          <AICard />
        </div>

        {/* Impact metrics */}
        <div className="mt-14">
          <p className="mb-5 text-center font-mono text-[0.58rem] uppercase tracking-[0.22em] text-slate-600">
            Impact Metrics — Hover to Explore
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {METRICS.map((m, i) => (
              <ImpactMetric key={m.label} icon={m.icon} label={m.label} tooltip={m.tooltip} index={i} />
            ))}
          </div>
        </div>

        {/* Philosophy card */}
        <div className="relative mt-12 overflow-hidden rounded-2xl border border-sky-400/20 bg-sky-400/[0.04] p-8 backdrop-blur-sm sm:p-10">
          <span className="pointer-events-none absolute left-0 top-0 h-12 w-12 rounded-tl-2xl border-l-2 border-t-2 border-sky-400/25" />
          <span className="pointer-events-none absolute bottom-0 right-0 h-12 w-12 rounded-br-2xl border-b-2 border-r-2 border-sky-400/25" />
          <blockquote className="text-center">
            <p className="mx-auto max-w-3xl font-display text-[1.05rem] italic leading-[1.75] text-slate-200 sm:text-[1.15rem]">
              "AI does not replace quality engineers—it amplifies expertise,
              accelerates feedback, and enables teams to deliver better software faster."
            </p>
          </blockquote>
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            {TECH_CHIPS.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-sky-400/20 bg-sky-400/[0.07] px-3 py-1 font-mono text-[0.68rem] tracking-wide text-sky-300/80 transition-colors duration-300 hover:border-sky-400/45 hover:bg-sky-400/[0.14] hover:text-sky-300"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
