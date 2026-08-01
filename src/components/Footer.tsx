import { WEDDING } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-linen/20 bg-burgundy/60 py-12 text-center backdrop-blur-sm">
      <p className="caps-label mb-2">
        With love
      </p>
      <p className="font-script text-[2.35rem] leading-none text-linen">
        {WEDDING.couple.groom.firstName}{" "}
        <span className="font-cormorant text-[1.15rem] italic text-gold-dark">&amp;</span>{" "}
        {WEDDING.couple.bride.firstName}
      </p>
      <p className="mt-4 font-josefin text-[0.72rem] uppercase tracking-[0.34em] text-linen/75">
        {WEDDING.hashtag}
      </p>
    </footer>
  );
}
