export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { verifyAdmin, forbidden } from "@/lib/auth";

// PUT /api/admin/modules
export async function PUT(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return forbidden();

  try {
    const { id, ...data } = await req.json();
    if (!id) {
      return NextResponse.json({ message: "Module id required" }, { status: 400 });
    }

    await db.collection("modules").doc(id).update(data);
    const updated = await db.collection("modules").doc(id).get();
    return NextResponse.json({ id: updated.id, ...updated.data() });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE /api/admin/modules?id=xxx
export async function DELETE(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return forbidden();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "Module id required" }, { status: 400 });
    }

    await db.collection("modules").doc(id).delete();
    return NextResponse.json({ message: "Module deleted." });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
