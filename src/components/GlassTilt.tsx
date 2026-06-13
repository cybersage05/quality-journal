import { motion, useMotionTemplate } from "framer-motion";
import type { ReactNode } from "react";
import { useTilt } from "../hooks/useTilt";

/**
 * Wraps a card in a 3D glass tilt that follows the pointer, with a moving
 * specular glare. `baseRotate` keeps the hand-placed slight rotation. Falls
 * back to a plain rotated container under prefers-reduced-motion.
 */
export default function GlassTilt({
  baseRotate = 0,
  className,
  children,
}: {
  baseRotate?: number;
  className?: string;
  children: ReactNode;
}) {
  const t = useTilt(6);
  const glare = useMotionTemplate`radial-gradient(circle at ${t.glareX} ${t.glareY}, rgba(255,255,255,0.28), transparent 46%)`;

  if (t.reduced) {
    return (
      <div className={className} style={{ transform: `rotate(${baseRotate}deg)` }}>
        {children}
      </div>
    );
  }

  return (
    <div className={className} style={{ perspective: 1000 }}>
      <motion.div
        ref={t.ref}
        onPointerMove={t.onMove}
        onPointerLeave={t.onLeave}
        style={{
          rotateX: t.rotateX,
          rotateY: t.rotateY,
          rotate: baseRotate,
          transformStyle: "preserve-3d",
        }}
        className="relative h-full [&>*]:h-full"
      >
        {children}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[3] rounded-2xl"
          style={{ backgroundImage: glare, mixBlendMode: "overlay" }}
        />
      </motion.div>
    </div>
  );
}
