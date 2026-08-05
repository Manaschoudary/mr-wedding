import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

let indexesReady: Promise<string> | null = null;

interface RSVPGuest {
  readonly firstName?: unknown;
  readonly lastName?: unknown;
  readonly attending?: unknown;
}

interface RSVPBody {
  readonly clientSubmissionId?: unknown;
  readonly submittedAt?: unknown;
  readonly primaryGuest?: RSVPGuest & Record<string, unknown>;
  readonly eventAttendance?: unknown;
  readonly [key: string]: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseBody(value: unknown): RSVPBody | null {
  if (!isRecord(value)) return null;

  const primaryGuest = value.primaryGuest;
  if (!isRecord(primaryGuest)) return null;

  if (typeof primaryGuest.firstName !== "string" || primaryGuest.firstName.trim().length === 0) {
    return null;
  }

  if (typeof primaryGuest.lastName !== "string" || primaryGuest.lastName.trim().length === 0) {
    return null;
  }

  if (primaryGuest.attending !== "yes" && primaryGuest.attending !== "no") {
    return null;
  }

  return value as RSVPBody;
}

function ensureIndexes() {
  if (!indexesReady) {
    indexesReady = getDb()
      .then((db) => db.collection("rsvps").createIndex(
        { clientSubmissionId: 1 },
        { unique: true, sparse: true }
      ))
      .catch((error) => {
        indexesReady = null;
        throw error;
      });
  }

  return indexesReady;
}

export async function POST(request: Request) {
  try {
    const parsed = parseBody(await request.json());

    if (parsed === null) {
      return NextResponse.json({ error: "First name, last name, and attendance response are required" }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection("rsvps");
    const doc = {
      ...parsed,
      submittedAt: typeof parsed.submittedAt === "string" ? parsed.submittedAt : new Date().toISOString(),
      createdAt: new Date(),
    };

    if (typeof parsed.clientSubmissionId === "string" && parsed.clientSubmissionId.trim().length > 0) {
      await ensureIndexes();
      try {
        const result = await collection.updateOne(
          { clientSubmissionId: parsed.clientSubmissionId },
          { $setOnInsert: doc },
          { upsert: true }
        );
        return NextResponse.json({
          success: true,
          id: result.upsertedId?.toString?.() || parsed.clientSubmissionId,
          duplicate: !result.upsertedId,
        }, { status: result.upsertedId ? 201 : 200 });
      } catch (error) {
        if (isRecord(error) && error.code === 11000) {
          return NextResponse.json({
            success: true,
            id: parsed.clientSubmissionId,
            duplicate: true,
          });
        }
        throw error;
      }
    }

    const result = await collection.insertOne(doc);
    return NextResponse.json({ success: true, id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    console.error("RSVP submission error:", error);
    if (error instanceof Error && error.message.includes("MONGODB_URI")) {
      return NextResponse.json({ error: "RSVP storage requires MONGODB_URI to be configured." }, { status: 503 });
    }
    return NextResponse.json({ error: "Failed to save RSVP. Please try again." }, { status: 500 });
  }
}
