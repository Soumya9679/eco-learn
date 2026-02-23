export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db, getFieldValue } from "@/lib/firebase";
import { verifyToken, unauthorized } from "@/lib/auth";


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

    // Create activity document
    const activityData = {
      userId: payload.uid,
      activityType,
      activityId,
      activityTitle,
      pointsEarned: pointsEarned || 0,
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
        ecoPoints: getFieldValue().increment(pointsEarned || 0),
        [progressField]: getFieldValue().increment(1),
      });

    const updatedUser = await db.collection("users").doc(payload.uid).get();

    return NextResponse.json({
      message: "Activity recorded successfully",
      activity: { id: activityRef.id, ...activityData },
      user: { _id: updatedUser.id, ...updatedUser.data() },
    });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
