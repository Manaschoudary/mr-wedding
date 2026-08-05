import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { isOwnerRequest } from "@/lib/adminAccess";
import { getDb } from "@/lib/mongodb";

async function requireOwner() {
  if (await isOwnerRequest()) return null;
  return NextResponse.json({ error: "Owner access required" }, { status: 401 });
}

function getId(request: Request): string | null {
  return new URL(request.url).searchParams.get("id");
}

function parseObjectId(id: string | null): ObjectId | null {
  if (!id) return null;
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

export async function GET() {
  const unauthorized = await requireOwner();
  if (unauthorized) return unauthorized;

  try {
    const db = await getDb();
    const rsvps = await db.collection("rsvps").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({
      rsvps: rsvps.map((rsvp) => ({ ...rsvp, _id: rsvp._id.toString() })),
    });
  } catch (error) {
    console.error("Guests API error:", error);
    if (error instanceof Error && error.message.includes("MONGODB_URI")) {
      return NextResponse.json({ error: "RSVP dashboard requires MONGODB_URI to be configured." }, { status: 503 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const unauthorized = await requireOwner();
  if (unauthorized) return unauthorized;

  const oid = parseObjectId(getId(request));
  if (!oid) return NextResponse.json({ error: "Valid ID required" }, { status: 400 });

  try {
    const db = await getDb();
    const result = await db.collection("rsvps").deleteOne({ _id: oid });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Guests delete error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const unauthorized = await requireOwner();
  if (unauthorized) return unauthorized;

  const oid = parseObjectId(getId(request));
  if (!oid) return NextResponse.json({ error: "Valid ID required" }, { status: 400 });

  try {
    const updates = await request.json() as Record<string, unknown>;
    delete updates._id;
    const db = await getDb();
    await db.collection("rsvps").updateOne(
      { _id: oid },
      { $set: { ...updates, updatedAt: new Date() } }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Guests patch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
