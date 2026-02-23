export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

// GET /api/modules
export async function GET() {
  try {
    const snapshot = await db.collection("modules").get();
    const modules = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(modules);
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
