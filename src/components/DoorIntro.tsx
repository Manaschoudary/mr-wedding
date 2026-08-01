"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="relative h-full w-full overflow-hidden bg-[#3d1012]">
      {/* Decorative border on outer edge */}
      <div
        className={`absolute top-0 bottom-0 w-6 bg-[#c4a35a]/30 ${
          side === "left" ? "left-0" : "right-0"
        }`}
      >
        <div className="h-full w-full bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%222%22%20fill%3D%22%23c4a35a40%22%2F%3E%3C%2Fsvg%3E')] opacity-60" />
      </div>
      {/* Repeating diya pattern grid */}
      <div
        className={`absolute inset-0 grid grid-cols-4 gap-0 ${
          side === "left" ? "pl-6" : "pr-6"
        }`}
        style={{ color: "#c4a35a" }}
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            <DiyaPattern />
          </div>
        ))}
      </div>
      {/* Door handle */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 ${
          side === "left" ? "right-3" : "left-3"
        }`}
      >
        <div className="h-14 w-3 rounded-full bg-[#c4a35a]/70 shadow-lg" />
        <div className="mx-auto mt-1 h-3 w-3 rounded-full bg-[#8b6914]/80" />
      </div>
      {/* Inner border */}
      <div
        className={`absolute top-2 bottom-2 w-[1px] bg-[#c4a35a]/25 ${
          side === "left" ? "right-8" : "left-8"
        }`}
      />
    </div>
  );
}

function FallingPetal({ delay, startX, duration }: { delay: number; startX: number; duration: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      initial={{ opacity: 0, x: startX, y: -40, rotate: 0 }}
      animate={{
        opacity: [0, 0.85, 0.85, 0],
        x: [startX, startX + 30, startX - 20, startX + 10],
        y: [-40, window?.innerHeight ? window.innerHeight * 0.4 : 350, window?.innerHeight ? window.innerHeight * 0.7 : 600, window?.innerHeight ? window.innerHeight + 40 : 950],
        rotate: [0, 45, -30, 90],
      }}
      transition={{
        duration,
        delay,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: Math.random() * 3 + 1,
      }}
    >
      <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
        <ellipse cx="8" cy="9" rx="6" ry="8" fill="#e8b4c0" opacity="0.8" />
        <ellipse cx="7" cy="8" rx="4" ry="5.5" fill="#f0c8d4" opacity="0.6" />
      </svg>
    </motion.div>
  );
}

export function DoorIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"closed" | "opening" | "done">("closed");

  useEffect(() => {
    // Brief pause then start opening
    const openTimer = setTimeout(() => setPhase("opening"), 800);
    // Complete after doors fully open
    const doneTimer = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 3200);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[100] flex"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Left door */}
          <motion.div
            className="h-full w-1/2 origin-left"
            initial={{ rotateY: 0 }}
            animate={phase === "opening" ? { rotateY: -95 } : { rotateY: 0 }}
            transition={{ duration: 2.2, ease: [0.4, 0, 0.2, 1] }}
            style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
          >
            <DoorPanel side="left" />
          </motion.div>

          {/* Right door */}
          <motion.div
            className="h-full w-1/2 origin-right"
            initial={{ rotateY: 0 }}
            animate={phase === "opening" ? { rotateY: 95 } : { rotateY: 0 }}
            transition={{ duration: 2.2, ease: [0.4, 0, 0.2, 1] }}
            style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
          >
            <DoorPanel side="right" />
          </motion.div>

          {/* Center seam detail */}
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[2px] bg-[#1a0a0b]" />

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const petals = Array.from({ length: 8 }).map((_, i) => ({
    delay: i * 0.7 + 2.5,
    startX: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000) * 0.7 + (typeof window !== "undefined" ? window.innerWidth : 1000) * 0.15,
    duration: 5 + Math.random() * 3,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
      {petals.map((petal, i) => (
        <FallingPetal key={i} {...petal} />
      ))}
    </div>
  );
}
