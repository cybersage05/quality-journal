import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { FlowDiagram, type FlowNode } from "./FlowDiagram";
import ValidationTrail from "./ValidationTrail";
import { Impact, LeafCheck, MetaChips, Pills, Reveal, SectionHeader } from "./ui";
import {
  CoffeeRing,
  Contours,
  FactoryScene,
  Fig,
  GhostNumeral,
  Parallax,
  SectionStage,
  Sprig,
  Tape,
  tilt,
} from "./decor";

const sfcFlow: FlowNode[] = [
  { title: "SFC starts test session", icon: "play" },
  { title: "Version check — installed vs approved", icon: "search" },
  {
    title: "Mismatch detected",
    tone: "terracotta",
    icon: "bug",
    details: ["If versions match, testing proceeds immediately"],
  },
  { title: "SFC triggers PowerShell / BAT script", icon: "bolt" },
  { title: "Pulls latest approved package from central server", icon: "download" },
  { title: "Silent install + configuration", icon: "wrench" },
  { title: "Version re-verified by SFC", icon: "shield" },
  { title: "✓ Testing proceeds", tone: "gold", icon: "seal" },
];

/* Compact icon-led story row — replaces wall-of-text project blurbs */
function StoryRow({
  kind,
  children,
}: {
  kind: "problem" | "built" | "result";
  children: ReactNode;
}) {
  const meta = {
    problem: { label: "Problem", color: "text-terracotta", icon: <path d="M12 5v8M12 16.5v.01M4 19h16L12 4z" /> },
    built: { label: "Built", color: "text-forest", icon: <path d="M14.5 6.5a4.5 4.5 0 0 0-6 6L4 17l3 3 4.5-4.5a4.5 4.5 0 0 0 6-6L14 13l-3-3z" /> },
    result: { label: "Result", color: "text-gold", icon: <path d="M5 13l4 4L19 7" /> },
  }[kind];
  return (
    <div className="flex gap-3">
      <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-paper-warm ${meta.color}`} aria-hidden="true">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {meta.icon}
        </svg>
      </span>
      <p className="text-[0.82rem] leading-[1.65] text-ink-soft">
        <span className={`mr-1.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] ${meta.color}`}>
          {meta.label}
        </span>
        {children}
      </p>
    </div>
  );
}

/* Hand-sketched mini dashboard — bars, a trend line, a live dot */
function DashboardSketch() {
  return (
    <svg viewBox="0 0 280 90" aria-hidden="true" className="w-full rounded-lg border border-line bg-paper">
      <g stroke="var(--line)" strokeWidth="1">
        <line x1="14" y1="72" x2="266" y2="72" />
        <line x1="14" y1="50" x2="266" y2="50" opacity=".5" strokeDasharray="3 4" />
        <line x1="14" y1="28" x2="266" y2="28" opacity=".5" strokeDasharray="3 4" />
      </g>
      {[
        [26, 34], [50, 22], [74, 40], [98, 16], [122, 30], [146, 12],
      ].map(([x, h]) => (
        <rect key={x} x={x} y={72 - h} width="13" height={h} rx="2" fill="var(--green)" opacity=".55" />
      ))}
      <path
        d="M170 58 C 188 40, 200 52, 214 34 S 248 22, 262 16"
        fill="none"
        stroke="var(--gold)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="262" cy="16" r="3.5" fill="var(--gold)">
        <animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x="18" y="16" fontFamily="var(--font-mono)" fontSize="7" letterSpacing="1.5" fill="var(--ink-soft)">
        PASS/FAIL · CYCLE TIME · LIVE
      </text>
    </svg>
  );
}

const benefits = [
  "Eliminated manual updates across all production PCs",
  "Every station guaranteed on the approved version",
  "Test interruptions from version mismatch reduced to zero",
  "Future deployments became one-step",
];

const facts: { value: number; prefix?: string; suffix?: string; label: string; icon: ReactNode }[] = [
  {
    value: 30,
    prefix: "~",
    suffix: "%",
    label: "configuration time saved through my own automation",
    icon: (
      <g>
        <circle cx="12" cy="12" r="4.5" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
      </g>
    ),
  },
];

/* Animated medallion — gold ring draws itself, number counts up */
function FactMedallion({ value, prefix, suffix, label, icon, delay }: (typeof facts)[number] & { delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(0, value, {
      duration: 1.1,
      delay,
      ease: "easeOut",
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, value, delay]);

  return (
    <div
      ref={ref}
      className="group flex flex-col items-center gap-3 rounded-2xl border border-line bg-card px-4 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_8px_22px_rgba(201,164,92,0.15)]"
    >
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full -rotate-90">
          <circle cx="32" cy="32" r="28" fill="none" stroke="var(--line)" strokeWidth="2" />
          <motion.circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : undefined}
            transition={{ duration: 1.1, delay, ease: "easeOut" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-forest transition-colors duration-300 group-hover:text-gold">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {icon}
          </svg>
        </span>
      </div>
      <span className="font-display text-3xl font-semibold text-gold">
        {prefix}
        {n}
        {suffix}
      </span>
      <span className="text-[0.74rem] leading-[1.55] text-ink-soft">{label}</span>
    </div>
  );
}

export default function ChapterOne() {
  return (
    <section
      id="experience"
      aria-label="Chapter one — Cal-Comp Electronics"
      className="relative overflow-hidden bg-paper"
    >
      <GhostNumeral n="01" className="-top-4 right-2 sm:right-10" />
      <Parallax speed={0.35} className="absolute -left-32 top-[30%]">
        <Contours className="relative h-[34rem] w-[34rem] opacity-50" />
      </Parallax>
      <Sprig className="sway absolute bottom-24 left-3 hidden h-24 w-14 lg:block" />

      <SectionStage className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_14rem]">
          <SectionHeader
            eyebrow="Chapter One · Software Validation Engineer · Bangkok"
            title="Validating Software Releases for Global Manufacturing"
            intro="Every software package released by the customer's development team — Python test code and firmware — passes through my validation before it reaches the production floor. I own that gate."
          >
            <MetaChips
              items={[
                { icon: "building", text: "Cal-Comp Electronics · EMS" },
                { icon: "pin", text: "Phetchaburi, Thailand" },
                { icon: "calendar", text: "2024 – Present" },
                { icon: "people", text: "Quality Engineering team" },
              ]}
            />
          </SectionHeader>
          <Reveal delay={0.15} className="hidden lg:block">
            <Parallax speed={0.18}>
              <FactoryScene rotate={2.5} className="mt-4" />
            </Parallax>
          </Reveal>
        </div>

        <div className="mt-14">
          <Reveal>
            <h3 className="eyebrow mb-10 text-center">
              A Package's Journey to the Floor — my validation trail
            </h3>
          </Reveal>
          <ValidationTrail />
          <Fig n="02" label="the validation gate, drawn from memory" />
        </div>

        <div className="mt-14 grid items-start gap-6 lg:grid-cols-2">
          <Reveal>
            <article
              style={tilt(-0.4)}
              className="dotgrid relative flex h-full flex-col gap-4 rounded-2xl border border-line bg-card p-6 shadow-[0_2px_10px_rgba(46,58,48,0.05)] transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(46,58,48,0.09)] sm:p-7"
            >
              <Tape className="-top-3 left-8" rotate={-5} />
              <CoffeeRing className="right-4 top-10 h-24 w-24" />
              <p className="eyebrow">Automation Project</p>
              <h3 className="font-display text-2xl font-semibold tracking-wide">
                Analytics Dashboard
              </h3>
              <DashboardSketch />
              <div className="space-y-2.5">
                <StoryRow kind="problem">
                  Quality metrics lived in raw logs — every report meant manual log analysis.
                </StoryRow>
                <StoryRow kind="built">
                  A live Python Dash + SQL Server dashboard: test results, error frequency,
                  cycle time per station, pass/fail trends.
                </StoryRow>
                <StoryRow kind="result">
                  Real-time visibility for the whole quality team, in daily use.
                </StoryRow>
              </div>
              <Pills items={["Python", "Dash", "SQL Server", "Windows"]} />
              <div className="mt-auto border-t border-line pt-4">
                <Impact>Real-time quality visibility · In daily use by the team</Impact>
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.1}>
            <article
              style={tilt(0.4)}
              className="dotgrid relative flex h-full flex-col gap-4 rounded-2xl border border-line bg-card p-6 shadow-[0_2px_10px_rgba(46,58,48,0.05)] transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(46,58,48,0.09)] sm:p-7"
            >
              <Tape className="-top-3 right-8" rotate={4} />
              <p className="eyebrow">Automation Project</p>
              <h3 className="font-display text-2xl font-semibold tracking-wide">
                Auto-Installer with SFC Integration
              </h3>
              <div className="space-y-2.5">
                <StoryRow kind="problem">
                  Stations ran outdated test software — interruptions across many production PCs.
                </StoryRow>
                <StoryRow kind="built">
                  An automated version-sync mechanism wired into the Shop Floor Control system:
                </StoryRow>
              </div>
              <div className="my-2">
                <FlowDiagram
                  nodes={sfcFlow}
                  compact
                  ariaLabel="Auto-installer flow"
                  description="The Shop Floor Control system checks installed versus approved software versions at every test session, and on mismatch automatically pulls and silently installs the approved package before testing proceeds."
                />
                <Fig n="03" label="version-sync mechanism" />
              </div>
              <ul className="space-y-2.5" aria-label="Benefits">
                {benefits.map((b, i) => (
                  <Reveal key={b} delay={0.08 * i}>
                    <li className="flex gap-2.5 text-[0.85rem] leading-6 text-ink-soft">
                      <LeafCheck />
                      {b}
                    </li>
                  </Reveal>
                ))}
              </ul>
              <Pills items={["PowerShell", "Batch", "SFC Integration", "Windows Server"]} />
            </article>
          </Reveal>
        </div>

        <div className="mt-12" aria-label="Quality facts">
          <Reveal>
            <p className="eyebrow mb-6 text-center">Field Notes · Measured at Cal-Comp</p>
          </Reveal>
          <div className="flex justify-center">
            {facts.map((f, i) => (
              <FactMedallion key={f.label} {...f} delay={i * 0.15} />
            ))}
          </div>
        </div>
      </SectionStage>
    </section>
  );
}
