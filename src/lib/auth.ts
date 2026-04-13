import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "./firebase";
import { db } from "./firebase";

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

/**
 * Verify that the request is from an admin or superadmin user.
 * Returns user data with uid, or null if not authorized.
 */
export async function verifyAdmin(
  req: NextRequest
): Promise<{ uid: string; role: string } | null> {
  const payload = await verifyToken(req);
  if (!payload) return null;

  try {
    const userDoc = await db.collection("users").doc(payload.uid).get();
    if (!userDoc.exists) return null;
    const userData = userDoc.data()!;
    if (!["admin", "superadmin"].includes(userData.role)) return null;
    return { uid: payload.uid, role: userData.role };
  } catch {
    return null;
  }
}

/**
 * Verify that the request is from a superadmin user.
 * Returns user data with uid, or null if not authorized.
 */
export async function verifySuperAdmin(
  req: NextRequest
): Promise<{ uid: string; role: string } | null> {
  const payload = await verifyToken(req);
  if (!payload) return null;

  try {
    const userDoc = await db.collection("users").doc(payload.uid).get();
    if (!userDoc.exists) return null;
    const userData = userDoc.data()!;
    if (userData.role !== "superadmin") return null;
    return { uid: payload.uid, role: userData.role };
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
