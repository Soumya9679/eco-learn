export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { verifyToken, unauthorized } from "@/lib/auth";

// GET /api/leaderboard?scope=[school|state|country]
export async function GET(req: NextRequest) {
  const payload = await verifyToken(req);
  if (!payload) return unauthorized();

  try {
    const { searchParams } = new URL(req.url);
    const scope = searchParams.get("scope");

    const userDoc = await db.collection("users").doc(payload.uid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
    const loggedInUser = userDoc.data()!;

    let query = db.collection("users").orderBy("ecoPoints", "desc").limit(20);

    if (scope === "school" && loggedInUser.school) {
      query = db
        .collection("users")
        .where("school", "==", loggedInUser.school)
        .orderBy("ecoPoints", "desc")
        .limit(20);
    } else if (scope === "state" && loggedInUser.state) {
      query = db
        .collection("users")
        .where("state", "==", loggedInUser.state)
        .orderBy("ecoPoints", "desc")
        .limit(20);
    } else if (scope === "country" && loggedInUser.country) {
      query = db
        .collection("users")
        .where("country", "==", loggedInUser.country)
        .orderBy("ecoPoints", "desc")
        .limit(20);
    }

    const snapshot = await query.get();
    const topUsers = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        _id: doc.id,
        name: data.name,
        ecoPoints: data.ecoPoints,
        school: data.school || "",
        profilePicture: data.profilePicture || "",
      };
    });

    return NextResponse.json(topUsers);
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
