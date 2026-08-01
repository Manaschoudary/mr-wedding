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
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(targetDate)
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const blocks = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

  if (!mounted) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {blocks.map((block) => (
          <div key={block.label} className="rounded-xl border border-olive/35 bg-linen-soft p-4 text-center">
            <p className="font-cinzel text-3xl text-ink">--</p>
            <p className="mt-1 font-josefin text-[0.62rem] uppercase tracking-[0.25em] text-ink/75">
              {block.label}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {blocks.map((block) => (
        <div
          key={block.label}
          className="rounded-xl border border-olive/40 bg-linen-soft p-4 text-center shadow-[0_10px_20px_rgba(0,0,0,0.16)]"
        >
          <p className="font-cinzel text-3xl text-ink sm:text-[2.15rem]">
            {String(block.value).padStart(2, "0")}
          </p>
          <p className="mt-1 font-josefin text-[0.62rem] uppercase tracking-[0.25em] text-ink/75">
            {block.label}
          </p>
        </div>
      ))}
    </div>
  );
}
