export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

// GET /api/quizzes/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doc = await db.collection("quizzes").doc(id).get();
    if (!doc.exists) {
      return NextResponse.json(
        { message: "Quiz not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ id: doc.id, ...doc.data() });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
