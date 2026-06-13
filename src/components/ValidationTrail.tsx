import type { ReactNode } from "react";
import { Reveal } from "./ui";
import { Ladybug, Stamp } from "./decor";

/*
 * "A package's journey to the floor" — Reevan's Cal-Comp validation
 * process drawn as an illustrated trail map. Every station describes
 * his actual work, not textbook STLC. Stations alternate around a
 * dashed gold trail; sketch vignettes face each station.
 */

/* ---------- sketch vignettes (one per station) ---------- */

function Sketch({ children, label }: { children: ReactNode; label: string }) {
  return (
    <figure aria-hidden="true" className="w-36 rotate-1 rounded-lg border border-line bg-card p-2 pb-1 shadow-[0_3px_10px_rgba(46,58,48,0.08)]">
      <svg viewBox="0 0 120 74" className="block w-full rounded bg-paper">{children}</svg>
      <figcaption className="hand pt-1 text-center text-sm leading-tight opacity-80">{label}</figcaption>
    </figure>
  );
}

const sketches = {
  parcel: (
    <Sketch label="fresh from the dev team">
      <g fill="none" stroke="var(--ink-soft)" strokeWidth="1.3" strokeLinejoin="round">
        <path d="M30 30l30-12 30 12v26l-30 12-30-12z" fill="var(--card)" />
        <path d="M30 30l30 12 30-12M60 42v26" />
        <path d="M45 24l30 12" strokeDasharray="3 3" stroke="var(--terracotta)" />
      </g>
      <text x="60" y="20" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6.5" letterSpacing="1" fill="var(--ink-soft)">PY · .NET · FW</text>
    </Sketch>
  ),
  magnifier: (
    <Sketch label="release notes, line by line">
      <g fill="none" stroke="var(--ink-soft)" strokeWidth="1.3">
        <rect x="28" y="14" width="44" height="50" rx="3" fill="var(--card)" />
        <path d="M35 24h28M35 32h28M35 40h18M35 48h24" opacity=".6" />
        <path d="M35 40h18" stroke="var(--terracotta)" strokeWidth="2" />
        <circle cx="74" cy="42" r="14" stroke="var(--forest)" strokeWidth="2" fill="rgba(94,146,114,0.08)" />
        <path d="M84 52l10 10" stroke="var(--forest)" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    </Sketch>
  ),
  notebook: (
    <Sketch label="the plan, estimated honestly">
      <g fill="none" stroke="var(--ink-soft)" strokeWidth="1.3">
        <rect x="26" y="12" width="52" height="52" rx="3" fill="var(--card)" />
        <path d="M34 12v52" opacity=".4" />
        <path d="M40 24h30M40 33h30M40 42h22M40 51h26" opacity=".6" />
        <path d="M88 20l-26 38" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" />
        <path d="M88 20l4-6 2 8z" fill="var(--gold)" stroke="none" />
      </g>
      <circle cx="44" cy="24" r="2.2" fill="var(--green)" />
      <circle cx="44" cy="33" r="2.2" fill="var(--green)" />
    </Sketch>
  ),
  station: (
    <Sketch label="a mirror of the floor">
      <g fill="none" stroke="var(--ink-soft)" strokeWidth="1.3">
        <rect x="30" y="14" width="60" height="38" rx="3" fill="var(--card)" />
        <path d="M52 52v8M68 52v8M44 60h32" />
        <rect x="36" y="20" width="48" height="26" rx="1.5" fill="rgba(179,214,230,0.25)" />
        <path d="M44 33l5 5 10-11" stroke="var(--green)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <text x="60" y="71" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6" letterSpacing="1.5" fill="var(--ink-soft)">PROD-MIRROR-01</text>
    </Sketch>
  ),
  checklist: (
    <Sketch label="evidence, or it didn't run">
      <g fill="none" stroke="var(--ink-soft)" strokeWidth="1.3">
        <rect x="32" y="10" width="56" height="56" rx="4" fill="var(--card)" />
        {[20, 30, 40, 50].map((y, i) => (
          <g key={y}>
            <rect x="38" y={y - 4} width="8" height="8" rx="2" stroke={i < 3 ? "var(--green)" : "var(--line)"} />
            {i < 3 && <path d={`M40 ${y}l2 2 4-5`} stroke="var(--green)" strokeWidth="1.6" strokeLinecap="round" />}
            <path d={`M52 ${y}h28`} opacity=".55" />
          </g>
        ))}
      </g>
    </Sketch>
  ),
  report: (
    <Sketch label="signed, sealed, traceable">
      <g fill="none" stroke="var(--ink-soft)" strokeWidth="1.3">
        <path d="M36 10h36l12 12v44H36z" fill="var(--card)" />
        <path d="M72 10v12h12" />
        <path d="M44 32h28M44 40h28M44 48h18" opacity=".6" />
      </g>
      <circle cx="72" cy="56" r="9" fill="none" stroke="var(--gold)" strokeWidth="1.6" />
      <path d="M68 56l3 3 5-6" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Sketch>
  ),
};

/* ---------- the gate finale ---------- */

function GateScene() {
  return (
    <svg viewBox="0 0 300 170" aria-hidden="true" className="mx-auto w-64 sm:w-72">
      {/* hill + path */}
      <path d="M0 140 Q 80 120 150 132 T 300 128 V170 H0 Z" fill="var(--green-light)" opacity=".5" />
      <path d="M150 170 C 146 150 152 140 150 122 M150 170 C 156 152 148 142 150 122" stroke="var(--gold)" strokeWidth="1.2" strokeDasharray="1 5" strokeLinecap="round" fill="none" />
      {/* gate posts + arch */}
      <g stroke="var(--forest)" strokeWidth="4" strokeLinecap="round">
        <path d="M105 150 V70" />
        <path d="M195 150 V70" />
      </g>
      <path d="M92 72 Q 150 46 208 72" stroke="var(--forest)" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M100 84 Q 150 62 200 84" stroke="var(--forest)" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* lantern */}
      <line x1="150" y1="58" x2="150" y2="74" stroke="var(--forest)" strokeWidth="1.6" />
      <rect x="143" y="74" width="14" height="18" rx="3" fill="var(--gold)" opacity=".9" />
      <circle cx="150" cy="83" r="13" fill="var(--gold)" opacity=".25">
        <animate attributeName="opacity" values=".25;.45;.25" dur="3.5s" repeatCount="indefinite" />
      </circle>
      {/* fireflies */}
      {[[120, 105], [180, 98], [165, 120], [135, 92]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.8" fill="var(--gold)">
          <animate attributeName="opacity" values=".2;.9;.2" dur={`${2.5 + i * 0.7}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* grass */}
      <g stroke="var(--forest)" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity=".6">
        <path d="M96 150c-2-5-5-8-8-9M99 150c0-5 1-9 3-12M204 150c2-5 5-8 8-9M201 150c0-5-1-9-3-12" />
      </g>
    </svg>
  );
}

/* ---------- station data — Reevan's actual work ---------- */

interface Station {
  n: string;
  title: string;
  note: ReactNode;
  chips?: string[];
  hand?: string;
  sketch?: ReactNode;
  icon: ReactNode;
}

const stations: Station[] = [
  {
    n: "01",
    title: "Package Received",
    note: "Python test code, .NET interaction components and firmware arrive from the customer's development team. Nothing reaches the floor until it passes validation.",
    chips: ["Python", ".NET", "Firmware"],
    hand: "nothing skips the gate",
    sketch: sketches.parcel,
    icon: <g><path d="M4 8l8-4 8 4v8l-8 4-8-4z" /><path d="M4 8l8 4 8-4M12 12v8" /></g>,
  },
  {
    n: "02",
    title: "Change & Risk Analysis",
    note: "I review the release notes line by line — which modules changed, what could break, where the risk sits. High-risk areas get targeted tests of their own.",
    hand: "risk first, always",
    sketch: sketches.magnifier,
    icon: <g><circle cx="10.5" cy="10.5" r="5.5" /><path d="M14.5 14.5L20 20" /></g>,
  },
  {
    n: "03",
    title: "Test Planning",
    note: "Scope SIT, integration and regression; estimate honestly against the release window. ~30% of configuration time now saved by my own automation.",
    chips: ["SIT", "Integration", "Regression"],
    sketch: sketches.notebook,
    icon: <g><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4h6v3H9zM9 11h6M9 15h4" /></g>,
  },
  {
    n: "04",
    title: "Environment Setup",
    note: "A Windows station configured as an exact mirror of the production floor. I verify the configuration before a single test runs.",
    hand: "an exact mirror of the floor",
    sketch: sketches.station,
    icon: <g><rect x="4" y="4" width="16" height="7" rx="1.5" /><rect x="4" y="13" width="16" height="7" rx="1.5" /><path d="M7.5 7.5h.01M7.5 16.5h.01M12 7.5h4M12 16.5h4" /></g>,
  },
  {
    n: "05",
    title: "Test Execution",
    note: "Smoke → sanity → SIT → integration → regression → targeted tests. Every result logged with evidence — screenshots, logs, data.",
    chips: ["Smoke", "Sanity", "SIT", "Integration", "Regression"],
    sketch: sketches.checklist,
    icon: <g><circle cx="12" cy="12" r="8.5" /><path d="M10 8.5l6 3.5-6 3.5z" /></g>,
  },
  {
    n: "06",
    title: "Test Summary & Sign-off",
    note: "Results, metrics and known issues compiled into a formal test summary the customer can trust. If it's not documented, it didn't happen.",
    sketch: sketches.report,
    icon: <g><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></g>,
  },
];

/* ---------- component ---------- */

export default function ValidationTrail() {
  return (
    <div role="group" aria-label="Validation process at Cal-Comp">
      <p className="sr-only">
        Reevan's validation process: a software package arrives, he analyses the changes,
        plans the testing, builds a production-mirror environment, executes the full test
        suite, loops any defects back to the development team within a 24-hour root-cause
        SLA until clean, documents the summary and approves the release for the
        production floor.
      </p>

      <div className="relative">
        {/* dashed gold trail */}
        <div
          aria-hidden="true"
          className="absolute bottom-8 left-[1.4rem] top-2 w-px border-l-2 border-dashed border-gold/50 md:left-1/2"
        />

        <ol className="space-y-9">
          {stations.map((s, i) => {
            const leftSide = i % 2 === 0;
            return (
              <li key={s.n} className="relative">
                <Reveal delay={0.05}>
                  {/* medallion on the trail */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1 flex h-11 w-11 items-center justify-center rounded-full border-2 border-gold/70 bg-card text-forest shadow-[0_0_0_5px_rgba(201,164,92,0.12)] md:left-1/2 md:-translate-x-1/2"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      {s.icon}
                    </svg>
                  </span>

                  {/* station card */}
                  <div
                    className={`ml-16 md:ml-0 md:w-[calc(50%-3.5rem)] ${
                      leftSide ? "md:mr-auto md:text-right" : "md:ml-auto"
                    }`}
                  >
                    <p className="font-mono text-[0.6rem] tracking-[0.3em] text-gold">
                      STAGE {s.n}
                    </p>
                    <h4 className="mt-1 font-display text-xl font-semibold tracking-wide">
                      {s.title}
                    </h4>
                    <p className="mt-1.5 text-[0.82rem] leading-[1.65] text-ink-soft">{s.note}</p>
                    {s.chips && (
                      <ul
                        aria-label={`${s.title} coverage`}
                        className={`mt-2.5 flex flex-wrap gap-1.5 ${leftSide ? "md:justify-end" : ""}`}
                      >
                        {s.chips.map((c) => (
                          <li
                            key={c}
                            className="rounded-full border border-green/40 bg-card px-2.5 py-0.5 font-mono text-[0.6rem] tracking-wide text-ink-soft"
                          >
                            {c}
                          </li>
                        ))}
                      </ul>
                    )}
                    {s.hand && (
                      <p aria-hidden="true" className="hand mt-2 -rotate-1 text-base text-terracotta/90">
                        {s.hand}
                      </p>
                    )}
                  </div>

                  {/* sketch vignette on the opposite bank */}
                  <div
                    className={`absolute top-0 hidden lg:block ${
                      leftSide ? "right-[4%]" : "left-[4%]"
                    }`}
                  >
                    {s.sketch}
                  </div>
                </Reveal>

                {/* the defect detour lives between execution and sign-off */}
                {s.n === "05" && (
                  <Reveal className="relative mt-9">
                    <div className="ml-16 max-w-xl rounded-2xl border border-dashed border-terracotta/50 bg-terracotta/[0.05] p-5 md:mx-auto md:ml-auto md:mr-auto">
                      <div className="flex items-start gap-4">
                        <svg viewBox="0 0 64 64" aria-hidden="true" className="h-14 w-14 shrink-0">
                          <path
                            d="M32 6 a 22 22 0 1 1 -0.1 0"
                            fill="none"
                            stroke="var(--terracotta)"
                            strokeWidth="2"
                            strokeDasharray="4 5"
                            strokeLinecap="round"
                          />
                          <path d="M30 3l6 4-6 4" fill="none" stroke="var(--terracotta)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div>
                          <p className="flex flex-wrap items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-terracotta">
                            Defect Loop
                            <span className="rounded-full border border-terracotta/40 px-2 py-0.5 normal-case tracking-wide">
                              24h root-cause SLA
                            </span>
                          </p>
                          <p className="mt-2 text-[0.82rem] leading-[1.65] text-ink-soft">
                            When a defect is found, severity, reproduction steps, logs and
                            evidence go to the development team — root cause inside 24 hours.
                            The fix comes back, I re-validate, and the loop runs{" "}
                            <span className="font-medium text-terracotta">until it's clean</span>.
                            Three NPI validations caught critical defects before mass production
                            this way.
                          </p>
                        </div>
                        <Ladybug className="hover-drift mt-1 hidden h-8 w-8 shrink-0 rotate-12 sm:block" />
                      </div>
                    </div>
                  </Reveal>
                )}
              </li>
            );
          })}
        </ol>

        {/* the gate */}
        <Reveal className="relative mt-12 text-center">
          <GateScene />
          <div className="relative -mt-2 inline-block">
            <p className="font-mono text-[0.6rem] tracking-[0.3em] text-gold">STAGE 07 · THE GATE</p>
            <h4 className="mt-1 font-display text-2xl font-semibold tracking-wide text-gold">
              Production Release Approved
            </h4>
            <p className="mx-auto mt-1.5 max-w-md text-[0.82rem] leading-[1.65] text-ink-soft">
              Only clean builds walk through. On the other side: a production floor that
              never has to wonder if the software works.
            </p>
            <Stamp text="✓ Validated" className="-right-24 top-1 hidden sm:inline-block" />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
