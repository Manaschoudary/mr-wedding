"use client";

import { useEffect, useState } from "react";
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

function DiyaPattern() {
  return (
    <svg
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
      {/* Oil lamp / diya decorative motif */}
      <rect x="20" y="0" width="80" height="140" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      {/* Lamp base */}
      <rect x="45" y="110" width="30" height="8" rx="2" fill="currentColor" opacity="0.7" />
      <rect x="50" y="102" width="20" height="10" rx="1" fill="currentColor" opacity="0.6" />
      {/* Lamp stem */}
      <rect x="57" y="60" width="6" height="44" fill="currentColor" opacity="0.5" />
      {/* Lamp bowl */}
      <ellipse cx="60" cy="56" rx="22" ry="12" fill="currentColor" opacity="0.55" />
      {/* Flame glow */}
      <ellipse cx="60" cy="36" rx="14" ry="18" fill="currentColor" opacity="0.25" />
      {/* Flame */}
      <ellipse cx="60" cy="38" rx="8" ry="14" fill="currentColor" opacity="0.6" />
      {/* Swag decoration left */}
      <path
        d="M20 20 Q40 50, 60 42 Q40 60, 20 50"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        opacity="0.5"
      />
      {/* Swag decoration right */}
      <path
        d="M100 20 Q80 50, 60 42 Q80 60, 100 50"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        opacity="0.5"
      />
      {/* Top horizontal bar */}
      <rect x="16" y="0" width="88" height="3" fill="currentColor" opacity="0.6" />
      {/* Bottom horizontal bar */}
      <rect x="16" y="130" width="88" height="3" fill="currentColor" opacity="0.6" />
      {/* Vertical side bars */}
      <rect x="16" y="0" width="3" height="140" fill="currentColor" opacity="0.4" />
      <rect x="101" y="0" width="3" height="140" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

function DoorPanel({ side }: { side: "left" | "right" }) {
  return (
    <div className={`temple-door-panel temple-door-panel--${side}`}>
      <div className="temple-door-woodgrain" />
      <div className="temple-door-panel-glow" />
      <div
        className={`absolute top-0 bottom-0 z-10 w-7 bg-[#caa356]/35 shadow-[inset_0_0_12px_rgba(0,0,0,0.38)] ${
          side === "left" ? "left-0" : "right-0"
        }`}
      >
        <div className="h-full w-full bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%222%22%20fill%3D%22%23c4a35a55%22%2F%3E%3C%2Fsvg%3E')] opacity-80" />
      </div>
      <div className={`temple-door-seam ${side === "left" ? "right-0" : "left-0"}`} />
      <div
        className={`absolute inset-0 z-[2] grid grid-cols-3 gap-1 py-8 ${
          side === "left" ? "pl-6" : "pr-6"
        }`}
        style={{ color: "#c4a35a" }}
      >
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="flex items-center justify-center opacity-85">
            <DiyaPattern />
          </div>
        ))}
      </div>
      <div className={`temple-door-inner-panel ${side === "left" ? "left-10 right-8" : "left-8 right-10"}`} />
      <div
        className={`absolute top-1/2 z-20 -translate-y-1/2 ${
          side === "left" ? "right-4" : "left-4"
        }`}
      >
        <div className="grid h-16 w-16 place-items-center rounded-full border border-[#f0cf83]/70 bg-[#8b6914]/75 shadow-[0_0_22px_rgba(240,207,131,0.28),inset_0_0_10px_rgba(0,0,0,0.28)]">
          <div className="h-8 w-8 rounded-full border-4 border-[#f3d48c]/85 shadow-inner" />
        </div>
        <div className="mx-auto mt-2 h-9 w-2 rounded-full bg-[#f0cf83]/75 shadow-lg" />
      </div>
      <div
        className={`absolute top-4 bottom-4 z-10 w-[2px] bg-[#e1bd6f]/35 ${
          side === "left" ? "right-8" : "left-8"
        }`}
      />
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
    const openTimer = setTimeout(() => setPhase("opening"), 650);
    const doneTimer = setTimeout(() => {
      setPhase("done");
    }, 3400);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden bg-[#140507]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{ perspective: "1600px" }}
        >
          <motion.div
            className="temple-door-light"
            initial={{ opacity: 0, scaleX: 0.05 }}
            animate={phase === "opening" ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0.05 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <div className="temple-door-frame" aria-hidden />
          <div className="flex h-full w-full">
            {/* Left door */}
            <motion.div
              className="h-full w-1/2 origin-left"
              initial={{ rotateY: 0, x: 0 }}
              animate={phase === "opening" ? { rotateY: -112, x: -18 } : { rotateY: 0, x: 0 }}
              transition={{ duration: 2.35, ease: [0.18, 0.82, 0.24, 1] }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <DoorPanel side="left" />
            </motion.div>

            {/* Right door */}
            <motion.div
              className="h-full w-1/2 origin-right"
              initial={{ rotateY: 0, x: 0 }}
              animate={phase === "opening" ? { rotateY: 112, x: 18 } : { rotateY: 0, x: 0 }}
              transition={{ duration: 2.35, ease: [0.18, 0.82, 0.24, 1] }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <DoorPanel side="right" />
            </motion.div>
          </div>

          {/* Scroll down text visible during closed state */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
            initial={{ opacity: 1 }}
            animate={phase === "opening" ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <span className="font-josefin text-[0.64rem] uppercase tracking-[0.28em] text-linen/85">
              Scroll Down
            </span>
            <svg className="mx-auto mt-1 h-4 w-4 animate-bounce text-linen/85" viewBox="0 0 24 24" fill="none">
              <path d="m6 10 6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </motion.div>
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
