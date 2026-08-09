"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CLOSED_HOLD_MS = 420;
const DOOR_OPEN_DURATION_SECONDS = 7;
const INTRO_DURATION_MS = CLOSED_HOLD_MS + DOOR_OPEN_DURATION_SECONDS * 1000;
const DOOR_CELLS = Array.from({ length: 40 }, (_, index) => index);

function DoorStudGrid() {
  return (
    <div className="reference-door-grid" aria-hidden>
      {DOOR_CELLS.map((cell) => (
        <span key={cell} className="reference-door-cell">
          <span />
        </span>
      ))}
    </div>
  );
}

function DoorPanel({ side }: { side: "left" | "right" }) {
  return (
    <div className={`reference-door-panel reference-door-panel--${side}`}>
      <div className="reference-door-grain" />
      <div className="reference-door-sheen" />
      <div className="reference-door-outer-rail" />
      <div className="reference-door-top-rail" />
      <DoorStudGrid />
      <div className={`reference-door-center-rail reference-door-center-rail--${side}`} />
      <div className={`reference-door-pull reference-door-pull--${side}`} aria-hidden>
        <span />
        <span />
      </div>
      <div className="reference-door-bottom-rail" />
    </div>
  );
}

export function DoorIntro() {
  const [phase, setPhase] = useState<"closed" | "opening" | "done">("closed");

  useEffect(() => {
    const openTimer = setTimeout(() => setPhase("opening"), CLOSED_HOLD_MS);
    const doneTimer = setTimeout(() => {
      setPhase("done");
    }, INTRO_DURATION_MS);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className={`reference-door-intro fixed inset-0 z-[100] overflow-hidden ${phase === "opening" ? "pointer-events-none" : ""}`}
          exit={{ opacity: 0 }}
          transition={{ duration: 0 }}
          style={{ perspective: "1800px" }}
        >
          <div className="reference-door-leaves">
            <motion.div
              className="reference-door-leaf reference-door-leaf--left"
              initial={{ rotateY: 0, x: 0 }}
              animate={phase === "opening" ? { rotateY: -108, x: -18, z: -6 } : { rotateY: 0, x: 0, z: 0 }}
              transition={{ duration: DOOR_OPEN_DURATION_SECONDS, ease: [0.16, 0.78, 0.24, 1] }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <DoorPanel side="left" />
            </motion.div>

            <motion.div
              className="reference-door-leaf reference-door-leaf--right"
              initial={{ rotateY: 0, x: 0 }}
              animate={phase === "opening" ? { rotateY: 108, x: 18, z: -6 } : { rotateY: 0, x: 0, z: 0 }}
              transition={{ duration: DOOR_OPEN_DURATION_SECONDS, ease: [0.16, 0.78, 0.24, 1] }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <DoorPanel side="right" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
