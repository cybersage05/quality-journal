import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Cover page — cream paper, a leaf draws itself, name fades in,
 * then dissolves into the hero like turning a page. Click anywhere to skip.
 */
export default function Loader({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  const reduced = useReducedMotion();

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), reduced ? 250 : 1400);
    return () => clearTimeout(t);
  }, [reduced]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          role="status"
          aria-label="Loading — Reevan D'Souza, Software QA and Test Engineer"
          onClick={() => setVisible(false)}
          className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center bg-paper"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <svg viewBox="0 0 48 48" className="h-14 w-14" aria-hidden="true">
            <path
              className="leaf-path"
              d="M38 9C24 9 13 14.5 10.2 27.5c-.8 4 .7 7.5 2.1 9 2-6.3 7.5-14.4 17-19.8C22.4 23 17 30.5 14.9 37.5 28.5 36.6 38 26 38 9z"
              fill="none"
              stroke="var(--forest)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.55, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="font-display text-2xl font-semibold tracking-[0.08em] text-ink">
              REEVAN D'SOUZA
            </p>
            <p className="eyebrow mt-2">Software QA &amp; Test Engineer</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
