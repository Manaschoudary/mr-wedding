"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";

type PetalSpec = {
  readonly delay: number;
  readonly startX: number;
  readonly duration: number;
  readonly size: number;
  readonly rotationStart: number;
  readonly rotationMid: number;
  readonly rotationEnd: number;
  readonly driftA: number;
  readonly driftB: number;
  readonly repeatDelay: number;
};

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

const DOOR_CELLS = Array.from({ length: 40 }, (_, index) => index);

const HANGING_DECOR = [
  { left: 6, height: 82, scale: 0.9 },
  { left: 12, height: 116, scale: 1.1 },
  { left: 19, height: 72, scale: 0.74 },
  { left: 70, height: 94, scale: 0.86 },
  { left: 78, height: 132, scale: 1.16 },
  { left: 86, height: 84, scale: 0.8 },
  { left: 93, height: 112, scale: 1.02 },
];

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

function randomFromRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function createRandomPetals(count: number): readonly PetalSpec[] {
  return Array.from({ length: count }, () => {
    const rotationStart = randomFromRange(-150, 150);
    const rotationMid = randomFromRange(-300, 300);
    return {
      delay: randomFromRange(0, 5.4),
      startX: randomFromRange(4, 96),
      duration: randomFromRange(4.8, 8.9),
      size: randomFromRange(14, 36),
      rotationStart,
      rotationMid,
      rotationEnd: randomFromRange(rotationMid - 110, rotationMid + 130),
      driftA: randomFromRange(-7, 8),
      driftB: randomFromRange(-8, 8),
      repeatDelay: randomFromRange(0.1, 2.4),
    };
  });
}

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

function HangingDecor() {
  return (
    <div className="reference-hanging-decor" aria-hidden>
      <div className="reference-floral-swag reference-floral-swag--left" />
      <div className="reference-floral-swag reference-floral-swag--right" />
      {HANGING_DECOR.map((decor) => (
        <span
          key={`${decor.left}-${decor.height}`}
          className="reference-hanging-string"
          style={
            {
              left: `${decor.left}%`,
              height: `${decor.height}px`,
              "--bell-scale": String(decor.scale),
            } as CSSProperties
          }
        >
          <span className="reference-bell" />
        </span>
      ))}
    </div>
  );
}

function BottomDecor({ side }: { side: "left" | "right" }) {
  return (
    <div className={`reference-bottom-decor reference-bottom-decor--${side}`} aria-hidden>
      <div className="reference-leaf-fan">
        {Array.from({ length: 6 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className="reference-decor-lattice" />
      <div className="reference-kalash">
        <span className="reference-kalash-neck" />
        <span className="reference-kalash-pot" />
        <span className="reference-kalash-base" />
      </div>
    </div>
  );
}

function RevealScene({ active }: { active: boolean }) {
  return (
    <motion.div
      className="reference-reveal-scene"
      initial={{ opacity: 0.38, scale: 1.05 }}
      animate={active ? { opacity: 1, scale: 1 } : { opacity: 0.38, scale: 1.05 }}
      transition={{ duration: 1.7, delay: active ? 0.45 : 0, ease: "easeOut" }}
      aria-hidden
    >
      <HangingDecor />
      <BottomDecor side="left" />
      <BottomDecor side="right" />
      <motion.div
        className="reference-reveal-copy"
        initial={{ opacity: 0, y: 18, scale: 0.94 }}
        animate={active ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 18, scale: 0.94 }}
        transition={{ duration: 1.45, delay: 1.15, ease: "easeOut" }}
      >
        <div className="reference-monogram">
          <span>M</span>
          <span>R</span>
        </div>
        <p className="reference-reveal-names">Manas &amp; Rupa Sree</p>
        <p className="reference-reveal-subtitle">The Beginning of Forever</p>
      </motion.div>
    </motion.div>
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

function RandomizedFallingPetal({ petal }: { petal: PetalSpec }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ width: `${petal.size}px`, height: `${petal.size + 4}px` }}
      initial={{ opacity: 0, x: `${petal.startX}vw`, y: "-16vh", rotate: petal.rotationStart }}
      animate={{
        opacity: [0, 0.92, 0.88, 0],
        x: [
          `${petal.startX}vw`,
          `${petal.startX + petal.driftA}vw`,
          `${petal.startX + petal.driftB}vw`,
          `${petal.startX + petal.driftA * 0.35}vw`,
        ],
        y: ["-16vh", "35vh", "76vh", "114vh"],
        rotate: [petal.rotationStart, petal.rotationMid, petal.rotationEnd, petal.rotationEnd + petal.driftB * 10],
      }}
      transition={{
        duration: petal.duration,
        delay: 3.5 + petal.delay,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: petal.repeatDelay,
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 24 28" fill="none">
        <ellipse cx="12" cy="14" rx="9" ry="12" fill="#e8b4c0" opacity="0.9" />
        <ellipse cx="11" cy="12" rx="6.5" ry="8" fill="#f3d1db" opacity="0.72" />
      </svg>
    </motion.div>
  );
}

export function DoorIntro() {
  const [phase, setPhase] = useState<"closed" | "opening" | "done">("closed");

  useEffect(() => {
    const openTimer = setTimeout(() => setPhase("opening"), 560);
    const doneTimer = setTimeout(() => {
      setPhase("done");
    }, 5200);

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
          transition={{ duration: 0.75 }}
          style={{ perspective: "1800px" }}
        >
          <RevealScene active={phase === "opening"} />
          <IntroPetals active={phase === "opening"} />
          <div className="reference-door-frame" aria-hidden>
            <span />
            <span />
          </div>
          <div className="reference-door-leaves">
            <motion.div
              className="reference-door-leaf reference-door-leaf--left"
              initial={{ rotateY: 0, x: 0 }}
              animate={phase === "opening" ? { rotateY: -116, x: -28, z: -8 } : { rotateY: 0, x: 0, z: 0 }}
              transition={{ duration: 3.15, ease: [0.16, 0.78, 0.24, 1] }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <DoorPanel side="left" />
            </motion.div>

            <motion.div
              className="reference-door-leaf reference-door-leaf--right"
              initial={{ rotateY: 0, x: 0 }}
              animate={phase === "opening" ? { rotateY: 116, x: 28, z: -8 } : { rotateY: 0, x: 0, z: 0 }}
              transition={{ duration: 3.15, ease: [0.16, 0.78, 0.24, 1] }}
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

export function FallingPetals() {
  const [petals, setPetals] = useState<readonly PetalSpec[]>([]);

  useEffect(() => {
    const petalTimer = window.setTimeout(() => setPetals(createRandomPetals(14)), 0);
    return () => window.clearTimeout(petalTimer);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[40] overflow-hidden" aria-hidden>
      {petals.map((petal, index) => (
        <RandomizedFallingPetal key={`${petal.startX}-${petal.delay}-${index}`} petal={petal} />
      ))}
    </div>
  );
}
