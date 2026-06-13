import React, { Fragment, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { Reveal } from "./ui";

/* ── Types ─────────────────────────────────────────────────── */

type Variant = "stakeholder" | "team" | "center" | "feature" | "system" | "validation";

interface EcoNode {
  id: string;
  title: string;
  abbr: string;
  desc: string;
  descParas?: string[];
  details: string[];
  variant: Variant;
  icon: ReactNode;
}

/* ── SVG path & node coordinate data ───────────────────────── */

/* All coordinates are in a 1000 × 600 viewBox. CSS % = coord/max*100. */

const NODE_POS: Record<string, { cx: number; cy: number }> = {
  po:  { cx: 500, cy:  45 },
  dev: { cx: 160, cy: 185 },
  qa:  { cx: 500, cy: 185 },
  sys: { cx: 840, cy: 185 },
  sff: { cx: 500, cy: 345 },
  api: { cx: 100, cy: 475 },
  mw:  { cx: 360, cy: 475 },
  ch:  { cx: 640, cy: 475 },
  db:  { cx: 900, cy: 475 },
  val: { cx: 500, cy: 565 },
};

const PATHS = [
  { id: "po-qa",    d: "M500,67 L500,157",                               delay: 0.0, dur: "2.4s" },
  { id: "qa-dev",   d: "M472,185 L182,185",                              delay: 0.1, dur: "2.2s" },
  { id: "qa-sys",   d: "M528,185 L818,185",                              delay: 0.1, dur: "2.2s" },
  { id: "feedback", d: "M160,207 C160,260 840,260 840,207",              delay: 0.2, dur: "4.5s" },
  { id: "dev-sff",  d: "M162,204 C166,275 462,320 480,345",              delay: 0.3, dur: "2.8s" },
  { id: "qa-sff",   d: "M500,213 L500,320",                              delay: 0.3, dur: "2.4s" },
  { id: "sys-sff",  d: "M838,204 C834,275 538,320 520,345",              delay: 0.3, dur: "2.8s" },
  { id: "sff-api",  d: "M472,358 C444,408 124,450 118,475",              delay: 0.5, dur: "3.0s" },
  { id: "sff-mw",   d: "M488,359 C480,408 362,450 358,475",              delay: 0.5, dur: "2.6s" },
  { id: "sff-ch",   d: "M512,359 C520,408 638,450 642,475",              delay: 0.5, dur: "2.6s" },
  { id: "sff-db",   d: "M528,358 C556,408 876,450 882,475",              delay: 0.5, dur: "3.0s" },
  { id: "api-val",  d: "M116,497 C112,535 458,550 478,565",              delay: 0.7, dur: "3.2s" },
  { id: "mw-val",   d: "M358,497 C355,535 465,550 490,565",              delay: 0.7, dur: "2.8s" },
  { id: "ch-val",   d: "M642,497 C645,535 535,550 510,565",              delay: 0.7, dur: "2.8s" },
  { id: "db-val",   d: "M884,497 C888,535 542,550 522,565",              delay: 0.7, dur: "3.2s" },
];

/* Horizontal transaction chain — API → MW → CH → DB (gold, active when SFF selected) */
const FEATURE_FLOW_PATHS = [
  { id: "ff-api-mw", d: "M118,475 L342,475", dur: "1.1s", delay: 0.0 },
  { id: "ff-mw-ch",  d: "M378,475 L622,475", dur: "1.1s", delay: 0.35 },
  { id: "ff-ch-db",  d: "M658,475 L882,475", dur: "1.1s", delay: 0.70 },
];

/* ── Node definitions ───────────────────────────────────────── */

const NODES: EcoNode[] = [
  {
    id: "po", abbr: "Product Owner",
    title: "Product Owner",
    desc: "Business requirements and feature prioritization driving sprint goals and delivery scope.",
    details: ["Requirements clarification", "Sprint planning", "Business alignment", "Feature prioritization"],
    variant: "stakeholder",
    icon: <g><circle cx="12" cy="8" r="4"/><path d="M6 20c0-4 2.5-7 6-7s6 3 6 7"/><path d="M9 5l3-3 3 3" strokeLinejoin="round"/></g>,
  },
  {
    id: "dev", abbr: "Dev Team",
    title: "Development Team",
    desc: "Feature implementation, defect resolution, and enhancement support across the delivery cycle.",
    details: ["Feature implementation", "Defect fixes", "Code reviews", "Enhancement support"],
    variant: "team",
    icon: <g><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></g>,
  },
  {
    id: "qa", abbr: "QA Engineer",
    title: "QA Engineer",
    desc: "Acted as the quality gate between development and production by validating enterprise features, identifying integration issues, verifying fixes, and ensuring release readiness.",
    details: [
      "Integration testing",
      "System testing",
      "User acceptance testing",
      "Functional testing",
      "Regression testing",
      "Root cause analysis",
    ],
    variant: "center",
    icon: <g><path d="M12 2.5l7.5 3v6.2c0 4.7-3.2 8-7.5 9.3-4.3-1.3-7.5-4.6-7.5-9.3V5.5z"/><path d="M9 12l2 2 4-4"/></g>,
  },
  {
    id: "sys", abbr: "System Team",
    title: "System Team",
    desc: "Environment readiness, deployment coordination, and infrastructure validation before release.",
    details: ["Environment readiness", "Deployment support", "Infrastructure validation", "Release preparation"],
    variant: "team",
    icon: <g><rect x="4" y="4" width="16" height="7" rx="1.5"/><rect x="4" y="13" width="16" height="7" rx="1.5"/><path d="M7.5 7.5h.01M7.5 16.5h.01M12 7.5h4M12 16.5h4"/></g>,
  },
  {
    id: "sff", abbr: "Service Fee Feature",
    title: "Service Fee Feature Delivery",
    desc: "A new business requirement introduced a transaction service fee during customer top-up operations, automatically deducted as part of the transaction flow across multiple enterprise systems.",
    descParas: [
      "A new business requirement introduced a transaction service fee during customer top-up operations, where a predefined fee would be automatically deducted as part of the transaction flow.",
      "Implementing this feature required coordinated updates across multiple enterprise systems — APIs, charging services, middleware components, and databases — to ensure consistent transaction processing.",
      "As part of the Agile delivery team, collaborated closely with Development, Testing, and Systems teams to analyze impacts, validate integrations, and ensure seamless end-to-end workflows.",
      "Performed integration testing to verify that transactions propagated correctly across systems, service fees were applied according to business rules, and transaction data remained synchronized throughout the ecosystem.",
      "Validated API behavior, database updates, and cross-system interactions to ensure backward compatibility and prevent unintended impacts on existing services.",
      "Executed system testing, functional testing, user acceptance testing (UAT), and regression testing to verify feature correctness across multiple scenarios.",
      "Worked with development teams to investigate defects, validate fixes, and continuously improve feature stability until production readiness was achieved.",
      "Successfully delivered the feature with reliability, stability, and customer experience as key priorities.",
    ],
    details: [
      "Business rule validation",
      "Transaction flow verification",
      "API testing & validation",
      "Database consistency checks",
      "Integration testing",
      "System testing",
      "Functional testing",
      "UAT",
      "Regression testing",
      "Defect investigation",
      "Root cause analysis",
      "Production readiness",
    ],
    variant: "feature",
    icon: <g><path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z"/></g>,
  },
  {
    id: "api", abbr: "API Layer",
    title: "API Layer",
    desc: "Request validation, interface verification, and service compatibility across all integration points.",
    details: ["Request validation", "Interface verification", "Service compatibility", "API testing"],
    variant: "system",
    icon: <g><path d="M8 6l-4 4 4 4M16 6l4 4-4 4M12 2v20" strokeWidth="1.6"/></g>,
  },
  {
    id: "mw", abbr: "Middleware",
    title: "Middleware",
    desc: "Data transformation, message orchestration, and service communication across distributed components.",
    details: ["Data transformation", "Message orchestration", "Service communication", "Integration flow"],
    variant: "system",
    icon: <g><path d="M8 3l4 4-4 4"/><path d="M16 21l-4-4 4-4"/><line x1="3" y1="7" x2="20" y2="7"/><line x1="4" y1="17" x2="21" y2="17"/></g>,
  },
  {
    id: "ch", abbr: "Charging System",
    title: "Charging System",
    desc: "Transaction processing, service fee business rules, and validation of charge calculations.",
    details: ["Transaction processing", "Business rules", "Service fee logic", "Validation checks"],
    variant: "system",
    icon: <g><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></g>,
  },
  {
    id: "db", abbr: "Database",
    title: "Database",
    desc: "Data integrity, transaction consistency, backward compatibility, and persistence validation.",
    details: ["Data integrity", "Transaction consistency", "Backward compatibility", "Persistence validation"],
    variant: "system",
    icon: <g><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/></g>,
  },
  {
    id: "val", abbr: "Validation & Release",
    title: "Validation & Release",
    desc: "Final quality gate — production release approved only after all validation criteria are met.",
    details: [
      "Integration Testing",
      "System Testing",
      "Functional Testing",
      "User Acceptance Testing",
      "Regression Testing",
      "Production Validation",
    ],
    variant: "validation",
    icon: <g><circle cx="12" cy="12" r="9"/><path d="M8.5 12l2.5 2.5 4.5-5"/></g>,
  },
];

const TECH_BADGES = [
  "REST APIs", "SQL", "Agile", "Integration Testing", "System Testing",
  "Functional Testing", "UAT", "Regression Testing", "Enterprise Systems",
  "Production Support", "Telecom", "Quality Engineering",
];

const HIGHLIGHTS = [
  { title: "Enterprise Feature Delivery", icon: <g><path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z"/></g> },
  { title: "Cross-System Validation", icon: <g><rect x="4" y="4" width="16" height="7" rx="1.5"/><rect x="4" y="13" width="16" height="7" rx="1.5"/><path d="M7.5 7.5h.01M7.5 16.5h.01"/></g> },
  { title: "Agile Collaboration", icon: <g><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></g> },
  { title: "Production Readiness", icon: <g><path d="M12 2.5l7.5 3v6.2c0 4.7-3.2 8-7.5 9.3-4.3-1.3-7.5-4.6-7.5-9.3V5.5z"/><path d="M9 12l2 2 4-4"/></g> },
  { title: "Defect Investigation", icon: <g><circle cx="10.5" cy="10.5" r="6"/><path d="M14.5 14.5L20 20"/></g> },
  { title: "Quality Assurance", icon: <g><circle cx="12" cy="12" r="9"/><path d="M8.5 12l2.5 2.5 4.5-5"/></g> },
];

/* ── Small helpers ─────────────────────────────────────────── */

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true">
      <path d="M16 4c-6 0-10 2.5-11.2 8.4-.3 1.7.3 3.2.9 3.8.9-2.6 3.2-6 7.3-8.3-2.9 2.7-5.2 5.9-6.1 8.8C12 16.4 16 12 16 4z" fill="var(--gold)" />
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
      initial={reduced ? false : { opacity: 0, scale: 0.84, y: 5 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : undefined}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      className="rounded-full border border-green/30 bg-card px-3 py-1 font-mono text-[0.62rem] tracking-wide text-ink-soft transition-colors duration-300 hover:border-green-light/60 hover:bg-green-light/30 hover:text-ink"
    >
      {text}
    </motion.span>
  );
}

/* Staggered checklist item for Validation & Release */
function ChecklistItem({ text, delay }: { text: string; delay: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  return (
    <motion.li
      ref={ref}
      className="flex items-center gap-2 text-[0.8rem] text-ink-soft"
      initial={reduced ? false : { opacity: 0, x: -12 }}
      animate={inView ? { opacity: 1, x: 0 } : undefined}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-forest" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 8l4 4 8-8" />
      </svg>
      {text}
    </motion.li>
  );
}

/* ── Desktop network SVG overlay ───────────────────────────── */

function NetworkSVG({ reduced, sffActive }: { reduced: boolean; sffActive: boolean }) {
  return (
    <svg
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="eco-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="gold-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="4.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {PATHS.map((p, i) => (
        <Fragment key={p.id}>
          <path d={p.d} stroke="var(--sky-deep)" strokeWidth="1" opacity="0.12" strokeLinecap="round" />
          <motion.path
            d={p.d}
            stroke="var(--sky-deep)"
            strokeWidth="1.4"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.55 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, delay: p.delay + i * 0.01 }}
          />
          {!reduced && (
            <circle r="3.5" fill="var(--sky-deep)" filter="url(#eco-glow)">
              <animateMotion dur={p.dur} repeatCount="indefinite" path={p.d} />
            </circle>
          )}
        </Fragment>
      ))}

      {/* Transaction chain — lights up gold when Service Fee Feature is active */}
      {FEATURE_FLOW_PATHS.map((p) => (
        <Fragment key={p.id}>
          <path d={p.d} stroke="var(--gold)" strokeWidth="1" opacity="0.12" strokeLinecap="round" strokeDasharray="4 4" />
          <motion.path
            d={p.d}
            stroke="var(--gold)"
            strokeWidth="2.4"
            strokeLinecap="round"
            animate={sffActive ? { opacity: 0.82, pathLength: 1 } : { opacity: 0, pathLength: 0 }}
            transition={{ duration: 0.6, delay: sffActive ? p.delay : 0, ease: "easeOut" }}
          />
          {!reduced && sffActive && (
            <circle r="4.5" fill="var(--gold)" filter="url(#gold-glow)">
              <animateMotion dur={p.dur} begin={`${p.delay}s`} repeatCount="indefinite" path={p.d} />
            </circle>
          )}
        </Fragment>
      ))}
    </svg>
  );
}

/* ── Desktop: individual node button ───────────────────────── */

function DesktopNode({
  node, cx, cy, isActive, onToggle, reduced,
}: {
  node: EcoNode; cx: number; cy: number;
  isActive: boolean; onToggle: () => void; reduced: boolean;
}) {
  const isQA = node.variant === "center";
  const isFeature = node.variant === "feature";
  const isVal = node.variant === "validation";
  const isTeam = node.variant === "team";

  const size = isQA ? "h-14 w-14" : isFeature || isVal ? "h-12 w-12" : "h-11 w-11";
  const iconSize = isQA ? "h-7 w-7" : "h-5 w-5";

  const borderCls = isActive
    ? "border-sky-deep bg-sky-deep/18 shadow-[0_0_0_4px_rgba(56,189,248,0.14),0_0_24px_rgba(56,189,248,0.45)]"
    : isQA
    ? "border-sky-deep bg-sky-deep/15 shadow-[0_0_20px_rgba(56,189,248,0.32)]"
    : isFeature
    ? "border-gold/55 bg-gold/8 hover:border-gold/80 hover:shadow-[0_0_14px_rgba(212,168,71,0.25)]"
    : isVal
    ? "border-forest/55 bg-forest/8 hover:border-forest/80 hover:shadow-[0_0_14px_rgba(26,120,80,0.25)]"
    : isTeam
    ? "border-sky-deep/40 bg-sky-deep/5 hover:border-sky-deep/70 hover:shadow-[0_0_14px_rgba(56,189,248,0.2)]"
    : "border-line bg-card hover:border-sky-deep/40 hover:shadow-[0_0_14px_rgba(56,189,248,0.18)]";

  const strokeColor = isActive || isQA
    ? "var(--sky-deep)"
    : isFeature ? "var(--gold)"
    : isVal ? "var(--forest)"
    : "var(--ink-soft)";

  const labelColor = isActive || isQA
    ? "text-sky-deep"
    : isFeature ? "text-gold"
    : isVal ? "text-forest"
    : "text-ink-soft/70";

  return (
    <div
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${(cx / 1000) * 100}%`, top: `${(cy / 600) * 100}%` }}
    >
      {/* QA halo pulse */}
      {isQA && !reduced && (
        <motion.div
          className="pointer-events-none absolute rounded-full"
          style={{ inset: "-10px" }}
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(56,189,248,0.55)",
              "0 0 0 18px rgba(56,189,248,0)",
            ],
          }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
      )}
      {/* Active pulse ring */}
      {isActive && !reduced && (
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-full border-2 border-sky-deep/50"
          animate={{ scale: [1, 1.7, 1.7], opacity: [0.6, 0, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isActive}
        aria-label={`${isActive ? "Collapse" : "Expand"} ${node.title}`}
        className={`relative flex ${size} items-center justify-center rounded-full border-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-deep focus-visible:ring-offset-2 ${borderCls}`}
      >
        <svg
          viewBox="0 0 24 24"
          className={`${iconSize} transition-colors duration-200`}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {node.icon}
        </svg>
      </button>

      <p className={`mt-1.5 max-w-[78px] text-center font-mono text-[0.48rem] leading-[1.3] tracking-[0.1em] transition-colors duration-200 ${labelColor}`}>
        {node.abbr}
      </p>
    </div>
  );
}

/* ── Desktop: detail card (floating, positioned near node) ─── */

function DetailCard({
  node, onClose,
}: {
  node: EcoNode; onClose: () => void; reduced: boolean;
}) {
  const isVal = node.variant === "validation";
  const borderCls = node.variant === "feature"
    ? "border-gold/35"
    : node.variant === "validation"
    ? "border-forest/35"
    : "border-sky-deep/35";

  const shadow = node.variant === "feature"
    ? "shadow-[0_8px_32px_rgba(212,168,71,0.18)]"
    : node.variant === "validation"
    ? "shadow-[0_8px_32px_rgba(26,120,80,0.18)]"
    : "shadow-[0_8px_32px_rgba(56,189,248,0.2)]";

  return (
    <div
      className={`rounded-2xl border bg-paper/95 p-5 backdrop-blur-md ${borderCls} ${shadow}`}
      role="region"
      aria-label={`${node.title} details`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[0.55rem] tracking-[0.3em] text-sky-deep">{node.variant.toUpperCase()}</p>
          <h4 className="mt-0.5 font-display text-[1.1rem] font-semibold tracking-wide text-ink">{node.title}</h4>
          {node.descParas ? (
            <div className="relative mt-2">
              <div className="max-h-[148px] space-y-2 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-line/60">
                {node.descParas.map((para, i) => (
                  <p key={i} className="text-[0.79rem] leading-[1.65] text-ink-soft">{para}</p>
                ))}
              </div>
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-paper/95 to-transparent" />
            </div>
          ) : (
            <p className="mt-2 text-[0.83rem] leading-[1.72] text-ink-soft">{node.desc}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-0.5 shrink-0 rounded-full p-1.5 text-ink-soft transition-colors hover:bg-line/50 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-deep"
          aria-label="Close detail panel"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {isVal ? (
        <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
          {node.details.map((d, i) => (
            <ChecklistItem key={d} text={d} delay={i * 0.08} />
          ))}
        </ul>
      ) : (
        <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-4">
          {node.details.map((d) => (
            <li key={d} className="flex items-start gap-2 text-[0.78rem] leading-[1.55] text-ink-soft">
              <Check />
              {d}
            </li>
          ))}
        </ul>
      )}

      {/* Success badge — shown only for the Service Fee Feature node */}
      {node.id === "sff" && (
        <motion.div
          className="mt-4 flex items-center gap-2 self-start rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 8l4 4 8-8" />
          </svg>
          <span className="font-mono text-[0.58rem] tracking-[0.18em] text-gold">ALL SYSTEMS VALIDATED</span>
        </motion.div>
      )}
    </div>
  );
}

/* ── Mobile accordion card ──────────────────────────────────── */

function MobileCard({
  node, index, isActive, onToggle, reduced,
}: {
  node: EcoNode; index: number;
  isActive: boolean; onToggle: () => void; reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isQA = node.variant === "center";
  const isFeature = node.variant === "feature";
  const isVal = node.variant === "validation";

  const nodeColor = isActive || isQA
    ? "border-sky-deep bg-sky-deep/15 shadow-[0_0_0_5px_rgba(56,189,248,0.1),0_0_22px_rgba(56,189,248,0.38)]"
    : isFeature
    ? "border-gold/50 bg-gold/8"
    : isVal
    ? "border-forest/50 bg-forest/8"
    : "border-line bg-card";

  return (
    <motion.div
      ref={ref}
      className="flex items-start gap-4"
      initial={reduced ? false : { opacity: 0, x: -22, filter: "blur(7px)" }}
      animate={inView ? { opacity: 1, x: 0, filter: "blur(0px)" } : undefined}
      transition={{ duration: 0.6, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Icon */}
      <div
        aria-hidden="true"
        className={`relative z-10 mt-1 flex ${isQA ? "h-14 w-14" : "h-11 w-11"} shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${nodeColor}`}
      >
        {isQA && !reduced && (
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-full border-2 border-sky-deep/55"
            animate={{ scale: [1, 1.6, 1.6], opacity: [0.65, 0, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        {isActive && !isQA && !reduced && (
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-full border-2 border-sky-deep/55"
            animate={{ scale: [1, 1.65, 1.65], opacity: [0.65, 0, 0] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <svg
          viewBox="0 0 24 24"
          className={`${isQA ? "h-7 w-7" : "h-5 w-5"} transition-colors duration-300`}
          fill="none"
          stroke={isActive || isQA ? "var(--sky-deep)" : isFeature ? "var(--gold)" : isVal ? "var(--forest)" : "var(--ink-soft)"}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {node.icon}
        </svg>
      </div>

      {/* Card */}
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
            <span className={`block font-mono text-[0.55rem] tracking-[0.28em] ${
              isQA ? "text-sky-deep" : isFeature ? "text-gold" : isVal ? "text-forest" : "text-sky-deep"
            }`}>
              {node.variant.toUpperCase()}
            </span>
            <h4 className="mt-0.5 font-display text-[0.97rem] font-semibold leading-snug tracking-wide text-ink">
              {node.title}
            </h4>
          </div>
          <motion.svg
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: reduced ? 0 : 0.25, ease: "easeOut" }}
            viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"
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
            {node.descParas ? (
              <div className="space-y-2">
                {node.descParas.map((para, i) => (
                  <p key={i} className="text-[0.79rem] leading-[1.65] text-ink-soft">{para}</p>
                ))}
              </div>
            ) : (
              <p className="text-[0.82rem] leading-[1.65] text-ink-soft">{node.desc}</p>
            )}
            <ul className="mt-3 space-y-1.5">
              {node.details.map((d, di) => (
                isVal
                  ? <ChecklistItem key={d} text={d} delay={di * 0.07} />
                  : (
                    <li key={d} className="flex items-start gap-2 text-[0.78rem] leading-[1.55] text-ink-soft">
                      <Check />{d}
                    </li>
                  )
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ── Engineering highlight card ─────────────────────────────── */

function HighlightCard({ title, icon, delay }: { title: string; icon: ReactNode; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, y: 20, filter: "blur(5px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-3 rounded-xl border border-line bg-card px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-deep/30 hover:shadow-[0_4px_16px_rgba(56,189,248,0.1)]"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-deep/10 text-sky-deep" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          {icon}
        </svg>
      </span>
      <span className="text-[0.82rem] font-medium text-ink">{title}</span>
    </motion.div>
  );
}

/* ── Main export ────────────────────────────────────────────── */

export default function AgileDeliveryEcosystem() {
  const [active, setActive] = useState<string | null>(null);
  const reduced = useReducedMotion();

  /* Mobile vertical connector */
  const VCONN = "pointer-events-none absolute bottom-4 left-[1.3rem] top-[2.75rem] w-px";

  function toggle(id: string) {
    setActive((prev) => (prev === id ? null : id));
  }

  const activeNode = NODES.find((n) => n.id === active) ?? null;

  return (
    <div aria-label="Agile Delivery Ecosystem">

      {/* ── Header ─────────────────────────────────────────── */}
      <Reveal>
        <p className="eyebrow mb-3 text-center">Agile Delivery Ecosystem · Enterprise Feature Delivery</p>
        <h3 className="section-title text-center font-display font-semibold leading-[1.18] tracking-wide text-ink">
          Agile Delivery Ecosystem
        </h3>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[0.84rem] leading-[1.7] text-ink-soft">
          From business requirement to production — coordinating validation across APIs, charging services,
          middleware, and databases in an Agile enterprise environment. Click any node to explore.
        </p>
      </Reveal>

      {/* ── Desktop: interactive network ──────────────────────
          Container is h-[600px]. SVG viewBox matches 1000×600.
          Nodes are absolutely positioned at (cx/1000, cy/600).  */}
      <div className="mt-10 hidden lg:block" aria-label="Enterprise delivery network — click nodes to expand">
        <div className="relative min-h-[600px] w-full" role="group" aria-label="Delivery network nodes">
          {/* SVG paths + particles */}
          <NetworkSVG reduced={!!reduced} sffActive={active === "sff"} />

          {/* Node buttons */}
          {NODES.map((node) => {
            const pos = NODE_POS[node.id];
            return (
              <DesktopNode
                key={node.id}
                node={node}
                cx={pos.cx}
                cy={pos.cy}
                isActive={active === node.id}
                onToggle={() => toggle(node.id)}
                reduced={!!reduced}
              />
            );
          })}

          {/* Stagger-reveal entrance for each node */}
          {NODES.map((node, i) => {
            const pos = NODE_POS[node.id];
            return (
              <motion.div
                key={`reveal-${node.id}`}
                className="pointer-events-none absolute z-0"
                style={{
                  left: `${(pos.cx / 1000) * 100}%`,
                  top: `${(pos.cy / 600) * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
                initial={reduced ? false : { opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              />
            );
          })}

          {/* Floating detail card — positioned near the active node */}
          <AnimatePresence mode="wait">
            {activeNode && (() => {
              const pos = NODE_POS[activeNode.id];
              const isUpper = pos.cy < 350;
              const cardPos: React.CSSProperties = isUpper
                ? { top: `calc(${(pos.cy / 600) * 100}% + 54px)`, left: 8, right: 8 }
                : { bottom: `calc(${((600 - pos.cy) / 600) * 100}% + 54px)`, left: 8, right: 8 };
              return (
                <motion.div
                  key={active!}
                  style={{ position: "absolute", zIndex: 30, ...cardPos }}
                  initial={reduced ? false : { opacity: 0, y: isUpper ? 14 : -14, filter: "blur(5px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={reduced ? undefined : { opacity: 0, y: isUpper ? -8 : 8, filter: "blur(3px)" }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                >
                  <DetailCard node={activeNode} onClose={() => setActive(null)} reduced={!!reduced} />
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {!activeNode && (
            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[0.6rem] tracking-[0.2em] text-ink-soft/50">
              CLICK ANY NODE TO EXPAND
            </p>
          )}
        </div>
      </div>

      {/* ── Mobile vertical layout ────────────────────────── */}
      <div className="relative mx-auto mt-10 max-w-xl lg:hidden">
        <div aria-hidden="true" className={`${VCONN} bg-line/50`} />
        {!reduced && (
          <motion.div
            aria-hidden="true"
            className={`${VCONN} bg-sky-deep`}
            style={{ scaleY: 0.85, transformOrigin: "50% 0%", boxShadow: "0 0 7px rgba(56,189,248,0.7)" }}
          />
        )}
        {!reduced && (
          <div aria-hidden="true" className={VCONN}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="flow-dot absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-sky-deep"
                style={{ animationDelay: `${i * 0.9}s`, animationDuration: "3.8s", boxShadow: "0 0 6px rgba(56,189,248,0.85)" }}
              />
            ))}
          </div>
        )}
        <div className="relative">
          {NODES.map((node, i) => (
            <MobileCard
              key={node.id}
              node={node}
              index={i}
              isActive={active === node.id}
              onToggle={() => toggle(node.id)}
              reduced={!!reduced}
            />
          ))}
        </div>
      </div>

      {/* ── Tech badges ───────────────────────────────────── */}
      <Reveal className="mt-14">
        <div className="rounded-2xl border border-line bg-card/80 p-6 backdrop-blur-sm sm:p-8">
          <p className="eyebrow mb-2">Technology &amp; Testing Stack</p>
          <h4 className="font-display text-xl font-semibold tracking-wide text-ink">
            Enterprise Testing &amp; Delivery Technologies
          </h4>
          <div className="mt-5 flex flex-wrap gap-2" aria-label="Technologies used">
            {TECH_BADGES.map((badge, i) => (
              <TechBadge key={badge} text={badge} delay={i * 0.04} />
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── Engineering highlights ────────────────────────── */}
      <Reveal className="mt-8">
        <p className="eyebrow mb-4 text-center">Engineering Contributions</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {HIGHLIGHTS.map((h, i) => (
            <HighlightCard
              key={h.title}
              title={h.title}
              icon={h.icon}
              delay={i * 0.07}
            />
          ))}
        </div>
      </Reveal>
    </div>
  );
}
