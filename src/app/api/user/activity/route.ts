export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db, getFieldValue } from "@/lib/firebase";
import { verifyToken, unauthorized } from "@/lib/auth";
import { checkAndGrantBadges } from "@/lib/badges";

// POST /api/user/activity
export async function POST(req: NextRequest) {
  const payload = await verifyToken(req);
  if (!payload) return unauthorized();

  try {
    const { activityType, activityId, activityTitle, pointsEarned, score } =
      await req.json();

    if (!activityType || !activityId || !activityTitle) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate points
    const safePoints = Math.max(0, Math.min(200, Math.floor(pointsEarned || 0)));

    // Create activity document
    const activityData = {
      userId: payload.uid,
      activityType,
      activityId,
      activityTitle,
      pointsEarned: safePoints,
      score: score ?? null,
      createdAt: new Date().toISOString(),
    };
    const activityRef = await db.collection("userActivities").add(activityData);

    // Update user progress and points atomically
    const progressField = `progress.${activityType}sCompleted`;
    await db
      .collection("users")
      .doc(payload.uid)
      .update({
        ecoPoints: getFieldValue().increment(safePoints),
        [progressField]: getFieldValue().increment(1),
      });

    // Check and grant badges (#26)
    await checkAndGrantBadges(payload.uid);

    const updatedUser = await db.collection("users").doc(payload.uid).get();

    return NextResponse.json({
      message: "Activity recorded successfully",
      activity: { id: activityRef.id, ...activityData },
      user: { id: updatedUser.id, ...updatedUser.data() },
    });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
