export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { verifyToken, unauthorized } from "@/lib/auth";

// POST /api/user/avatar
export async function POST(req: NextRequest) {
  const payload = await verifyToken(req);
  if (!payload) return unauthorized();

  try {
    const formData = await req.formData();
    const file = formData.get("avatarImage") as File;
    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadToCloudinary(buffer, "eco-avatars", {
      transformation: [{ width: 250, height: 250, crop: "fill" }],
    });

    await db.collection("users").doc(payload.uid).update({
      profilePicture: result.secure_url,
    });

    const updatedDoc = await db.collection("users").doc(payload.uid).get();

    return NextResponse.json({
      message: "Avatar updated successfully!",
      user: { _id: updatedDoc.id, ...updatedDoc.data() },
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { message: "Error uploading avatar." },
      { status: 500 }
    );
  }
}
