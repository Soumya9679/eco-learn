export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { verifyAdmin, forbidden } from "@/lib/auth";

// PUT /api/admin/quizzes
export async function PUT(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return forbidden();

  try {
    const { id, ...data } = await req.json();
    if (!id) {
      return NextResponse.json({ message: "Quiz id required" }, { status: 400 });
    }

    const ref = db.collection("quizzes").doc(id);
    const doc = await ref.get();
    if (!doc.exists)
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });

    await ref.update(data);
    const updated = await ref.get();
    return NextResponse.json({ id: updated.id, ...updated.data() });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE /api/admin/quizzes?id=xxx
export async function DELETE(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return forbidden();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "Quiz id required" }, { status: 400 });
    }

    const ref = db.collection("quizzes").doc(id);
    const doc = await ref.get();
    if (!doc.exists)
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    await ref.delete();
    return NextResponse.json({ message: "Quiz deleted." });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
