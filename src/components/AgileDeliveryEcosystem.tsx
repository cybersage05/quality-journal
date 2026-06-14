import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Reveal } from "./ui";

/* ─── Types ─────────────────────────────────────────────────── */

type StepVariant = "origin" | "process" | "system" | "collab" | "success";

interface FlowStepData {
  id: string;
  title: string;
  sub: string;
  variant: StepVariant;
  icon: ReactNode;
}

interface ChipData {
  label: string;
  icon: ReactNode;
}

/* ─── Flow data ──────────────────────────────────────────────── */

const STEPS: FlowStepData[] = [
  {
    id: "req",
    title: "Business Requirement",
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
    id: "sprint",
    title: "Sprint Planning & Analysis",
    sub: "Impact scoping and task breakdown",
    variant: "process",
    icon: (
      <g>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </g>
    ),
  },
  {
    id: "impact",
    title: "System Impact Assessment",
    sub: "Architecture review across systems",
    variant: "process",
    icon: (
      <g>
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </g>
    ),
  },
  {
    id: "charging",
    title: "Charging System",
    sub: "Rating & Fee Processing",
    variant: "system",
    icon: (
      <g>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </g>
    ),
  },
  {
    id: "mediation",
    title: "Mediation Layer",
    sub: "Transaction Routing & Data",
    variant: "system",
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
    variant: "system",
    icon: (
      <g>
        <path d="M8 6l-4 4 4 4M16 6l4 4-4 4M12 2v20" />
      </g>
    ),
  },
  {
    id: "database",
    title: "Database Updates",
    sub: "Persistence & Validation",
    variant: "system",
    icon: (
      <g>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
        <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
      </g>
    ),
  },
  {
    id: "collab",
    title: "Cross-Team Collaboration",
    sub: "Development · Charging · Systems · DevOps · QA",
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
    sub: "12 testing strategies executed",
    variant: "process",
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
    sub: "Stability and deployment verification",
    variant: "process",
    icon: (
      <g>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </g>
    ),
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
  {
    label: "Functional Testing",
    icon: <g><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" /></g>,
  },
  {
    label: "API Testing",
    icon: <g><path d="M8 6l-4 4 4 4M16 6l4 4-4 4M12 2v20" /></g>,
  },
  {
    label: "Integration Testing",
    icon: (
      <g>
        <circle cx="18" cy="18" r="3" />
        <circle cx="6" cy="6" r="3" />
        <path d="M13 6h3a2 2 0 0 1 2 2v7" />
        <line x1="6" y1="9" x2="6" y2="21" />
      </g>
    ),
  },
  {
    label: "System Testing",
    icon: (
      <g>
        <rect x="4" y="4" width="16" height="7" rx="1.5" />
        <rect x="4" y="13" width="16" height="7" rx="1.5" />
      </g>
    ),
  },
  {
    label: "End-to-End Testing",
    icon: (
      <g>
        <polyline points="5 12 3 12 12 3 21 12 19 12" />
        <polyline points="5 12 5 20 19 20 19 12" />
      </g>
    ),
  },
  {
    label: "Database Validation",
    icon: (
      <g>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
        <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
      </g>
    ),
  },
  {
    label: "Sanity Testing",
    icon: (
      <g>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </g>
    ),
  },
  {
    label: "Regression Testing",
    icon: (
      <g>
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 .49-3.51" />
      </g>
    ),
  },
  {
    label: "Performance Testing",
    icon: <g><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></g>,
  },
  {
    label: "Stress Testing",
    icon: <g><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></g>,
  },
  {
    label: "UAT Support",
    icon: (
      <g>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </g>
    ),
  },
  {
    label: "Production Validation",
    icon: (
      <g>
        <path d="M12 2.5l7.5 3v6.2c0 4.7-3.2 8-7.5 9.3-4.3-1.3-7.5-4.6-7.5-9.3V5.5z" />
        <path d="M9 12l2 2 4-4" />
      </g>
    ),
  },
];

/* ─── Connector line between steps ──────────────────────────── */

function StepConnector({ inView, reduced }: { inView: boolean; reduced: boolean }) {
  return (
    <div className="relative ml-[1.3rem] h-7" style={{ width: 2 }}>
      <div className="absolute inset-0 rounded-full bg-line/25" />
      <motion.div
        className="absolute inset-0 rounded-full bg-sky-deep/65"
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : undefined}
        style={{ transformOrigin: "50% 0%" }}
        transition={{ duration: 0.45, delay: 0.22, ease: "easeOut" }}
      />
      {!reduced && inView && (
        <motion.div
          className="absolute rounded-full bg-sky-deep"
          style={{ width: 6, height: 6, left: -2, boxShadow: "0 0 7px rgba(56,189,248,0.95)" }}
          animate={{ y: [-3, 26], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.85, delay: 0.5, ease: "linear", repeat: Infinity, repeatDelay: 2 }}
        />
      )}
    </div>
  );
}

/* ─── Individual flow step (sub-component for useRef/useInView) */

function FlowStepNode({
  step, index, isLast, reduced,
}: {
  step: FlowStepData; index: number; isLast: boolean; reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });

  const isSystem = step.variant === "system";
  const isOrigin = step.variant === "origin";
  const isSuccess = step.variant === "success";
  const isCollab = step.variant === "collab";

  const iconStroke = isOrigin
    ? "var(--gold)"
    : isSuccess
    ? "var(--forest)"
    : "var(--sky-deep)";

  const dotRing = isOrigin
    ? "border-gold/55 bg-[rgba(212,168,71,0.1)]"
    : isSuccess
    ? "border-forest/55 bg-[rgba(26,120,80,0.1)]"
    : isSystem
    ? "border-sky-deep/45 bg-sky-deep/8"
    : "border-sky-deep/28 bg-sky-deep/5";

  const dotSize = isSystem || isOrigin || isSuccess ? "h-11 w-11" : "h-[2.6rem] w-[2.6rem]";

  return (
    <div ref={ref}>
      <motion.div
        className="flex items-start gap-3.5"
        initial={reduced ? false : { opacity: 0, x: -18, filter: "blur(4px)" }}
        animate={inView ? { opacity: 1, x: 0, filter: "blur(0px)" } : undefined}
        transition={{ duration: 0.5, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Icon circle */}
        <div className={`relative shrink-0 flex ${dotSize} items-center justify-center rounded-full border-2 transition-all duration-300 ${dotRing}`}>
          {(isOrigin || isSuccess) && !reduced && (
            <motion.span
              className={`pointer-events-none absolute inset-0 rounded-full border-2 ${isSuccess ? "border-forest/40" : "border-gold/40"}`}
              animate={{ scale: [1, 1.6, 1.6], opacity: [0.55, 0, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <svg
            viewBox="0 0 24 24"
            className={isSystem || isOrigin || isSuccess ? "h-5 w-5" : "h-4 w-4"}
            fill="none"
            stroke={iconStroke}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {step.icon}
          </svg>
        </div>

        {/* Content */}
        {isSystem ? (
          <motion.div
            className="mb-0.5 flex-1 rounded-xl border border-sky-deep/20 bg-card/75 px-4 py-3 backdrop-blur-sm transition-colors duration-300 hover:border-sky-deep/40 hover:shadow-[0_4px_18px_rgba(56,189,248,0.1)]"
            whileHover={reduced ? undefined : { y: -2, transition: { duration: 0.2 } }}
          >
            <p className="font-display text-[0.92rem] font-semibold text-ink">{step.title}</p>
            <p className="mt-0.5 font-mono text-[0.59rem] tracking-[0.1em] text-sky-deep/65">{step.sub}</p>
          </motion.div>
        ) : (
          <div className="flex-1 pb-0.5 pt-0.5">
            <p
              className={`text-[0.88rem] font-semibold leading-tight ${
                isOrigin ? "text-gold" : isSuccess ? "text-forest" : "text-ink"
              }`}
            >
              {step.title}
            </p>
            {isCollab ? (
              <p className="mt-0.5 font-mono text-[0.56rem] leading-relaxed tracking-[0.1em] text-sky-deep/65">
                {step.sub}
              </p>
            ) : (
              <p className="mt-0.5 text-[0.75rem] leading-snug text-ink-soft/65">{step.sub}</p>
            )}
          </div>
        )}
      </motion.div>

      {!isLast && <StepConnector inView={inView} reduced={reduced} />}
    </div>
  );
}

/* ─── Validation chip (sub-component for useRef/useInView) ──── */

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

/* ─── Main export ────────────────────────────────────────────── */

export default function EnterpriseFeatureDelivery() {
  const reduced = useReducedMotion();

  return (
    <div aria-label="Enterprise Feature Delivery">

      {/* Section header */}
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

      {/* Two-column layout — flow (left) + story card (right) */}
      <div className="mt-10 grid items-start gap-8 lg:grid-cols-2">

        {/* Left: animated flow diagram */}
        <div>
          <Reveal>
            <p className="eyebrow mb-5">Delivery Flow</p>
          </Reveal>
          {STEPS.map((step, i) => (
            <FlowStepNode
              key={step.id}
              step={step}
              index={i}
              isLast={i === STEPS.length - 1}
              reduced={!!reduced}
            />
          ))}
        </div>

        {/* Right: feature story card (sticky on desktop) */}
        <Reveal delay={0.1}>
          <article className="rounded-2xl border border-sky-deep/22 bg-card/80 p-6 shadow-[0_2px_24px_rgba(56,189,248,0.06)] backdrop-blur-sm transition-all duration-300 hover:border-sky-deep/38 hover:shadow-[0_8px_32px_rgba(56,189,248,0.12)] sm:p-7 lg:sticky lg:top-24">

            <p className="font-mono text-[0.52rem] tracking-[0.32em] text-gold">FEATURE STORY</p>
            <h4 className="mt-1.5 font-display text-[1.15rem] font-semibold tracking-wide text-ink">
              AT&T Service Fee Enhancement
            </h4>

            {/* Impacted systems */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["Charging System", "Mediation Layer", "APIs & Services", "Databases"].map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-sky-deep/25 bg-sky-deep/8 px-2.5 py-0.5 font-mono text-[0.56rem] tracking-wide text-sky-deep"
                >
                  {s}
                </span>
              ))}
            </div>

            {/* Story body */}
            <div className="mt-4 space-y-3 text-[0.82rem] leading-[1.72] text-ink-soft">
              <p>
                During an Agile sprint, AT&T introduced a new requirement to charge customers a
                service fee for specific prepaid transactions.
              </p>
              <p>
                Although the business requirement appeared small, implementing the feature required
                architectural changes across multiple telecom systems — Charging System, Mediation
                Layer, APIs & Services, and Databases.
              </p>
              <p>
                Working closely with Development, Charging System, Systems, and DevOps teams, I
                participated in end-to-end validation to ensure charging accuracy, data integrity,
                seamless integration, and production stability before release.
              </p>
              <p>
                Due to the architectural impact, multiple validation strategies were executed across
                the ecosystem — functional, integration, API, database, performance, stress, sanity,
                and regression testing.
              </p>
              <p>
                The feature was successfully delivered within sprint timelines while supporting
                millions of AT&T prepaid subscribers.
              </p>
            </div>

            {/* Teams */}
            <div className="mt-5 border-t border-line/50 pt-4">
              <p className="mb-2 font-mono text-[0.52rem] tracking-[0.22em] text-ink-soft/50">
                CROSS-TEAM COLLABORATION
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["Development", "Charging System", "Systems Team", "DevOps Team", "QA Team"].map(
                  (t) => (
                    <span
                      key={t}
                      className="rounded-full border border-line bg-paper/80 px-2.5 py-0.5 text-[0.7rem] text-ink-soft"
                    >
                      {t}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Impact metric */}
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-forest/25 bg-forest/8 px-4 py-3">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 shrink-0 text-forest"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <div>
                <p className="font-mono text-[0.52rem] tracking-[0.2em] text-forest/80">
                  PRODUCTION IMPACT
                </p>
                <p className="mt-0.5 text-[0.78rem] font-medium text-ink">
                  Millions of AT&T prepaid subscribers served
                </p>
              </div>
            </div>
          </article>
        </Reveal>
      </div>

      {/* Validation chips */}
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

      {/* Bottom insight */}
      <Reveal className="mt-10">
        <blockquote className="relative rounded-2xl border border-gold/25 bg-[rgba(212,168,71,0.04)] px-7 py-6 text-center backdrop-blur-sm">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-2 select-none font-display text-5xl leading-none text-gold/15"
          >
            "
          </span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-2 right-4 select-none font-display text-5xl leading-none text-gold/15"
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
