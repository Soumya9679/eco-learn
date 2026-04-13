"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <div
        className="max-w-md w-full p-8 rounded-2xl text-center"
        style={{
          background: "rgba(17, 24, 39, 0.6)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(24px)",
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: "rgba(239, 68, 68, 0.1)" }}
        >
          <AlertTriangle size={28} style={{ color: "#f87171" }} />
        </div>
        <h2
          className="text-lg font-bold text-white mb-2"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          Something went wrong
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          {error.message || "An unexpected error occurred while loading this page."}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 transition-all"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <ArrowLeft size={16} />
            Dashboard
          </Link>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium cursor-pointer transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              boxShadow: "0 4px 20px rgba(16, 185, 129, 0.3)",
            }}
          >
            <RefreshCcw size={16} />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
