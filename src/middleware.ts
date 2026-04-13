import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// Rate limiting config for different route groups
const API_RATE_LIMIT = { maxRequests: 60, windowSeconds: 60 };
const AUTH_RATE_LIMIT = { maxRequests: 10, windowSeconds: 60 };

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = getClientIp(req);

  // Rate limiting for API routes
  if (pathname.startsWith("/api/")) {
    const config = pathname.startsWith("/api/auth/")
      ? AUTH_RATE_LIMIT
      : API_RATE_LIMIT;

    const key = `${ip}:${pathname}`;
    const result = checkRateLimit(key, config);

    if (!result.allowed) {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(result.resetInSeconds),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // Add rate limit headers to the response
    const response = NextResponse.next();
    response.headers.set(
      "X-RateLimit-Remaining",
      String(result.remaining)
    );
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match API routes for rate limiting
    "/api/:path*",
  ],
};
