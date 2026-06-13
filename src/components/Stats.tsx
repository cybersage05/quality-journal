import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { Contours } from "./decor";

/* Tiny hand-sketched glyphs above each field number */
const glyphs: Record<string, ReactNode> = {
  leaf: <path d="M16 4C9 4 4 7 2.6 13.4c-.4 2 .3 3.8 1 4.6C5 14.8 8 11 12.6 8.4 9.4 11.4 6.8 15 5.8 18.4 12.4 18 16 12.4 16 4z" fill="var(--green)" />,
  chart: (
    <g stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" fill="none">
      <path d="M3 17V8M8 17V4M13 17v-7M18 17V6" />
      <path d="M1 19h18" stroke="var(--ink-soft)" />
    </g>
  ),
  gear: (
    <g stroke="var(--green)" strokeWidth="1.4" fill="none">
      <circle cx="10" cy="10" r="4" />
      <path d="M10 2v3M10 15v3M2 10h3M15 10h3M4.3 4.3l2.1 2.1M13.6 13.6l2.1 2.1M15.7 4.3l-2.1 2.1M6.4 13.6l-2.1 2.1" strokeLinecap="round" />
    </g>
  ),
  db: (
    <g stroke="var(--green)" strokeWidth="1.4" fill="none">
      <ellipse cx="10" cy="4.5" rx="7" ry="2.8" />
      <path d="M3 4.5v11c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8v-11M3 10c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8" />
    </g>
  ),
  award: (
    <g stroke="var(--gold)" strokeWidth="1.4" fill="none">
      <circle cx="10" cy="8" r="5.5" />
      <path d="M7 12.5L5 19l5-2.5L15 19l-2-6.5" strokeLinejoin="round" />
      <path d="M8 8l1.5 1.5L13 6" strokeLinecap="round" />
    </g>
  ),
};

const stats = [
  { value: 5, suffix: "+", label: "Years Experience", glyph: "leaf" },
  { value: 40, suffix: "%", label: "Manual Effort Reduced", glyph: "chart" },
  { value: 75, suffix: "%", label: "Load Reduction via RPA", glyph: "gear" },
  { value: 10, suffix: "M+", label: "Subscriber Records Tested", glyph: "db" },
  { value: 2, suffix: "", label: "Ericsson Awards", glyph: "award" },
];

function Stat({ value, suffix, label, glyph }: (typeof stats)[number]) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, value]);

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <svg viewBox="0 0 20 20" className="h-5 w-5 opacity-80" aria-hidden="true">
        {glyphs[glyph]}
      </svg>
      <span ref={ref} className="font-display text-3xl font-semibold text-gold sm:text-4xl">
        {n}
        {suffix}
      </span>
      <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink-soft">
        {label}
      </span>
    </div>
  );
}

export default function Stats() {
  return (
    <section id="stats" aria-label="Career statistics" className="relative bg-paper">
      <Contours className="-left-20 -top-24 h-[26rem] w-[26rem] opacity-40" />
      <div className="relative z-20 mx-auto -mt-24 max-w-6xl px-5 sm:px-8">
        <div className="rounded-2xl border border-white/50 bg-card/75 px-5 py-10 shadow-[0_12px_40px_rgba(20,40,56,0.14)] backdrop-blur-md dark:border-line">
          <p
            aria-hidden="true"
            className="hand mb-7 text-center text-xl text-ink-soft opacity-80"
          >
            ~ field numbers, measured not estimated ~
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-5">
            {stats.map((s) => (
              <Stat key={s.label} {...s} />
            ))}
          </div>
        </div>
      </div>
      <div className="h-16" />
    </section>
  );
}
