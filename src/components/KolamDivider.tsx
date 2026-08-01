interface KolamDividerProps {
  className?: string;
}

function KolamMotif({ size = 40 }: { readonly size?: number }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 0.55)}
      viewBox="0 0 160 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-kolam"
      aria-hidden
    >
      <circle cx="22" cy="44" r="2.3" fill="currentColor" />
      <circle cx="40" cy="44" r="2.3" fill="currentColor" />
      <circle cx="58" cy="44" r="2.3" fill="currentColor" />
      <circle cx="76" cy="44" r="2.3" fill="currentColor" />
      <circle cx="94" cy="44" r="2.3" fill="currentColor" />
      <circle cx="112" cy="44" r="2.3" fill="currentColor" />
      <circle cx="130" cy="44" r="2.3" fill="currentColor" />
      <path
        d="M22 44c7-12 11-18 18-18s11 6 18 18 11 18 18 18 11-6 18-18 11-18 18-18 11 6 18 18"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M22 44c7 12 11 18 18 18s11-6 18-18 11-18 18-18 11 6 18 18 11 18 18 18 11-6 18-18"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M12 44h136"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="0.9"
        fill="none"
      />
    </svg>
  );
}

function OrnamentLine() {
  return (
    <div className="h-px w-20 bg-gradient-to-r from-transparent via-kolam/70 to-transparent md:w-32" />
  );
}

export function KolamDivider({ className = "" }: KolamDividerProps) {
  return (
    <div className={`kolam-divider ${className}`}>
      <div className="flex items-center justify-center gap-2.5 px-4">
        <OrnamentLine />
        <KolamMotif size={86} />
        <OrnamentLine />
      </div>
    </div>
  );
}
