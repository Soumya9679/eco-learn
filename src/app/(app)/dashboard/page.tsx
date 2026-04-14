"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { PageSkeleton } from "@/components/ui/Skeleton";
import Avatar from "@/components/ui/Avatar";
import ProgressBar from "@/components/ui/ProgressBar";
import {
  Leaf,
  BookOpen,
  Target,
  HelpCircle,
  Gamepad2,
  Trophy,
  MessageSquare,
  TrendingUp,
  Zap,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface Activity {
  id: string;
  activityType: string;
  activityTitle: string;
  pointsEarned: number;
  createdAt: string;
}

interface Achievement {
  id: string;
  title: string;
  icon: string;
  earned: boolean;
  description: string;
}

export default function DashboardPage() {
  const { user, firebaseUser } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseUser) return;
    const fetchData = async () => {
      const token = await firebaseUser.getIdToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [actRes, achRes] = await Promise.all([
        fetch("/api/user/recent-activity?limit=5", { headers }),
        fetch("/api/user/achievements", { headers }),
      ]);

      if (actRes.ok) setActivities(await actRes.json());
      if (achRes.ok) setAchievements(await achRes.json());
      setLoading(false);
    };
    fetchData();
  }, [firebaseUser]);

  if (loading || !user) return <PageSkeleton />;

  const quickActions = [
    { href: "/modules", icon: BookOpen, label: "Modules", color: "from-blue-400 to-blue-600" },
    { href: "/challenges", icon: Target, label: "Challenges", color: "from-green-400 to-green-600" },
    { href: "/quiz", icon: HelpCircle, label: "Quizzes", color: "from-purple-400 to-purple-600" },
    { href: "/games", icon: Gamepad2, label: "Games", color: "from-orange-400 to-orange-600" },
    { href: "/forum", icon: MessageSquare, label: "Forum", color: "from-pink-400 to-pink-600" },
    { href: "/leaderboard", icon: Trophy, label: "Leaderboard", color: "from-amber-400 to-amber-600" },
  ];

  const stats = [
    { label: "EcoPoints", value: user.ecoPoints, icon: Leaf, color: "text-[#34d399]", bg: "rgba(16, 185, 129, 0.15)" },
    { label: "Modules", value: user.progress.modulesCompleted, icon: BookOpen, color: "text-[#22d3ee]", bg: "rgba(6, 182, 212, 0.15)" },
    { label: "Challenges", value: user.progress.challengesCompleted, icon: Target, color: "text-[#c084fc]", bg: "rgba(168, 85, 247, 0.15)" },
    { label: "Quizzes", value: user.progress.quizzesCompleted, icon: HelpCircle, color: "text-[#f472b6]", bg: "rgba(236, 72, 153, 0.15)" },
  ];

  const activityIcon: Record<string, React.ReactNode> = {
    module: <BookOpen size={16} />,
    challenge: <Target size={16} />,
    quiz: <HelpCircle size={16} />,
    game: <Gamepad2 size={16} />,
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Hero */}
      <motion.div
        variants={staggerItem}
        className="relative overflow-hidden rounded-[32px] p-8 sm:p-10 text-white"
        style={{
          background: "linear-gradient(135deg, var(--primary-700), var(--bg-hover))",
          boxShadow: "0 10px 40px rgba(6, 182, 212, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          border: "1px solid var(--border-color)"
        }}
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--primary-400)]/10 rounded-full blur-[80px] -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--accent-400)]/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <Avatar src={user.profilePicture} name={user.name} size="xl" ring />
            <div>
              <p className="text-[#94a3b8] text-sm font-medium tracking-wide">Welcome back,</p>
              <h1 className="text-3xl sm:text-4xl font-bold mt-1 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                {user.name}! 🌿
              </h1>
              <div className="flex items-center gap-2 mt-3">
                <div className="p-1 rounded-full bg-amber-500/20 text-amber-400">
                   <Zap size={14} />
                </div>
                <span className="text-[#34d399] text-sm font-semibold tracking-wide">
                  {user.ecoPoints} <span className="text-slate-400 font-medium">EcoPoints earned</span>
                </span>
              </div>
            </div>
          </div>
          <Link
            href="/profile"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-sm font-medium transition-all backdrop-blur-sm"
          >
            View Profile <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid — Fixed for dark theme (#11) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} variants={staggerItem}>
            <Card variant="glass" padding="md" className="relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{s.label}</p>
                  <motion.p
                    className="text-3xl font-bold text-white mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    {s.value}
                  </motion.p>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}
                  style={{ background: s.bg }}
                >
                  <s.icon size={20} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div variants={staggerItem}>
        <h2 className="text-xl font-bold text-white mb-4 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickActions.map((a) => (
            <Link key={a.href} href={a.href}>
              <Card variant="default" padding="sm" className="flex flex-col items-center gap-2 py-4 text-center">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center text-white shadow-md`}>
                  <a.icon size={22} />
                </div>
                <span className="text-xs font-semibold text-slate-300">{a.label}</span>
              </Card>
            </Link>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div variants={staggerItem}>
          <h2 className="text-xl font-bold text-white mb-4 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Recent Activity
          </h2>
          <Card variant="default" padding="none">
            {activities.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No recent activity yet. Start learning!
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {activities.map((act) => (
                  <div key={act.id} className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-green-400"
                      style={{ background: "rgba(34,197,94,0.1)" }}
                    >
                      {activityIcon[act.activityType] || <Zap size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{act.activityTitle}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock size={12} />
                        {new Date(act.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    {act.pointsEarned > 0 && (
                      <Badge variant="success">+{act.pointsEarned} pts</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div variants={staggerItem}>
          <h2 className="text-xl font-bold text-white mb-4 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Achievements
          </h2>
          <Card variant="default" padding="none">
            <div className="divide-y divide-white/5">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`flex items-center gap-3 p-4 transition-colors ${ach.earned ? "" : "opacity-40"
                    }`}
                >
                  <div className="text-2xl">{ach.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-200">{ach.title}</p>
                    <p className="text-xs text-slate-500">{ach.description}</p>
                  </div>
                  {ach.earned ? (
                    <Badge variant="success">Earned</Badge>
                  ) : (
                    <Badge variant="default">Locked</Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
