export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { verifyToken, unauthorized } from "@/lib/auth";

// GET /api/forum
export async function GET(req: NextRequest) {
  const payload = await verifyToken(req);
  if (!payload) return unauthorized();

  try {
    const snapshot = await db
      .collection("posts")
      .orderBy("promoteCount", "desc")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const posts = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        _id: doc.id,
        ...data,
        author: {
          name: data.authorName,
          profilePicture: data.authorPicture || "",
        },
        isPromotedByMe: (data.promoters || []).includes(payload.uid),
      };
    });

    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST /api/forum
export async function POST(req: NextRequest) {
  const payload = await verifyToken(req);
  if (!payload) return unauthorized();

  try {
    const formData = await req.formData();
    const file = formData.get("mediaFile") as File;
    if (!file) {
      return NextResponse.json(
        { message: "A media file (image or video) is required." },
        { status: 400 }
      );
    }

    const description = formData.get("description") as string;
    const place = formData.get("place") as string;
    const nearestSpot = formData.get("nearestSpot") as string;

    // Get user info for denormalization
    const userDoc = await db.collection("users").doc(payload.uid).get();
    const userData = userDoc.data();

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadToCloudinary(buffer, "eco-forum", {
      resource_type: "auto",
    });

    const postData = {
      description,
      place: place || "",
      nearestSpot: nearestSpot || "",
      mediaUrl: result.secure_url,
      mediaType: result.resource_type,
      authorId: payload.uid,
      authorName: userData?.name || "Unknown",
      authorPicture: userData?.profilePicture || "",
      promoters: [],
      promoteCount: 0,
      createdAt: new Date().toISOString(),
    };

    const postRef = await db.collection("posts").add(postData);

    return NextResponse.json(
      {
        _id: postRef.id,
        ...postData,
        author: {
          name: postData.authorName,
          profilePicture: postData.authorPicture,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Post creation error:", error);
    return NextResponse.json(
      { message: "Server error while creating post." },
      { status: 500 }
    );
  }
}
