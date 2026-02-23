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
  _id: string;
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
    { href: "/challenges", icon: Target, label: "Challenges", color: "from-emerald-400 to-emerald-600" },
    { href: "/quiz", icon: HelpCircle, label: "Quizzes", color: "from-purple-400 to-purple-600" },
    { href: "/games", icon: Gamepad2, label: "Games", color: "from-orange-400 to-orange-600" },
    { href: "/forum", icon: MessageSquare, label: "Forum", color: "from-pink-400 to-pink-600" },
    { href: "/leaderboard", icon: Trophy, label: "Leaderboard", color: "from-amber-400 to-amber-600" },
  ];

  const stats = [
    { label: "EcoPoints", value: user.ecoPoints, icon: Leaf, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Modules", value: user.progress.modulesCompleted, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Challenges", value: user.progress.challengesCompleted, icon: Target, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Quizzes", value: user.progress.quizzesCompleted, icon: HelpCircle, color: "text-amber-600", bg: "bg-amber-50" },
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
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-6 sm:p-8 text-white"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar src={user.profilePicture} name={user.name} size="lg" ring />
            <div>
              <p className="text-emerald-100 text-sm">Welcome back,</p>
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "var(--font-jakarta)" }}>
                {user.name}! 🌿
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Zap size={16} className="text-amber-300" />
                <span className="text-emerald-100 text-sm font-medium">
                  {user.ecoPoints} EcoPoints earned
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} variants={staggerItem}>
            <Card variant="glass" padding="md" className="relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{s.label}</p>
                  <motion.p
                    className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    {s.value}
                  </motion.p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}>
                  <s.icon size={20} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div variants={staggerItem}>
        <h2 className="text-lg font-bold text-slate-800 mb-4" style={{ fontFamily: "var(--font-jakarta)" }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickActions.map((a) => (
            <Link key={a.href} href={a.href}>
              <Card variant="default" padding="sm" className="flex flex-col items-center gap-2 py-4 text-center">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center text-white shadow-md`}>
                  <a.icon size={22} />
                </div>
                <span className="text-xs font-semibold text-slate-700">{a.label}</span>
              </Card>
            </Link>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div variants={staggerItem}>
          <h2 className="text-lg font-bold text-slate-800 mb-4" style={{ fontFamily: "var(--font-jakarta)" }}>
            Recent Activity
          </h2>
          <Card variant="default" padding="none">
            {activities.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No recent activity yet. Start learning!
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {activities.map((act) => (
                  <div key={act._id} className="flex items-center gap-3 p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      {activityIcon[act.activityType] || <Zap size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{act.activityTitle}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
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
          <h2 className="text-lg font-bold text-slate-800 mb-4" style={{ fontFamily: "var(--font-jakarta)" }}>
            Achievements
          </h2>
          <Card variant="default" padding="none">
            <div className="divide-y divide-slate-50">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`flex items-center gap-3 p-4 transition-colors ${ach.earned ? "" : "opacity-40"
                    }`}
                >
                  <div className="text-2xl">{ach.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">{ach.title}</p>
                    <p className="text-xs text-slate-400">{ach.description}</p>
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
