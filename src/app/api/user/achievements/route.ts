export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { verifyToken, unauthorized } from "@/lib/auth";
import { BADGE_DEFINITIONS } from "@/lib/badges";

// GET /api/user/achievements
export async function GET(req: NextRequest) {
  const payload = await verifyToken(req);
  if (!payload) return unauthorized();

  try {
    const userDoc = await db.collection("users").doc(payload.uid).get();
    if (!userDoc.exists)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const userData = userDoc.data()!;
    const badges: string[] = userData.badges || [];

    // Use configurable badge definitions instead of hardcoded (#17)
    const achievements = BADGE_DEFINITIONS.map((badge) => ({
      id: badge.id,
      title: badge.title,
      description: badge.description,
      icon: badge.icon,
      earned: badges.includes(badge.title),
      requirement: badge.requirement,
    }));

    return NextResponse.json(achievements);
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
