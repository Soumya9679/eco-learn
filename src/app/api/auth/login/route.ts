export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { verifyToken, unauthorized } from "@/lib/auth";

export async function POST(req: NextRequest) {
  // Verify Firebase ID token instead of trusting client-supplied UID
  const payload = await verifyToken(req);
  if (!payload) return unauthorized();

  try {
    // Fetch user data from Firestore using the verified UID
    const userDoc = await db.collection("users").doc(payload.uid).get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const userData = userDoc.data()!;
    const user = {
      id: userDoc.id,
      name: userData.name,
      email: userData.email,
      ecoPoints: userData.ecoPoints,
      role: userData.role,
    };

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
