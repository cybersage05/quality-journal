import { useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

/*
 * The Ericsson STLC drawn as a release cycle wheel — nine stages orbiting
 * a hub, gold particles circulating clockwise, each stage clickable with
 * details shown in the hub. Replaces the old accordion list.
 */

interface Stage {
  id: string;
  name: string;
  icon: ReactNode;
  details: string;
}

const I = {
  search: <g><circle cx="10.5" cy="10.5" r="5.5" /><path d="M14.5 14.5L20 20" /></g>,
  clipboard: <g><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4h6v3H9zM9 11h6M9 15h4" /></g>,
  wrench: <path d="M14.5 6.5a4.5 4.5 0 0 0-6 6L4 17l3 3 4.5-4.5a4.5 4.5 0 0 0 6-6L14 13l-3-3z" />,
  server: <g><rect x="4" y="4" width="16" height="7" rx="1.5" /><rect x="4" y="13" width="16" height="7" rx="1.5" /><path d="M7.5 7.5h.01M7.5 16.5h.01M12 7.5h4M12 16.5h4" /></g>,
  play: <g><circle cx="12" cy="12" r="8.5" /><path d="M10 8.5l6 3.5-6 3.5z" /></g>,
  bug: <g><ellipse cx="12" cy="14" rx="5" ry="6" /><path d="M12 8V5M8 6l1.5 2.5M16 6l-1.5 2.5M7 12H4M20 12h-3M7 17l-2.5 2M17 17l2.5 2M12 9v10" /></g>,
  loop: <g><path d="M5 12a7 7 0 0 1 12-5l2 2M19 12a7 7 0 0 1-12 5l-2-2" /><path d="M19 4v5h-5M5 20v-5h5" /></g>,
  shield: <g><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><path d="M9 12l2.2 2.2L15.5 10" /></g>,
  flag: <g><path d="M6 21V4" /><path d="M6 5c4-2 8 2 12 0v8c-4 2-8-2-12 0" /></g>,
};

const stages: Stage[] = [
  { id: "req", name: "Requirement Analysis", icon: I.search, details: "Studied change requests across charging, mediation, APIs and reporting — mapped impact to the subscriber-facing apps." },
  { id: "plan", name: "Test Planning", icon: I.clipboard, details: "Scoped functional, integration and regression coverage per release, coordinated across development, infrastructure and business teams." },
  { id: "design", name: "Test Design", icon: I.wrench, details: "Authored end-to-end scenarios spanning the full stack, with data setups against 10M+ subscriber records." },
  { id: "env", name: "Environment Setup", icon: I.server, details: "Provisioned test environments on Red Hat Linux, MapR and Greenplum — verified configuration parity with production." },
  { id: "exec", name: "Test Execution", icon: I.play, details: "Daily regression of ~600 scenarios — smoke, sanity, system, SIT, performance and load runs." },
  { id: "defect", name: "Defect Reporting", icon: I.bug, details: "Triaged failures with full root-cause analysis; tracked severity, evidence and ownership to closure." },
  { id: "retest", name: "Re-testing", icon: I.loop, details: "Validated every fix in isolation before wider runs." },
  { id: "reg", name: "Regression", icon: I.shield, details: "Guarded existing behavior across all three customer applications on every change." },
  { id: "close", name: "Test Closure", icon: I.flag, details: "Production readiness sign-off with metrics and a known-issue summary — the cycle ends where the next one begins." },
];

const CX = 300;
const CY = 300;
const R = 218;

function polar(angleDeg: number, r: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

export default function ReleaseCycle() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const current = stages[active];

  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActive(i);
    }
  };

  return (
    <div role="group" aria-label="Release testing cycle at Ericsson">
      <p className="sr-only">
        Nine stages repeated for every release across three years: requirement analysis,
        test planning, test design, environment setup, test execution, defect reporting,
        re-testing, regression and test closure. Select a stage to read what it involved.
      </p>

      {/* ---- the wheel (sm and up) ---- */}
      <div className="hidden sm:block">
        <svg viewBox="0 0 600 600" className="mx-auto w-full max-w-lg">
          {/* orbit track */}
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--line)" strokeWidth="1.4" strokeDasharray="3 6" />
          {/* direction arrows on the track */}
          {[40, 160, 280].map((a) => {
            const p = polar(a, R);
            return (
              <g key={a} transform={`translate(${p.x} ${p.y}) rotate(${a})`}>
                <path d="M-4 -7l6 7-6 7" fill="none" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity=".7" />
              </g>
            );
          })}
          {/* circulating particles */}
          {!reduced &&
            [0, 1, 2, 3].map((i) => (
              <circle key={i} r="3.2" fill="var(--gold)">
                <animateMotion
                  dur="14s"
                  repeatCount="indefinite"
                  begin={`${i * 3.5}s`}
                  path={`M ${CX} ${CY - R} a ${R} ${R} 0 1 1 -0.01 0`}
                />
              </circle>
            ))}

          {/* hub — inspector */}
          <circle cx={CX} cy={CY} r="128" fill="var(--card)" stroke="var(--gold)" strokeWidth="1.2" opacity=".97" />
          <circle cx={CX} cy={CY} r="118" fill="none" stroke="var(--line)" strokeWidth=".8" strokeDasharray="2 4" />
          <text x={CX} y={CY - 86} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="3" fill="var(--gold)">
            STAGE {String(active + 1).padStart(2, "0")} / 09
          </text>
          <text x={CX} y={CY - 62} textAnchor="middle" fontFamily="var(--font-display)" fontSize="21" fontWeight="600" fill="var(--ink)">
            {current.name}
          </text>
          <foreignObject x={CX - 100} y={CY - 48} width="200" height="120">
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "11.5px",
                lineHeight: 1.55,
                color: "var(--ink-soft)",
                textAlign: "center",
                margin: 0,
              }}
            >
              {current.details}
            </p>
          </foreignObject>
          <text x={CX} y={CY + 92} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8.5" letterSpacing="2" fill="var(--ink-soft)" opacity=".85">
            EVERY RELEASE · THREE YEARS
          </text>

          {/* stage medallions */}
          {stages.map((s, i) => {
            const angle = (360 / stages.length) * i;
            const p = polar(angle, R);
            const lp = polar(angle, R + 42);
            const isActive = i === active;
            return (
              <g
                key={s.id}
                tabIndex={0}
                role="button"
                aria-pressed={isActive}
                aria-label={`${s.name} — show details`}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKey(e, i)}
                className="cursor-pointer outline-none"
              >
                {isActive && <circle cx={p.x} cy={p.y} r="29" fill="var(--gold)" opacity=".18" />}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="23"
                  fill="var(--card)"
                  stroke={isActive ? "var(--gold)" : s.id === "defect" ? "color-mix(in srgb, var(--terracotta) 55%, transparent)" : "var(--line)"}
                  strokeWidth={isActive ? 2.2 : 1.3}
                />
                <g
                  transform={`translate(${p.x - 11} ${p.y - 11}) scale(0.92)`}
                  fill="none"
                  stroke={isActive ? "var(--gold)" : s.id === "defect" ? "var(--terracotta)" : "var(--forest)"}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {s.icon}
                </g>
                <text
                  x={lp.x}
                  y={lp.y + 3}
                  textAnchor={lp.x > CX + 8 ? "start" : lp.x < CX - 8 ? "end" : "middle"}
                  fontFamily="var(--font-mono)"
                  fontSize="9.5"
                  letterSpacing="1"
                  fill={isActive ? "var(--gold)" : "var(--ink-soft)"}
                >
                  {s.name.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ---- compact fallback (below sm) ---- */}
      <div className="sm:hidden">
        <div className="grid grid-cols-3 gap-2" role="group" aria-label="Select a stage">
          {stages.map((s, i) => {
            const isActive = i === active;
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActive(i)}
                className={`flex flex-col items-center gap-1 rounded-xl border bg-card px-1.5 py-2.5 transition-all duration-300 ${
                  isActive ? "border-gold shadow-[0_3px_12px_rgba(201,164,92,0.2)]" : "border-line"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`h-5 w-5 ${isActive ? "text-gold" : s.id === "defect" ? "text-terracotta" : "text-forest"}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {s.icon}
                </svg>
                <span className="text-center font-mono text-[0.52rem] leading-tight tracking-wide text-ink-soft">
                  {s.name}
                </span>
              </button>
            );
          })}
        </div>
        <div aria-live="polite" className="mt-3 rounded-xl border border-gold/40 bg-card px-4 py-3">
          <p className="font-mono text-[0.6rem] tracking-[0.25em] text-gold">
            STAGE {String(active + 1).padStart(2, "0")} / 09
          </p>
          <p className="mt-1 font-display text-lg font-semibold tracking-wide">{current.name}</p>
          <p className="mt-1 text-[0.8rem] leading-[1.6] text-ink-soft">{current.details}</p>
        </div>
      </div>
    </div>
  );
}
