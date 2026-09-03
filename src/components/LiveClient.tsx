"use client";

import { CalendarDays, Clock, ExternalLink, MapPin, Radio } from "lucide-react";
import { useVisitAnalytics } from "@/lib/analytics";
import { EVENTS, LIVE_STREAMS, WEDDING, type WeddingEvent } from "@/lib/data";

type StreamWithEvent = (typeof LIVE_STREAMS)[number] & {
  readonly event: WeddingEvent;
};

function getStreamEvent(eventId: string): WeddingEvent | undefined {
  return EVENTS.find((event) => event.id === eventId);
}

function getWatchUrl(videoId: string): string {
  return `https://www.youtube.com/live/${videoId}`;
}

function getEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
}

export function LiveClient() {
  const streams = LIVE_STREAMS
    .map((stream) => {
      const event = getStreamEvent(stream.eventId);
      return event ? { ...stream, event } : null;
    })
    .filter((stream): stream is StreamWithEvent => Boolean(stream));

  const { handleTrackedClick } = useVisitAnalytics({
    sections: ["Live Header", "Live Streams"],
    metadata: {
      page: "live",
    },
  });

  return (
    <div className="min-h-screen pb-14 pt-28" onClickCapture={handleTrackedClick}>
      <section data-analytics-section="Live Header" className="section-tight pb-7 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-linen/35 bg-linen/10 text-linen">
          <Radio className="h-7 w-7" />
        </div>
        <p className="font-josefin text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-linen/92">
          Wedding Livestreams
        </p>
        <h1 className="mt-2 font-script text-6xl leading-none text-linen sm:text-7xl">Watch Live</h1>
        <p className="mx-auto mt-3 max-w-xl font-cormorant text-xl italic text-linen/90">
          Join {WEDDING.couple.short} for the ceremonies from wherever you are.
        </p>
      </section>

      <section data-analytics-section="Live Streams" className="event-timeline pt-4">
        <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-3">
          {streams.map((stream) => (
            <article
              key={stream.id}
              className="rounded-2xl border border-dashed border-linen/45 bg-burgundy-deep p-3 shadow-[0_22px_52px_rgba(0,0,0,0.3)]"
            >
              <div className="overflow-hidden rounded-xl border border-linen/18 bg-linen-soft text-ink">
                <div className="relative aspect-video bg-black">
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={getEmbedUrl(stream.youtubeVideoId)}
                    title={`${stream.name} livestream`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>

                <div className="p-4 sm:p-5">
                  <p className="font-josefin text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-ink/48">
                    {stream.event.name}
                  </p>
                  <h2 className="mt-1 font-cormorant text-3xl italic leading-none text-ink">
                    {stream.name}
                  </h2>

                  <div className="mt-4 space-y-2 font-josefin text-sm text-ink/68">
                    <p className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 flex-shrink-0 text-olive" />
                      <span>{stream.event.dateLabel}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 flex-shrink-0 text-olive" />
                      <span>{stream.event.timeLabel}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 flex-shrink-0 text-olive" />
                      <span>{stream.event.venue}</span>
                    </p>
                  </div>

                  <a
                    href={getWatchUrl(stream.youtubeVideoId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-olive px-5 py-3 font-josefin text-xs font-semibold uppercase tracking-[0.18em] text-linen transition hover:bg-olive-strong"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Stream
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
