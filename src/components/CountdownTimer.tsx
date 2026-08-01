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
  targetDate: Date;
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
      <div className="flex items-center justify-center gap-6 sm:gap-10">
        {blocks.map((block) => (
          <div key={block.label} className="flex flex-col items-center">
            <span className="countdown-number">--</span>
            <span className="countdown-label">{block.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-6 sm:gap-10">
      {blocks.map((block) => (
        <div key={block.label} className="flex flex-col items-center">
          <span className="countdown-number">{block.value}</span>
          <span className="countdown-label">{block.label}</span>
        </div>
      ))}
    </div>
  );
}
