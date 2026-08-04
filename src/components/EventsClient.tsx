"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, type PanInfo } from "framer-motion";
import { EVENTS, type WeddingEvent } from "@/lib/data";
import { KolamDivider } from "@/components/KolamDivider";

interface EventModalProps {
  readonly event: WeddingEvent;
  readonly onClose: () => void;
}

export function EventModal({ event, onClose }: EventModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] grid place-items-center bg-[#130708]/70 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-dashed border-linen/45 bg-linen-soft p-6 text-ink shadow-2xl animate-[fadeScaleIn_0.25s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-ink/20 bg-linen text-lg leading-none text-ink transition hover:bg-[#efe6cf]"
          aria-label="Close event details"
        >
          ×
        </button>
        <p className="pr-10 font-script text-5xl leading-none">{event.name}</p>
        <p className="mt-3 font-josefin text-[0.68rem] uppercase tracking-[0.22em]">{event.date}</p>
        <p className="mt-1 font-cormorant text-2xl italic">{event.time}</p>
        <p className="mt-4 font-josefin text-sm">{event.venue}</p>
        <p className="mt-1 font-josefin text-sm">{event.address}</p>
        {event.dressCode ? <p className="mt-4 font-josefin text-sm">Dress Code: {event.dressCode}</p> : null}
        <p className="mt-2 font-josefin text-sm">Meal: {event.meal}</p>
      </div>
    </div>,
    document.body
  );
}

function clampIndex(next: number, length: number): number {
  if (next < 0) {
    return length - 1;
  }
  if (next >= length) {
    return 0;
  }
  return next;
}

export function EventsClient() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const updateScreenState = () => setIsMobile(mediaQuery.matches);
    updateScreenState();
    mediaQuery.addEventListener("change", updateScreenState);
    return () => mediaQuery.removeEventListener("change", updateScreenState);
  }, []);

  const cards = useMemo(() => {
    const total = EVENTS.length;
    return EVENTS.map((event, index) => {
      const offsetRaw = index - activeIndex;
      const offset = offsetRaw < -2 ? offsetRaw + total : offsetRaw > 2 ? offsetRaw - total : offsetRaw;
      return { event, index, offset };
    });
  }, [activeIndex]);

  const activeEvent = EVENTS[activeIndex];

  function onCardDragEnd(offsetX: number) {
    if (!isMobile) {
      return;
    }

    if (offsetX <= -42) {
      setShowDetails(false);
      setActiveIndex((current) => clampIndex(current + 1, EVENTS.length));
      return;
    }

    if (offsetX >= 42) {
      setShowDetails(false);
      setActiveIndex((current) => clampIndex(current - 1, EVENTS.length));
    }
  }

  return (
    <div className="pb-10 pt-24">
      <KolamDivider />
      <section className="section-wide">
        <div className="mx-auto max-w-5xl rounded-2xl border border-dashed border-linen/45 bg-burgundy-deep p-4 sm:p-6">
          <div className="olive-card p-6 text-center sm:p-8">
            <p className="font-josefin text-[0.68rem] uppercase tracking-[0.28em] text-linen/85">EVENT NAVIGATOR</p>
            <p className="mt-2 font-script text-4xl leading-none text-linen sm:text-6xl">Wedding Functions</p>
            <p className="mx-auto mt-4 max-w-xl font-cormorant text-xl italic text-linen/92">
              Tap an event card to open details for date, time, venue, dress code, and meal.
            </p>
          </div>
        </div>

        <div className="event-stack-perspective mx-auto mt-9 max-w-4xl px-1">
          <div className="relative mx-auto h-[22rem] w-full max-w-[17rem] sm:h-[26rem] sm:max-w-[22rem]">
            {cards.map(({ event, index, offset }) => {
              const distance = Math.abs(offset);
              const isCenter = offset === 0;
              return (
                <motion.button
                  type="button"
                  key={event.id}
                  onClick={() => {
                    setActiveIndex(index);
                    setShowDetails((current) => (index === activeIndex ? !current : true));
                  }}
                  className="event-card-shell absolute inset-0 text-left"
                  style={{
                    zIndex: 20 - distance,
                    pointerEvents: distance > 1 ? "none" : "auto",
                  }}
                  drag={isMobile && isCenter ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  onDragEnd={(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) =>
                    onCardDragEnd(info.offset.x)
                  }
                  animate={{
                    x: offset * (isMobile ? 55 : 94),
                    y: distance * (isMobile ? 12 : 18),
                    scale: isCenter ? 1 : isMobile ? 0.92 - distance * 0.04 : 0.86 - distance * 0.06,
                    rotateY: offset * -15,
                    filter: isCenter ? "brightness(1)" : "brightness(0.55)",
                    opacity: distance > 2 ? 0 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 180, damping: 24 }}
                  aria-label={`Open ${event.name} details`}
                >
                  <div className="relative h-[62%] overflow-hidden rounded-t-2xl">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2a0f11]/60 to-transparent" />
                </div>
                  <div className="flex h-[38%] flex-col items-center justify-center bg-burgundy px-4 text-center">
                    <p className="font-script text-[2.1rem] leading-none text-linen">{event.name}</p>
                    <p className="mt-3 font-josefin text-[0.62rem] uppercase tracking-[0.26em] text-linen/76">Tap for details</p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setShowDetails(false);
                setActiveIndex((current) => clampIndex(current - 1, EVENTS.length));
              }}
              className="grid h-10 w-10 place-items-center rounded-full border border-linen/42 bg-burgundy-deep text-linen"
              aria-label="Previous event"
            >
              <span aria-hidden>←</span>
            </button>
            <div className="flex items-center gap-2">
              {EVENTS.map((event, index) => (
                <button
                  type="button"
                  key={event.id}
                  onClick={() => {
                    setShowDetails(false);
                    setActiveIndex(index);
                  }}
                  className={`h-2.5 w-2.5 rounded-full ${index === activeIndex ? "bg-linen" : "bg-linen/35"}`}
                  aria-label={`Go to ${event.name}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setShowDetails(false);
                setActiveIndex((current) => clampIndex(current + 1, EVENTS.length));
              }}
              className="grid h-10 w-10 place-items-center rounded-full border border-linen/42 bg-burgundy-deep text-linen"
              aria-label="Next event"
            >
              <span aria-hidden>→</span>
            </button>
          </div>

          {showDetails && (
            <EventModal event={activeEvent} onClose={() => setShowDetails(false)} />
          )}
        </div>
      </section>
      <KolamDivider />
    </div>
  );
}
