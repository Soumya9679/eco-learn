"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          className="min-h-screen flex items-center justify-center p-6"
          style={{ background: "#030712" }}
        >
          <div
            className="max-w-md w-full p-8 rounded-2xl text-center"
            style={{
              background: "rgba(17, 24, 39, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(24px)",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(239, 68, 68, 0.1)" }}
            >
              <AlertTriangle size={32} style={{ color: "#f87171" }} />
            </div>
            <h2
              className="text-xl font-bold mb-2"
              style={{ color: "#f1f5f9", fontFamily: "system-ui" }}
            >
              Something went wrong
            </h2>
            <p
              className="text-sm mb-6"
              style={{ color: "#94a3b8" }}
            >
              An unexpected error occurred. Please try again or refresh the page.
            </p>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium cursor-pointer transition-all hover:opacity-90"
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
      </body>
    </html>
  );
}
