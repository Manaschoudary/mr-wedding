"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS, WEDDING } from "@/lib/data";

function HamburgerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <path d="M5 8h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5 16h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <div className="fixed left-4 top-4 z-50 md:left-6 md:top-6">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="grid h-11 w-11 place-items-center rounded-full bg-olive text-linen shadow-[0_8px_18px_rgba(0,0,0,0.24)] transition-transform hover:scale-[1.03]"
          aria-label="Open menu"
        >
          <HamburgerIcon />
        </button>
      </div>

      <AnimatePresence>
        {drawerOpen ? (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24 }}
              type="button"
              className="drawer-overlay fixed inset-0 z-50"
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              initial={{ x: -320, opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0.5 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="fixed bottom-0 left-0 top-0 z-[51] w-[17.5rem] bg-olive px-5 pb-6 pt-7 text-linen"
            >
              <div className="mb-7 flex items-center justify-between">
                <p className="font-script text-3xl leading-none text-linen">
                  {WEDDING.couple.monogram}
                </p>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-full bg-[#738648] text-linen"
                  aria-label="Close menu"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                    <path d="M6 6 18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="space-y-2">
                {NAV_LINKS.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setDrawerOpen(false)}
                      className={`block rounded-xl border px-4 py-3 font-cormorant text-[1.35rem] italic tracking-wide transition ${
                        active
                          ? "border-linen/70 bg-[#6a7b40] text-linen"
                          : "border-transparent bg-[#4f5f2f] text-linen/90 hover:border-linen/40"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <p className="mt-8 text-center font-josefin text-[0.68rem] uppercase tracking-[0.26em] text-linen/80">
                {WEDDING.hashtag}
              </p>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
