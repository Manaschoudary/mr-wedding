import { WEDDING } from "@/lib/data";

export function Footer() {
  return (
    <footer className="py-12 text-center bg-bg-primary border-t border-gold/10">
      <p className="text-text-muted text-xs tracking-widest uppercase mb-2">
        With love
      </p>
      <p className="font-serif text-2xl text-gold">
        {WEDDING.couple.groom.firstName}{" "}
        <span className="text-text-muted font-sans text-base">&amp;</span>{" "}
        {WEDDING.couple.bride.firstName}
      </p>
      <p className="mt-4 text-text-muted text-xs tracking-[0.3em] uppercase">
        {WEDDING.hashtag}
      </p>
    </footer>
  );
}
