"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import { PageSkeleton } from "@/components/ui/Skeleton";
import {
  User,
  Leaf,
  BookOpen,
  Target,
  HelpCircle,
  Gamepad2,
  Droplets,
  Trash2,
  TreePine,
  Camera,
  Trophy,
  Clock,
} from "lucide-react";

interface Proof {
  _id: string;
  challengeTitle: string;
  proofImageUrl: string;
  createdAt: string;
}

interface Activity {
  _id: string;
  activityType: string;
  activityTitle: string;
  pointsEarned: number;
  score?: number;
  createdAt: string;
}

export default function ProfilePage() {
  const { user, firebaseUser, fetchProfile } = useAuth();
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const avatarRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!firebaseUser) return;
    const fetchData = async () => {
      const token = await firebaseUser.getIdToken();
      const headers = { Authorization: `Bearer ${token}` };
      const [pRes, aRes] = await Promise.all([
        fetch("/api/user/proofs", { headers }),
        fetch("/api/user/recent-activity?limit=10", { headers }),
      ]);
      if (pRes.ok) setProofs(await pRes.json());
      if (aRes.ok) setActivities(await aRes.json());
      setLoading(false);
    };
    fetchData();
  }, [firebaseUser]);

  const handleAvatarUpload = async (file: File) => {
    if (!firebaseUser) return;
    setUploading(true);
    const token = await firebaseUser.getIdToken();
    const formData = new FormData();
    formData.append("avatar", file);
    await fetch("/api/user/avatar", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    await fetchProfile();
    setUploading(false);
  };

  if (loading || !user) return <PageSkeleton />;

  const statItems = [
    { label: "Modules", value: user.progress.modulesCompleted, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Challenges", value: user.progress.challengesCompleted, icon: Target, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Quizzes", value: user.progress.quizzesCompleted, icon: HelpCircle, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Games", value: user.progress.gamesCompleted, icon: Gamepad2, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  const ecoStats = [
    { label: "Water Saved", value: `${user.stats.waterSaved}L`, icon: Droplets, color: "text-blue-500" },
    { label: "Waste Diverted", value: `${user.stats.wasteDiverted}kg`, icon: Trash2, color: "text-green-500" },
    { label: "Trees Planted", value: user.stats.treesPlanted, icon: TreePine, color: "text-emerald-500" },
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      {/* Profile Hero */}
      <motion.div variants={staggerItem} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-6 sm:p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative group">
            <Avatar src={user.profilePicture} name={user.name} size="xl" ring />
            <button
              onClick={() => avatarRef.current?.click()}
              className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              {uploading ? (
                <div className="animate-spin w-5 h-5 border-2 border-white/50 border-t-white rounded-full" />
              ) : (
                <Camera size={20} className="text-white" />
              )}
            </button>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleAvatarUpload(f); }} />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-jakarta)" }}>{user.name}</h1>
            <p className="text-emerald-100 text-sm">{user.email}</p>
            <div className="flex items-center gap-3 mt-2 justify-center sm:justify-start">
              <Badge variant="success"><Leaf size={12} className="mr-1" />{user.ecoPoints} EcoPoints</Badge>
              <Badge variant="default">{user.role}</Badge>
            </div>
            {user.school && <p className="text-emerald-100 text-xs mt-1">{user.school}</p>}
          </div>
        </div>
      </motion.div>

      {/* Progress Stats */}
      <motion.div variants={staggerItem}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {statItems.map((s) => (
            <Card key={s.label} variant="glass" padding="md">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}>
                  <s.icon size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Eco Impact */}
      <motion.div variants={staggerItem}>
        <h2 className="text-lg font-bold text-slate-800 mb-3" style={{ fontFamily: "var(--font-jakarta)" }}>Eco Impact</h2>
        <div className="grid grid-cols-3 gap-3">
          {ecoStats.map((s) => (
            <Card key={s.label} variant="default" padding="md" className="text-center">
              <s.icon size={24} className={`mx-auto mb-2 ${s.color}`} />
              <p className="text-xl font-bold text-slate-800">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Badges */}
      {user.badges.length > 0 && (
        <motion.div variants={staggerItem}>
          <h2 className="text-lg font-bold text-slate-800 mb-3" style={{ fontFamily: "var(--font-jakarta)" }}>Badges</h2>
          <div className="flex flex-wrap gap-2">
            {user.badges.map((b, i) => (
              <Badge key={i} variant="success" size="md">{b}</Badge>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity */}
        <motion.div variants={staggerItem}>
          <h2 className="text-lg font-bold text-slate-800 mb-3" style={{ fontFamily: "var(--font-jakarta)" }}>Activity History</h2>
          <Card variant="default" padding="none">
            {activities.length === 0 ? (
              <p className="p-6 text-center text-sm text-slate-400">No activity yet</p>
            ) : (
              <div className="divide-y divide-slate-50">
                {activities.map((act) => (
                  <div key={act._id} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Clock size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{act.activityTitle}</p>
                      <p className="text-xs text-slate-400">{new Date(act.createdAt).toLocaleDateString()}</p>
                    </div>
                    {act.pointsEarned > 0 && <Badge variant="success">+{act.pointsEarned}</Badge>}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Challenge Proofs */}
        <motion.div variants={staggerItem}>
          <h2 className="text-lg font-bold text-slate-800 mb-3" style={{ fontFamily: "var(--font-jakarta)" }}>Challenge Proofs</h2>
          <Card variant="default" padding="none">
            {proofs.length === 0 ? (
              <p className="p-6 text-center text-sm text-slate-400">No proofs submitted yet</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 p-3">
                {proofs.map((p) => (
                  <div key={p._id} className="relative rounded-xl overflow-hidden aspect-square group">
                    <img src={p.proofImageUrl} alt={p.challengeTitle} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs text-white font-medium">{p.challengeTitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
