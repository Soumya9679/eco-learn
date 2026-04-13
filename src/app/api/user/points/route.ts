export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db, getFieldValue } from "@/lib/firebase";
import { verifyToken, unauthorized } from "@/lib/auth";

const MAX_POINTS_PER_REQUEST = 200;

// POST /api/user/points
export async function POST(req: NextRequest) {
  const payload = await verifyToken(req);
  if (!payload) return unauthorized();

  try {
    const { points } = await req.json();

    // Validate points input
    if (typeof points !== "number" || !Number.isFinite(points)) {
      return NextResponse.json(
        { message: "Points must be a valid number" },
        { status: 400 }
      );
    }
    if (points <= 0) {
      return NextResponse.json(
        { message: "Points must be greater than 0" },
        { status: 400 }
      );
    }
    if (points > MAX_POINTS_PER_REQUEST) {
      return NextResponse.json(
        { message: `Points cannot exceed ${MAX_POINTS_PER_REQUEST} per request` },
        { status: 400 }
      );
    }

    const userRef = db.collection("users").doc(payload.uid);

    await userRef.update({
      ecoPoints: getFieldValue().increment(Math.floor(points)),
    });

    const updatedDoc = await userRef.get();
    if (!updatedDoc.exists)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
