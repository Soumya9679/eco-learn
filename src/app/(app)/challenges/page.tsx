"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { Target, Upload, CheckCircle, Leaf, Camera } from "lucide-react";

interface Challenge {
  id: string;
  category: string;
  title: string;
  description: string;
  points: number;
}

export default function ChallengesPage() {
  const { firebaseUser, addPoints, recordActivity } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [uploading, setUploading] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<string>("");

  useEffect(() => {
    const fetchChallenges = async () => {
      const res = await fetch("/api/challenges");
      if (res.ok) setChallenges(await res.json());
      setLoading(false);
    };
    fetchChallenges();
  }, []);

  if (loading) return <PageSkeleton />;

  const categories = ["All", ...new Set(challenges.map((c) => c.category))];
  const filtered = category === "All" ? challenges : challenges.filter((c) => c.category === category);

  const handleUpload = async (challengeTitle: string, file: File) => {
    if (!firebaseUser) return;
    setUploading(challengeTitle);
    setSuccess("");

    const token = await firebaseUser.getIdToken();
    const formData = new FormData();
    formData.append("proofImage", file);
    formData.append("challengeTitle", challengeTitle);

    const res = await fetch("/api/challenges", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) {
      setSuccess(challengeTitle);
      const ch = challenges.find((c) => c.title === challengeTitle);
      if (ch) {
        await addPoints(ch.points);
        await recordActivity("challenge", ch.id, ch.title, ch.points);
      }
    }
    setUploading(null);
  };

  const categoryIcons: Record<string, string> = {
    "🏠 At Home": "🏠",
    "🏫 School Level": "🏫",
    "🎓 College Level": "🎓",
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <PageHeader title="Eco Challenges" subtitle="Complete real-world sustainability tasks and earn points" icon={<Target size={22} />} />

      {/* Category Filter */}
      <motion.div variants={staggerItem} className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${category === cat
                ? "bg-emerald-500 text-white shadow-md"
                : "bg-white/5 text-slate-400 hover:bg-white/5 border border-white/10"
              }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Challenge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((ch) => (
          <motion.div key={ch.id} variants={staggerItem}>
            <Card variant="glass" padding="md" className="relative overflow-hidden">
              {success === ch.title && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                    <CheckCircle size={18} />
                  </div>
                </motion.div>
              )}
              <div className="flex items-start gap-4">
                <div className="text-3xl">{categoryIcons[ch.category] || "🌍"}</div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-white">{ch.title}</h3>
                    <Badge variant="success">
                      <Leaf size={12} className="mr-1" />
                      {ch.points} pts
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500">{ch.description}</p>
                  <Button
                    size="sm"
                    variant={success === ch.title ? "secondary" : "primary"}
                    loading={uploading === ch.title}
                    icon={success === ch.title ? <CheckCircle size={16} /> : <Camera size={16} />}
                    onClick={() => {
                      setSelectedChallenge(ch.title);
                      fileInputRef.current?.click();
                    }}
                  >
                    {success === ch.title ? "Submitted!" : "Upload Proof"}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && selectedChallenge) handleUpload(selectedChallenge, file);
          e.target.value = "";
        }}
      />
    </motion.div>
  );
}
