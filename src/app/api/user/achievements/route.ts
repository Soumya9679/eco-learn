export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { verifyToken, unauthorized } from "@/lib/auth";

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

    const achievements = [
      {
        id: "eco-starter",
        title: "Eco Starter",
        description: "Complete your first challenge",
        icon: "🌱",
        earned: badges.includes("Eco Starter"),
        requirement: "Complete 1 challenge",
      },
      {
        id: "knowledge-seeker",
        title: "Knowledge Seeker",
        description: "Complete 5 modules",
        icon: "📚",
        earned: badges.includes("Knowledge Seeker"),
        requirement: "Complete 5 modules",
      },
      {
        id: "eco-champion",
        title: "Eco Champion",
        description: "Complete 10 challenges",
        icon: "🏆",
        earned: badges.includes("Eco Champion"),
        requirement: "Complete 10 challenges",
      },
      {
        id: "point-master",
        title: "Point Master",
        description: "Earn 1000 EcoPoints",
        icon: "⭐",
        earned: badges.includes("Point Master"),
        requirement: "Earn 1000 EcoPoints",
      },
      {
        id: "quiz-master",
        title: "Quiz Master",
        description: "Score 100% on any quiz",
        icon: "🧠",
        earned: badges.includes("Quiz Master"),
        requirement: "Score 100% on any quiz",
      },
    ];

    return NextResponse.json(achievements);
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
