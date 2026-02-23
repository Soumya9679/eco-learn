export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

// GET /api/quizzes
export async function GET() {
  try {
    const snapshot = await db.collection("quizzes").get();
    const quizzes = snapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      description: doc.data().description,
      category: doc.data().category,
    }));
    return NextResponse.json(quizzes);
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
