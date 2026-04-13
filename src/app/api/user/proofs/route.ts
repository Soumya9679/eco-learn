export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { verifyToken, unauthorized } from "@/lib/auth";

// GET /api/user/proofs
export async function GET(req: NextRequest) {
  const payload = await verifyToken(req);
  if (!payload) return unauthorized();

  try {
    const snapshot = await db
      .collection("proofs")
      .where("userId", "==", payload.uid)
      .orderBy("createdAt", "desc")
      .get();

    const proofs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(proofs);
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
