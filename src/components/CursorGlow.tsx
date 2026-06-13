import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * A soft blue glow that trails the cursor across the whole page.
 * Pointer-driven via a single rAF-throttled listener (no re-renders), shown
 * only on fine-pointer devices and never under reduced-motion. Sits above the
 * page on a non-interactive layer with screen blending so it reads as light.
 */
export default function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 220, damping: 26, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 220, damping: 26, mass: 0.5 });

  useEffect(() => {
    const fine =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return;
    setEnabled(true);

    let raf = 0;
    let tx = -200;
    let ty = -200;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
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
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed z-[55] hidden h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen lg:block dark:mix-blend-plus-lighter"
      style={{
        left: sx,
        top: sy,
        background:
          "radial-gradient(closest-side, rgba(56,189,248,0.22), transparent 68%)",
        opacity: 0.65,
      }}
    />
  );
}
