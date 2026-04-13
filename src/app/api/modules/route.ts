// Modules listing — cacheable (#12)
export const revalidate = 300; // Cache for 5 minutes

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

// GET /api/modules?q=searchterm
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.toLowerCase() || "";

    const snapshot = await db.collection("modules").get();
    let modules: Record<string, unknown>[] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Server-side search filtering (#28)
    if (query) {
      modules = modules.filter(
        (m) =>
          (m.title as string)?.toLowerCase().includes(query) ||
          (m.description as string)?.toLowerCase().includes(query) ||
          (m.category as string)?.toLowerCase().includes(query)
      );
    }

    return NextResponse.json(modules);
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
