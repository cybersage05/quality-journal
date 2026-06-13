import { useId, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export type Tone = "default" | "green" | "terracotta" | "gold";

export type FlowIcon =
  | "package"
  | "search"
  | "clipboard"
  | "server"
  | "play"
  | "bug"
  | "doc"
  | "seal"
  | "loop"
  | "bolt"
  | "download"
  | "shield"
  | "wrench"
  | "chart"
  | "bot"
  | "db"
  | "flag";

export interface FlowNode {
  title: string;
  details?: string[];
  tone?: Tone;
  icon?: FlowIcon;
  /** Terracotta defect-loop branch rendered beside/below this node. */
  branch?: {
    label: string;
    nodes: FlowNode[];
    loopNote?: string;
  };
  connectorLabel?: string;
}

/* Tiny hand-drawn stage icons (24px stroke glyphs) */
const icons: Record<FlowIcon, ReactNode> = {
  package: (
    <g>
      <path d="M4 8l8-4 8 4v8l-8 4-8-4z" />
      <path d="M4 8l8 4 8-4M12 12v8" />
    </g>
  ),
  search: (
    <g>
      <circle cx="10.5" cy="10.5" r="5.5" />
      <path d="M14.5 14.5L20 20" />
    </g>
  ),
  clipboard: (
    <g>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4h6v3H9zM9 11h6M9 15h4" />
    </g>
  ),
  server: (
    <g>
      <rect x="4" y="4" width="16" height="7" rx="1.5" />
      <rect x="4" y="13" width="16" height="7" rx="1.5" />
      <path d="M7.5 7.5h.01M7.5 16.5h.01M12 7.5h4M12 16.5h4" />
    </g>
  ),
  play: (
    <g>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10 8.5l6 3.5-6 3.5z" />
    </g>
  ),
  bug: (
    <g>
      <ellipse cx="12" cy="14" rx="5" ry="6" />
      <path d="M12 8V5M8 6l1.5 2.5M16 6l-1.5 2.5M7 12H4M20 12h-3M7 17l-2.5 2M17 17l2.5 2M12 9v10" />
    </g>
  ),
  doc: (
    <g>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </g>
  ),
  seal: (
    <g>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8 12.5l2.8 2.8L16.5 9" />
    </g>
  ),
  loop: (
    <g>
      <path d="M5 12a7 7 0 0 1 12-5l2 2M19 12a7 7 0 0 1-12 5l-2-2" />
      <path d="M19 4v5h-5M5 20v-5h5" />
    </g>
  ),
  bolt: <path d="M13 3L5 14h6l-1 7 9-12h-6z" />,
  download: (
    <g>
      <path d="M12 4v10M8 10l4 4 4-4" />
      <path d="M5 18h14" />
    </g>
  ),
  shield: (
    <g>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      <path d="M9 12l2.2 2.2L15.5 10" />
    </g>
  ),
  wrench: (
    <g>
      <path d="M14.5 6.5a4.5 4.5 0 0 0-6 6L4 17l3 3 4.5-4.5a4.5 4.5 0 0 0 6-6L14 13l-3-3z" />
    </g>
  ),
  chart: (
    <g>
      <path d="M4 20h16M7 16v-5M12 16V7M17 16v-8" />
    </g>
  ),
  bot: (
    <g>
      <rect x="6" y="9" width="12" height="10" rx="3" />
      <rect x="9" y="3" width="6" height="4" rx="2" />
      <path d="M10 13.5h.01M14 13.5h.01M10 16.5h4" />
    </g>
  ),
  db: (
    <g>
      <ellipse cx="12" cy="6" rx="7" ry="2.8" />
      <path d="M5 6v12c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8V6M5 12c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8" />
    </g>
  ),
  flag: (
    <g>
      <path d="M6 21V4" />
      <path d="M6 5c4-2 8 2 12 0v8c-4 2-8-2-12 0" />
    </g>
  ),
};

const toneStyles: Record<Tone, string> = {
  default: "border-line bg-card text-ink",
  green: "border-green/50 bg-card text-ink",
  terracotta: "border-terracotta/50 bg-card text-ink",
  gold: "border-gold/60 bg-card text-ink shadow-[0_0_0_3px_rgba(201,164,92,0.12)]",
};

const toneIcon: Record<Tone, string> = {
  default: "bg-green/10 text-forest",
  green: "bg-green/15 text-forest",
  terracotta: "bg-terracotta/12 text-terracotta",
  gold: "bg-gold/15 text-gold",
};

function Connector({ label, tone = "default" }: { label?: string; tone?: Tone }) {
  const color = tone === "terracotta" ? "bg-terracotta/45" : "bg-line";
  return (
    <div className="flex flex-col items-center py-0.5" aria-hidden="true">
      <div className={`h-4 w-px ${color}`} />
      {label && (
        <span className="my-0.5 max-w-[16rem] text-center font-mono text-[0.6rem] italic tracking-wide text-ink-soft/80">
          {label}
        </span>
      )}
      {label && <div className={`h-4 w-px ${color}`} />}
      <svg viewBox="0 0 10 6" className="h-1.5 w-2.5 text-line" aria-hidden="true">
        <path
          d="M1 1l4 4 4-4"
          fill="none"
          stroke={tone === "terracotta" ? "var(--terracotta)" : "var(--line)"}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function NodeCard({ node, compact }: { node: FlowNode; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const id = useId();
  const tone = node.tone ?? "default";
  const expandable = !!node.details?.length;

  const inner = (
    <>
      <span
        className={`flex shrink-0 items-center justify-center rounded-full ${toneIcon[tone]} ${
          compact ? "h-6 w-6" : "h-7 w-7"
        }`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          className={compact ? "h-3.5 w-3.5" : "h-4 w-4"}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icons[node.icon ?? "clipboard"]}
        </svg>
      </span>
      <span
        className={`font-display font-semibold tracking-wide ${
          compact ? "text-[0.95rem]" : "text-base sm:text-lg"
        } ${tone === "gold" ? "text-gold" : ""}`}
      >
        {node.title}
      </span>
      {expandable && (
        <span
          aria-hidden="true"
          className={`ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            open
              ? "rotate-45 border-gold bg-gold/15 text-gold"
              : "border-line text-ink-soft"
          }`}
        >
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M6 2v8M2 6h8" />
          </svg>
        </span>
      )}
    </>
  );

  return (
    <div
      className={`w-full max-w-md rounded-xl border ${toneStyles[tone]} shadow-[0_1px_3px_rgba(46,58,48,0.06)] transition-all duration-300 ${
        expandable
          ? "hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-[0_5px_16px_rgba(46,58,48,0.12)]"
          : ""
      } ${open ? "border-gold/60 shadow-[0_6px_18px_rgba(201,164,92,0.14)]" : ""}`}
    >
      {expandable ? (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className={`flex w-full items-center gap-2.5 rounded-xl text-left ${
            compact ? "px-3 py-2" : "px-3.5 py-2.5"
          }`}
        >
          {inner}
        </button>
      ) : (
        <div className={`flex items-center gap-2.5 ${compact ? "px-3 py-2" : "px-3.5 py-2.5"}`}>
          {inner}
        </div>
      )}
      <AnimatePresence initial={false}>
        {open && expandable && (
          <motion.div
            id={id}
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="overflow-hidden"
          >
            <div className={`${compact ? "px-3 pb-2.5" : "px-3.5 pb-3"}`}>
              <ul className="space-y-1.5 rounded-lg border-l-2 border-gold/60 bg-paper-warm/70 py-2.5 pl-4 pr-3">
                {node.details!.map((d) => (
                  <li key={d} className="flex gap-2 text-[0.78rem] leading-[1.6] text-ink-soft">
                    <svg viewBox="0 0 12 12" className="mt-1 h-2.5 w-2.5 shrink-0" aria-hidden="true">
                      <path
                        d="M10 2C6 2 3.4 3.5 2.6 7c-.2 1 .2 2 .6 2.4C4 7.5 5.5 5.5 8 4.2 6.2 5.8 4.8 7.8 4.2 9.6 7.8 9.3 10 6.8 10 2z"
                        fill="var(--gold)"
                      />
                    </svg>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Illustrated vertical flow — rounded paper nodes with stage icons,
 * hairline connectors, optional terracotta defect-loop branches.
 * Fully keyboard accessible.
 */
export function FlowDiagram({
  nodes,
  compact = false,
  ariaLabel,
  description,
}: {
  nodes: FlowNode[];
  compact?: boolean;
  ariaLabel: string;
  description?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-col items-center">
      {description && <p className="sr-only">{description}</p>}
      {nodes.map((node, i) => (
        <motion.div
          key={node.title}
          className="flex w-full flex-col items-center"
          initial={reduced ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.4, delay: 0.05 * Math.min(i, 8), ease: "easeOut" }}
        >
          <NodeCard node={node} compact={compact} />
          {node.branch && (
            <div className="mt-2 w-full max-w-md rounded-xl border border-dashed border-terracotta/40 bg-terracotta/[0.05] p-3">
              <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-terracotta">
                {node.branch.label}
              </p>
              <div className="flex flex-col items-center">
                {node.branch.nodes.map((bn, j) => (
                  <div key={bn.title} className="flex w-full flex-col items-center">
                    <NodeCard node={{ ...bn, tone: bn.tone ?? "terracotta" }} compact />
                    {j < node.branch!.nodes.length - 1 && <Connector tone="terracotta" />}
                  </div>
                ))}
                {node.branch.loopNote && (
                  <p className="mt-2 flex items-center gap-2 font-mono text-[0.64rem] italic text-terracotta">
                    <span aria-hidden="true" className="text-sm">↺</span>
                    {node.branch.loopNote}
                  </p>
                )}
              </div>
            </div>
          )}
          {i < nodes.length - 1 && (
            <Connector
              label={compact ? undefined : node.connectorLabel}
              tone={node.branch ? "default" : node.tone === "terracotta" ? "terracotta" : "default"}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
