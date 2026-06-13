import { Fragment, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { Reveal } from "./ui";

/* ── Types ────────────────────────────────────────────────── */

interface WorkflowNode {
  n: string;
  title: string;
  short: string;
  desc: string;
  details: string[];
  icon: ReactNode;
}

/* ── Data ─────────────────────────────────────────────────── */

const NODES: WorkflowNode[] = [
  {
    n: "01",
    title: "New Product Introduction",
    short: "NPI",
    desc: "New products often introduce unknown integration challenges as software and firmware are brought together for the first time.",
    details: [
      "Initial bring-up activities",
      "Requirement analysis",
      "Environment preparation",
      "Cross-functional collaboration",
    ],
    icon: (
      <g>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </g>
    ),
  },
  {
    n: "02",
    title: "Integration Validation",
    short: "Integration",
    desc: "Firmware compatibility is often one of the major integration challenges during early development. Validate interactions between software, firmware, and system components to ensure stable operation.",
    details: [
      "Firmware compatibility validation",
      "Configuration checks",
      "Environment setup",
      "Early defect detection",
    ],
    icon: (
      <g>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </g>
    ),
  },
  {
    n: "03",
    title: "Developer Collaboration",
    short: "Collab",
    desc: "Leverage prior QA experience and collaborate closely with development teams to reproduce issues, provide actionable feedback, and verify fixes.",
    details: [
      "Defect triage",
      "Root cause analysis",
      "Continuous feedback",
      "Regression verification",
    ],
    icon: (
      <g>
        <line x1="6" y1="3" x2="6" y2="15" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="M18 9a9 9 0 0 1-9 9" />
      </g>
    ),
  },
  {
    n: "04",
    title: "System Validation",
    short: "System",
    desc: "Perform end-to-end system validation to ensure reliability, connectivity, and expected behavior across integrated components.",
    details: [
      "Workflow validation",
      "Connectivity testing",
      "Cross-component verification",
      "Stability testing",
    ],
    icon: (
      <g>
        <rect x="4" y="4" width="16" height="7" rx="1.5" />
        <rect x="4" y="13" width="16" height="7" rx="1.5" />
        <path d="M7.5 7.5h.01M7.5 16.5h.01M12 7.5h4M12 16.5h4" />
      </g>
    ),
  },
  {
    n: "05",
    title: "User Acceptance Testing",
    short: "UAT",
    desc: "Validate customer workflows and real-world scenarios to ensure business expectations are met.",
    details: [
      "Customer scenarios",
      "Acceptance criteria",
      "Business workflows",
      "Release confidence",
    ],
    icon: (
      <g>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M3 20c0-3.5 2.5-6 6-6s6 2.5 6 6" />
        <circle cx="17" cy="8" r="2.5" />
        <path d="M21 20c0-2.5-1.8-4.5-4-4.5" />
      </g>
    ),
  },
  {
    n: "06",
    title: "Functional Testing",
    short: "Functional",
    desc: "Verify features and requirements across multiple configurations to ensure consistent behavior.",
    details: [
      "Feature validation",
      "Regression testing",
      "Requirement verification",
      "Compatibility testing",
    ],
    icon: (
      <g>
        <circle cx="12" cy="12" r="9" />
        <path d="M8.5 12l2.5 2.5 4.5-5" />
      </g>
    ),
  },
  {
    n: "07",
    title: "Product Stabilization",
    short: "Stabilize",
    desc: "Gather feedback and continuously improve usability, workflows, and overall product quality before release.",
    details: [
      "UI improvements",
      "Workflow optimization",
      "Quality enhancements",
      "Customer feedback incorporation",
    ],
    icon: (
      <g>
        <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
      </g>
    ),
  },
  {
    n: "08",
    title: "Release Readiness",
    short: "Release",
    desc: "Approve release only after all quality gates, validations, and production criteria have been successfully met.",
    details: [
      "Final verification",
      "Production readiness",
      "Risk assessment",
      "Release sign-off",
    ],
    icon: (
      <g>
        <path d="M12 2.5l7.5 3v6.2c0 4.7-3.2 8-7.5 9.3-4.3-1.3-7.5-4.6-7.5-9.3V5.5z" />
        <path d="M9 12l2 2 4-4" />
      </g>
    ),
  },
];

const TECH_BADGES = [
  "Python",
  "REST APIs",
  "EWS Validation",
  "Automation",
  "Firmware Validation",
  "System Testing",
  "Integration Testing",
  "QA Engineering",
  "Root Cause Analysis",
];

const AUTO_FLOW = [
  "Python Automation",
  "Configuration",
  "API / EWS Access",
  "Validation",
  "Analysis",
  "Quality Feedback",
];

/* ── Small helpers ────────────────────────────────────────── */

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true">
      <path
        d="M16 4c-6 0-10 2.5-11.2 8.4-.3 1.7.3 3.2.9 3.8.9-2.6 3.2-6 7.3-8.3-2.9 2.7-5.2 5.9-6.1 8.8C12 16.4 16 12 16 4z"
        fill="var(--gold)"
      />
    </svg>
  );
}

function TechBadge({ text, delay }: { text: string; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();

  return (
    <motion.span
      ref={ref}
      initial={reduced ? false : { opacity: 0, scale: 0.82, y: 6 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : undefined}
      transition={{ duration: 0.38, delay, ease: "easeOut" }}
      className="rounded-full border border-sky-deep/28 bg-sky-deep/[0.06] px-3 py-1 font-mono text-[0.62rem] tracking-wider text-sky-deep"
    >
      {text}
    </motion.span>
  );
}

/* ── Desktop detail card (shown below the node row) ─────── */

function DetailCard({
  node,
  onClose,
  reduced,
}: {
  node: WorkflowNode;
  onClose: () => void;
  reduced: boolean;
}) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={reduced ? undefined : { opacity: 0, y: 10, filter: "blur(3px)" }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      className="mt-8 rounded-2xl border border-sky-deep/35 bg-[rgba(56,189,248,0.055)] p-6 shadow-[0_8px_32px_rgba(56,189,248,0.14)] backdrop-blur-[4px]"
      role="region"
      aria-label={`${node.title} details`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <span className="font-mono text-[0.55rem] tracking-[0.3em] text-sky-deep">
            STAGE {node.n}
          </span>
          <h4 className="mt-0.5 font-display text-[1.1rem] font-semibold tracking-wide text-ink">
            {node.title}
          </h4>
          <p className="mt-2 max-w-xl text-[0.83rem] leading-[1.7] text-ink-soft">{node.desc}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-0.5 shrink-0 rounded-full p-1.5 text-ink-soft transition-colors hover:bg-line/50 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-deep"
          aria-label="Close detail panel"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <ul
        className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4"
        aria-label={`${node.title} activities`}
      >
        {node.details.map((d) => (
          <li key={d} className="flex items-start gap-2 text-[0.78rem] leading-[1.55] text-ink-soft">
            <Check />
            {d}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ── Mobile accordion step ────────────────────────────────── */

function MobileStep({
  node,
  index,
  isActive,
  onToggle,
  reduced,
}: {
  node: WorkflowNode;
  index: number;
  isActive: boolean;
  onToggle: () => void;
  reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="flex items-start gap-4"
      initial={reduced ? false : { opacity: 0, x: -22, filter: "blur(7px)" }}
      animate={inView ? { opacity: 1, x: 0, filter: "blur(0px)" } : undefined}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Icon node — decorative */}
      <div
        aria-hidden="true"
        className={`relative z-10 mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
          isActive
            ? "border-sky-deep bg-sky-deep/15 shadow-[0_0_0_5px_rgba(56,189,248,0.12),0_0_22px_rgba(56,189,248,0.38)]"
            : "border-line bg-card"
        }`}
      >
        {isActive && !reduced && (
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-full border-2 border-sky-deep/60"
            animate={{ scale: [1, 1.65, 1.65], opacity: [0.65, 0, 0] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 transition-colors duration-300"
          fill="none"
          stroke={isActive ? "var(--sky-deep)" : "var(--ink-soft)"}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {node.icon}
        </svg>
      </div>

      {/* Accordion card */}
      <div
        className={`mb-3 flex-1 overflow-hidden rounded-2xl border backdrop-blur-[4px] transition-all duration-300 ${
          isActive
            ? "border-sky-deep/40 bg-[rgba(56,189,248,0.06)] shadow-[0_8px_32px_rgba(56,189,248,0.16)]"
            : "border-line bg-card/80 hover:border-sky-deep/25 hover:shadow-[0_4px_14px_rgba(46,58,48,0.07)]"
        }`}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isActive}
          aria-label={`${isActive ? "Collapse" : "Expand"} ${node.title}`}
          className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-deep focus-visible:ring-offset-2"
        >
          <div>
            <span className="block font-mono text-[0.55rem] tracking-[0.3em] text-sky-deep">
              STAGE {node.n}
            </span>
            <h4 className="mt-0.5 font-display text-[0.97rem] font-semibold leading-snug tracking-wide text-ink">
              {node.title}
            </h4>
          </div>
          <motion.svg
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: reduced ? 0 : 0.25, ease: "easeOut" }}
            viewBox="0 0 24 24"
            className="h-4 w-4 shrink-0 text-ink-soft"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </motion.svg>
        </button>

        <motion.div
          initial={false}
          animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 0.3, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="border-t border-line px-4 pb-4 pt-3">
            <p className="text-[0.82rem] leading-[1.65] text-ink-soft">{node.desc}</p>
            <ul className="mt-3 space-y-1.5">
              {node.details.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-2 text-[0.78rem] leading-[1.55] text-ink-soft"
                >
                  <Check />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ── Main export ──────────────────────────────────────────── */

export default function ValidationWorkflow() {
  const [active, setActive] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 45, damping: 14, mass: 0.5 });

  function toggle(i: number) {
    setActive((prev) => (prev === i ? null : i));
  }

  /* Shared class for the vertical mobile connector */
  const VCONN = "pointer-events-none absolute bottom-4 left-[1.3rem] top-[2.75rem] w-px";

  return (
    <div ref={containerRef} className="mt-16" aria-label="Validation workflow">

      {/* ── Header ───────────────────────────────────────── */}
      <Reveal>
        <p className="eyebrow mb-3 text-center">NPI &amp; Product Validation · Cal-Comp Electronics</p>
        <h3 className="section-title text-center font-display font-semibold leading-[1.18] tracking-wide text-ink">
          Validation Workflow
        </h3>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[0.84rem] leading-[1.7] text-ink-soft">
          Ensuring reliability, compatibility, and release readiness through validation, automation,
          and collaboration.
        </p>
      </Reveal>

      {/* ── Desktop horizontal journey ────────────────────
          8 nodes in a grid-cols-8 row; single connector line
          spans from center of col-0 to center of col-7 via
          inset-x-[calc(100%/16)] (= 6.25% each side).       */}
      <div className="mt-10 hidden lg:block" aria-label="NPI validation stages — click a stage to expand">
        <div className="relative">

          {/* Horizontal connector */}
          <div
            aria-hidden="true"
            className="absolute inset-x-[calc(100%/16)] top-[1.375rem] h-px"
          >
            {/* Ghost track */}
            <div className="absolute inset-0 bg-line/55" />
            {/* Scroll-driven live drawing */}
            {!reduced && (
              <motion.div
                className="absolute inset-y-0 left-0 bg-sky-deep"
                style={{
                  scaleX: progress,
                  transformOrigin: "0% 50%",
                  boxShadow: "0 0 7px rgba(56,189,248,0.75)",
                }}
              />
            )}
            {/* Left-to-right particles */}
            {!reduced && [0, 1, 2].map((i) => (
              <span
                key={i}
                className="migrate-dot absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-sky-deep"
                style={{
                  animationDelay: `${i * 1.27}s`,
                  animationDuration: "3.8s",
                  boxShadow: "0 0 6px rgba(56,189,248,0.9)",
                }}
              />
            ))}
          </div>

          {/* 8-column node grid */}
          <div className="relative z-10 grid grid-cols-8" role="group" aria-label="Validation stages">
            {NODES.map((node, i) => {
              const isActive = active === i;
              return (
                <motion.div
                  key={node.n}
                  className="flex flex-col items-center gap-2.5"
                  initial={reduced ? false : { opacity: 0, y: 20, filter: "blur(5px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.55, delay: i * 0.065, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Node button */}
                  <div className="relative">
                    {isActive && !reduced && (
                      <motion.span
                        className="pointer-events-none absolute inset-0 rounded-full border-2 border-sky-deep/55"
                        animate={{ scale: [1, 1.75, 1.75], opacity: [0.65, 0, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      aria-expanded={isActive}
                      aria-label={`${isActive ? "Collapse" : "Expand"} ${node.title}`}
                      className={`flex h-11 w-11 items-center justify-center rounded-full border-2 bg-card transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-deep focus-visible:ring-offset-2 ${
                        isActive
                          ? "border-sky-deep bg-sky-deep/15 shadow-[0_0_0_4px_rgba(56,189,248,0.12),0_0_20px_rgba(56,189,248,0.38)]"
                          : "border-line hover:border-sky-deep/50 hover:bg-sky-deep/5 hover:shadow-[0_0_14px_rgba(56,189,248,0.18)]"
                      }`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5 transition-colors duration-200"
                        fill="none"
                        stroke={isActive ? "var(--sky-deep)" : "var(--ink-soft)"}
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {node.icon}
                      </svg>
                    </button>
                  </div>

                  {/* Short label */}
                  <span
                    className={`max-w-[72px] text-center font-mono text-[0.52rem] leading-tight tracking-[0.12em] transition-colors duration-200 ${
                      isActive ? "text-sky-deep" : "text-ink-soft"
                    }`}
                  >
                    {node.short}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Expanding detail card — AnimatePresence for exit animation */}
          <AnimatePresence mode="wait">
            {active !== null && (
              <DetailCard
                key={active}
                node={NODES[active]}
                onClose={() => setActive(null)}
                reduced={!!reduced}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Mobile vertical layout ────────────────────────── */}
      <div className="relative mx-auto mt-10 max-w-xl lg:hidden">
        {/* Ghost connector */}
        <div aria-hidden="true" className={`${VCONN} bg-line/50`} />
        {/* Live connector */}
        {!reduced && (
          <motion.div
            aria-hidden="true"
            className={`${VCONN} bg-sky-deep`}
            style={{
              scaleY: progress,
              transformOrigin: "50% 0%",
              boxShadow: "0 0 7px rgba(56,189,248,0.75)",
            }}
          />
        )}
        {/* Top-to-bottom particles */}
        {!reduced && (
          <div aria-hidden="true" className={VCONN}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="flow-dot absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-sky-deep"
                style={{
                  animationDelay: `${i * 0.9}s`,
                  animationDuration: "3.8s",
                  boxShadow: "0 0 6px rgba(56,189,248,0.85)",
                }}
              />
            ))}
          </div>
        )}

        {/* Steps */}
        <div className="relative">
          {NODES.map((node, i) => (
            <MobileStep
              key={node.n}
              node={node}
              index={i}
              isActive={active === i}
              onToggle={() => toggle(i)}
              reduced={!!reduced}
            />
          ))}
        </div>
      </div>

      {/* ── Technical Automation Panel ─────────────────────── */}
      <Reveal className="mt-14">
        <div className="rounded-2xl border border-line bg-card/80 p-6 shadow-[0_2px_10px_rgba(46,58,48,0.05)] backdrop-blur-sm sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto]">

            {/* Left: title + description + badges */}
            <div>
              <p className="eyebrow mb-2">Automation Stack</p>
              <h4 className="font-display text-xl font-semibold tracking-wide text-ink">
                Automation &amp; Validation Technologies
              </h4>
              <p className="mt-3 max-w-xl text-[0.83rem] leading-[1.7] text-ink-soft">
                Python-based automation tools are used to configure environments, update settings,
                validate system behavior, and automate repetitive workflows. APIs and web interfaces
                are leveraged for validation, verification, and efficient quality feedback cycles.
              </p>
              <div className="mt-5 flex flex-wrap gap-2" aria-label="Technologies used">
                {TECH_BADGES.map((badge, i) => (
                  <TechBadge key={badge} text={badge} delay={i * 0.04} />
                ))}
              </div>
            </div>

            {/* Right: automation flow pipeline */}
            <div className="flex flex-col justify-center gap-2 lg:min-w-[200px]">
              <p className="font-mono text-[0.56rem] tracking-[0.24em] text-gold">
                AUTOMATION FLOW
              </p>
              {AUTO_FLOW.map((step, i) => (
                <Fragment key={step}>
                  <span className="rounded-full border border-sky-deep/28 bg-sky-deep/[0.06] px-3 py-1 text-center font-mono text-[0.6rem] tracking-wider text-sky-deep">
                    {step}
                  </span>
                  {i < AUTO_FLOW.length - 1 && (
                    <svg
                      viewBox="0 0 10 12"
                      className="mx-auto h-3 w-2.5 shrink-0 text-sky-deep/45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 0v8M2 6l3 3 3-3" />
                    </svg>
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
