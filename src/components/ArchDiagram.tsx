import { useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

/*
 * Real 2D architecture diagram of the AT&T prepaid reporting stack —
 * zoned containers, orthogonal connectors with arrowheads, animated
 * data particles, clickable components with an inspector panel.
 */

interface Node {
  id: string;
  name: string;
  sub?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  tone?: "gold" | "sky";
  icon: ReactNode;
  note: string;
}

const I = {
  user: <g><circle cx="12" cy="8" r="3.6" /><path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5" /></g>,
  bolt: <path d="M13 3L5 14h6l-1 7 9-12h-6z" />,
  funnel: <path d="M4 5h16l-6 7v6l-4 2v-8z" />,
  db: <g><ellipse cx="12" cy="6" rx="7" ry="2.6" /><path d="M5 6v12c0 1.5 3.1 2.6 7 2.6s7-1.1 7-2.6V6M5 12c0 1.5 3.1 2.6 7 2.6s7-1.1 7-2.6" /></g>,
  plug: <g><path d="M9 7V3M15 7V3M7 7h10v4a5 5 0 0 1-10 0z" /><path d="M12 16v5" /></g>,
  phone: <g><rect x="7" y="2" width="10" height="20" rx="2.5" /><path d="M10.5 18.5h3" /></g>,
  warehouse: <g><path d="M3 21V9l9-5 9 5v12" /><path d="M7 21v-8h10v8M7 17h10" /></g>,
  chart: <g><path d="M3 21h18" /><path d="M6 17v-6M11 17V7M16 17v-4M21 17V9" /></g>,
};

const nodes: Node[] = [
  { id: "sub", name: "Subscriber", sub: "recharge · top-up · plans", x: 285, y: 14, w: 190, h: 52, icon: I.user, note: "Where everything begins — millions of AT&T prepaid subscribers recharging, topping up, changing plans and checking history." },
  { id: "chg", name: "Charging System", x: 148, y: 130, w: 196, h: 52, icon: I.bolt, note: "Rates and charges every subscriber event in real time. Any change here rippled through the whole stack — and into my regression scope." },
  { id: "med", name: "Mediation System", x: 416, y: 130, w: 196, h: 52, icon: I.funnel, note: "Normalizes raw usage records into clean events for downstream systems. I validated record integrity on every release." },
  { id: "db", name: "Operational DB", x: 282, y: 212, w: 196, h: 52, icon: I.db, note: "Stores subscriber usage and account history at 10M+ record scale on MapR and Greenplum. My data-integrity test bed." },
  { id: "api", name: "API Layer", x: 282, y: 330, w: 196, h: 48, icon: I.plug, note: "Serves usage and history data to every customer-facing app. API validation — schema, contract and performance — lived here." },
  { id: "self", name: "Self Care", x: 92, y: 448, w: 172, h: 46, icon: I.phone, note: "The main subscriber portal. End-to-end usage-history validation terminated here, on the screens customers actually saw." },
  { id: "kic", name: "Kic Care", x: 294, y: 448, w: 172, h: 46, icon: I.phone, note: "Companion self-service app — same APIs, separate flows, its own regression suite." },
  { id: "res", name: "Reseller Care", x: 496, y: 448, w: 172, h: 46, icon: I.phone, note: "The retailer-facing portal for activations and account servicing — B2B flows validated alongside the consumer apps." },
  { id: "dw", name: "Data Warehouse", x: 148, y: 572, w: 196, h: 50, icon: I.warehouse, note: "Aggregates platform data for analytics. Cross-environment comparisons ran against it during the AWS migration." },
  { id: "rpt", name: "Reporting Platform", x: 416, y: 572, w: 196, h: 50, tone: "gold", icon: I.chart, note: "My primary domain. Every report — usage, revenue, reconciliation — validated end to end, on-premise and after the move to AWS." },
];

interface Zone {
  x: number; y: number; w: number; h: number; label: string; gold?: boolean;
}
const zones: Zone[] = [
  { x: 118, y: 100, w: 524, h: 188, label: "B/OSS CORE" },
  { x: 64, y: 418, w: 632, h: 98, label: "CUSTOMER APPLICATIONS · 10M+ SUBSCRIBERS" },
  { x: 118, y: 542, w: 524, h: 102, label: "ANALYTICS & REPORTING — MY DOMAIN", gold: true },
];

/* Orthogonal edges. `flow` paths also carry an animated particle. */
const edges: { d: string; label?: string; lx?: number; ly?: number; flow?: boolean; dur?: number }[] = [
  { d: "M380 66 V96 H246 V130", label: "charging events", lx: 388, ly: 88, flow: true, dur: 5 },
  { d: "M344 156 H416", flow: true, dur: 2.5 },
  { d: "M246 182 V198 H340 V212", flow: true, dur: 3 },
  { d: "M514 182 V198 H420 V212", label: "records", lx: 524, ly: 202, flow: true, dur: 3 },
  { d: "M380 264 V330", label: "serves data", lx: 388, ly: 302, flow: true, dur: 2.5 },
  { d: "M380 378 V404 H178 V448", flow: true, dur: 3.5 },
  { d: "M380 378 V448", flow: true, dur: 2.5 },
  { d: "M380 378 V404 H582 V448", flow: true, dur: 3.5 },
  { d: "M380 516 V530 H246 V572", label: "analytics pipeline", lx: 388, ly: 528, flow: true, dur: 4 },
  { d: "M344 597 H416", label: "reports", lx: 368, ly: 588, flow: true, dur: 2.5 },
];

export default function ArchDiagram() {
  const [active, setActive] = useState<string>("rpt");
  const reduced = useReducedMotion();
  const current = nodes.find((n) => n.id === active)!;

  const onKey = (e: KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActive(id);
    }
  };

  return (
    <div role="group" aria-label="Reporting architecture diagram">
      <p className="sr-only">
        Subscriber transactions flow into the B/OSS core — charging system, mediation
        system and operational database — which serves an API layer consumed by the Self
        Care, Kic Care and Reseller Care applications. Application data feeds the data
        warehouse and finally the reporting platform, my primary validation domain.
      </p>

      <svg viewBox="0 0 760 656" className="w-full" role="presentation">
        <defs>
          <marker id="arch-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0.5 0.8L7.2 4L0.5 7.2z" fill="var(--gold)" />
          </marker>
        </defs>

        {/* Zones */}
        {zones.map((z) => (
          <g key={z.label}>
            <rect
              x={z.x} y={z.y} width={z.w} height={z.h} rx="14"
              fill={z.gold ? "var(--gold)" : "var(--ink-soft)"}
              opacity={z.gold ? 0.06 : 0.045}
            />
            <rect
              x={z.x} y={z.y} width={z.w} height={z.h} rx="14"
              fill="none"
              stroke={z.gold ? "var(--gold)" : "var(--ink-soft)"}
              strokeWidth="1"
              strokeDasharray="5 5"
              opacity={z.gold ? 0.55 : 0.35}
            />
            <text
              x={z.x + 14} y={z.y + 17}
              fontFamily="var(--font-mono)" fontSize="9.5" letterSpacing="2.5"
              fill={z.gold ? "var(--gold)" : "var(--ink-soft)"}
              opacity=".9"
            >
              {z.label}
            </text>
          </g>
        ))}

        {/* Edges */}
        {edges.map((e, i) => (
          <g key={i}>
            <path
              d={e.d}
              fill="none"
              stroke="var(--ink-soft)"
              strokeWidth="1.3"
              opacity=".5"
              markerEnd="url(#arch-arrow)"
            />
            {e.label && (
              <text
                x={e.lx} y={e.ly}
                fontFamily="var(--font-mono)" fontSize="9" fontStyle="italic"
                fill="var(--ink-soft)" opacity=".85"
              >
                {e.label}
              </text>
            )}
            {e.flow && !reduced && (
              <circle r="3" fill="var(--gold)">
                <animateMotion dur={`${e.dur ?? 3}s`} repeatCount="indefinite" begin={`${i * 0.4}s`} path={e.d} />
              </circle>
            )}
          </g>
        ))}

        {/* Component nodes */}
        {nodes.map((n) => {
          const isActive = n.id === active;
          const stroke = isActive
            ? "var(--gold)"
            : n.tone === "gold"
              ? "color-mix(in srgb, var(--gold) 60%, transparent)"
              : "var(--line)";
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
              style={{ transition: "opacity .3s" }}
              opacity={active && !isActive ? 0.82 : 1}
            >
              {isActive && (
                <rect
                  x={n.x - 4} y={n.y - 4} width={n.w + 8} height={n.h + 8} rx="14"
                  fill="var(--gold)" opacity="0.14"
                />
              )}
              <rect
                x={n.x} y={n.y} width={n.w} height={n.h} rx="11"
                fill="var(--card)"
                stroke={stroke}
                strokeWidth={isActive ? 1.8 : 1.2}
              />
              <g
                transform={`translate(${n.x + 14}, ${n.y + n.h / 2 - 11})`}
                fill="none"
                stroke={n.tone === "gold" ? "var(--gold)" : "var(--forest)"}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="14.5" fill={n.tone === "gold" ? "var(--gold)" : "var(--green)"} opacity=".12" stroke="none" />
                <g transform="translate(-1,-1) scale(1)">{n.icon}</g>
              </g>
              <text
                x={n.x + 44} y={n.y + (n.sub ? n.h / 2 - 2 : n.h / 2 + 5)}
                fontFamily="var(--font-display)" fontSize="16.5" fontWeight="600"
                fill={n.tone === "gold" ? "var(--gold)" : "var(--ink)"}
              >
                {n.name}
              </text>
              {n.sub && (
                <text
                  x={n.x + 44} y={n.y + n.h / 2 + 15}
                  fontFamily="var(--font-mono)" fontSize="8.5" letterSpacing="1"
                  fill="var(--ink-soft)"
                >
                  {n.sub}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Inspector panel */}
      <div
        aria-live="polite"
        className="mx-auto mt-3 flex max-w-2xl items-start gap-3 rounded-xl border border-gold/40 bg-card px-4 py-3 shadow-[0_2px_10px_rgba(46,58,48,0.06)]"
      >
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/12 text-forest" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {current.icon}
          </svg>
        </span>
        <div>
          <p className="font-display text-base font-semibold tracking-wide">{current.name}</p>
          <p className="mt-0.5 text-[0.8rem] leading-[1.6] text-ink-soft">{current.note}</p>
        </div>
      </div>
    </div>
  );
}
