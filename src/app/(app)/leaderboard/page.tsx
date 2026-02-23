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
  _id: string;
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
  { bg: "bg-amber-50", border: "border-amber-200", icon: <Crown size={18} className="text-amber-500" /> },
  { bg: "bg-slate-50", border: "border-slate-200", icon: <Medal size={18} className="text-slate-400" /> },
  { bg: "bg-orange-50", border: "border-orange-200", icon: <Award size={18} className="text-orange-500" /> },
];

export default function LeaderboardPage() {
  const { user, firebaseUser } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [scope, setScope] = useState("all");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const params = new URLSearchParams({ scope });
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        const res = await fetch(`/api/leaderboard?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setEntries(await res.json());
      } else {
        const res = await fetch(`/api/leaderboard?${params}`);
        if (res.ok) setEntries(await res.json());
      }
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

      {/* Top 3 Podium */}
      {entries.length >= 3 && (
        <motion.div variants={staggerItem} className="grid grid-cols-3 gap-3">
          {[1, 0, 2].map((idx) => {
            const e = entries[idx];
            const isFirst = idx === 0;
            return (
              <Card
                key={e._id}
                variant="glass"
                padding="md"
                className={`text-center ${isFirst ? "lg:-mt-4 border-2 border-amber-200" : ""}`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <Avatar src={e.profilePicture} name={e.name} size={isFirst ? "xl" : "lg"} ring={isFirst} />
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${idx === 0 ? "bg-amber-400" : idx === 1 ? "bg-slate-400" : "bg-orange-400"
                      }`}>
                      {idx + 1}
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 truncate w-full">{e.name}</p>
                  <div className="flex items-center gap-1 text-emerald-600 font-bold">
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
        <div className="divide-y divide-slate-50">
          {entries.map((entry, i) => {
            const isCurrentUser = user && entry._id === user._id;
            return (
              <motion.div
                key={entry._id}
                variants={staggerItem}
                className={`flex items-center gap-4 px-5 py-3.5 transition-colors ${isCurrentUser ? "bg-emerald-50/50" : "hover:bg-slate-50/50"
                  }`}
              >
                <span className={`w-8 text-center text-sm font-bold ${i < 3 ? "text-amber-500" : "text-slate-400"
                  }`}>
                  {i < 3 ? rankStyles[i].icon : `#${i + 1}`}
                </span>
                <Avatar src={entry.profilePicture} name={entry.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isCurrentUser ? "text-emerald-700" : "text-slate-700"}`}>
                    {entry.name} {isCurrentUser && <Badge variant="success" size="sm">You</Badge>}
                  </p>
                  {entry.school && (
                    <p className="text-xs text-slate-400 truncate">{entry.school}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
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
