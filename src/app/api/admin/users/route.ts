export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db, adminAuth } from "@/lib/firebase";
import { verifyAdmin, verifySuperAdmin, forbidden } from "@/lib/auth";

// GET /api/admin/users — list all users
export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return forbidden();

  try {
    const snapshot = await db
      .collection("users")
      .orderBy("createdAt", "desc")
      .get();

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST /api/admin/users — create an admin user
export async function POST(req: NextRequest) {
  const admin = await verifySuperAdmin(req);
  if (!admin) return forbidden();

  try {
    const { name, email, password, school } = await req.json();

    // Check if email already exists
    const existingSnap = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();
    if (!existingSnap.empty) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 400 }
      );
    }

    // Create Firebase Auth user
    const firebaseUser = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // Create Firestore user doc
    await db.collection("users").doc(firebaseUser.uid).set({
      name,
      email,
      mobile: "",
      school: school || "",
      state: "",
      country: "",
      profilePicture: "",
      role: "admin",
      status: "active",
      ecoPoints: 0,
      badges: [],
      stats: { waterSaved: 0, wasteDiverted: 0, treesPlanted: 0 },
      progress: {
        modulesCompleted: 0,
        challengesCompleted: 0,
        quizzesCompleted: 0,
        gamesCompleted: 0,
      },
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: "Admin account created successfully." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT /api/admin/users — update a user
export async function PUT(req: NextRequest) {
  const admin = await verifySuperAdmin(req);
  if (!admin) return forbidden();

  try {
    const { id, name, email, school, role, status, ecoPoints } =
      await req.json();
    if (!id) {
      return NextResponse.json(
        { message: "User id is required" },
        { status: 400 }
      );
    }

    const userRef = db.collection("users").doc(id);
    const userDoc = await userRef.get();
    if (!userDoc.exists)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    await userRef.update({ name, email, school, role, status, ecoPoints });
    const updated = await userRef.get();
    return NextResponse.json({ id: updated.id, ...updated.data() });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE /api/admin/users?id=xxx
export async function DELETE(req: NextRequest) {
  const admin = await verifySuperAdmin(req);
  if (!admin) return forbidden();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "User id is required" },
        { status: 400 }
      );
    }

    // Delete user's posts
    const postsSnap = await db
      .collection("posts")
      .where("authorId", "==", id)
      .get();
    const batch = db.batch();
    postsSnap.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    // Delete user doc
    const userRef = db.collection("users").doc(id);
    const userDoc = await userRef.get();
    if (!userDoc.exists)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    await userRef.delete();

    // Delete Firebase Auth user
    try {
      await adminAuth.deleteUser(id);
    } catch {
      // Auth user may not exist
    }

    return NextResponse.json({
      message: "User and their posts deleted successfully.",
    });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
