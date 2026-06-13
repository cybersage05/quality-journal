import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

/*
 * Scroll-driven journey path — a slim organic SVG stroke on the right edge
 * that draws itself as the user scrolls through the portfolio sections.
 * Only visible on extra-wide viewports; decorative, aria-hidden.
 */

const SECTIONS = [
  { id: "top",          label: "Intro" },
  { id: "experience",   label: "Experience" },
  { id: "architecture", label: "AT&T" },
  { id: "projects",     label: "Projects" },
  { id: "contact",      label: "Contact" },
];

/* Organic wavy path in a 20×400 viewBox */
const PATH =
  "M10 0 C 17 48 3 96 10 148 C 17 196 3 244 10 296 C 16 336 4 360 10 400";

/* Y positions for the 5 waypoint dots in the viewBox */
const DOT_Y = [0, 100, 200, 296, 400];

export default function ScrollJourney() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 55, damping: 18, mass: 0.4 });
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observers = SECTIONS.map((s, i) => {
      const el = document.getElementById(s.id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(i); },
        { rootMargin: "-30% 0px -60% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  if (reduced) return null;

  return (
    <aside
      aria-hidden="true"
      className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 min-[1500px]:block"
    >
      <div className="relative h-[55vh] w-10">
        <svg
          viewBox="0 0 20 400"
          className="h-full w-auto"
          fill="none"
          overflow="visible"
        >
          {/* Ghost track */}
          <path
            d={PATH}
            stroke="var(--line)"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.45"
          />

          {/* Live drawing progress */}
          <motion.path
            d={PATH}
            stroke="var(--sky-deep)"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ pathLength: progress }}
            opacity="0.75"
          />

          {/* Waypoint dots */}
          {DOT_Y.map((y, i) => {
            const isActive = active === i;
            const isPast = active > i;
            return (
              <g key={SECTIONS[i].id}>
                {/* Outer pulse ring for active */}
                {isActive && (
                  <circle
                    cx="10" cy={y} r="8"
                    fill="var(--sky-deep)"
                    opacity="0.12"
                  />
                )}
                {/* Dot */}
                <circle
                  cx="10" cy={y}
                  r={isActive ? 3.8 : 2.2}
                  fill={isActive || isPast ? "var(--sky-deep)" : "var(--line)"}
                  style={{ transition: "all 0.4s ease" }}
                />
                {/* Active ring */}
                {isActive && (
                  <circle
                    cx="10" cy={y} r="6"
                    fill="none"
                    stroke="var(--sky-deep)"
                    strokeWidth="0.8"
                    opacity="0.45"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating section labels */}
        {SECTIONS.map((s, i) => (
          <motion.div
            key={s.id}
            className="absolute right-10 -translate-y-1/2 whitespace-nowrap font-mono text-[0.5rem] tracking-[0.22em] text-sky-deep"
            style={{ top: `${(DOT_Y[i] / 400) * 100}%` }}
            animate={{
              opacity: active === i ? 1 : 0,
              x: active === i ? 0 : 5,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {s.label}
          </motion.div>
        ))}
      </div>
    </aside>
  );
}
