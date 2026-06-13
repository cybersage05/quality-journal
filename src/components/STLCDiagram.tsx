import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { Reveal, SectionHeader } from "./ui";
import { Contours, Parallax, SectionStage, WaveDivider } from "./decor";

const stages: { n: number; name: string; short: string; desc: string; icon: ReactNode }[] = [
  {
    n: 1, name: "Requirement Analysis",
    short: "Understand & document testable requirements",
    desc: "Review and analyze requirements to identify testable conditions, acceptance criteria and potential risk areas. Establish what needs to be validated before a single test case is written.",
    icon: <path d="M9 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 4 0M9 12h6M9 16h4" />,
  },
  {
    n: 2, name: "Test Planning",
    short: "Define strategy, scope & resources",
    desc: "Define test scope, strategy, approach, resources, schedule and exit criteria. Identify risks early and establish quality benchmarks that the release must meet before shipping.",
    icon: <path d="M8 6h8M8 10h8M8 14h5M3 6l1 1-1 1M3 10l1 1-1 1M3 14l1 1-1 1" />,
  },
  {
    n: 3, name: "Test Design",
    short: "Create test cases & scenarios",
    desc: "Design test cases, test scripts and test data based on requirements. Ensure full coverage of positive, negative and edge-case scenarios. Every scenario traces back to a requirement.",
    icon: <g><path d="M14.5 6.5a4.5 4.5 0 0 0-6 6L4 17l3 3 4.5-4.5a4.5 4.5 0 0 0 6-6L14 13l-3-3z" /><path d="M15 5l4 4" /></g>,
  },
  {
    n: 4, name: "Environment Setup",
    short: "Configure test infrastructure & data",
    desc: "Prepare test environments, tools, test data and infrastructure. Validate that environments are stable and consistent with production configurations before execution begins.",
    icon: (
      <g>
        <rect x="4" y="5" width="16" height="7" rx="2" />
        <rect x="4" y="16" width="16" height="7" rx="2" />
        <circle cx="8" cy="8.5" r="1" fill="var(--gold)" stroke="none" />
        <circle cx="8" cy="19.5" r="1" fill="var(--gold)" stroke="none" />
        <path d="M12 8.5h6M12 19.5h6" strokeLinecap="round" opacity=".6" />
      </g>
    ),
  },
  {
    n: 5, name: "Test Execution",
    short: "Execute tests & log results",
    desc: "Execute test cases systematically, log results and report defects found. Track execution progress against the plan and escalate blockers to keep the release on schedule.",
    icon: <g><circle cx="12" cy="12" r="9" /><path d="M10 8l6 4-6 4V8z" fill="var(--sky-deep)" stroke="none" opacity=".5" /><path d="M10 8l6 4-6 4V8z" /></g>,
  },
  {
    n: 6, name: "Defect Reporting",
    short: "Document & triage defects",
    desc: "Document defects with clear reproducible steps, severity classification and evidence. Triage with development teams to prioritize and resolve issues before the next cycle gate.",
    icon: <g><path d="M12 9v4M12 16h.01M4.93 4.93l14.14 14.14M4.93 19.07 19.07 4.93" opacity=".4" /><circle cx="12" cy="12" r="9" /></g>,
  },
  {
    n: 7, name: "Re-testing",
    short: "Verify defect fixes",
    desc: "Validate that reported defects have been resolved correctly by retesting fix builds in the same environment conditions. Confirm no regression within the fixed area before closing.",
    icon: <g><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /></g>,
  },
  {
    n: 8, name: "Regression Testing",
    short: "Protect existing functionality",
    desc: "Execute full or targeted regression suites to ensure new changes have not broken existing functionality. The critical safety net before any production sign-off.",
    icon: <g><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L24 24" strokeLinecap="round" /><path d="M8 10c.5-2 2-3.5 4-4" strokeLinecap="round" opacity=".6" /></g>,
  },
  {
    n: 9, name: "Test Closure",
    short: "Sign off & document outcomes",
    desc: "Production readiness sign-off with metrics and known issue summary. Lessons learned documented for the next cycle. The cycle ends where the next release begins.",
    icon: <g><path d="M12 2.5l7.5 3v6.2c0 4.7-3.2 8-7.5 9.3-4.3-1.3-7.5-4.6-7.5-9.3V5.5z" /><path d="M8.4 12.2l2.6 2.6 4.6-5" /></g>,
  },
];

export default function STLCDiagram() {
  const [active, setActive] = useState<number | null>(null);
  const reduced = useReducedMotion();

  return (
    <section
      id="stlc"
      aria-label="Software Testing Life Cycle"
      className="relative overflow-hidden bg-paper-warm"
    >
      <WaveDivider fill="var(--paper)" />
      <WaveDivider fill="var(--paper)" flip />
      <Parallax speed={0.2} className="absolute -left-32 top-[20%]">
        <Contours className="relative h-[32rem] w-[32rem] opacity-35" />
      </Parallax>
      <Parallax speed={0.14} className="absolute -right-20 top-[40%]">
        <Contours className="relative h-[24rem] w-[24rem] rotate-45 opacity-30" />
      </Parallax>

      {/* Background cycle watermark */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.025]">
        <svg viewBox="0 0 400 400" className="h-[40rem] w-[40rem]">
          <circle cx="200" cy="200" r="180" fill="none" stroke="var(--sky-deep)" strokeWidth="1.5" strokeDasharray="8 6" />
          <circle cx="200" cy="200" r="120" fill="none" stroke="var(--gold)" strokeWidth="1" strokeDasharray="4 8" />
        </svg>
      </div>

      <SectionStage className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeader
          eyebrow="Quality Engineering · STLC"
          title="Software Testing Life Cycle"
          intro="Nine stages from requirement analysis to production sign-off — the structured framework behind every quality release."
        />
        <p aria-hidden="true" className="hand mt-4 text-xl text-ink-soft opacity-75">
          click any stage to expand
        </p>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stages.map((stage, i) => (
            <Reveal key={stage.n} delay={0.04 * i}>
              <motion.div
                onHoverStart={() => { if (!reduced) setActive(stage.n); }}
                onHoverEnd={() => { if (!reduced) setActive(null); }}
                onClick={() => setActive(active === stage.n ? null : stage.n)}
                whileHover={reduced ? undefined : { y: -3 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className={`cursor-pointer rounded-2xl border p-5 transition-all duration-300 ${
                  active === stage.n
                    ? "border-sky-deep bg-[rgba(56,189,248,0.06)] shadow-[0_8px_32px_rgba(56,189,248,0.16)]"
                    : "border-line bg-card/70 backdrop-blur-sm hover:border-sky-deep/40 hover:shadow-[0_4px_20px_rgba(56,189,248,0.09)]"
                }`}
                role="button"
                aria-expanded={active === stage.n}
                aria-label={`Stage ${stage.n}: ${stage.name}`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-[0.58rem] font-bold tracking-wider transition-all duration-300 ${
                      active === stage.n
                        ? "bg-sky-deep text-white shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                        : "bg-[rgba(56,189,248,0.1)] text-sky-deep"
                    }`}
                    aria-hidden="true"
                  >
                    {String(stage.n).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-[0.95rem] font-semibold leading-snug tracking-wide text-ink">
                      {stage.name}
                    </h3>
                    <p className="mt-0.5 font-mono text-[0.6rem] tracking-wide text-ink-soft">
                      {stage.short}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 transition-colors duration-300 ${active === stage.n ? "text-sky-deep" : "text-ink-soft/60"}`}
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {stage.icon}
                    </svg>
                  </span>
                </div>

                <motion.div
                  initial={false}
                  animate={{
                    height: active === stage.n ? "auto" : 0,
                    opacity: active === stage.n ? 1 : 0,
                  }}
                  transition={{ duration: reduced ? 0 : 0.3, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="mt-3 border-t border-line pt-3 text-[0.78rem] leading-[1.65] text-ink-soft">
                    {stage.desc}
                  </p>
                </motion.div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-gold/30 bg-gold/[0.06] px-6 py-2.5">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2.5l7.5 3v6.2c0 4.7-3.2 8-7.5 9.3-4.3-1.3-7.5-4.6-7.5-9.3V5.5zM8.4 12.2l2.6 2.6 4.6-5" />
            </svg>
            <p className="font-display text-base italic text-gold">
              "The cycle ends where the next release begins."
            </p>
          </div>
        </Reveal>
      </SectionStage>
    </section>
  );
}
