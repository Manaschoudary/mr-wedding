"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { InvitationNavbar } from "@/components/InvitationNavbar";
import { MusicPlayer } from "@/components/MusicPlayer";
import { flushLocalRsvps } from "@/lib/offlineOutbox";
import { flushQueuedAnalytics } from "@/lib/analytics";
import { FULL_INVITE_BASE_PATH, WEDDING_ONLY_BASE_PATH } from "@/lib/data";
import { useEffect, type ReactNode } from "react";

function isInvitationPath(pathname: string): boolean {
  return pathname === WEDDING_ONLY_BASE_PATH ||
    pathname.startsWith(`${WEDDING_ONLY_BASE_PATH}/`) ||
    pathname === FULL_INVITE_BASE_PATH ||
    pathname.startsWith(`${FULL_INVITE_BASE_PATH}/`);
}

function isAdminPath(pathname: string): boolean {
  return pathname === "/admin-mr-2026" || pathname.startsWith("/admin-mr-2026/");
}

export function SiteChrome({ children }: { readonly children: ReactNode }) {
  const pathname = usePathname();
  const admin = isAdminPath(pathname);
  const invitation = isInvitationPath(pathname);

  useEffect(() => {
    if (admin) return;

    const flushQueuedWrites = () => {
      flushLocalRsvps().catch(() => {});
      flushQueuedAnalytics().catch(() => {});
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") flushQueuedWrites();
    };

    flushQueuedWrites();
    window.addEventListener("online", flushQueuedWrites);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    const interval = window.setInterval(flushQueuedWrites, 30000);

    return () => {
      window.removeEventListener("online", flushQueuedWrites);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.clearInterval(interval);
    };
  }, [admin]);

  return (
    <>
      {!admin ? <MusicPlayer /> : null}
      {invitation ? <InvitationNavbar /> : null}
      <main className="flex-1 overflow-x-hidden">{children}</main>
      {!admin ? <Footer /> : null}
    </>
  );
}
