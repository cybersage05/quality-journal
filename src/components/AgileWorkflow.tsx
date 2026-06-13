import { useState } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "./ui";

const jiraColor: Record<string, string> = {
  "To Do": "text-ink-soft bg-line/60",
  "In Progress": "text-sky-deep bg-[rgba(56,189,248,0.1)]",
  "Testing": "text-gold bg-gold/10",
  "Done": "text-forest bg-forest/10",
};

const stages: {
  name: string;
  jira: "To Do" | "In Progress" | "Testing" | "Done";
  desc: string;
  icon: ReactNode;
}[] = [
  {
    name: "Epic Owners", jira: "To Do",
    desc: "Business stakeholders and product owners define high-level goals and feature sets that drive the release scope.",
    icon: <g><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.5 2.5-6 7-6s7 2.5 7 6" /></g>,
  },
  {
    name: "Epics", jira: "To Do",
    desc: "Large bodies of work broken down into manageable feature sets, each traceable to a business objective.",
    icon: <g><rect x="4" y="5" width="16" height="3" rx="1" /><rect x="4" y="11" width="12" height="3" rx="1" /><rect x="4" y="17" width="8" height="3" rx="1" /></g>,
  },
  {
    name: "User Stories", jira: "To Do",
    desc: "Epics decomposed into user-centric requirements with clear acceptance criteria for QA validation.",
    icon: <path d="M4 6h16M4 10h16M4 14h10M4 18h6" />,
  },
  {
    name: "Sprint Planning", jira: "To Do",
    desc: "Story points estimated, sprint backlog finalized, QA involvement begins — test cases aligned to committed stories.",
    icon: <g><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 9h18M9 4v5M15 4v5" /></g>,
  },
  {
    name: "Development", jira: "In Progress",
    desc: "Engineers implement features. QA monitors build health and prepares test environments in parallel.",
    icon: <g><path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3M9 12h6" /><path d="M12 8v8" /></g>,
  },
  {
    name: "QA Validation", jira: "In Progress",
    desc: "Functional and integration testing against completed stories. Defects raised immediately, retested on fix builds.",
    icon: <g><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L24 24" strokeLinecap="round" /></g>,
  },
  {
    name: "Test Cycle", jira: "Testing",
    desc: "Structured test execution cycles covering smoke, sanity, regression, integration and performance scenarios.",
    icon: <g><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></g>,
  },
  {
    name: "Defect Management", jira: "Testing",
    desc: "Active defect triage — severity/priority classification, root cause analysis, fix coordination and re-verification.",
    icon: <g><path d="M12 9v4M12 16h.01" /><circle cx="12" cy="12" r="9" /></g>,
  },
  {
    name: "Regression Testing", jira: "Testing",
    desc: "Full regression suite execution to confirm no existing functionality has been broken by new changes.",
    icon: <g><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></g>,
  },
  {
    name: "UAT", jira: "Testing",
    desc: "User Acceptance Testing with business stakeholders. Sign-off obtained before production release is approved.",
    icon: <g><path d="M9 12l2 2 5-5" /><path d="M12 2.5l7.5 3v6.2c0 4.7-3.2 8-7.5 9.3-4.3-1.3-7.5-4.6-7.5-9.3V5.5z" /></g>,
  },
  {
    name: "Production Release", jira: "Done",
    desc: "Deployment executed with zero functional defects outstanding. Production smoke testing validates live environment.",
    icon: <g><path d="M12 19V5M5 12l7-7 7 7" /><path d="M5 19h14" /></g>,
  },
  {
    name: "Monitoring & Closure", jira: "Done",
    desc: "Post-release monitoring, metrics collection and sprint retrospective. Lessons documented for continuous improvement.",
    icon: <g><path d="M3 17V7M9 17V4M15 17v-7M21 17V9" /><path d="M1 19h20" /></g>,
  },
];

export default function AgileWorkflow() {
  const [active, setActive] = useState<number | null>(null);
  const reduced = useReducedMotion();

  return (
    <div className="relative mt-12" aria-label="Agile delivery workflow">
      <Reveal>
        <p className="eyebrow mb-6 text-center">Agile Delivery Flow · Jira States</p>
      </Reveal>

      <div className="relative mx-auto max-w-xl">
        {stages.map((stage, i) => {
          const isActive = active === i;
          const isLast = i === stages.length - 1;

          return (
            <div key={stage.name} className="flex flex-col items-center">
              <motion.button
                type="button"
                onHoverStart={() => { if (!reduced) setActive(i); }}
                onHoverEnd={() => { if (!reduced) setActive(null); }}
                onClick={() => setActive(isActive ? null : i)}
                whileHover={reduced ? undefined : { x: 2 }}
                transition={{ duration: 0.18 }}
                className={`w-full rounded-xl border px-4 py-3 text-left transition-all duration-250 ${
                  isActive
                    ? "border-sky-deep bg-[rgba(56,189,248,0.06)] shadow-[0_4px_18px_rgba(56,189,248,0.14)]"
                    : "border-line bg-card/70 hover:border-sky-deep/35"
                }`}
                aria-expanded={isActive}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-250 ${
                      isActive ? "bg-sky-deep text-white" : "bg-[rgba(56,189,248,0.1)] text-sky-deep"
                    }`}
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      {stage.icon}
                    </svg>
                  </span>
                  <span className="flex-1 font-display text-[0.92rem] font-semibold tracking-wide text-ink">
                    {stage.name}
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[0.56rem] tracking-[0.14em] ${jiraColor[stage.jira]}`}
                  >
                    {stage.jira}
                  </span>
                </div>

                <motion.div
                  initial={false}
                  animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
                  transition={{ duration: reduced ? 0 : 0.28, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="mt-2.5 border-t border-line pt-2.5 text-[0.78rem] leading-[1.65] text-ink-soft">
                    {stage.desc}
                  </p>
                </motion.div>
              </motion.button>

              {!isLast && (
                <div
                  className="relative flex h-8 w-px items-center justify-center bg-line"
                  aria-hidden="true"
                >
                  {!reduced && (
                    <span
                      className="flow-dot absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-sky-deep"
                      style={{ animationDelay: `${i * 0.35}s` }}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Jira state legend */}
      <Reveal className="mt-8 flex flex-wrap justify-center gap-3">
        {(["To Do", "In Progress", "Testing", "Done"] as const).map((state) => (
          <span
            key={state}
            className={`rounded-full px-3 py-1 font-mono text-[0.6rem] tracking-[0.16em] ${jiraColor[state]}`}
          >
            {state}
          </span>
        ))}
      </Reveal>
    </div>
  );
}
