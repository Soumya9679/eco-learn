"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { PageSkeleton } from "@/components/ui/Skeleton";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center animate-pulse">
            <span className="text-white text-xl">🌱</span>
          </div>
          <p className="text-sm text-slate-500 font-medium">Loading EcoLearn...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") {
      router.replace("/");
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />
      {/* Main content area - pushed right by sidebar on desktop */}
      <main className="lg:pl-[260px] pb-20 lg:pb-0 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
