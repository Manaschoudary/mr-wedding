"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type IntroPetalSpec = {
  readonly delay: number;
  readonly startX: number;
  readonly startY: number;
  readonly endX: number;
  readonly endY: number;
  readonly duration: number;
  readonly size: number;
  readonly rotationStart: number;
  readonly rotationEnd: number;
};

const CLOSED_HOLD_MS = 420;
const DOOR_OPEN_DURATION_SECONDS = 3.08;
const INTRO_DURATION_MS = CLOSED_HOLD_MS + DOOR_OPEN_DURATION_SECONDS * 1000;
const DOOR_CELLS = Array.from({ length: 40 }, (_, index) => index);

const INTRO_PETALS: readonly IntroPetalSpec[] = [
  { delay: 0.45, startX: 86, startY: -8, endX: 62, endY: 60, duration: 3.4, size: 22, rotationStart: -30, rotationEnd: 250 },
  { delay: 0.72, startX: 79, startY: -12, endX: 39, endY: 76, duration: 3.9, size: 18, rotationStart: 46, rotationEnd: -180 },
  { delay: 0.94, startX: 12, startY: -6, endX: 31, endY: 58, duration: 3.1, size: 16, rotationStart: 110, rotationEnd: 340 },
  { delay: 1.08, startX: 64, startY: -10, endX: 73, endY: 90, duration: 4.0, size: 24, rotationStart: -74, rotationEnd: 210 },
  { delay: 1.2, startX: 52, startY: -8, endX: 45, endY: 68, duration: 3.6, size: 17, rotationStart: 18, rotationEnd: -240 },
  { delay: 1.36, startX: 34, startY: -12, endX: 57, endY: 82, duration: 4.1, size: 20, rotationStart: -120, rotationEnd: 165 },
  { delay: 1.58, startX: 92, startY: 6, endX: 68, endY: 102, duration: 3.5, size: 14, rotationStart: 60, rotationEnd: 330 },
  { delay: 1.76, startX: 5, startY: 8, endX: 27, endY: 96, duration: 3.8, size: 18, rotationStart: 18, rotationEnd: -210 },
  { delay: 2.0, startX: 74, startY: -6, endX: 51, endY: 54, duration: 2.7, size: 15, rotationStart: -50, rotationEnd: 190 },
];

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

function DoorBackdrop({ active }: { active: boolean }) {
  return (
    <motion.div
      className="reference-door-backdrop"
      initial={{ opacity: 0.96, scale: 1.02 }}
      animate={active ? { opacity: 1, scale: 1 } : { opacity: 0.96, scale: 1.02 }}
      transition={{ duration: 1.1, ease: "easeOut" }}
      aria-hidden
    />
  );
}

function IntroPetal({ petal, active }: { petal: IntroPetalSpec; active: boolean }) {
  return (
    <motion.div
      className="reference-intro-petal"
      style={{ width: `${petal.size}px`, height: `${petal.size + 5}px` }}
      initial={{ opacity: 0, x: `${petal.startX}vw`, y: `${petal.startY}vh`, rotate: petal.rotationStart }}
      animate={
        active
          ? {
              opacity: [0, 0.88, 0.78, 0],
              x: [`${petal.startX}vw`, `${(petal.startX + petal.endX) / 2}vw`, `${petal.endX}vw`],
              y: [`${petal.startY}vh`, `${(petal.startY + petal.endY) / 2}vh`, `${petal.endY}vh`],
              rotate: [petal.rotationStart, (petal.rotationStart + petal.rotationEnd) / 2, petal.rotationEnd],
            }
          : { opacity: 0, x: `${petal.startX}vw`, y: `${petal.startY}vh`, rotate: petal.rotationStart }
      }
      transition={{ duration: petal.duration, delay: petal.delay, ease: "easeInOut" }}
    >
      <svg width="100%" height="100%" viewBox="0 0 24 28" fill="none">
        <ellipse cx="12" cy="14" rx="8.5" ry="12" fill="#f4c7d0" opacity="0.9" />
        <ellipse cx="10.5" cy="11.5" rx="5.5" ry="7.5" fill="#fff2f4" opacity="0.55" />
      </svg>
    </motion.div>
  );
}

function IntroPetals({ active }: { active: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden>
      {INTRO_PETALS.map((petal) => (
        <IntroPetal key={`${petal.startX}-${petal.delay}`} petal={petal} active={active} />
      ))}
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
          className="reference-door-intro fixed inset-0 z-[100] overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0 }}
          style={{ perspective: "1800px" }}
        >
          <DoorBackdrop active={phase === "opening"} />
          <IntroPetals active={phase === "opening"} />
          <div className="reference-door-frame" aria-hidden>
            <span />
            <span />
          </div>
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
          <div className="reference-door-vignette" aria-hidden />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
