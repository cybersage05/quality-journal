import { createContext, useContext, useEffect } from "react";
import {
  motionValue,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "framer-motion";
import type { ReactNode } from "react";

type PointerCtx = {
  x: MotionValue<number>;
  y: MotionValue<number>;
  reduced: boolean;
};

/* Static fallback (e.g. reduced-motion, or consumer outside a provider). */
const fallback: PointerCtx = {
  x: motionValue(0),
  y: motionValue(0),
  reduced: true,
};

const Ctx = createContext<PointerCtx>(fallback);

/**
 * Single source of pointer parallax for the whole app.
 *
 * One throttled window listener feeds two spring-smoothed motion values in the
 * range -0.5..0.5 (relative to viewport center). Every parallax layer reads
 * from these via useTransform, so the scene reacts to the cursor without any
 * React re-renders — pure GPU transforms. Disabled under reduced-motion.
 */
export function PointerProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 55, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 55, damping: 18, mass: 0.5 });

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

  return (
    <Ctx.Provider value={{ x: sx, y: sy, reduced: !!reduced }}>
      {children}
    </Ctx.Provider>
  );
}

/** Read the shared pointer springs. */
export function usePointer(): PointerCtx {
  return useContext(Ctx);
}
