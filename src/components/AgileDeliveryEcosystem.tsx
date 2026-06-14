import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Reveal } from "./ui";

/* ─── Types ──────────────────────────────────────────────────── */

type NodeVariant = "origin" | "process" | "collab" | "validation" | "success";

interface ArchNode {
  id: string;
  title: string;
  sub: string;
  variant: NodeVariant;
  icon: ReactNode;
}

interface SysCard {
  id: string;
  title: string;
  sub: string;
  icon: ReactNode;
}

interface ChipData {
  label: string;
  icon: ReactNode;
}

/* ─── Flow data ───────────────────────────────────────────────── */

const TOP_STEPS: ArchNode[] = [
  {
    id: "biz",
    title: "Business Change",
    sub: "Service Fee Introduction",
    variant: "origin",
    icon: (
      <g>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </g>
    ),
  },
  {
    id: "impact",
    title: "System Impact Analysis",
    sub: "Architecture review across all affected services",
    variant: "process",
    icon: (
      <g>
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </g>
    ),
  },
];

const SYS_CARDS: SysCard[] = [
  {
    id: "charging",
    title: "Charging System",
    sub: "Rating & Fee Processing",
    icon: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  },
  {
    id: "mediation",
    title: "Mediation Layer",
    sub: "Transaction Routing & Data",
    icon: (
      <g>
        <path d="M8 3l4 4-4 4" />
        <path d="M16 21l-4-4 4-4" />
        <line x1="3" y1="7" x2="20" y2="7" />
        <line x1="4" y1="17" x2="21" y2="17" />
      </g>
    ),
  },
  {
    id: "api",
    title: "APIs & Services",
    sub: "Integration & Exposure",
    icon: <g><path d="M8 6l-4 4 4 4M16 6l4 4-4 4M12 2v20" /></g>,
  },
  {
    id: "database",
    title: "Database Updates",
    sub: "Persistence & Validation",
    icon: (
      <g>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
        <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
      </g>
    ),
  },
];

const BOT_STEPS: ArchNode[] = [
  {
    id: "collab",
    title: "Cross-Team Collaboration",
    sub: "Development · Charging System · Systems · DevOps · QA",
    variant: "collab",
    icon: (
      <g>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </g>
    ),
  },
  {
    id: "validation",
    title: "Multi-Layer Validation",
    sub: "12 testing strategies executed across the ecosystem",
    variant: "validation",
    icon: (
      <g>
        <path d="M12 2.5l7.5 3v6.2c0 4.7-3.2 8-7.5 9.3-4.3-1.3-7.5-4.6-7.5-9.3V5.5z" />
        <path d="M9 12l2 2 4-4" />
      </g>
    ),
  },
  {
    id: "production",
    title: "Production Readiness",
    sub: "Stability, deployment verification, and sign-off",
    variant: "process",
    icon: <g><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></g>,
  },
  {
    id: "release",
    title: "✓ Feature Release",
    sub: "Delivered within sprint timeline",
    variant: "success",
    icon: (
      <g>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </g>
    ),
  },
];

const CHIPS: ChipData[] = [
  { label: "Functional Testing",   icon: <g><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></g> },
  { label: "API Testing",           icon: <g><path d="M8 6l-4 4 4 4M16 6l4 4-4 4M12 2v20"/></g> },
  { label: "Integration Testing",   icon: <g><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></g> },
  { label: "System Testing",        icon: <g><rect x="4" y="4" width="16" height="7" rx="1.5"/><rect x="4" y="13" width="16" height="7" rx="1.5"/></g> },
  { label: "End-to-End Testing",    icon: <g><polyline points="5 12 3 12 12 3 21 12 19 12"/><polyline points="5 12 5 20 19 20 19 12"/></g> },
  { label: "Database Validation",   icon: <g><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/></g> },
  { label: "Sanity Testing",        icon: <g><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></g> },
  { label: "Regression Testing",    icon: <g><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></g> },
  { label: "Performance Testing",   icon: <g><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></g> },
  { label: "Stress Testing",        icon: <g><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></g> },
  { label: "UAT Support",           icon: <g><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></g> },
  { label: "Production Validation", icon: <g><path d="M12 2.5l7.5 3v6.2c0 4.7-3.2 8-7.5 9.3-4.3-1.3-7.5-4.6-7.5-9.3V5.5z"/><path d="M9 12l2 2 4-4"/></g> },
];

/* ─── Centered vertical connector ────────────────────────────── */

function CenterConnector({ inView, reduced }: { inView: boolean; reduced: boolean }) {
  return (
    <div className="relative mx-auto my-1.5" style={{ width: 2, height: 28 }}>
      <div className="absolute inset-0 bg-sky-deep/14" />
      <motion.div
        className="absolute inset-0 bg-sky-deep/60"
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : undefined}
        style={{ transformOrigin: "50% 0%" }}
        transition={{ duration: 0.42, delay: 0.18, ease: "easeOut" }}
      />
      {!reduced && inView && (
        <motion.div
          className="absolute rounded-full bg-sky-deep"
          style={{ width: 6, height: 6, left: -2, boxShadow: "0 0 8px rgba(56,189,248,0.95)" }}
          animate={{ y: [-3, 24], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.8, delay: 0.4, ease: "linear", repeat: Infinity, repeatDelay: 2 }}
        />
      )}
    </div>
  );
}

/* ─── Architecture flow node (useRef per node, no hooks in loop) */

function ArchFlowNode({
  node, renderConnector, reduced,
}: {
  node: ArchNode; renderConnector: boolean; reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const isOrigin = node.variant === "origin";
  const isSuccess = node.variant === "success";
  const isCollab = node.variant === "collab";

  const borderAccent = isOrigin
    ? "border-l-4 border-l-gold border-t border-r border-b border-gold/22"
    : isSuccess
    ? "border-l-4 border-l-forest border-t border-r border-b border-forest/22"
    : isCollab
    ? "border-l-4 border-l-sky-deep border-t border-r border-b border-sky-deep/22"
    : "border-l-4 border-l-sky-deep/45 border-t border-r border-b border-sky-deep/16";

  const cardBg = isOrigin
    ? "bg-[rgba(212,168,71,0.05)]"
    : isSuccess
    ? "bg-[rgba(26,120,80,0.05)]"
    : "bg-[rgba(56,189,248,0.03)]";

  const iconBg = isOrigin
    ? "bg-gold/12 text-gold"
    : isSuccess
    ? "bg-forest/12 text-forest"
    : "bg-sky-deep/10 text-sky-deep";

  const titleColor = isOrigin ? "text-gold" : isSuccess ? "text-forest" : "text-ink";

  return (
    <div ref={ref}>
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12, filter: "blur(4px)" }}
        animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`relative flex items-center gap-3.5 rounded-xl px-4 py-3.5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_18px_rgba(56,189,248,0.09)] ${borderAccent} ${cardBg}`}
      >
        {/* Breathing glow for origin / success */}
        {(isOrigin || isSuccess) && !reduced && (
          <motion.span
            className={`pointer-events-none absolute -inset-px rounded-xl border ${isSuccess ? "border-forest/25" : "border-gold/25"}`}
            animate={{ opacity: [0.5, 0.12, 0.5] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Icon */}
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconBg}`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {node.icon}
          </svg>
        </span>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <p className={`text-[0.88rem] font-semibold leading-tight ${titleColor}`}>
            {node.title}
          </p>
          <p
            className={`mt-0.5 leading-snug ${
              isCollab
                ? "font-mono text-[0.58rem] tracking-[0.09em] text-sky-deep/65"
                : "text-[0.73rem] text-ink-soft/65"
            }`}
          >
            {node.sub}
          </p>
        </div>
      </motion.div>

      {renderConnector && <CenterConnector inView={inView} reduced={reduced} />}
    </div>
  );
}

/* ─── Horizontal system card grid (sub-component for useRef) ─── */

function SystemLayer({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref}>
      <motion.div
        className="grid grid-cols-2 gap-2 lg:grid-cols-4"
        initial={reduced ? false : { opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {SYS_CARDS.map((sys, i) => (
          <motion.div
            key={sys.id}
            initial={reduced ? false : { opacity: 0, scale: 0.88 }}
            animate={inView ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 0.38, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="group flex flex-col items-center gap-2 rounded-xl border border-sky-deep/22 bg-[rgba(56,189,248,0.05)] px-3 py-4 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-deep/45 hover:bg-[rgba(56,189,248,0.09)] hover:shadow-[0_6px_20px_rgba(56,189,248,0.13)]"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full border border-sky-deep/25 bg-sky-deep/10 text-sky-deep transition-colors duration-300 group-hover:bg-sky-deep/20"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {sys.icon}
              </svg>
            </span>
            <p className="text-[0.77rem] font-semibold leading-snug text-ink">{sys.title}</p>
            <p className="text-[0.65rem] leading-tight text-ink-soft/60">{sys.sub}</p>
          </motion.div>
        ))}
      </motion.div>

      <CenterConnector inView={inView} reduced={reduced} />
    </div>
  );
}

/* ─── Validation chip (sub-component for useRef/useInView) ────── */

function ValidationChip({ label, icon, delay }: ChipData & { delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, scale: 0.82, y: 10 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : undefined}
      transition={{ duration: 0.38, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group flex items-center gap-2.5 rounded-xl border border-sky-deep/18 bg-[rgba(56,189,248,0.04)] px-3.5 py-2.5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-deep/38 hover:bg-[rgba(56,189,248,0.08)] hover:shadow-[0_4px_14px_rgba(56,189,248,0.1)]"
    >
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-deep/10 text-sky-deep transition-colors duration-300 group-hover:bg-sky-deep/18"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icon}
        </svg>
      </span>
      <span className="text-[0.78rem] font-medium text-ink-soft transition-colors duration-300 group-hover:text-ink">
        {label}
      </span>
    </motion.div>
  );
}

/* ─── Main export ─────────────────────────────────────────────── */

export default function EnterpriseFeatureDelivery() {
  const reduced = useReducedMotion();

  return (
    <div className="mx-auto max-w-[1600px]" aria-label="Enterprise Feature Delivery">

      {/* Header */}
      <Reveal>
        <p className="eyebrow mb-2 text-center">Enterprise Feature Delivery</p>
        <h3 className="section-title text-center font-display font-semibold leading-[1.18] tracking-wide text-ink">
          Enterprise Feature Delivery
        </h3>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[0.84rem] leading-[1.72] text-ink-soft">
          Enterprise telecom features often impact multiple systems across the ecosystem. Delivering
          changes requires cross-functional collaboration, end-to-end validation, and production
          readiness.
        </p>
      </Reveal>

      {/* Two-column: 40 / 60 */}
      <div className="mt-10 grid items-start gap-8 md:grid-cols-2 lg:grid-cols-[2fr_3fr]">

        {/* ── Left (40 %): Case study card ─────────────────────── */}
        <Reveal delay={0.05}>
          <article className="h-full rounded-2xl border border-sky-deep/20 bg-[rgba(56,189,248,0.035)] p-6 shadow-[0_4px_32px_rgba(56,189,248,0.07)] backdrop-blur-sm transition-all duration-300 hover:border-sky-deep/35 hover:shadow-[0_8px_42px_rgba(56,189,248,0.12)] sm:p-7">

            {/* Label row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-gold/38 bg-gold/10 px-2.5 py-0.5 font-mono text-[0.52rem] tracking-[0.28em] text-gold">
                CASE STUDY
              </span>
              <span className="rounded-full border border-sky-deep/28 bg-sky-deep/8 px-2.5 py-0.5 font-mono text-[0.52rem] tracking-[0.18em] text-sky-deep">
                ENTERPRISE TELECOM
              </span>
            </div>

            {/* Title */}
            <h4 className="mt-4 font-display text-[1.18rem] font-semibold tracking-wide text-ink">
              AT&T Service Fee Enhancement
            </h4>
            <p className="mt-0.5 font-mono text-[0.6rem] tracking-[0.12em] text-ink-soft/60">
              Prepaid Transaction Service Fee
            </p>

            {/* Technology pills */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {["Charging System", "Mediation Layer", "APIs & Services", "Databases"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-sky-deep/25 bg-sky-deep/8 px-2.5 py-0.5 font-mono text-[0.55rem] tracking-wide text-sky-deep"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Description */}
            <div className="mt-5 space-y-3 text-[0.82rem] leading-[1.72] text-ink-soft">
              <p>
                AT&T introduced a service fee enhancement for prepaid transactions. Although the
                business change appeared small, it impacted multiple telecom layers — Charging
                Systems, Mediation, APIs, and Databases.
              </p>
              <p>
                Working closely with Development, Charging System, Systems, and DevOps teams, I
                performed end-to-end validation and multi-layer testing to ensure production
                readiness for millions of subscribers.
              </p>
            </div>

            {/* 2 × 2 metrics */}
            <div className="mt-6 grid grid-cols-2 gap-2">
              {[
                { icon: "🏗", label: "4 Architecture Layers" },
                { icon: "🧪", label: "Multi-Layer Testing" },
                { icon: "🚀", label: "Production Release"  },
                { icon: "👥", label: "5 Teams Involved"    },
              ].map((m) => (
                <div
                  key={m.label}
                  className="flex flex-col gap-1.5 rounded-xl border border-line bg-card/50 px-3.5 py-3"
                >
                  <span className="text-[1.1rem] leading-none" aria-hidden="true">{m.icon}</span>
                  <span className="text-[0.72rem] font-semibold leading-tight text-ink">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer banner */}
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-forest/28 bg-forest/8 px-4 py-3">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 shrink-0 text-forest"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span className="text-[0.78rem] font-semibold text-forest">
                Successfully Delivered in Agile Sprint
              </span>
            </div>
          </article>
        </Reveal>

        {/* ── Right (60 %): Enterprise architecture flow ────────── */}
        <div aria-label="Enterprise architecture delivery flow">
          <Reveal>
            <p className="eyebrow mb-5">Architecture Flow</p>
          </Reveal>

          {/* Business Change → System Impact */}
          {TOP_STEPS.map((node) => (
            <ArchFlowNode
              key={node.id}
              node={node}
              renderConnector
              reduced={!!reduced}
            />
          ))}

          {/* 4-system horizontal grid + connector below */}
          <SystemLayer reduced={!!reduced} />

          {/* Cross-Team → Validation → Production → Release */}
          {BOT_STEPS.map((node, i) => (
            <ArchFlowNode
              key={node.id}
              node={node}
              renderConnector={i < BOT_STEPS.length - 1}
              reduced={!!reduced}
            />
          ))}
        </div>
      </div>

      {/* ── Validation chips ──────────────────────────────────── */}
      <Reveal className="mt-14">
        <p className="eyebrow mb-1 text-center">Validation Executed</p>
        <h4 className="text-center font-display text-lg font-semibold tracking-wide text-ink">
          Multi-Layer Testing Strategy
        </h4>
        <p className="mx-auto mt-2 max-w-lg text-center text-[0.82rem] leading-[1.65] text-ink-soft">
          Every layer of the telecom ecosystem was validated to ensure correctness, stability, and
          backward compatibility.
        </p>
      </Reveal>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {CHIPS.map((c, i) => (
          <ValidationChip key={c.label} label={c.label} icon={c.icon} delay={i * 0.04} />
        ))}
      </div>

      {/* ── Insight quote ─────────────────────────────────────── */}
      <Reveal className="mt-10">
        <blockquote className="relative rounded-2xl border border-gold/25 bg-[rgba(212,168,71,0.04)] px-7 py-6 text-center backdrop-blur-sm">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-2 select-none font-display text-5xl leading-none text-gold/14"
          >
            "
          </span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-2 right-4 select-none font-display text-5xl leading-none text-gold/14"
          >
            "
          </span>
          <p className="relative mx-auto max-w-2xl text-[0.87rem] italic leading-[1.74] text-ink-soft">
            When a business change impacted charging systems, mediation, APIs, and databases, I
            ensured end-to-end quality and release readiness across the telecom ecosystem.
          </p>
        </blockquote>
      </Reveal>
    </div>
  );
}
