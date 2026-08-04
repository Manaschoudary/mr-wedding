import { WEDDING } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-linen/20 bg-burgundy/60 py-10 text-center backdrop-blur-sm">
      <p className="font-josefin text-[0.72rem] uppercase tracking-[0.34em] text-linen/75">
        {WEDDING.hashtag}
      </p>
    </footer>
  );
}
