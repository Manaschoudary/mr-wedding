interface KolamDividerProps {
  className?: string;
}

function KolamMotif({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-gold/60"
    >
      {/* Traditional kolam-inspired dot pattern */}
      <circle cx="40" cy="40" r="3" fill="currentColor" />
      <circle cx="40" cy="20" r="2" fill="currentColor" />
      <circle cx="40" cy="60" r="2" fill="currentColor" />
      <circle cx="20" cy="40" r="2" fill="currentColor" />
      <circle cx="60" cy="40" r="2" fill="currentColor" />
      <circle cx="28" cy="28" r="1.5" fill="currentColor" />
      <circle cx="52" cy="28" r="1.5" fill="currentColor" />
      <circle cx="28" cy="52" r="1.5" fill="currentColor" />
      <circle cx="52" cy="52" r="1.5" fill="currentColor" />
      {/* Connecting curves — kolam style */}
      <path
        d="M20 40 Q30 30, 40 20 Q50 30, 60 40 Q50 50, 40 60 Q30 50, 20 40Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M28 28 Q40 34, 52 28 Q46 40, 52 52 Q40 46, 28 52 Q34 40, 28 28Z"
        stroke="currentColor"
        strokeWidth="0.75"
        fill="none"
      />
    </svg>
  );
}

function OrnamentLine() {
  return (
    <div className="flex-1 max-w-32 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
  );
}

export function KolamDivider({ className = "" }: KolamDividerProps) {
  return (
    <div
      className={`flex items-center justify-center gap-4 py-8 px-4 ${className}`}
    >
      <OrnamentLine />
      <KolamMotif size={36} />
      <KolamMotif size={28} />
      <KolamMotif size={36} />
      <OrnamentLine />
    </div>
  );
}
