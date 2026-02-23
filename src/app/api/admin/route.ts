export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db, adminAuth } from "@/lib/firebase";


// Helper: get superadmin from Firebase token
async function getSuperAdmin(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  if (!token) return null;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const userDoc = await db.collection("users").doc(decoded.uid).get();
    if (!userDoc.exists) return null;
    const userData = userDoc.data()!;
    if (userData.role !== "superadmin") return null;
    return { uid: decoded.uid, ...userData };
  } catch {
    return null;
  }
}

async function getAdmin(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  if (!token) return null;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const userDoc = await db.collection("users").doc(decoded.uid).get();
    if (!userDoc.exists) return null;
    const userData = userDoc.data()!;
    if (!["admin", "superadmin"].includes(userData.role)) return null;
    return { uid: decoded.uid, ...userData };
  } catch {
    return null;
  }
}

// GET /api/admin?action=stats|content-stats|users
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  if (action === "stats") {
    const admin = await getSuperAdmin(req);
    if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const usersSnap = await db.collection("users").get();
    const totalUsers = usersSnap.size;

    let totalFaculty = 0;
    let activeUsers = 0;
    let newUsersThisWeek = 0;
    let newFacultyThisWeek = 0;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoISO = weekAgo.toISOString();

    usersSnap.docs.forEach((doc) => {
      const d = doc.data();
      if (d.role === "admin") totalFaculty++;
      if (d.status === "active") activeUsers++;
      if (d.createdAt && d.createdAt >= weekAgoISO) {
        newUsersThisWeek++;
        if (d.role === "admin") newFacultyThisWeek++;
      }
    });

    const modulesSnap = await db.collection("modules").get();
    const quizzesSnap = await db.collection("quizzes").get();
    const challengesSnap = await db.collection("challenges").get();

    let newContentThisWeek = 0;
    [...modulesSnap.docs, ...quizzesSnap.docs, ...challengesSnap.docs].forEach((doc) => {
      const d = doc.data();
      if (d.createdAt && d.createdAt >= weekAgoISO) newContentThisWeek++;
    });

    return NextResponse.json({
      totalUsers,
      totalFaculty,
      activeUsers,
      totalContent: modulesSnap.size + quizzesSnap.size + challengesSnap.size,
      usersChange: `+${newUsersThisWeek} this week`,
      facultyChange: `+${newFacultyThisWeek} this week`,
      activityChange: `+${totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}% this week`,
      contentChange: `+${newContentThisWeek} this week`,
    });
  }

  if (action === "content-stats") {
    const admin = await getAdmin(req);
    if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const [modulesSnap, quizzesSnap, challengesSnap] = await Promise.all([
      db.collection("modules").count().get(),
      db.collection("quizzes").count().get(),
      db.collection("challenges").count().get(),
    ]);

    return NextResponse.json({
      moduleCount: modulesSnap.data().count,
      quizCount: quizzesSnap.data().count,
      challengeCount: challengesSnap.data().count,
    });
  }

  if (action === "users") {
    const admin = await getAdmin(req);
    if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const snapshot = await db
      .collection("users")
      .orderBy("createdAt", "desc")
      .get();

    const users = snapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(users);
  }

  return NextResponse.json({ message: "Invalid action" }, { status: 400 });
}

// POST /api/admin
export async function POST(req: NextRequest) {
  const body = await req.json();
  const action = body.action;

  if (action === "create-admin") {
    const admin = await getSuperAdmin(req);
    if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { name, email, password, school } = body;

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
  }

  if (action === "initialize-challenges") {
    const admin = await getAdmin(req);
    if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const existing = await db.collection("challenges").count().get();
    if (existing.data().count > 0) {
      return NextResponse.json({
        message: "Challenges already initialized",
        count: existing.data().count,
      });
    }

    const defaultChallenges = [
      { category: "🏠 At Home", title: "Segregate Waste", description: "Separate your household waste into dry and wet for one week.", points: 50 },
      { category: "🏠 At Home", title: "Fix a Leak", description: "Find and fix a dripping tap or leaky pipe in your home.", points: 75 },
      { category: "🏫 School Level", title: "Campus Clean-up Drive", description: "Organize or participate in a clean-up drive on your campus.", points: 100 },
      { category: "🏫 School Level", title: "Start a Garden Patch", description: "Help plant and maintain a small garden at your school.", points: 120 },
      { category: "🎓 College Level", title: "Energy Audit", description: "Analyze the energy consumption of one building on your campus.", points: 150 },
      { category: "🎓 College Level", title: "Waste Awareness Drive", description: "Conduct a presentation to raise awareness about waste management.", points: 130 },
    ];

    const batch = db.batch();
    defaultChallenges.forEach((c) => {
      const ref = db.collection("challenges").doc();
      batch.set(ref, { ...c, createdAt: new Date().toISOString() });
    });
    await batch.commit();

    return NextResponse.json({
      message: "Default challenges initialized successfully",
      count: defaultChallenges.length,
    });
  }

  return NextResponse.json({ message: "Invalid action" }, { status: 400 });
}

// PUT /api/admin
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { resource, id, ...data } = body;

  if (resource === "users") {
    const admin = await getSuperAdmin(req);
    if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { name, email, school, role, status, ecoPoints } = data;
    const userRef = db.collection("users").doc(id);
    const userDoc = await userRef.get();
    if (!userDoc.exists)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    await userRef.update({ name, email, school, role, status, ecoPoints });
    const updated = await userRef.get();
    return NextResponse.json({ _id: updated.id, ...updated.data() });
  }

  if (resource === "modules") {
    const admin = await getAdmin(req);
    if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    await db.collection("modules").doc(id).update(data);
    const updated = await db.collection("modules").doc(id).get();
    return NextResponse.json({ id: updated.id, ...updated.data() });
  }

  if (resource === "quizzes") {
    const admin = await getAdmin(req);
    if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const ref = db.collection("quizzes").doc(id);
    const doc = await ref.get();
    if (!doc.exists)
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });

    await ref.update(data);
    const updated = await ref.get();
    return NextResponse.json({ id: updated.id, ...updated.data() });
  }

  if (resource === "challenges") {
    const admin = await getAdmin(req);
    if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const ref = db.collection("challenges").doc(id);
    const doc = await ref.get();
    if (!doc.exists)
      return NextResponse.json({ message: "Challenge not found" }, { status: 404 });

    await ref.update(data);
    const updated = await ref.get();
    return NextResponse.json({ id: updated.id, ...updated.data() });
  }

  return NextResponse.json({ message: "Invalid resource" }, { status: 400 });
}

// DELETE /api/admin
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const resource = searchParams.get("resource");
  const id = searchParams.get("id");

  if (!resource || !id) {
    return NextResponse.json({ message: "Missing resource or id" }, { status: 400 });
  }

  if (resource === "users") {
    const admin = await getSuperAdmin(req);
    if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

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

    return NextResponse.json({ message: "User and their posts deleted successfully." });
  }

  const admin = await getAdmin(req);
  if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  if (resource === "modules") {
    await db.collection("modules").doc(id).delete();
    return NextResponse.json({ message: "Module deleted." });
  }

  if (resource === "quizzes") {
    const ref = db.collection("quizzes").doc(id);
    const doc = await ref.get();
    if (!doc.exists)
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    await ref.delete();
    return NextResponse.json({ message: "Quiz deleted." });
  }

  if (resource === "challenges") {
    const ref = db.collection("challenges").doc(id);
    const doc = await ref.get();
    if (!doc.exists)
      return NextResponse.json({ message: "Challenge not found" }, { status: 404 });
    await ref.delete();
    return NextResponse.json({ message: "Challenge deleted." });
  }

  return NextResponse.json({ message: "Invalid resource" }, { status: 400 });
}
