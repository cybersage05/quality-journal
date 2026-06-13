import { useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { usePointer } from "../hooks/usePointer";

/*
 * Illustrated-journal decoration library.
 * Everything here is aria-hidden, pointer-events-none ornamentation —
 * background contours, midground vignettes, foreground annotations.
 */

/**
 * Scroll parallax wrapper — children drift vertically at `speed`
 * relative to scroll while in view. Decorative layers only.
 */
export function Parallax({
  children,
  speed = 0.25,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { x: pointerX, y: pointerY } = usePointer();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scrollY = useTransform(scrollYProgress, [0, 1], [speed * 120, speed * -120]);
  const px = useTransform(pointerX, [-0.5, 0.5], [speed * 70, speed * -70]);
  const py = useTransform(pointerY, [-0.5, 0.5], [speed * 45, speed * -45]);
  const y = useTransform([scrollY, py], ([s, p]: number[]) => s + p);
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div ref={ref} style={{ x: px, y }} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Cursor-reactive parallax — children drift with the pointer at `depth` px
 * (negative `depth` moves against the cursor for far layers). Reads the shared
 * pointer springs, so the whole world feels three-dimensional as the mouse
 * moves. Decorative layers only; no movement under reduced-motion.
 */
export function PointerParallax({
  children,
  depth = 14,
  className,
}: {
  children: ReactNode;
  depth?: number;
  className?: string;
}) {
  const { x, y } = usePointer();
  const tx = useTransform(x, [-0.5, 0.5], [depth, -depth]);
  const ty = useTransform(y, [-0.5, 0.5], [depth * 0.66, depth * -0.66]);
  return (
    <motion.div style={{ x: tx, y: ty }} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Scroll-driven "camera" stage for a section's content — a gentle lift, fade
 * and depth-scale as the section enters and leaves the viewport, so scrolling
 * reads like a slow camera move through the world. Keeps text crisp (settles
 * to scale 1). No transform under reduced-motion.
 */
export function SectionStage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.14, 0.88, 1], [0.7, 1, 1, 0.82]);
  const scale = useTransform(scrollYProgress, [0, 0.14, 0.92, 1], [0.985, 1, 1, 0.994]);
  const y = useTransform(scrollYProgress, [0, 0.14], [40, 0]);
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale, y, willChange: "transform, opacity" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Puffy watercolor cloud. */
export function Cloud({
  className,
  opacity = 0.75,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <svg
      viewBox="0 0 220 70"
      aria-hidden="true"
      className={`pointer-events-none ${className ?? ""}`}
      style={{ opacity }}
    >
      <g fill="var(--cloud)">
        <ellipse cx="52" cy="46" rx="42" ry="17" />
        <ellipse cx="96" cy="32" rx="36" ry="20" />
        <ellipse cx="142" cy="40" rx="40" ry="17" />
        <ellipse cx="176" cy="50" rx="32" ry="12" />
        <ellipse cx="98" cy="50" rx="72" ry="15" />
      </g>
      <g fill="var(--sky-deep)" opacity=".18">
        <ellipse cx="98" cy="58" rx="66" ry="7" />
        <ellipse cx="150" cy="52" rx="28" ry="5" />
      </g>
    </svg>
  );
}

/** A sky full of slow clouds — drop into any section background. */
export function CloudBank({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 ${className ?? ""}`}>
      <Cloud className="cloud absolute left-[4%] top-0 w-44 blur-[1px] sm:w-56" opacity={0.7} />
      <Cloud className="cloud absolute right-[10%] top-10 w-32 blur-[1.5px] sm:w-44 [animation-delay:-25s]" opacity={0.55} />
      <Cloud className="cloud absolute left-[42%] top-4 hidden w-36 blur-[2px] md:block [animation-delay:-45s]" opacity={0.4} />
    </div>
  );
}

/** Soft wavy edge that melts one section into the next. */
export function WaveDivider({
  fill = "var(--paper)",
  flip,
  className,
}: {
  fill?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 ${flip ? "bottom-0" : "top-0"} ${className ?? ""}`}
    >
      <svg
        viewBox="0 0 1440 56"
        preserveAspectRatio="none"
        className="block h-8 w-full sm:h-12"
        style={flip ? { transform: "scaleY(-1)" } : undefined}
      >
        <path
          d="M0 0 L1440 0 L1440 22 C1220 50 1040 8 820 26 C600 44 380 14 180 30 C110 36 50 32 0 24 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

/** Topographic contour lines — faint engineering-map background. */
export function Contours({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      aria-hidden="true"
      className={`pointer-events-none absolute text-line ${className ?? ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M40 200c0-60 50-100 110-100s130 30 130 95-55 105-125 105S40 260 40 200z" opacity=".55" />
      <path d="M70 200c0-44 38-74 84-74s98 23 98 70-42 78-94 78-88-30-88-74z" opacity=".45" />
      <path d="M100 198c0-30 26-50 58-50s66 16 66 48-29 54-64 54-60-21-60-52z" opacity=".4" />
      <path d="M130 197c0-17 15-28 33-28s37 9 37 27-16 30-36 30-34-12-34-29z" opacity=".35" />
      <path d="M10 330c60-24 130-10 180 12s140 26 200 2" opacity=".4" />
      <path d="M0 365c70-20 150-4 210 14s130 18 190-2" opacity=".3" />
      <path d="M30 60c50 18 120 10 170-8s130-16 190 6" opacity=".35" />
    </svg>
  );
}

/** Washi tape strip holding a card or inset to the page. */
export function Tape({
  className,
  rotate = -4,
}: {
  className?: string;
  rotate?: number;
}) {
  return (
    <span
      aria-hidden="true"
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`pointer-events-none absolute z-10 block h-6 w-24 bg-gold/30 shadow-[0_1px_2px_rgba(46,58,48,0.12)] backdrop-blur-[1px] ${className ?? ""}`}
    >
      <span className="absolute inset-y-0 left-0 w-[3px] bg-paper/40 [clip-path:polygon(0_0,100%_12%,40%_30%,100%_48%,30%_66%,100%_84%,0_100%)]" />
      <span className="absolute inset-y-0 right-0 w-[3px] bg-paper/40 [clip-path:polygon(100%_0,0_12%,60%_30%,0_48%,70%_66%,0_84%,100%_100%)]" />
    </span>
  );
}

/** Layered watercolor pine tree. */
export function Pine({
  className,
  shade = "var(--forest)",
}: {
  className?: string;
  shade?: string;
}) {
  return (
    <svg viewBox="0 0 60 100" aria-hidden="true" className={`pointer-events-none ${className ?? ""}`}>
      <path d="M30 4 L46 34 L38 32 L52 60 L42 57 L56 86 L4 86 L18 57 L8 60 L22 32 L14 34 Z" fill={shade} opacity=".85" />
      <path d="M30 12 L40 32 L34 30 L44 54 L36 51 L46 78 L30 78 Z" fill="#000" opacity=".08" />
      <rect x="27" y="86" width="6" height="11" rx="1" fill={shade} opacity=".7" />
    </svg>
  );
}

/** A small stand of pines with ground line — midground storytelling. */
export function PineCluster({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none ${className ?? ""}`}>
      <div className="relative flex items-end">
        <Pine className="h-20 w-12 opacity-70" shade="var(--green)" />
        <Pine className="-ml-5 h-32 w-20" />
        <Pine className="-ml-6 h-24 w-14 opacity-80" shade="var(--green)" />
        <svg viewBox="0 0 160 12" className="absolute -bottom-1 left-0 w-full text-line">
          <path d="M4 8c30-5 70-5 100 0s40 2 52-2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

/** A loose flock of distant birds. */
export function Birds({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 50"
      aria-hidden="true"
      className={`pointer-events-none absolute text-ink-soft ${className ?? ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M10 30c3-4 6-4 9 0 3-4 6-4 9 0" opacity=".55" />
      <path d="M48 18c2.5-3.5 5-3.5 7.5 0 2.5-3.5 5-3.5 7.5 0" opacity=".5" />
      <path d="M82 28c2-3 4.5-3 6.5 0 2-3 4.5-3 6.5 0" opacity=".45" />
      <path d="M64 40c2-2.5 4-2.5 6 0 2-2.5 4-2.5 6 0" opacity=".35" />
      <path d="M100 12c2-2.5 4-2.5 6 0 2-2.5 4-2.5 6 0" opacity=".4" />
    </svg>
  );
}

/** Hand-drawn compass rose. */
export function CompassRose({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      aria-hidden="true"
      className={`pointer-events-none absolute text-ink-soft ${className ?? ""}`}
      fill="none"
      stroke="currentColor"
    >
      <circle cx="40" cy="40" r="30" strokeWidth="1" opacity=".5" />
      <circle cx="40" cy="40" r="24" strokeWidth=".7" strokeDasharray="2 4" opacity=".5" />
      <path d="M40 12 L45 38 L40 34 L35 38 Z" fill="var(--terracotta)" stroke="none" opacity=".75" />
      <path d="M40 68 L35 42 L40 46 L45 42 Z" fill="currentColor" stroke="none" opacity=".5" />
      <path d="M12 40 L38 35 L34 40 L38 45 Z M68 40 L42 45 L46 40 L42 35 Z" fill="currentColor" stroke="none" opacity=".35" />
      <text x="40" y="9" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" fontFamily="var(--font-mono)" opacity=".7">N</text>
    </svg>
  );
}

/** Rubber-stamp seal — slightly rotated, inked unevenly. */
export function Stamp({
  text,
  className,
  color = "var(--forest)",
}: {
  text: string;
  className?: string;
  color?: string;
}) {
  return (
    <span
      aria-hidden="true"
      style={{ color, borderColor: color }}
      className={`pointer-events-none absolute z-10 inline-block -rotate-6 rounded-md border-2 px-3 py-1 font-mono text-[0.6rem] font-bold uppercase tracking-[0.25em] opacity-60 mix-blend-multiply dark:mix-blend-screen ${className ?? ""}`}
    >
      {text}
    </span>
  );
}

/** Handwritten margin annotation with a curving arrow. */
export function MarginNote({
  children,
  className,
  arrow = "down",
}: {
  children: ReactNode;
  className?: string;
  arrow?: "down" | "left" | "right" | "none";
}) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-10 flex items-center gap-1.5 ${className ?? ""}`}
    >
      {arrow === "left" && <Squiggle dir="left" />}
      <span className="hand whitespace-nowrap text-lg leading-tight opacity-80">{children}</span>
      {arrow === "right" && <Squiggle dir="right" />}
      {arrow === "down" && <Squiggle dir="down" />}
    </span>
  );
}

function Squiggle({ dir }: { dir: "down" | "left" | "right" }) {
  const rotate = dir === "down" ? "rotate(70 20 12)" : dir === "left" ? "rotate(180 20 12)" : "";
  return (
    <svg viewBox="0 0 40 24" className="h-5 w-8 shrink-0 text-ink-soft opacity-70">
      <g transform={rotate}>
        <path d="M4 12c8-8 16 8 26 0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M26 6l6 6-8 3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/** Figure caption under a diagram — "fig. 03 — release validation flow". */
export function Fig({ n, label }: { n: string; label: string }) {
  return (
    <p
      aria-hidden="true"
      className="mt-6 text-center font-mono text-[0.62rem] italic tracking-[0.18em] text-ink-soft/70"
    >
      — fig. {n} · {label} —
    </p>
  );
}

/** Ghost chapter numeral floating behind a section heading. */
export function GhostNumeral({ n, className }: { n: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute select-none font-display text-[7rem] font-semibold leading-none text-ink/[0.05] sm:text-[10rem] ${className ?? ""}`}
    >
      {n}
    </span>
  );
}

/** A ladybug — the friendliest possible defect. */
export function Ladybug({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={`pointer-events-none ${className ?? ""}`}>
      <ellipse cx="20" cy="22" rx="11" ry="9.5" fill="var(--terracotta)" />
      <circle cx="20" cy="11.5" r="4.5" fill="var(--ink)" />
      <line x1="20" y1="13" x2="20" y2="31" stroke="var(--ink)" strokeWidth="1.2" />
      <circle cx="14.5" cy="20" r="1.7" fill="var(--ink)" />
      <circle cx="25.5" cy="20" r="1.7" fill="var(--ink)" />
      <circle cx="16" cy="26" r="1.4" fill="var(--ink)" />
      <circle cx="24" cy="26" r="1.4" fill="var(--ink)" />
      <path d="M17 8l-3-4M23 8l3-4" stroke="var(--ink)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/** Dragonfly drifting over the page. */
export function Dragonfly({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" aria-hidden="true" className={`pointer-events-none ${className ?? ""}`}>
      <ellipse cx="22" cy="20" rx="14" ry="4" fill="var(--sky)" opacity=".9" transform="rotate(-24 22 20)" />
      <ellipse cx="38" cy="20" rx="14" ry="4" fill="var(--sky)" opacity=".9" transform="rotate(24 38 20)" />
      <ellipse cx="24" cy="24" rx="11" ry="3" fill="var(--mist)" opacity=".8" transform="rotate(-30 24 24)" />
      <ellipse cx="36" cy="24" rx="11" ry="3" fill="var(--mist)" opacity=".8" transform="rotate(30 36 24)" />
      <rect x="28" y="14" width="3.5" height="20" rx="1.75" fill="var(--forest)" />
      <circle cx="29.8" cy="12" r="3" fill="var(--forest)" />
    </svg>
  );
}

/** Pressed-leaf sprig for margins. */
export function Sprig({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 50 90"
      aria-hidden="true"
      className={`pointer-events-none ${className ?? ""}`}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M25 86C22 60 22 32 30 8" fill="none" stroke="var(--green)" strokeWidth="1.4" strokeLinecap="round" opacity=".7" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} opacity={0.65 - i * 0.06}>
          <path
            d={`M${25 - i * 0.8} ${72 - i * 14} q -12 -4 -16 -14 q 12 0 16 10`}
            fill="var(--green-light)"
          />
          <path
            d={`M${26 - i * 0.6} ${66 - i * 14} q 12 -6 14 -16 q -12 1 -15 12`}
            fill="var(--green)"
            opacity=".75"
          />
        </g>
      ))}
    </svg>
  );
}

/** Coffee ring — someone worked late on this page. */
export function CoffeeRing({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={`pointer-events-none absolute ${className ?? ""}`}>
      <circle cx="50" cy="50" r="40" fill="none" stroke="var(--terracotta)" strokeWidth="5" opacity=".1" strokeDasharray="40 14 60 8 90 20" strokeLinecap="round" />
      <circle cx="50" cy="50" r="34" fill="none" stroke="var(--terracotta)" strokeWidth="2" opacity=".08" strokeDasharray="60 30 40 10" />
    </svg>
  );
}

/* ---------- Taped watercolor scene vignettes (midground storytelling) ---------- */

function Vignette({
  children,
  caption,
  className,
  rotate = -2,
}: {
  children: ReactNode;
  caption: string;
  className?: string;
  rotate?: number;
}) {
  return (
    <figure
      aria-hidden="true"
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`pointer-events-none relative border border-line bg-card p-2 pb-1 shadow-[0_4px_14px_rgba(46,58,48,0.1)] ${className ?? ""}`}
    >
      <Tape className="-top-3 left-1/2 -translate-x-1/2" rotate={3} />
      <div className="overflow-hidden">{children}</div>
      <figcaption className="hand py-1 text-center text-base opacity-80">{caption}</figcaption>
    </figure>
  );
}

/** Factory on a hillside — Cal-Comp. */
export function FactoryScene({ className, rotate }: { className?: string; rotate?: number }) {
  return (
    <Vignette caption="the production floor, Bangkok" className={className} rotate={rotate}>
      <svg viewBox="0 0 200 130" className="block w-full">
        <rect width="200" height="130" fill="var(--sky)" opacity=".5" />
        <circle cx="160" cy="28" r="13" fill="var(--gold)" opacity=".5" />
        <path d="M0 80 Q 50 56 100 74 T 200 70 V130 H0 Z" fill="var(--mist)" />
        <path d="M0 96 Q 60 78 120 92 T 200 90 V130 H0 Z" fill="var(--green-light)" opacity=".9" />
        <g transform="translate(58 58)">
          <rect x="0" y="18" width="84" height="34" fill="var(--card)" stroke="var(--ink-soft)" strokeWidth="1.2" />
          <path d="M0 18 L14 6 L14 18 L28 6 L28 18 L42 6 L42 18" fill="var(--terracotta)" opacity=".75" stroke="var(--ink-soft)" strokeWidth="1" />
          <rect x="48" y="2" width="6" height="16" fill="var(--ink-soft)" opacity=".8" />
          <path d="M51 0c4-3 8-5 14-5" stroke="var(--mist)" strokeWidth="4" fill="none" strokeLinecap="round" opacity=".9" />
          <rect x="8" y="26" width="10" height="10" fill="var(--gold)" opacity=".55" />
          <rect x="26" y="26" width="10" height="10" fill="var(--gold)" opacity=".55" />
          <rect x="44" y="26" width="10" height="10" fill="var(--gold)" opacity=".55" />
          <rect x="62" y="26" width="14" height="26" fill="var(--ink-soft)" opacity=".35" />
        </g>
        <path d="M10 122c20-4 50-4 70 0" stroke="var(--green)" strokeWidth="1.4" fill="none" opacity=".7" />
      </svg>
    </Vignette>
  );
}

/** Telecom tower among hills — Ericsson. */
export function TowerScene({ className, rotate }: { className?: string; rotate?: number }) {
  return (
    <Vignette caption="signals over Bangalore" className={className} rotate={rotate}>
      <svg viewBox="0 0 200 130" className="block w-full">
        <rect width="200" height="130" fill="var(--sky)" opacity=".55" />
        <path d="M0 86 Q 60 58 120 80 T 200 72 V130 H0 Z" fill="var(--mist)" />
        <path d="M0 104 Q 70 84 140 100 T 200 96 V130 H0 Z" fill="var(--green-light)" opacity=".9" />
        <g stroke="var(--ink-soft)" strokeWidth="1.4" fill="none">
          <path d="M96 100 L104 28 M120 100 L112 28" />
          <path d="M98 84 L118 84 M100 66 L116 66 M102 48 L114 48 M104 30 L112 30" />
          <path d="M98 84 L116 66 M118 84 L100 66 M100 66 L114 48 M116 66 L102 48" strokeWidth="1" />
        </g>
        <line x1="108" y1="28" x2="108" y2="14" stroke="var(--terracotta)" strokeWidth="1.6" />
        <path d="M97 20a14 14 0 0 1 22 0M101 25a8 8 0 0 1 14 0" stroke="var(--gold)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M30 30c2.5-3 5-3 7.5 0 2.5-3 5-3 7.5 0M55 20c2-2.5 4-2.5 6 0 2-2.5 4-2.5 6 0" stroke="var(--ink-soft)" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity=".6" />
      </svg>
    </Vignette>
  );
}

/** A friendly bot tending its garden — EOX Vantage. */
export function RobotScene({ className, rotate }: { className?: string; rotate?: number }) {
  return (
    <Vignette caption="the helpful machine" className={className} rotate={rotate}>
      <svg viewBox="0 0 200 130" className="block w-full">
        <rect width="200" height="130" fill="var(--sky)" opacity=".45" />
        <path d="M0 96 Q 70 78 140 94 T 200 90 V130 H0 Z" fill="var(--green-light)" opacity=".9" />
        <g transform="translate(76 30)">
          <rect x="6" y="26" width="36" height="40" rx="7" fill="var(--card)" stroke="var(--ink-soft)" strokeWidth="1.4" />
          <rect x="10" y="0" width="28" height="22" rx="6" fill="var(--card)" stroke="var(--ink-soft)" strokeWidth="1.4" />
          <circle cx="19" cy="10" r="3" fill="var(--forest)" />
          <circle cx="29" cy="10" r="3" fill="var(--forest)" />
          <path d="M19 16q5 4 10 0" stroke="var(--ink-soft)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <line x1="24" y1="0" x2="24" y2="-7" stroke="var(--ink-soft)" strokeWidth="1.2" />
          <circle cx="24" cy="-9" r="2.5" fill="var(--gold)" />
          <rect x="14" y="34" width="20" height="14" rx="2" fill="var(--mist)" stroke="var(--ink-soft)" strokeWidth="1" />
          <path d="M17 41h4M25 38v6M31 41h-3" stroke="var(--forest)" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M6 34 Q -6 40 -2 52 M42 34 Q 54 40 50 52" stroke="var(--ink-soft)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </g>
        <g transform="translate(40 92)">
          <path d="M0 8 Q 4 -4 10 0 Q 16 -6 20 4" stroke="var(--green)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </g>
        <g transform="translate(140 88)">
          <path d="M6 12C4 4 8 -2 14 -4 12 4 12 8 6 12z" fill="var(--green)" opacity=".8" />
          <line x1="6" y1="12" x2="6" y2="20" stroke="var(--green)" strokeWidth="1.4" />
        </g>
      </svg>
    </Vignette>
  );
}

/** Foreground meadow band — grass and seed-heads along a section's bottom edge. */
export function MeadowEdge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 70"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`pointer-events-none absolute bottom-0 left-0 w-full ${className ?? ""}`}
    >
      <path d="M0 70 L0 52 Q 360 38 720 50 T 1440 48 L1440 70 Z" fill="var(--green)" opacity=".25" />
      {[60, 200, 340, 520, 700, 880, 1060, 1240, 1380].map((x, i) => (
        <g key={x} transform={`translate(${x} ${54 - (i % 3) * 4})`} stroke="var(--forest)" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity=".5">
          <path d="M0 16 Q -2 6 -6 0" />
          <path d="M2 16 Q 3 4 1 -4" />
          <path d="M4 16 Q 8 8 12 4" />
          {i % 2 === 0 && <circle cx="1" cy="-6" r="2" fill="var(--gold)" stroke="none" opacity=".8" />}
        </g>
      ))}
    </svg>
  );
}

/** Inline style helper for a gentle paper rotation on cards. */
export function tilt(deg: number): CSSProperties {
  return { transform: `rotate(${deg}deg)` };
}

/**
 * Fixed journal-margin rail on very wide screens — a miniature "my journey"
 * trail stitched into the page binding. Pure ornament; the real timeline
 * lives in its own section.
 */
export function JournalRail() {
  const stops = [
    { year: "2021", name: "EOX Vantage" },
    { year: "2021–24", name: "Ericsson" },
    { year: "2024–", name: "Cal-Comp" },
  ];
  return (
    <aside
      aria-hidden="true"
      className="pointer-events-none fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-start min-[1500px]:flex"
    >
      <span className="hand mb-4 -rotate-6 text-xl text-ink-soft opacity-80">my journey ~</span>
      <div className="relative ml-2 flex flex-col gap-9 border-l border-dashed border-gold/50 pl-5">
        {stops.map((s) => (
          <div key={s.name} className="relative">
            <span className="absolute -left-[1.6rem] top-1 h-2.5 w-2.5 rounded-full border border-gold bg-paper" />
            <p className="font-mono text-[0.58rem] tracking-[0.18em] text-gold">{s.year}</p>
            <p className="font-display text-sm font-semibold tracking-wide text-ink-soft">
              {s.name}
            </p>
          </div>
        ))}
        <Sprig className="absolute -bottom-16 -left-4 h-16 w-10 opacity-70" />
      </div>
    </aside>
  );
}
