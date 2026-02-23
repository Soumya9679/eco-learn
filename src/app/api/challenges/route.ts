export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { verifyToken, unauthorized } from "@/lib/auth";

// GET /api/challenges
export async function GET() {
  try {
    const snapshot = await db
      .collection("challenges")
      .orderBy("category")
      .orderBy("createdAt", "desc")
      .get();
    const challenges = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(challenges);
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST /api/challenges (upload proof)
export async function POST(req: NextRequest) {
  const payload = await verifyToken(req);
  if (!payload) return unauthorized();

  try {
    const formData = await req.formData();
    const file = formData.get("proofImage") as File;
    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded." },
        { status: 400 }
      );
    }

    const challengeTitle = formData.get("challengeTitle") as string;
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadToCloudinary(buffer, "eco-proofs");

    const proofData = {
      userId: payload.uid,
      challengeTitle,
      imageUrl: result.secure_url,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    const proofRef = await db.collection("proofs").add(proofData);

    return NextResponse.json(
      {
        message: "File uploaded successfully!",
        proof: { id: proofRef.id, ...proofData },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Error uploading file." },
      { status: 500 }
    );
  }
}
