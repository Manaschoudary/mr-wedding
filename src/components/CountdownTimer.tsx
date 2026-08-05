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

  const valueClass = "font-cinzel text-[1.45rem] leading-none text-linen tabular-nums drop-shadow-sm sm:text-[2.35rem]";
  const labelClass = "mt-1 font-josefin text-[0.48rem] font-semibold uppercase tracking-[0.16em] text-linen/92 sm:text-[0.58rem] sm:tracking-[0.24em]";
  const blockClass =
    "min-w-0 rounded-xl border border-linen/22 bg-gradient-to-b from-[#74422f] to-[#341315] px-1.5 py-2.5 text-center shadow-[0_12px_26px_rgba(0,0,0,0.28)] sm:px-3 sm:py-3.5";

  return (
    <div className="mx-auto max-w-2xl rounded-[1.35rem] border border-gold-dark/55 bg-[#230d10]/88 p-2.5 shadow-[0_22px_54px_rgba(0,0,0,0.34)]">
      <div className="rounded-2xl border border-linen/12 bg-gradient-to-r from-[#3a1417] via-[#5b2220] to-[#3f4a24] p-2 sm:p-3">
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5">
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
        <p className="mt-3 font-josefin text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-linen/92">
          Sumuhurtham · 9:31 PM
        </p>
      </div>
    </div>
  );
}
