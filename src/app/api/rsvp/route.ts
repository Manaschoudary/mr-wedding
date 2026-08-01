import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

interface RSVPEventResponse {
  eventId: string;
  status: "attending" | "tentative" | "decline";
}

interface RSVPRequest {
  name: string;
  email?: string;
  phone?: string;
  events: RSVPEventResponse[];
}

export async function POST(request: Request) {
  try {
    const body: RSVPRequest = await request.json();

    // Validate required fields
    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.events) || body.events.length === 0) {
      return NextResponse.json(
        { error: "At least one event response is required" },
        { status: 400 }
      );
    }

    // Validate event responses
    const validStatuses = new Set(["attending", "tentative", "decline"]);
    for (const event of body.events) {
      if (!event.eventId || !validStatuses.has(event.status)) {
        return NextResponse.json(
          { error: "Invalid event response format" },
          { status: 400 }
        );
      }
    }

    const db = await getDb();
    const collection = db.collection("rsvps");

    const rsvpDoc = {
      name: body.name.trim(),
      email: body.email?.trim() || null,
      phone: body.phone?.trim() || null,
      events: body.events.map((e) => ({
        eventId: e.eventId,
        status: e.status,
      })),
      submittedAt: new Date(),
      updatedAt: new Date(),
    };

    // Upsert by name (allows guests to update their RSVP)
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

    return NextResponse.json(
      { message: "RSVP submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("RSVP submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
