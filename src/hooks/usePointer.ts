import { useEffect } from "react";
import {
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "framer-motion";

/**
 * A single throttled window pointer listener feeding two spring-smoothed
 * motion values in the range -0.5..0.5 (relative to viewport center).
 *
 * Everything reads from these springs via useTransform, so the scene reacts
 * to the cursor without triggering React re-renders — pure GPU transforms.
 * Disabled entirely under prefers-reduced-motion.
 */
export function usePointer(stiffness = 55, damping = 18): {
  x: MotionValue<number>;
  y: MotionValue<number>;
  reduced: boolean;
} {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness, damping, mass: 0.5 });
  const sy = useSpring(y, { stiffness, damping, mass: 0.5 });

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          x.set(tx);
          y.set(ty);
          raf = 0;
        });
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, x, y]);

  return { x: sx, y: sy, reduced: !!reduced };
}
