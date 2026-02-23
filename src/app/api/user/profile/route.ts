export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { verifyToken, unauthorized } from "@/lib/auth";

// GET /api/user/profile
export async function GET(req: NextRequest) {
  const payload = await verifyToken(req);
  if (!payload) return unauthorized();

  try {
    const userDoc = await db.collection("users").doc(payload.uid).get();
    if (!userDoc.exists)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ _id: userDoc.id, ...userDoc.data() });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT /api/user/profile
export async function PUT(req: NextRequest) {
  const payload = await verifyToken(req);
  if (!payload) return unauthorized();

  try {
    const { name, email, school } = await req.json();
    if (!name || !email) {
      return NextResponse.json(
        { message: "Name and email are required." },
        { status: 400 }
      );
    }

    await db.collection("users").doc(payload.uid).update({
      name,
      email,
      school: school || "",
      updatedAt: new Date().toISOString(),
    });

    const updatedDoc = await db.collection("users").doc(payload.uid).get();
    if (!updatedDoc.exists)
      return NextResponse.json({ message: "User not found." }, { status: 404 });

    return NextResponse.json({ _id: updatedDoc.id, ...updatedDoc.data() });
  } catch {
    return NextResponse.json(
      { message: "Server error while updating profile." },
      { status: 500 }
    );
  }
}
