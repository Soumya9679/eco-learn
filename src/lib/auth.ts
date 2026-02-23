import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "./firebase";

export async function verifyToken(
  req: NextRequest
): Promise<{ uid: string } | null> {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return null;
    const token = authHeader.split(" ")[1];
    if (!token) return null;
    const decoded = await adminAuth.verifyIdToken(token);
    return { uid: decoded.uid };
  } catch {
    return null;
  }
}

export function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ message: "Forbidden" }, { status: 403 });
}
