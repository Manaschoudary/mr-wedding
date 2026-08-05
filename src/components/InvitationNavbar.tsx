"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getInvitationConfig, getInvitationModeFromPath, WEDDING } from "@/lib/data";
import { trackEvent } from "@/lib/analytics";

export function InvitationNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const invitation = getInvitationConfig(getInvitationModeFromPath(pathname));
  const links = [
    { href: invitation.homePath, label: "Home" },
    { href: invitation.rsvpPath, label: "RSVP" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const closeTimer = window.setTimeout(() => setMenuOpen(false), 0);
    return () => window.clearTimeout(closeTimer);
  }, [pathname]);

  const trackNavigation = (label: string, href: string) => {
    trackEvent("action", {
      actionName: "navigation_click",
      actionLabel: `Navigation: ${label}`,
      metadata: {
        invitationMode: invitation.mode,
        invitationLabel: invitation.label,
        destination: href,
      },
    }, { beacon: true });
  };

  const isActive = (href: string) => (
    href === invitation.homePath ? pathname === invitation.homePath : pathname.startsWith(href)
  );

  return (
    <header className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${scrolled ? "pt-2" : "pt-4"}`}>
      <div className="mx-auto max-w-5xl px-3 sm:px-6">
        <div className="flex items-center justify-between rounded-full border border-linen/25 bg-burgundy-deep/90 px-4 py-3 text-linen shadow-[0_12px_28px_rgba(0,0,0,0.22)] backdrop-blur-md">
          <Link
            href={invitation.homePath}
            className="font-script text-2xl leading-none text-linen sm:text-3xl"
            onClick={() => trackNavigation("Brand", invitation.homePath)}
          >
            {WEDDING.couple.short}
          </Link>

          <nav className="hidden items-center gap-2 md:flex" aria-label={`${invitation.label} navigation`}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => trackNavigation(link.label, link.href)}
                className={`rounded-full px-4 py-2 font-josefin text-[0.66rem] uppercase tracking-[0.22em] transition ${
                  isActive(link.href)
                    ? "bg-linen text-ink"
                    : "text-linen/82 hover:bg-linen/10 hover:text-linen"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-linen/25 text-linen md:hidden"
            onClick={() => {
              trackEvent("action", {
                actionName: "mobile_menu_toggle",
                actionLabel: menuOpen ? "Closed mobile menu" : "Opened mobile menu",
                metadata: {
                  invitationMode: invitation.mode,
                  invitationLabel: invitation.label,
                },
              }, { beacon: true });
              setMenuOpen((current) => !current);
            }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-invitation-navigation"
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <span className="flex flex-col gap-1.5" aria-hidden>
              <span className={`block h-0.5 w-5 rounded-full bg-current transition ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-current transition ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-current transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>

        <div
          id="mobile-invitation-navigation"
          className={`mx-3 overflow-hidden rounded-2xl border border-linen/20 bg-burgundy-deep/95 text-linen shadow-xl backdrop-blur-md transition-all md:hidden ${
            menuOpen ? "mt-2 max-h-48 opacity-100" : "max-h-0 opacity-0"
          }`}
          aria-hidden={!menuOpen}
        >
          <nav className="grid gap-1 p-2" aria-label={`${invitation.label} mobile navigation`}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => trackNavigation(link.label, link.href)}
                className={`rounded-xl px-4 py-3 font-cormorant text-xl italic ${
                  isActive(link.href) ? "bg-linen text-ink" : "text-linen/86"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
