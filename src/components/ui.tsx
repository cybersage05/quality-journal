import { motion, useReducedMotion, useInView } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";

/** Cinematic scroll-entry reveal — blur lift + snappy spring easing. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Museum-label section header: eyebrow + large serif title + optional intro. */
export function SectionHeader({
  eyebrow,
  title,
  intro,
  align = "left",
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  children?: ReactNode;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <Reveal className={align === "center" ? "text-center" : ""}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title mt-3 font-display font-semibold leading-[1.18] tracking-wide text-ink">
        {title}
      </h2>
      <span ref={ref} aria-hidden="true" className={`mt-3 block h-px overflow-hidden ${align === "center" ? "mx-auto" : ""}`} style={{ width: 64 }}>
        <motion.span
          className="block h-full bg-gold/70"
          initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : undefined}
          style={{ transformOrigin: align === "center" ? "center" : "left" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        />
      </span>
      {intro && (
        <p
          className={`mt-4 max-w-xl text-[0.85rem] leading-[1.7] text-ink-soft ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {intro}
        </p>
      )}
      {children}
    </Reveal>
  );
}

/** Scannable fact chips under a chapter header — role · place · period. */
export function MetaChips({ items }: { items: { icon: "pin" | "calendar" | "building" | "people"; text: string }[] }) {
  const paths = {
    pin: <path d="M12 21s-6-6.2-6-10.5a6 6 0 1 1 12 0C18 14.8 12 21 12 21zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />,
    calendar: <g><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M4 10h16M8 3v4M16 3v4" /></g>,
    building: <g><path d="M4 21V7l8-4 8 4v14" /><path d="M9 21v-6h6v6M9 11h.01M15 11h.01" /></g>,
    people: <g><circle cx="9" cy="8" r="3.5" /><path d="M3 20c0-3.5 2.5-6 6-6s6 2.5 6 6M16 5a3.5 3.5 0 0 1 0 7M18 14.5c2 .8 3 2.8 3 5.5" /></g>,
  };
  return (
    <ul className="mt-5 flex flex-wrap gap-2" aria-label="Key facts">
      {items.map((m) => (
        <li
          key={m.text}
          className="flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1 font-mono text-[0.62rem] tracking-wide text-ink-soft"
        >
          <svg viewBox="0 0 24 24" className="h-3 w-3 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {paths[m.icon]}
          </svg>
          {m.text}
        </li>
      ))}
    </ul>
  );
}

/** Soft tech pills that warm to green-light on hover. */
export function Pills({ items, label }: { items: string[]; label?: string }) {
  return (
    <ul
      aria-label={label ?? "Technologies"}
      className="flex flex-wrap gap-2"
    >
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full border border-line bg-card px-3 py-1 font-mono text-[0.68rem] tracking-wide text-ink-soft transition-colors duration-300 hover:border-green-light hover:bg-green-light/40 hover:text-ink"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Gold impact line, mono — the "field note" metric. */
export function Impact({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[0.72rem] tracking-wider text-gold">
      {children}
    </p>
  );
}

/** Hand-drawn-feel gold leaf checkmark. */
export function LeafCheck() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="mt-0.5 h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path
        d="M16 4c-6 0-10 2.5-11.2 8.4-.3 1.7.3 3.2.9 3.8.9-2.6 3.2-6 7.3-8.3-2.9 2.7-5.2 5.9-6.1 8.8C12 16.4 16 12 16 4z"
        fill="var(--gold)"
      />
    </svg>
  );
}
