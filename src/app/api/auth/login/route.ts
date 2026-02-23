export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json();

    // Fetch user data from Firestore
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
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
