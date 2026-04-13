// Quizzes listing — cacheable (#12)
export const revalidate = 300; // Cache for 5 minutes

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

// GET /api/quizzes?q=searchterm
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.toLowerCase() || "";

    const snapshot = await db.collection("quizzes").get();
    let quizzes = snapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      description: doc.data().description,
      category: doc.data().category,
    }));

    // Server-side search filtering (#28)
    if (query) {
      quizzes = quizzes.filter(
        (q) =>
          q.title?.toLowerCase().includes(query) ||
          q.description?.toLowerCase().includes(query) ||
          q.category?.toLowerCase().includes(query)
      );
    }

    return NextResponse.json(quizzes);
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
