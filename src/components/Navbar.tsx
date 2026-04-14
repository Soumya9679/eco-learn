"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Avatar from "@/components/ui/Avatar";
import {
  LayoutDashboard,
  BookOpen,
  Target,
  HelpCircle,
  Gamepad2,
  MessageSquare,
  Trophy,
  User,
  Settings,
  Shield,
  LogOut,
  Leaf,
  MoreHorizontal,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/modules", label: "Modules", icon: BookOpen },
  { href: "/challenges", label: "Challenges", icon: Target },
  { href: "/quiz", label: "Quiz", icon: HelpCircle },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/forum", label: "Forum", icon: MessageSquare },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

const mobileMainItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/challenges", label: "Challenges", icon: Target },
    { href: "/quiz", label: "Quiz", icon: HelpCircle },
    { href: "/leaderboard", label: "Ranks", icon: Trophy },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ── Desktop Floating Dock ── */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`hidden lg:flex fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${scrolled ? 'w-[90%] max-w-5xl' : 'w-[95%] max-w-6xl'}`}
      >
        <div 
          className="w-full flex items-center justify-between px-4 py-3 rounded-full"
          style={{
            background: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)"
          }}
        >
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 pl-2 pr-4 group">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-[#020617] transition-all group-hover:scale-110"
              style={{
                background: "linear-gradient(135deg, var(--primary-400), var(--accent-500))",
                boxShadow: "0 0 20px rgba(6, 182, 212, 0.5)",
              }}
            >
              <Leaf size={20} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-jakarta)" }}>
              EcoLearn
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2.5 rounded-full text-sm font-medium transition-all group"
                  style={{ color: isActive ? "#22d3ee" : "#94a3b8" }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="desktop-nav-active"
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "rgba(6, 182, 212, 0.1)",
                        border: "1px solid rgba(6, 182, 212, 0.2)",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <item.icon size={16} className={isActive ? "" : "group-hover:text-white transition-colors"} />
                    <span className={isActive ? "" : "group-hover:text-white transition-colors"}>{item.label}</span>
                  </span>
                </Link>
              );
            })}
          </div>

          {/* User & Settings Dropdown (simplified as buttons for now) */}
          <div className="flex items-center gap-2 pl-4 border-l border-white/10">
            {isAdmin && (
              <Link href="/admin" className="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                <Shield size={20} />
              </Link>
            )}
            <Link href="/profile" className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-white/5 transition-all cursor-pointer">
               <Avatar src={user?.profilePicture} name={user?.name || "User"} size="sm" ring />
               <span className="text-sm font-medium text-slate-200 hidden xl:block pr-2">{user?.name}</span>
            </Link>
            <button onClick={() => logout()} className="p-2.5 rounded-full text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile Bottom Floating Dock ── */}
      <nav
        className="lg:hidden fixed bottom-4 left-4 right-4 z-50"
      >
        <div 
          className="flex items-center justify-around py-2 px-2 rounded-3xl"
          style={{
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)"
          }}
        >
          {mobileMainItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 p-2 rounded-2xl transition-all relative w-16"
                style={{ color: isActive ? "#22d3ee" : "#64748b" }}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-active"
                    className="absolute inset-0 rounded-2xl"
                    style={{ background: "rgba(6, 182, 212, 0.15)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon size={22} className="relative z-10" />
                <span className="text-[10px] font-medium relative z-10">{item.label}</span>
              </Link>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className="flex flex-col items-center gap-1 p-2 rounded-2xl transition-all cursor-pointer w-16 relative"
            style={{ color: moreOpen ? "#22d3ee" : "#64748b" }}
          >
             {moreOpen && (
                 <motion.div layoutId="mobile-active" className="absolute inset-0 rounded-2xl" style={{ background: "rgba(6, 182, 212, 0.15)" }} />
             )}
            <MoreHorizontal size={22} className="relative z-10" />
            <span className="text-[10px] font-medium relative z-10">More</span>
          </button>
        </div>

        {/* Mobile More Sheet */}
        <AnimatePresence>
          {moreOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                onClick={() => setMoreOpen(false)}
              />
              <motion.div
                initial={{ y: "100%", scale: 0.95, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ y: "100%", scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="fixed bottom-24 left-4 right-4 rounded-[32px] z-50 p-6"
                style={{
                  background: "rgba(30, 41, 59, 0.95)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
                }}
              >
                <div className="grid grid-cols-4 gap-4">
                  {[...navItems.slice(4), { href: "/profile", label: "Profile", icon: User }, { href: "/settings", label: "Settings", icon: Settings }].map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMoreOpen(false)}
                        className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all"
                        style={{
                          color: isActive ? "#22d3ee" : "#94a3b8",
                          background: isActive ? "rgba(6, 182, 212, 0.1)" : "rgba(255,255,255,0.02)",
                        }}
                      >
                        <item.icon size={24} />
                        <span className="text-[10px] font-medium text-center">{item.label}</span>
                      </Link>
                    );
                  })}
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMoreOpen(false)}
                      className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all"
                      style={{ color: "#d946ef", background: "rgba(217, 70, 239, 0.05)" }}
                    >
                      <Shield size={24} />
                      <span className="text-[10px] font-medium text-center">Admin</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMoreOpen(false);
                      logout();
                    }}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all cursor-pointer"
                    style={{ color: "#f87171", background: "rgba(239, 68, 68, 0.05)" }}
                  >
                    <LogOut size={24} />
                    <span className="text-[10px] font-medium text-center">Logout</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
