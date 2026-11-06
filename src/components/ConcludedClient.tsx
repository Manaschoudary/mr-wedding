"use client";

import { LockKeyhole } from "lucide-react";
import { useState, type FormEvent } from "react";
import { WEDDING } from "@/lib/data";

function getReturnPath(): string {
  const value = new URLSearchParams(window.location.search).get("returnTo");
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/wedding";
}

export function ConcludedClient() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        setError("That password is not correct.");
        return;
      }

      window.location.assign(getReturnPath());
    } catch {
      setError("Unable to verify the password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-5 py-12">
      <section className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full border border-linen/30 bg-linen/10 text-linen">
          <LockKeyhole className="h-6 w-6" />
        </div>
        <p className="font-josefin text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-linen/78">
          {WEDDING.hashtag} Wedding
        </p>
        <h1 className="mt-3 font-script text-6xl leading-none text-linen sm:text-7xl">
          Thank You
        </h1>
        <p className="mx-auto mt-5 max-w-sm font-cormorant text-2xl italic leading-relaxed text-linen/90">
          Our wedding celebration has concluded. Thank you for being part of our special days.
        </p>

        <div className="mt-9 rounded-2xl border border-linen/20 bg-burgundy-deep/80 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.25)]">
          <p className="font-josefin text-xs uppercase tracking-[0.2em] text-linen/72">
            Private archive access
          </p>
          <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-left">
            <label htmlFor="archive-password" className="sr-only">Password</label>
            <input
              id="archive-password"
              type="password"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-linen/25 bg-linen-soft px-4 py-3 font-josefin text-ink outline-none transition focus:border-gold-dark focus:ring-2 focus:ring-gold-dark/30"
            />
            {error ? <p className="text-center font-josefin text-xs text-[#f3a397]">{error}</p> : null}
            <button
              type="submit"
              disabled={submitting || !code.trim()}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-olive px-5 py-3 font-josefin text-xs font-semibold uppercase tracking-[0.18em] text-linen transition hover:bg-olive-strong disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LockKeyhole className="h-4 w-4" />
              {submitting ? "Checking..." : "View Private Site"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
