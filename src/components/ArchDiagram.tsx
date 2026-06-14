import { useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/*
 * AT&T prepaid platform — accurate two-path bifurcating architecture.
 * Mediation is the central hub distributing into:
 *   Path A: Operational DB → API Layer → Self Care / Kic Care / Reseller Care
 *   Path B: Reporting DB  → Usage History → Report Generation
 */

interface NodeDef {
  id: string;
  name: string;
  sub?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  tone?: "hub" | "gold";
  icon: ReactNode;
  note: string;
}

interface EdgeDef {
  d: string;
  branch: "main" | "a" | "b";
  dur: number;
  begin?: number;
}

const I: Record<string, ReactNode> = {
  user: (
    <g>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5" />
    </g>
  ),
  bolt: <path d="M13 3L5 14h6l-1 7 9-12h-6z" />,
  funnel: <path d="M4 5h16l-6 7v6l-4 2v-8z" />,
  db: (
    <g>
      <ellipse cx="12" cy="6" rx="7" ry="2.6" />
      <path d="M5 6v12c0 1.5 3.1 2.6 7 2.6s7-1.1 7-2.6V6M5 12c0 1.5 3.1 2.6 7 2.6s7-1.1 7-2.6" />
    </g>
  ),
  plug: (
    <g>
      <path d="M9 7V3M15 7V3M7 7h10v4a5 5 0 0 1-10 0z" />
      <path d="M12 16v5" />
    </g>
  ),
  phone: (
    <g>
      <rect x="7" y="2" width="10" height="20" rx="2.5" />
      <path d="M10.5 18.5h3" />
    </g>
  ),
  warehouse: (
    <g>
      <path d="M3 21V9l9-5 9 5v12" />
      <path d="M7 21v-8h10v8M7 17h10" />
    </g>
  ),
  chart: (
    <g>
      <path d="M3 21h18" />
      <path d="M6 17v-6M11 17V7M16 17v-4M21 17V9" />
    </g>
  ),
};

/* ── Node layout ────────────────────────────────────────────────────────────
   viewBox 0 0 900 625
   Subscriber & Charging: center column (x=350, w=200, cx=450)
   Mediation hub: wider (x=306, w=288, cx=450)
   Path A (left): OpDB & API at cx=204; portals fanning below
   Path B (right): RptDB, UsageH, ReportGen at cx=696
   ─────────────────────────────────────────────────────────────────────────*/
const nodes: NodeDef[] = [
  {
    id: "sub",
    name: "Subscriber",
    sub: "recharge · top-up · plans",
    x: 350, y: 16, w: 200, h: 50,
    icon: I.user,
    note: "Millions of AT&T prepaid subscribers triggering transactions across all three customer portals.",
  },
  {
    id: "chg",
    name: "Charging System",
    x: 350, y: 112, w: 200, h: 50,
    icon: I.bolt,
    note: "Rates every subscriber event in real time. Any change here triggered full-ecosystem regression.",
  },
  {
    id: "med",
    name: "Mediation",
    sub: "central hub · data normalization",
    x: 306, y: 212, w: 288, h: 68,
    tone: "hub",
    icon: I.funnel,
    note: "Central router — normalizes charging events and distributes clean streams into two independent paths simultaneously.",
  },
  // ── Path A: Operational ──────────────────────────────────────
  {
    id: "opdb",
    name: "Operational DB",
    x: 104, y: 338, w: 200, h: 50,
    icon: I.db,
    note: "Live subscriber usage and account history at 10M+ record scale on MapR and Greenplum.",
  },
  {
    id: "api",
    name: "API Layer",
    x: 104, y: 442, w: 200, h: 50,
    icon: I.plug,
    note: "Serves subscriber usage data to all three portals. Schema, contracts and performance validated here.",
  },
  {
    id: "self",
    name: "Self Care",
    x: 22, y: 556, w: 148, h: 46,
    icon: I.phone,
    note: "Primary self-service portal — end-to-end usage history validated on screens used by millions daily.",
  },
  {
    id: "kic",
    name: "Kic Care",
    x: 180, y: 556, w: 148, h: 46,
    icon: I.phone,
    note: "Companion app sharing the same APIs with distinct flows — independent regression suite maintained.",
  },
  {
    id: "res",
    name: "Reseller Care",
    x: 338, y: 556, w: 148, h: 46,
    icon: I.phone,
    note: "Retailer-facing portal for activations and account servicing, validated alongside all consumer apps.",
  },
  // ── Path B: Reporting ────────────────────────────────────────
  {
    id: "rptdb",
    name: "Reporting DB",
    sub: "report generation · usage analytics · business reporting",
    x: 596, y: 338, w: 200, h: 68,
    icon: I.warehouse,
    note: "Aggregates platform usage for analytics and reporting. Cross-environment comparisons ran here across the 1.5-year AWS migration.",
  },
  {
    id: "usage",
    name: "Usage History",
    x: 596, y: 442, w: 200, h: 50,
    icon: I.db,
    note: "Aggregated subscriber records — completeness and accuracy verified across both on-prem and AWS environments.",
  },
  {
    id: "rpt",
    name: "Report Generation",
    x: 596, y: 556, w: 200, h: 50,
    tone: "gold",
    icon: I.chart,
    note: "My primary domain — every revenue and reconciliation report verified end-to-end, pre and post-AWS migration.",
  },
];

/* ── Edge paths ─────────────────────────────────────────────────────────────
   All paths end exactly at the target node's top-center so arrowheads land
   on the border. Bezier curves end with a vertical tangent for clean arrows.
   ─────────────────────────────────────────────────────────────────────────*/
const edges: EdgeDef[] = [
  // Main trunk
  { d: "M450 66 V112",                                branch: "main", dur: 3.0 },
  { d: "M450 162 V212",                               branch: "main", dur: 3.0, begin: 0.5 },
  // Path A
  { d: "M400 280 C330 318 204 318 204 338",           branch: "a",    dur: 4.0, begin: 0.2 },
  { d: "M204 388 V442",                               branch: "a",    dur: 2.5, begin: 0.6 },
  { d: "M204 492 C204 526 96 526 96 556",             branch: "a",    dur: 3.5, begin: 0.8 },
  { d: "M204 492 C204 526 254 526 254 556",           branch: "a",    dur: 3.2, begin: 1.2 },
  { d: "M204 492 C204 526 412 526 412 556",           branch: "a",    dur: 3.8, begin: 0.4 },
  // Path B
  { d: "M500 280 C570 318 696 318 696 338",           branch: "b",    dur: 4.0, begin: 0.3 },
  { d: "M696 406 V442",                               branch: "b",    dur: 2.5, begin: 0.7 },
  { d: "M696 492 V556",                               branch: "b",    dur: 2.5, begin: 0.2 },
];

/* ── Tooltip positions (SVG coords 0 0 900 625) ─────────────────────────────
   Top nodes → right of center column (x 562+).
   Mid/bottom nodes → neutral zone between the two paths (x 314+).
   ─────────────────────────────────────────────────────────────────────────*/
const TPOS: Record<string, { tx: number; ty: number; tw: number }> = {
  sub:   { tx: 562, ty:  10, tw: 270 },
  chg:   { tx: 562, ty: 108, tw: 270 },
  med:   { tx: 606, ty: 214, tw: 268 },
  opdb:  { tx: 316, ty: 330, tw: 268 },
  api:   { tx: 316, ty: 434, tw: 268 },
  self:  { tx: 316, ty: 448, tw: 268 },
  kic:   { tx: 316, ty: 448, tw: 268 },
  res:   { tx: 316, ty: 448, tw: 268 },
  rptdb: { tx: 316, ty: 330, tw: 268 },
  usage: { tx: 316, ty: 434, tw: 268 },
  rpt:   { tx: 316, ty: 448, tw: 268 },
};

export default function ArchDiagram() {
  const [active, setActive] = useState<string>("med");
  const reduced = useReducedMotion();
  const current = nodes.find((n) => n.id === active)!;

  const onKey = (e: KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActive(id);
    }
  };

  return (
    <div role="group" aria-label="AT&T prepaid platform architecture diagram" className="relative">
      <p className="sr-only">
        Subscriber transactions flow through the Charging System into the Mediation hub,
        which distributes data across two independent paths. Path A — operational: Operational
        Database, API Layer, then the Self Care, Kic Care and Reseller Care portals. Path B
        — reporting: Reporting Database, Usage History, Report Generation. Responsibilities
        spanned the complete ecosystem — charging, mediation, both databases, APIs, all three
        portals, usage history, reporting and the 1.5-year AWS cloud migration.
      </p>

      <svg viewBox="0 0 900 625" className="w-full" role="presentation">
        <defs>
          {/* Gold arrowhead */}
          <marker
            id="aa"
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0.5 0.8L7.2 4L0.5 7.2z" fill="var(--gold)" opacity="0.85" />
          </marker>
          {/* Sky arrowhead for Path B */}
          <marker
            id="ab"
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0.5 0.8L7.2 4L0.5 7.2z" fill="var(--sky-deep)" opacity="0.85" />
          </marker>
          {/* Soft blur for path glow layers */}
          <filter id="blur5" x="-60%" y="-100%" width="220%" height="300%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id="blur3" x="-40%" y="-80%" width="180%" height="260%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Path branch labels */}
        <text
          x="204" y="324"
          fontFamily="var(--font-mono)" fontSize="8" letterSpacing="2"
          fill="var(--forest)" opacity="0.75" textAnchor="middle"
        >
          PATH A · OPERATIONAL
        </text>
        <text
          x="696" y="324"
          fontFamily="var(--font-mono)" fontSize="8" letterSpacing="2"
          fill="var(--sky-deep)" opacity="0.75" textAnchor="middle"
        >
          PATH B · REPORTING
        </text>

        {/* ── Edge glow layer (blurred, low opacity, wide stroke) ── */}
        {edges.map((e, i) => (
          <path
            key={`glow-${i}`}
            d={e.d}
            fill="none"
            stroke={e.branch === "b" ? "var(--sky-deep)" : "var(--gold)"}
            strokeWidth={e.branch === "main" ? 10 : 7}
            opacity={e.branch === "main" ? 0.12 : 0.09}
            filter="url(#blur5)"
          />
        ))}

        {/* ── Edge crisp lines + animated particles ── */}
        {edges.map((e, i) => {
          const isB = e.branch === "b";
          const stroke = isB ? "var(--sky-deep)" : "var(--gold)";
          const marker = isB ? "url(#ab)" : "url(#aa)";
          return (
            <g key={`edge-${i}`}>
              <path
                d={e.d}
                fill="none"
                stroke={stroke}
                strokeWidth={e.branch === "main" ? 1.6 : 1.3}
                opacity={e.branch === "main" ? 0.8 : 0.65}
                markerEnd={marker}
              />
              {!reduced && (
                <circle
                  r={e.branch === "main" ? 3.5 : 2.8}
                  fill={stroke}
                  opacity="0.95"
                >
                  <animateMotion
                    dur={`${e.dur}s`}
                    repeatCount="indefinite"
                    begin={`${e.begin ?? 0}s`}
                    path={e.d}
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* ── Nodes ── */}
        {nodes.map((n) => {
          const isActive = n.id === active;
          const isHub = n.tone === "hub";
          const isGold = n.tone === "gold";
          const rx = isHub ? 12 : 9;

          const borderColor = isActive
            ? "var(--gold)"
            : isHub
              ? "var(--gold)"
              : isGold
                ? "color-mix(in srgb, var(--gold) 55%, transparent)"
                : "var(--line)";

          const iconStroke = isHub || isGold ? "var(--gold)" : "var(--forest)";
          const iconFill = isHub || isGold ? "var(--gold)" : "var(--green)";
          const nameColor = isHub || isGold ? "var(--gold)" : "var(--ink)";
          const iconOffsetX = isHub ? 18 : 14;
          const textOffsetX = isHub ? 54 : 44;

          return (
            <g
              key={n.id}
              tabIndex={0}
              role="button"
              aria-pressed={isActive}
              aria-label={`${n.name} — show details`}
              onClick={() => setActive(n.id)}
              onKeyDown={(e) => onKey(e, n.id)}
              className="cursor-pointer outline-none"
              opacity={!isActive ? 0.8 : 1}
              style={{ transition: "opacity .3s" }}
            >
              {/* Beacon pulse ring for hub and reporting nodes */}
              {(isHub || isGold) && !reduced && (
                <rect
                  x={n.x - 8} y={n.y - 8}
                  width={n.w + 16} height={n.h + 16}
                  rx={rx + 4}
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="1.5"
                >
                  <animate
                    attributeName="opacity"
                    values="0.28;0;0.28"
                    dur={isHub ? "2.5s" : "3.2s"}
                    repeatCount="indefinite"
                    begin={isHub ? "0s" : "1.1s"}
                  />
                </rect>
              )}

              {/* Selection halo */}
              {isActive && (
                <rect
                  x={n.x - 5} y={n.y - 5}
                  width={n.w + 10} height={n.h + 10}
                  rx={rx + 3}
                  fill="var(--gold)"
                  opacity="0.11"
                />
              )}

              {/* Node background */}
              <rect
                x={n.x} y={n.y}
                width={n.w} height={n.h}
                rx={rx}
                fill={
                  isHub
                    ? "color-mix(in srgb, var(--gold) 7%, var(--card))"
                    : "var(--card)"
                }
                stroke={borderColor}
                strokeWidth={isActive || isHub ? 1.9 : 1.2}
              />

              {/* Icon circle + icon */}
              <g
                transform={`translate(${n.x + iconOffsetX}, ${n.y + n.h / 2 - 11})`}
                fill="none"
                stroke={iconStroke}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle
                  cx="11" cy="11"
                  r={isHub ? 16 : 14.5}
                  fill={iconFill}
                  opacity={isHub ? 0.16 : 0.1}
                  stroke="none"
                />
                <g transform="translate(-1,-1)">{n.icon}</g>
              </g>

              {/* Node name */}
              <text
                x={n.x + textOffsetX}
                y={n.y + (n.sub ? n.h / 2 - 2 : n.h / 2 + 5)}
                fontFamily="var(--font-display)"
                fontSize={isHub ? 18 : 16}
                fontWeight="600"
                fill={nameColor}
              >
                {n.name}
              </text>

              {/* Sub-label */}
              {n.sub && (
                <text
                  x={n.x + textOffsetX}
                  y={n.y + n.h / 2 + (isHub ? 17 : 15)}
                  fontFamily="var(--font-mono)"
                  fontSize={isHub ? 9.5 : 8.5}
                  letterSpacing="1"
                  fill={isHub ? "var(--gold)" : "var(--ink-soft)"}
                  opacity="0.9"
                >
                  {n.sub}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Scope annotation */}
      <p className="mx-auto mt-3 max-w-2xl text-center font-mono text-[0.58rem] uppercase tracking-[0.18em] text-ink-soft/55">
        full validation scope · charging · mediation · databases · apis · reporting · portals · aws migration
      </p>

      {/* Floating tooltip — positioned near the active node */}
      <AnimatePresence mode="wait">
        {active && (() => {
          const pos = TPOS[active];
          return (
            <motion.div
              key={active}
              aria-live="polite"
              initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.93, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.93 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute"
              style={{
                left:  `${(pos.tx / 900) * 100}%`,
                top:   `${(pos.ty / 625) * 100}%`,
                width: `${(pos.tw / 900) * 100}%`,
              }}
            >
              <div className="rounded-xl border border-gold/35 bg-card/80 px-3 py-2.5 shadow-[0_4px_18px_rgba(0,0,0,0.18)] backdrop-blur-md">
                <p className="font-display text-[0.78rem] font-semibold leading-snug text-ink">
                  {current.name}
                </p>
                <p className="mt-1 text-[0.68rem] leading-[1.5] text-ink-soft">
                  {current.note}
                </p>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
