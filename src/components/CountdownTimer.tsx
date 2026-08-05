"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  const diff = Math.max(0, target - now);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

interface CountdownTimerProps {
  readonly targetDate: Date;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const updateTimeLeft = () => setTimeLeft(calculateTimeLeft(targetDate));
    const firstTick = window.setTimeout(updateTimeLeft, 0);
    const timer = window.setInterval(updateTimeLeft, 1000);

    return () => {
      window.clearTimeout(firstTick);
      window.clearInterval(timer);
    };
  }, [targetDate]);

  const blocks = [
    { value: timeLeft?.days, label: "Days" },
    { value: timeLeft?.hours, label: "Hours" },
    { value: timeLeft?.minutes, label: "Minutes" },
    { value: timeLeft?.seconds, label: "Seconds" },
  ];

  const valueClass = "font-cinzel text-[1.35rem] leading-none text-ink tabular-nums sm:text-3xl";
  const labelClass = "mt-1 font-josefin text-[0.48rem] uppercase tracking-[0.14em] text-ink/70 sm:text-[0.58rem] sm:tracking-[0.22em]";
  const blockClass =
    "min-w-0 rounded-lg border border-gold-dark/35 bg-linen-soft px-1.5 py-2 text-center shadow-[0_8px_18px_rgba(0,0,0,0.14)] sm:rounded-xl sm:px-3 sm:py-3";

  return (
    <div className="mx-auto grid max-w-xl grid-cols-4 gap-1.5 rounded-2xl border border-linen/25 bg-burgundy-deep p-2 shadow-[0_18px_36px_rgba(0,0,0,0.2)] sm:gap-2 sm:p-3">
      {blocks.map((block) => (
        <div
          key={block.label}
          className={blockClass}
        >
          <p className={valueClass}>
            {block.value === undefined ? "--" : String(block.value).padStart(2, "0")}
          </p>
          <p className={labelClass}>
            {block.label}
          </p>
        </div>
      ))}
    </div>
  );
}
