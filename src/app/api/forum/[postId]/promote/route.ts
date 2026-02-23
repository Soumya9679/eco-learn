export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db, getFieldValue } from "@/lib/firebase";
import { verifyToken, unauthorized } from "@/lib/auth";


// PATCH /api/forum/[postId]/promote
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const payload = await verifyToken(req);
  if (!payload) return unauthorized();

  try {
    const { postId } = await params;
    const postRef = db.collection("posts").doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const postData = postDoc.data()!;
    const promoters: string[] = postData.promoters || [];
    const hasPromoted = promoters.includes(payload.uid);

    if (hasPromoted) {
      await postRef.update({
        promoters: getFieldValue().arrayRemove(payload.uid),
        promoteCount: getFieldValue().increment(-1),
      });
    } else {
      await postRef.update({
        promoters: getFieldValue().arrayUnion(payload.uid),
        promoteCount: getFieldValue().increment(1),
      });
    }

    return NextResponse.json({
      promoteCount: hasPromoted
        ? postData.promoteCount - 1
        : postData.promoteCount + 1,
      isPromotedByMe: !hasPromoted,
    });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
