export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

// Password reset is handled entirely client-side via Firebase Auth
// sendPasswordResetEmail() — no server route needed
export async function POST() {
  return NextResponse.json({
    message:
      "If an account exists for this email, we have sent reset instructions.",
  });
}
