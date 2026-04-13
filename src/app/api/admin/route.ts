export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

// This route has been split into separate endpoints:
// - GET /api/admin/stats
// - GET /api/admin/content-stats
// - GET /api/admin/users
// - POST /api/admin/users (create admin)
// - POST /api/admin/init-challenges
// - PUT/DELETE /api/admin/users
// - PUT/DELETE /api/admin/modules
// - PUT/DELETE /api/admin/quizzes
// - PUT/DELETE /api/admin/challenges

export async function GET() {
  return NextResponse.json(
    {
      message:
        "This endpoint has been deprecated. Use /api/admin/stats, /api/admin/content-stats, or /api/admin/users instead.",
    },
    { status: 410 }
  );
}

export async function POST() {
  return NextResponse.json(
    {
      message:
        "This endpoint has been deprecated. Use /api/admin/users or /api/admin/init-challenges instead.",
    },
    { status: 410 }
  );
}

export async function PUT() {
  return NextResponse.json(
    {
      message:
        "This endpoint has been deprecated. Use /api/admin/users, /api/admin/modules, /api/admin/quizzes, or /api/admin/challenges instead.",
    },
    { status: 410 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message:
        "This endpoint has been deprecated. Use /api/admin/users, /api/admin/modules, /api/admin/quizzes, or /api/admin/challenges instead.",
    },
    { status: 410 }
  );
}
