"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Tabs from "@/components/ui/Tabs";
import PageHeader from "@/components/ui/PageHeader";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { Trophy, Leaf, Medal, Crown, Award } from "lucide-react";

interface LeaderboardEntry {
  id: string;
  name: string;
  profilePicture?: string;
  school?: string;
  ecoPoints: number;
}

const tabs = [
  { id: "all", label: "Global" },
  { id: "school", label: "School" },
  { id: "state", label: "State" },
  { id: "country", label: "Country" },
];

const rankStyles = [
  { bg: "rgba(245,158,11,0.1)", border: "border-amber-500/30", icon: <Crown size={18} className="text-amber-400" /> },
  { bg: "rgba(148,163,184,0.1)", border: "border-slate-500/30", icon: <Medal size={18} className="text-slate-400" /> },
  { bg: "rgba(249,115,22,0.1)", border: "border-orange-500/30", icon: <Award size={18} className="text-orange-400" /> },
];

export default function LeaderboardPage() {
  const { user, firebaseUser } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [scope, setScope] = useState("all");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!firebaseUser) return;
      setLoading(true);
      const params = new URLSearchParams({ scope });
      const token = await firebaseUser.getIdToken();
      const res = await fetch(`/api/leaderboard?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setEntries(await res.json());
      setLoading(false);
    };
    fetchLeaderboard();
  }, [scope, firebaseUser]);

  if (loading && entries.length === 0) return <PageSkeleton />;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <PageHeader title="Leaderboard" subtitle="See who's making the biggest impact" icon={<Trophy size={22} />} />

      <motion.div variants={staggerItem}>
        <Tabs tabs={tabs} activeTab={scope} onTabChange={setScope} />
      </motion.div>

      {/* Top 3 Podium — Fixed for dark theme (#11) */}
      {entries.length >= 3 && (
        <motion.div variants={staggerItem} className="grid grid-cols-3 gap-3">
          {[1, 0, 2].map((idx) => {
            const e = entries[idx];
            const isFirst = idx === 0;
            return (
              <Card
                key={e.id}
                variant="glass"
                padding="md"
                className={`text-center ${isFirst ? "lg:-mt-4" : ""}`}
                style={isFirst ? { border: "2px solid rgba(245,158,11,0.3)" } : undefined}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <Avatar src={e.profilePicture} name={e.name} size={isFirst ? "xl" : "lg"} ring={isFirst} />
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${idx === 0 ? "bg-amber-400" : idx === 1 ? "bg-slate-400" : "bg-orange-400"
                      }`}>
                      {idx + 1}
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-200 truncate w-full">{e.name}</p>
                  <div className="flex items-center gap-1 text-emerald-400 font-bold">
                    <Leaf size={14} /> {e.ecoPoints}
                  </div>
                </div>
              </Card>
            );
          })}
        </motion.div>
      )}

      {/* Full List */}
      <Card variant="default" padding="none">
        <div className="divide-y divide-white/5">
          {entries.map((entry, i) => {
            const isCurrentUser = user && entry.id === user.id;
            return (
              <motion.div
                key={entry.id}
                variants={staggerItem}
                className={`flex items-center gap-4 px-5 py-3.5 transition-colors ${isCurrentUser ? "" : "hover:bg-white/5"
                  }`}
                style={isCurrentUser ? { background: "rgba(16,185,129,0.08)" } : undefined}
              >
                <span className={`w-8 text-center text-sm font-bold ${i < 3 ? "text-amber-400" : "text-slate-500"
                  }`}>
                  {i < 3 ? rankStyles[i].icon : `#${i + 1}`}
                </span>
                <Avatar src={entry.profilePicture} name={entry.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isCurrentUser ? "text-emerald-400" : "text-slate-200"}`}>
                    {entry.name} {isCurrentUser && <Badge variant="success" size="sm">You</Badge>}
                  </p>
                  {entry.school && (
                    <p className="text-xs text-slate-500 truncate">{entry.school}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-emerald-400">
                  <Leaf size={14} />
                  {entry.ecoPoints}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}
