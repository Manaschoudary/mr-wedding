"use client";

import type { ReactNode } from "react";

interface ScrollRevealProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delay?: number;
  readonly direction?: "up" | "down" | "left" | "right";
}

export function ScrollReveal({
  children,
  className = "",
}: ScrollRevealProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
