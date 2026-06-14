import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Reveal, SectionHeader } from "./ui";

/* ─── SVG icon paths (match portfolio's existing icon style) ──── */

const I = {
  doc: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </>
  ),
  edit: (
    <>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </>
  ),
  code: (
    <>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </>
  ),
  bug: (
    <>
      <circle cx="12" cy="13" r="5" />
      <path d="M12 8V6M6 11H3M21 11h-3M6 16H3M21 16h-3M9 4l1 2M15 4l-1 2" />
    </>
  ),
  layers: (
    <>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </>
  ),
  list: (
    <>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </>
  ),
  chart: (
    <>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  trending: (
    <>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </>
  ),
};

function Ico({ d, size = 3.5 }: { d: ReactNode; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-${size} w-${size}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {d}
    </svg>
  );
}

/* ─── Data ──────────────────────────────────────────────────────── */

const TRAD_STEPS = [
  { icon: I.doc,  label: "Read & understand requirements" },
  { icon: I.edit, label: "Write test scenarios manually" },
  { icon: I.code, label: "Write automation scripts" },
  { icon: I.bug,  label: "Debug & maintain scripts" },
];

const AI_STEPS = [
  {
    icon: I.layers,
    label: "Understand requirements",
    desc: "Analyzes PRDs, user stories, and docs instantly",
  },
  {
    icon: I.list,
    label: "Generate test scenarios & cases",
    desc: "Covers happy paths, edge cases & negative scenarios",
  },
  {
    icon: I.code,
    label: "Generate automation scripts",
    desc: "Clean, reusable code in Playwright, Selenium, Cypress & more",
  },
  {
    icon: I.chart,
    label: "Review, refine & run",
    desc: "Easily tweak, maintain and scale test suites",
  },
];

const BENEFITS = [
  { icon: I.target,   label: "Understands context",     desc: "Better test scenarios with full context" },
  { icon: I.code,     label: "Generates reliable code", desc: "Clean, consistent & debug-friendly" },
  { icon: I.clock,    label: "Saves significant time",  desc: "From hours to minutes for test creation" },
  { icon: I.shield,   label: "Improves coverage",       desc: "Thinks of cases we might miss" },
  { icon: I.trending, label: "Boosts productivity",     desc: "Focus more on quality, less on manual work" },
];

/* ─── TradStep ──────────────────────────────────────────────────── */

function TradStep({
  icon, label, index, isLast,
}: {
  icon: ReactNode; label: string; index: number; isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const reduced = useReducedMotion();

  return (
    <div ref={ref}>
      <motion.div
        className="flex items-center gap-3"
        initial={reduced ? { opacity: 1 } : { opacity: 0, x: -10 }}
        animate={inView ? { opacity: 1, x: 0 } : undefined}
        transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-paper-warm text-ink-soft">
          <Ico d={icon} />
        </span>
        <span className="text-[0.82rem] leading-snug text-ink-soft">{label}</span>
      </motion.div>
      {!isLast && (
        <div className="ml-4 my-1.5" style={{ paddingLeft: 12 }}>
          <div className="h-4 w-px bg-line/60" />
        </div>
      )}
    </div>
  );
}

/* ─── AIStep ─────────────────────────────────────────────────────── */

function AIStep({
  icon, label, desc, index, isLast,
}: {
  icon: ReactNode; label: string; desc: string; index: number; isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const reduced = useReducedMotion();

  return (
    <div ref={ref}>
      <motion.div
        className="flex items-start gap-3"
        initial={reduced ? { opacity: 1 } : { opacity: 0, x: 10 }}
        animate={inView ? { opacity: 1, x: 0 } : undefined}
        transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-paper-warm text-forest">
          <Ico d={icon} />
        </span>
        <div>
          <p className="text-[0.82rem] font-medium leading-snug text-ink">{label}</p>
          <p className="mt-0.5 text-[0.73rem] leading-snug text-ink-soft/70">{desc}</p>
        </div>
      </motion.div>
      {!isLast && (
        <div className="ml-4 my-1.5" style={{ paddingLeft: 12 }}>
          <div className="h-4 w-px bg-forest/20" />
        </div>
      )}
    </div>
  );
}

/* ─── BenefitCard ───────────────────────────────────────────────── */

function BenefitCard({
  icon, label, desc, index,
}: {
  icon: ReactNode; label: string; desc: string; index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center gap-2 text-center"
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.42, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-paper-warm text-forest">
        <Ico d={icon} size={4} />
      </span>
      <p className="font-display text-[0.9rem] font-semibold text-ink">{label}</p>
      <p className="text-[0.75rem] leading-snug text-ink-soft">{desc}</p>
    </motion.div>
  );
}

/* ─── Main export ───────────────────────────────────────────────── */

export default function AIEraSection() {
  const reduced = useReducedMotion();
  const arrowRef = useRef<SVGSVGElement>(null);
  const arrowInView = useInView(arrowRef as React.RefObject<Element>, { once: true });

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">

        {/* Header */}
        <SectionHeader
          eyebrow="Next-Gen Engineering"
          title="AI Based QA"
          intro="Claude acts like a smart QA partner—understanding our app, generating high-quality tests, and speeding up our automation journey."
          align="center"
        />

        {/* Comparison cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">

          {/* Traditional card */}
          <Reveal>
            <div className="flex h-full flex-col rounded-2xl border border-line bg-card p-6">
              <div className="mb-5 w-fit rounded-lg bg-ink/[0.07] px-3 py-1.5">
                <span className="font-mono text-[0.63rem] font-medium uppercase tracking-[0.18em] text-ink">
                  Traditional Approach
                </span>
              </div>
              <div className="flex-1">
                {TRAD_STEPS.map((s, i) => (
                  <TradStep
                    key={s.label}
                    icon={s.icon}
                    label={s.label}
                    index={i}
                    isLast={i === TRAD_STEPS.length - 1}
                  />
                ))}
              </div>
              <div className="mt-5 flex items-center gap-2 rounded-lg border border-line bg-paper-warm px-3 py-2">
                <span className="text-ink-soft/60">
                  <Ico d={I.clock} />
                </span>
                <span className="font-mono text-[0.62rem] text-ink-soft">
                  Time-consuming &amp; repetitive
                </span>
              </div>
            </div>
          </Reveal>

          {/* Arrow — desktop only, vertically centred */}
          <div className="hidden lg:flex items-center justify-center px-1">
            <svg
              ref={arrowRef}
              viewBox="0 0 52 24"
              className="w-12"
              fill="none"
              aria-hidden="true"
            >
              <motion.path
                d="M4 12 H40 M30 4 L40 12 L30 20"
                stroke="var(--ink)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduced ? {} : { pathLength: 0, opacity: 0 }}
                animate={arrowInView ? { pathLength: 1, opacity: 1 } : undefined}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
          </div>

          {/* AI card */}
          <Reveal delay={0.15}>
            <div className="flex h-full flex-col rounded-2xl border border-forest/30 bg-card bg-[radial-gradient(ellipse_at_top_right,rgba(26,120,80,0.06)_0%,transparent_55%)] p-6">
              <div className="mb-5 w-fit rounded-lg bg-forest px-3 py-1.5">
                <span className="font-mono text-[0.63rem] font-medium uppercase tracking-[0.18em] text-paper">
                  With Claude
                </span>
              </div>
              <div className="flex-1">
                {AI_STEPS.map((s, i) => (
                  <AIStep
                    key={s.label}
                    icon={s.icon}
                    label={s.label}
                    desc={s.desc}
                    index={i}
                    isLast={i === AI_STEPS.length - 1}
                  />
                ))}
              </div>
              <div className="mt-5 flex items-center gap-2 rounded-lg border border-forest/25 bg-forest/[0.05] px-3 py-2">
                <span className="text-forest">
                  <Ico d={I.trending} />
                </span>
                <span className="font-mono text-[0.62rem] text-forest">
                  Faster · Smarter · Higher Coverage
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Benefits */}
        <div className="mt-16">
          <Reveal>
            <p className="mb-7 text-center font-mono text-[0.6rem] uppercase tracking-[0.22em] text-ink-soft/55">
              What I love about using Claude
            </p>
          </Reveal>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {BENEFITS.map((b, i) => (
              <BenefitCard key={b.label} icon={b.icon} label={b.label} desc={b.desc} index={i} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
