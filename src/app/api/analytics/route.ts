import { NextResponse } from "next/server";
import { isOwnerRequest } from "@/lib/adminAccess";
import { getDb } from "@/lib/mongodb";

let indexesReady: Promise<string> | null = null;

interface AnalyticsDoc {
  readonly _id?: { toString(): string };
  readonly eventType?: string;
  readonly sessionId?: string;
  readonly visitId?: string;
  readonly clientEventId?: string;
  readonly userId?: string | null;
  readonly ipAddress?: string;
  readonly location?: string | null;
  readonly deviceInfo?: string | null;
  readonly pagePath?: string | null;
  readonly actionName?: string | null;
  readonly actionLabel?: string | null;
  readonly metadata?: Record<string, unknown> | null;
  readonly durationSeconds?: number;
  readonly lastActiveAt?: Date;
  readonly timestamp?: Date;
}

function ensureIndexes() {
  if (!indexesReady) {
    indexesReady = getDb()
      .then((db) => db.collection("analytics").createIndex(
        { clientEventId: 1 },
        { unique: true, sparse: true }
      ))
      .catch((error) => {
        indexesReady = null;
        throw error;
      });
  }

  return indexesReady;
}

function firstHeaderValue(value: string | null): string | null {
  return value ? value.split(",")[0]?.trim() || null : null;
}

function normalizeIp(value: string | null): string {
  const raw = firstHeaderValue(value);
  if (!raw) return "unknown";

  let ip = raw;
  if (ip.startsWith("::ffff:")) {
    ip = ip.slice(7);
  }

  if (ip.startsWith("[")) {
    const endBracket = ip.indexOf("]");
    if (endBracket !== -1) {
      ip = ip.slice(1, endBracket);
    }
  } else {
    const ipv4WithPort = ip.match(/^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/);
    if (ipv4WithPort) {
      ip = ipv4WithPort[1];
    }
  }

  return ip || "unknown";
}

function getClientIp(request: Request): string {
  const candidates = [
    request.headers.get("cf-connecting-ip"),
    request.headers.get("true-client-ip"),
    request.headers.get("x-real-ip"),
    request.headers.get("x-vercel-forwarded-for"),
    request.headers.get("x-forwarded-for"),
    request.headers.get("x-client-ip"),
  ];

  for (const candidate of candidates) {
    const ip = normalizeIp(candidate);
    if (ip !== "unknown") return ip;
  }

  return "unknown";
}

function isPrivateIp(ip: string): boolean {
  if (!ip || ip === "unknown") return true;

  const lowerIp = ip.toLowerCase();
  if (
    lowerIp === "::1" ||
    lowerIp.startsWith("fc") ||
    lowerIp.startsWith("fd") ||
    lowerIp.startsWith("fe80:")
  ) {
    return true;
  }

  const octets = ip.split(".").map(Number);
  if (octets.length !== 4 || octets.some((octet) => Number.isNaN(octet) || octet < 0 || octet > 255)) {
    return false;
  }

  const [a, b] = octets;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  );
}

async function fetchJson(url: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json() as Promise<Record<string, unknown>>;
  } finally {
    clearTimeout(timeout);
  }
}

function formatLocation(city: unknown, region: unknown, country: unknown, countryCode: unknown): string | null {
  const normalizedCountry = String(country || "").trim().toLowerCase();
  const normalizedCountryCode = String(countryCode || "").trim().toUpperCase();
  const isUnitedStates = (
    normalizedCountryCode === "US" ||
    normalizedCountry === "united states" ||
    normalizedCountry === "united states of america" ||
    normalizedCountry === "usa" ||
    normalizedCountry === "us"
  );
  const parts = isUnitedStates ? [city, region, country] : [city, country];

  return parts.map((part) => String(part || "").trim()).filter(Boolean).join(", ") || null;
}

function getPositiveInteger(value: string | null, fallback: number, max = Number.MAX_SAFE_INTEGER): number {
  const parsedValue = Number.parseInt(value || "", 10);

  if (!Number.isFinite(parsedValue) || parsedValue < 1) return fallback;
  return Math.min(parsedValue, max);
}

function getQueryText(value: string | null, maxLength = 100): string {
  return String(value || "").trim().slice(0, maxLength);
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getTimeFilterStart(timeFilter: string | null): Date | null {
  const start = new Date();

  switch (timeFilter) {
    case "15m":
      start.setMinutes(start.getMinutes() - 15);
      return start;
    case "30m":
      start.setMinutes(start.getMinutes() - 30);
      return start;
    case "1h":
      start.setHours(start.getHours() - 1);
      return start;
    case "6h":
      start.setHours(start.getHours() - 6);
      return start;
    case "1d":
      start.setDate(start.getDate() - 1);
      return start;
    default:
      return null;
  }
}

function getVisitorKey(event: AnalyticsDoc): string {
  if (event.ipAddress && event.ipAddress !== "unknown") {
    return `ip:${event.ipAddress}|device:${event.deviceInfo || "unknown"}`;
  }

  return event.sessionId ? `session:${event.sessionId}` : `event:${event._id?.toString() || "unknown"}`;
}

function sanitizeDurationSeconds(value: unknown): number {
  const duration = Number(value);
  if (!Number.isFinite(duration) || duration < 0) return 0;
  return Math.min(Math.round(duration), 24 * 60 * 60);
}

async function getLocationFromIP(ip: string): Promise<string | null> {
  if (isPrivateIp(ip)) return null;

  const encodedIp = encodeURIComponent(ip);
  const providers = [
    {
      url: `https://ipwho.is/${encodedIp}`,
      parse: (data: Record<string, unknown>) => data.success
        ? formatLocation(data.city, data.region, data.country, data.country_code)
        : null,
    },
    {
      url: `https://tools.keycdn.com/geo.json?host=${encodedIp}`,
      options: {
        headers: {
          "User-Agent": `keycdn-tools:${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://mr-wedding.local"}`,
        },
      },
      parse: (data: Record<string, unknown>) => {
        const body = data.body as { geo?: Record<string, unknown> } | undefined;
        const nested = data.data as { geo?: Record<string, unknown> } | undefined;
        const geo = nested?.geo || body?.geo;
        return data.status === "success"
          ? formatLocation(geo?.city, geo?.region_name, geo?.country_name, geo?.country_code)
          : null;
      },
    },
  ];

  for (const provider of providers) {
    try {
      const data = await fetchJson(provider.url, provider.options);
      const location = provider.parse(data);
      if (location) return location;
    } catch {
      // Geolocation is helpful but should never block analytics.
    }
  }

  return null;
}

async function parseJsonBody(request: Request): Promise<Record<string, unknown>> {
  try {
    return await request.json() as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody(request);
    const {
      eventType,
      sessionId,
      clientEventId,
      userId,
      deviceInfo,
      visitId,
      pagePath,
      actionName,
      actionLabel,
      durationSeconds,
      metadata,
    } = body;

    if (typeof eventType !== "string" || typeof sessionId !== "string") {
      return NextResponse.json({ error: "eventType and sessionId required" }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection("analytics");

    if (eventType === "duration_update") {
      if (typeof visitId !== "string") {
        return NextResponse.json({ error: "visitId required for duration_update" }, { status: 400 });
      }

      await collection.updateOne(
        { eventType: "page_view", visitId },
        {
          $max: { durationSeconds: sanitizeDurationSeconds(durationSeconds) },
          $set: { lastActiveAt: new Date() },
        }
      );

      return NextResponse.json({ success: true });
    }

    const ipAddress = getClientIp(request);
    const location = eventType === "page_view" ? await getLocationFromIP(ipAddress) : null;
    const eventDoc = {
      eventType,
      sessionId,
      visitId: typeof visitId === "string" ? visitId : null,
      userId: typeof userId === "string" ? userId : null,
      ipAddress,
      location,
      deviceInfo: typeof deviceInfo === "string" ? deviceInfo : null,
      pagePath: typeof pagePath === "string" ? pagePath : null,
      actionName: typeof actionName === "string" ? actionName : null,
      actionLabel: typeof actionLabel === "string" ? actionLabel : null,
      metadata: typeof metadata === "object" && metadata !== null ? metadata : null,
      durationSeconds: eventType === "page_view" ? 0 : null,
      lastActiveAt: eventType === "page_view" ? new Date() : null,
      timestamp: new Date(),
    };

    if (typeof clientEventId === "string" && clientEventId.trim().length > 0) {
      await ensureIndexes();
      try {
        await collection.updateOne(
          { clientEventId },
          { $setOnInsert: { ...eventDoc, clientEventId } },
          { upsert: true }
        );
      } catch (error) {
        if (!(typeof error === "object" && error !== null && "code" in error && error.code === 11000)) {
          throw error;
        }
      }
    } else {
      await collection.insertOne(eventDoc);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics API error:", error);
    if (error instanceof Error && error.message.includes("MONGODB_URI")) {
      return NextResponse.json({ error: "Visitor logs require MONGODB_URI to be configured." }, { status: 503 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  if (!(await isOwnerRequest())) {
    return NextResponse.json({ error: "Owner access required" }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const db = await getDb();
    const collection = db.collection<AnalyticsDoc>("analytics");
    const startTime = getTimeFilterStart(url.searchParams.get("timeFilter"));
    const timeQuery = startTime ? { timestamp: { $gte: startTime } } : {};

    if (url.searchParams.get("details") === "true") {
      const requestedPage = getPositiveInteger(url.searchParams.get("page"), 1);
      const pageSize = getPositiveInteger(url.searchParams.get("pageSize"), 10, 100);
      const detailsQuery: Record<string, unknown> = { ...timeQuery, eventType: "page_view" };
      const ipFilter = getQueryText(url.searchParams.get("ip"));
      const locationFilter = getQueryText(url.searchParams.get("location"));

      if (ipFilter) {
        detailsQuery.ipAddress = { $regex: escapeRegex(ipFilter), $options: "i" };
      }
      if (locationFilter) {
        detailsQuery.location = { $regex: escapeRegex(locationFilter), $options: "i" };
      }

      const totalVisitors = await collection.countDocuments(detailsQuery);
      const totalPages = Math.max(1, Math.ceil(totalVisitors / pageSize));
      const page = Math.min(requestedPage, totalPages);
      const events = await collection
        .find(detailsQuery)
        .sort({ timestamp: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .toArray();

      const visitIds = events.map((event) => event.visitId).filter((id): id is string => Boolean(id));
      const actionEvents = visitIds.length
        ? await collection
            .find({ visitId: { $in: visitIds }, eventType: { $ne: "page_view" } })
            .sort({ timestamp: 1 })
            .toArray()
        : [];
      const actionsByVisitId = new Map<string, AnalyticsDoc[]>();

      actionEvents.forEach((event) => {
        if (!event.visitId) return;
        if (!actionsByVisitId.has(event.visitId)) actionsByVisitId.set(event.visitId, []);
        actionsByVisitId.get(event.visitId)?.push(event);
      });

      const visitors = events.map((event) => ({
        id: event._id?.toString(),
        visitId: event.visitId,
        sessionId: event.sessionId,
        visitorName: "Anonymous",
        ipAddress: event.ipAddress,
        location: event.location,
        deviceInfo: event.deviceInfo,
        pagePath: event.pagePath,
        metadata: event.metadata,
        durationSeconds: event.durationSeconds || 0,
        actions: (event.visitId ? actionsByVisitId.get(event.visitId) : [])?.map((action) => ({
          id: action._id?.toString(),
          eventType: action.eventType,
          actionName: action.actionName,
          actionLabel: action.actionLabel,
          metadata: action.metadata,
          timestamp: action.timestamp,
        })) || [],
        visitedAt: event.timestamp,
      }));

      return NextResponse.json({
        visitors,
        pagination: {
          page,
          pageSize,
          totalVisitors,
          totalPages,
        },
      });
    }

    const allEvents = await collection.find(timeQuery).toArray();
    const pageViewEvents = allEvents.filter((event) => event.eventType === "page_view");
    const videoPlayEvents = allEvents.filter((event) => event.eventType === "video_play");
    const uniquePageViewVisitors = new Set(pageViewEvents.map(getVisitorKey)).size;
    const uniqueVideoViewers = new Set(videoPlayEvents.map(getVisitorKey)).size;

    return NextResponse.json({
      totalPageViews: pageViewEvents.length,
      uniqueVisitors: uniquePageViewVisitors,
      totalVideoPlays: videoPlayEvents.length,
      uniqueVideoViewers,
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    if (error instanceof Error && error.message.includes("MONGODB_URI")) {
      return NextResponse.json({ error: "Visitor logs require MONGODB_URI to be configured." }, { status: 503 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
