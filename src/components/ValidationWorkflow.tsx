import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, useInView, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Reveal } from "./ui";

interface Step {
  n: string;
  title: string;
  desc: string;
  icon: ReactNode;
}

const steps: Step[] = [
  {
    n: "01",
    title: "Package Integration",
    desc: "Integrate new package versions and verify compatibility with existing environments.",
    icon: (
      <g>
        <path d="M4 8l8-4 8 4v8l-8 4-8-4z" />
        <path d="M4 8l8 4 8-4M12 12v8" />
      </g>
    ),
  },
  {
    n: "02",
    title: "Firmware Verification",
    desc: "Validate firmware behavior, version compatibility, and production readiness.",
    icon: (
      <g>
        <rect x="5" y="5" width="14" height="14" rx="2" />
        <path d="M9 9h6v6H9z" />
        <path d="M3 11h2M3 13h2M19 11h2M19 13h2M11 3v2M13 3v2M11 19v2M13 19v2" />
      </g>
    ),
  },
  {
    n: "03",
    title: "System Testing",
    desc: "Perform end-to-end validation across integrated system components.",
    icon: (
      <g>
        <rect x="4" y="4" width="16" height="7" rx="1.5" />
        <rect x="4" y="13" width="16" height="7" rx="1.5" />
        <path d="M7.5 7.5h.01M7.5 16.5h.01M12 7.5h4M12 16.5h4" />
      </g>
    ),
  },
  {
    n: "04",
    title: "UAT",
    desc: "Verify business workflows and customer-facing scenarios.",
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
    n: "05",
    title: "Functional Testing",
    desc: "Validate expected features, workflows, and requirements.",
    icon: (
      <g>
        <circle cx="12" cy="12" r="9" />
        <path d="M8.5 12l2.5 2.5 4.5-5" />
      </g>
    ),
  },
  {
    n: "06",
    title: "Defect Investigation",
    desc: "Analyze failures, reproduce issues, and perform root cause analysis.",
    icon: (
      <g>
        <circle cx="10.5" cy="10.5" r="6" />
        <path d="M14.5 14.5L20 20" />
      </g>
    ),
  },
  {
    n: "07",
    title: "Release Approval",
    desc: "Approve release after quality gates and validation criteria are met.",
    icon: (
      <g>
        <path d="M12 2.5l7.5 3v6.2c0 4.7-3.2 8-7.5 9.3-4.3-1.3-7.5-4.6-7.5-9.3V5.5z" />
        <path d="M9 12l2 2 4-4" />
      </g>
    ),
  },
];

const METRICS = [
  "Integration Testing",
  "Firmware Validation",
  "System Testing",
  "UAT",
  "Functional Testing",
  "Root Cause Analysis",
];

function StepCard({
  step,
  index,
  isActive,
  onToggle,
  reduced,
}: {
  step: Step;
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
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Icon node — decorative, state-driven glow */}
      <div
        aria-hidden="true"
        className={`relative z-10 mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
          isActive
            ? "border-sky-deep bg-sky-deep/15 shadow-[0_0_0_5px_rgba(56,189,248,0.12),0_0_22px_rgba(56,189,248,0.38)]"
            : "border-line bg-card"
        }`}
      >
        {/* Pulse ring when active */}
        {isActive && !reduced && (
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-full border-2 border-sky-deep/60"
            animate={{ scale: [1, 1.6, 1.6], opacity: [0.7, 0, 0] }}
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
          {step.icon}
        </svg>
      </div>

      {/* Glass card */}
      <div
        className={`mb-3 flex-1 overflow-hidden rounded-2xl border backdrop-blur-[4px] transition-all duration-300 ${
          isActive
            ? "border-sky-deep/40 bg-[rgba(56,189,248,0.06)] shadow-[0_8px_32px_rgba(56,189,248,0.16)]"
            : "border-line bg-card/80 hover:border-sky-deep/25 hover:shadow-[0_4px_16px_rgba(46,58,48,0.07)]"
        }`}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isActive}
          aria-label={`${isActive ? "Collapse" : "Expand"} ${step.title}`}
          className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-deep focus-visible:ring-offset-2"
        >
          <div>
            <span className="block font-mono text-[0.55rem] tracking-[0.3em] text-sky-deep">
              STAGE {step.n}
            </span>
            <h4 className="mt-0.5 font-display text-[1rem] font-semibold leading-snug tracking-wide text-ink">
              {step.title}
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
          <p className="border-t border-line px-4 pb-4 pt-3 text-[0.82rem] leading-[1.65] text-ink-soft">
            {step.desc}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function ValidationWorkflow() {
  const [active, setActive] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 25%"],
  });
  const lineProgress = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 14,
    mass: 0.5,
  });

  function toggle(i: number) {
    setActive((prev) => (prev === i ? null : i));
  }

  /* top-[2.75rem] = first node circle center; bottom-4 clears the last node */
  const CONNECTOR_CLASSES =
    "pointer-events-none absolute bottom-4 left-[1.3rem] top-[2.75rem] w-px";

  return (
    <div ref={containerRef} className="mt-16" aria-label="Validation workflow">
      {/* Header */}
      <Reveal>
        <p className="eyebrow mb-3 text-center">Enterprise QA · Cal-Comp Electronics</p>
        <h3 className="section-title text-center font-display font-semibold leading-[1.18] tracking-wide text-ink">
          Validation Workflow
        </h3>
        <p className="mx-auto mt-3 max-w-lg text-center text-[0.84rem] leading-[1.7] text-ink-soft">
          Ensuring reliability, compatibility, and release readiness across enterprise systems.
        </p>
      </Reveal>

      {/* Timeline */}
      <div className="relative mx-auto mt-10 max-w-xl">
        {/* Ghost connector track */}
        <div aria-hidden="true" className={`${CONNECTOR_CLASSES} bg-line/50`} />

        {/* Scroll-driven live connector */}
        {!reduced && (
          <motion.div
            aria-hidden="true"
            className={`${CONNECTOR_CLASSES} origin-top bg-sky-deep`}
            style={{
              scaleY: lineProgress,
              boxShadow: "0 0 7px rgba(56,189,248,0.75)",
            }}
          />
        )}

        {/* Flowing particles along the connector */}
        {!reduced && (
          <div aria-hidden="true" className={CONNECTOR_CLASSES}>
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

        {/* Step cards */}
        <div className="relative">
          {steps.map((step, i) => (
            <StepCard
              key={step.n}
              step={step}
              index={i}
              isActive={active === i}
              onToggle={() => toggle(i)}
              reduced={!!reduced}
            />
          ))}
        </div>
      </div>

      {/* Footer metric bar */}
      <Reveal className="mt-8 flex flex-wrap justify-center gap-2.5">
        {METRICS.map((m) => (
          <span
            key={m}
            className="flex items-center gap-1.5 rounded-full border border-forest/30 bg-forest/[0.06] px-3 py-1 font-mono text-[0.58rem] tracking-[0.18em] text-forest"
          >
            <svg
              viewBox="0 0 12 12"
              className="h-2.5 w-2.5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M1.5 6L5 9.5 10.5 3" />
            </svg>
            {m}
          </span>
        ))}
      </Reveal>
    </div>
  );
}
