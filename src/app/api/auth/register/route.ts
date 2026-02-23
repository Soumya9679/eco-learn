export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const { uid, email, name, mobile } = await req.json();

    // Check if user already exists in Firestore
    const userDoc = await db.collection("users").doc(uid).get();
    if (userDoc.exists) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Create user document in Firestore
    await db
      .collection("users")
      .doc(uid)
      .set({
        name,
        email,
        mobile: mobile || "",
        school: "",
        state: "",
        country: "",
        profilePicture: "",
        role: "user",
        status: "active",
        ecoPoints: 0,
        badges: [],
        stats: { waterSaved: 0, wasteDiverted: 0, treesPlanted: 0 },
        progress: {
          modulesCompleted: 0,
          challengesCompleted: 0,
          quizzesCompleted: 0,
          gamesCompleted: 0,
        },
        createdAt: new Date().toISOString(),
      });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
