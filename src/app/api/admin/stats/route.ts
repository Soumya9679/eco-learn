export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { verifySuperAdmin, forbidden } from "@/lib/auth";

// GET /api/admin/stats
export async function GET(req: NextRequest) {
  const admin = await verifySuperAdmin(req);
  if (!admin) return forbidden();

  try {
    // Use count queries instead of fetching all documents (#9)
    const [usersSnap, modulesCount, quizzesCount, challengesCount] =
      await Promise.all([
        db.collection("users").get(), // Need full scan for role/status/date aggregation
        db.collection("modules").count().get(),
        db.collection("quizzes").count().get(),
        db.collection("challenges").count().get(),
      ]);

    const totalUsers = usersSnap.size;
    let totalFaculty = 0;
    let activeUsers = 0;
    let newUsersThisWeek = 0;
    let newFacultyThisWeek = 0;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoISO = weekAgo.toISOString();

    usersSnap.docs.forEach((doc) => {
      const d = doc.data();
      if (d.role === "admin") totalFaculty++;
      if (d.status === "active") activeUsers++;
      if (d.createdAt && d.createdAt >= weekAgoISO) {
        newUsersThisWeek++;
        if (d.role === "admin") newFacultyThisWeek++;
      }
    });

    const totalContent =
      modulesCount.data().count +
      quizzesCount.data().count +
      challengesCount.data().count;

    return NextResponse.json({
      totalUsers,
      totalFaculty,
      activeUsers,
      totalContent,
      usersChange: `+${newUsersThisWeek} this week`,
      facultyChange: `+${newFacultyThisWeek} this week`,
      activityChange: `+${totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}% this week`,
      contentChange: `+0 this week`,
    });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
