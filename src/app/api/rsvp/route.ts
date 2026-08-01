import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

interface RSVPEventResponse {
  readonly eventId: string;
  readonly status: "attending" | "tentative" | "decline";
}

interface RSVPRequest {
  readonly name: string;
  readonly email?: string;
  readonly phone?: string;
  readonly note?: string;
  readonly events: readonly RSVPEventResponse[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseRequest(value: unknown): RSVPRequest | null {
  if (!isRecord(value)) {
    return null;
  }

  const name = value.name;
  const email = value.email;
  const phone = value.phone;
  const note = value.note;
  const events = value.events;

  if (typeof name !== "string" || name.trim().length === 0 || !Array.isArray(events) || events.length === 0) {
    return null;
  }

  const validStatuses = new Set(["attending", "tentative", "decline"] as const);
  const parsedEvents: RSVPEventResponse[] = [];

  for (const item of events) {
    if (!isRecord(item)) {
      return null;
    }
    const eventId = item.eventId;
    const status = item.status;
    if (typeof eventId !== "string" || typeof status !== "string" || !validStatuses.has(status as RSVPEventResponse["status"])) {
      return null;
    }
    parsedEvents.push({ eventId, status: status as RSVPEventResponse["status"] });
  }

  return {
    name,
    email: typeof email === "string" ? email : undefined,
    phone: typeof phone === "string" ? phone : undefined,
    note: typeof note === "string" ? note : undefined,
    events: parsedEvents,
  };
}

export async function POST(request: Request) {
  try {
    const parsed = parseRequest(await request.json());

    if (parsed === null) {
      return NextResponse.json({ error: "Invalid RSVP payload" }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection("rsvps");

    const rsvpDoc = {
      name: parsed.name.trim(),
      email: parsed.email?.trim() || null,
      phone: parsed.phone?.trim() || null,
      note: parsed.note?.trim() || null,
      events: parsed.events.map((e) => ({
        eventId: e.eventId,
        status: e.status,
      })),
      submittedAt: new Date(),
      updatedAt: new Date(),
    };

    await collection.updateOne(
      { name: rsvpDoc.name },
      {
        $set: {
          ...rsvpDoc,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          submittedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ message: "RSVP submitted successfully" }, { status: 200 });
  } catch (error) {
    console.error("RSVP submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
