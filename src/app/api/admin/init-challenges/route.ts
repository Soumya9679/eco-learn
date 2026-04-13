export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { verifyAdmin, forbidden } from "@/lib/auth";

// POST /api/admin/init-challenges — initialize default challenges
export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return forbidden();

  try {
    const existing = await db.collection("challenges").count().get();
    if (existing.data().count > 0) {
      return NextResponse.json({
        message: "Challenges already initialized",
        count: existing.data().count,
      });
    }

    const defaultChallenges = [
      { category: "🏠 At Home", title: "Segregate Waste", description: "Separate your household waste into dry and wet for one week.", points: 50 },
      { category: "🏠 At Home", title: "Fix a Leak", description: "Find and fix a dripping tap or leaky pipe in your home.", points: 75 },
      { category: "🏫 School Level", title: "Campus Clean-up Drive", description: "Organize or participate in a clean-up drive on your campus.", points: 100 },
      { category: "🏫 School Level", title: "Start a Garden Patch", description: "Help plant and maintain a small garden at your school.", points: 120 },
      { category: "🎓 College Level", title: "Energy Audit", description: "Analyze the energy consumption of one building on your campus.", points: 150 },
      { category: "🎓 College Level", title: "Waste Awareness Drive", description: "Conduct a presentation to raise awareness about waste management.", points: 130 },
    ];

    const batch = db.batch();
    defaultChallenges.forEach((c) => {
      const ref = db.collection("challenges").doc();
      batch.set(ref, { ...c, createdAt: new Date().toISOString() });
    });
    await batch.commit();

    return NextResponse.json({
      message: "Default challenges initialized successfully",
      count: defaultChallenges.length,
    });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
