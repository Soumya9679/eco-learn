"use client";

import React, { useState } from "react";
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
  ChevronLeft,
  ChevronRight,
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
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

const mobileMainItems = navItems.slice(0, 4);
const mobileMoreItems = navItems.slice(4);

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:flex fixed left-0 top-0 h-screen flex-col z-50 overflow-hidden"
        style={{
          background: "rgba(3, 7, 18, 0.95)",
          backdropFilter: "blur(24px)",
          borderRight: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-5 py-5"
          style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
            }}
          >
            <Leaf size={20} />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-lg font-bold text-white whitespace-nowrap overflow-hidden"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                EcoLearn
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* User Card */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mx-3 mt-4 mb-2 p-3 rounded-xl"
              style={{
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.15)",
              }}
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={user?.profilePicture}
                  name={user?.name || "User"}
                  size="md"
                  ring
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">
                    {user?.name || "User"}
                  </p>
                  <div className="flex items-center gap-1 text-xs font-medium" style={{ color: "#34d399" }}>
                    <Leaf size={12} />
                    <span>{user?.ecoPoints || 0} pts</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group
                  ${collapsed ? "justify-center" : ""}
                `}
                style={{
                  color: isActive ? "#34d399" : "#64748b",
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: "rgba(16, 185, 129, 0.1)",
                      border: "1px solid rgba(16, 185, 129, 0.15)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon
                  size={20}
                  className="relative z-10 flex-shrink-0"
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="relative z-10 whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              href="/admin"
              className={`
                relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200
                ${collapsed ? "justify-center" : ""}
              `}
              style={{
                color: pathname === "/admin" ? "#a78bfa" : "#64748b",
                background: pathname === "/admin" ? "rgba(139, 92, 246, 0.1)" : "transparent",
              }}
            >
              <Shield size={20} className="flex-shrink-0" />
              {!collapsed && <span>Admin</span>}
            </Link>
          )}
        </nav>

        {/* Collapse Toggle + Logout */}
        <div className="px-3 py-3 space-y-1" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
          <button
            onClick={() => logout()}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full cursor-pointer ${collapsed ? "justify-center" : ""}`}
            style={{ color: "#f87171" }}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all w-full cursor-pointer ${collapsed ? "justify-center" : ""}`}
            style={{ color: "#475569" }}
          >
            {collapsed ? (
              <ChevronRight size={20} />
            ) : (
              <>
                <ChevronLeft size={20} className="flex-shrink-0" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </motion.aside>

      {/* ── Mobile Bottom Tab Bar ── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-2 pb-[env(safe-area-inset-bottom)]"
        style={{
          background: "rgba(3, 7, 18, 0.95)",
          backdropFilter: "blur(24px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <div className="flex items-center justify-around py-1">
          {mobileMainItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all relative"
                style={{ color: isActive ? "#34d399" : "#64748b" }}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-active"
                    className="absolute -top-1 w-6 h-1 rounded-full"
                    style={{ background: "#10b981" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon size={22} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all cursor-pointer"
            style={{ color: moreOpen ? "#34d399" : "#64748b" }}
          >
            <MoreHorizontal size={22} />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>

        {/* More Sheet */}
        <AnimatePresence>
          {moreOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40"
                style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(4px)" }}
                onClick={() => setMoreOpen(false)}
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="fixed bottom-0 left-0 right-0 rounded-t-3xl z-50 p-6 pb-8"
                style={{
                  background: "rgba(17, 24, 39, 0.98)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: "0 -20px 60px rgba(0, 0, 0, 0.5)",
                }}
              >
                <div className="w-12 h-1 rounded-full mx-auto mb-6" style={{ background: "rgba(255,255,255,0.15)" }} />
                <div className="grid grid-cols-3 gap-4">
                  {mobileMoreItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMoreOpen(false)}
                        className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all"
                        style={{
                          color: isActive ? "#34d399" : "#94a3b8",
                          background: isActive ? "rgba(16, 185, 129, 0.1)" : "transparent",
                        }}
                      >
                        <item.icon size={24} />
                        <span className="text-xs font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMoreOpen(false)}
                      className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all"
                      style={{ color: "#94a3b8" }}
                    >
                      <Shield size={24} />
                      <span className="text-xs font-medium">Admin</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMoreOpen(false);
                      logout();
                    }}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all cursor-pointer"
                    style={{ color: "#f87171" }}
                  >
                    <LogOut size={24} />
                    <span className="text-xs font-medium">Logout</span>
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
