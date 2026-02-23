export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { verifyToken, unauthorized } from "@/lib/auth";

// GET /api/user/recent-activity
export async function GET(req: NextRequest) {
  const payload = await verifyToken(req);
  if (!payload) return unauthorized();

  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const snapshot = await db
      .collection("userActivities")
      .where("userId", "==", payload.uid)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    const activities = snapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(activities);
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
