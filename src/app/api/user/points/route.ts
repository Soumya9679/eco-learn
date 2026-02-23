export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db, getFieldValue } from "@/lib/firebase";
import { verifyToken, unauthorized } from "@/lib/auth";


// POST /api/user/points
export async function POST(req: NextRequest) {
  const payload = await verifyToken(req);
  if (!payload) return unauthorized();

  try {
    const { points } = await req.json();
    const userRef = db.collection("users").doc(payload.uid);

    await userRef.update({
      ecoPoints: getFieldValue().increment(points),
    });

    const updatedDoc = await userRef.get();
    if (!updatedDoc.exists)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ _id: updatedDoc.id, ...updatedDoc.data() });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
