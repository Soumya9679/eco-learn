export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db, adminAuth } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    // Verify Firebase ID token to get the real UID
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = await adminAuth.verifyIdToken(token);
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const uid = decoded.uid;
    const { email, name, mobile } = await req.json();

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
        email: email || decoded.email || "",
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
