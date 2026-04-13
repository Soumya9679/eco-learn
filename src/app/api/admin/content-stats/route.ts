export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { verifyAdmin, forbidden } from "@/lib/auth";

// GET /api/admin/content-stats
export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return forbidden();

  try {
    const [modulesSnap, quizzesSnap, challengesSnap] = await Promise.all([
      db.collection("modules").count().get(),
      db.collection("quizzes").count().get(),
      db.collection("challenges").count().get(),
    ]);

    return NextResponse.json({
      moduleCount: modulesSnap.data().count,
      quizCount: quizzesSnap.data().count,
      challengeCount: challengesSnap.data().count,
    });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
