import { useRef } from "react";
import {
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

/**
 * 3D glass-tilt for a card. Returns spring-smoothed rotateX / rotateY plus a
 * moving glare position, and the handlers to wire onto a motion element.
 * Pointer is read locally (per-card) so many cards stay independent.
 * No-ops under prefers-reduced-motion.
 */
export function useTilt(max = 7) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 150, damping: 18, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 150, damping: 18, mass: 0.4 });

  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const glareX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(sy, [0, 1], ["0%", "100%"]);

  const onMove = (e: React.PointerEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return {
    ref,
    onMove,
    onLeave,
    rotateX,
    rotateY,
    glareX,
    glareY,
    reduced: !!reduced,
  } as {
    ref: React.RefObject<HTMLDivElement>;
    onMove: (e: React.PointerEvent) => void;
    onLeave: () => void;
    rotateX: MotionValue<number>;
    rotateY: MotionValue<number>;
    glareX: MotionValue<string>;
    glareY: MotionValue<string>;
    reduced: boolean;
  };
}
