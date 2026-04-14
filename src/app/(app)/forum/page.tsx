"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import PageHeader from "@/components/ui/PageHeader";
import { PageSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import Image from "next/image";
import {
  MessageSquare,
  Send,
  ThumbsUp,
  Image as ImageIcon,
  Clock,
  X,
  Search,
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  description: string;
  content: string;
  place: string;
  authorId: string;
  authorName: string;
  authorPicture?: string;
  mediaUrl?: string;
  image?: string;
  promoteCount: number;
  promoters: string[];
  isPromotedByMe: boolean;
  createdAt: string;
}

export default function ForumPage() {
  const { user, firebaseUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPlace, setNewPlace] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPosts();
  }, [firebaseUser]);

  const fetchPosts = async (query?: string) => {
    if (!firebaseUser) return;
    const token = await firebaseUser.getIdToken();
    const url = query ? `/api/forum?q=${encodeURIComponent(query)}` : "/api/forum";
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setPosts(await res.json());
    setLoading(false);
  };

  const handleSearch = () => {
    fetchPosts(searchQuery);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser || !newImage) return;
    setSubmitting(true);

    const token = await firebaseUser.getIdToken();
    const formData = new FormData();
    formData.append("description", newDescription);
    formData.append("place", newPlace);
    formData.append("mediaFile", newImage);

    const res = await fetch("/api/forum", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) {
      setNewDescription("");
      setNewPlace("");
      setNewImage(null);
      setShowCreate(false);
      fetchPosts();
    }
    setSubmitting(false);
  };

  const handlePromote = async (postId: string) => {
    if (!firebaseUser) return;
    const token = await firebaseUser.getIdToken();
    const res = await fetch(`/api/forum/${postId}/promote`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchPosts();
  };

  if (loading) return <PageSkeleton />;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <PageHeader
        title="Community Forum"
        subtitle="Share ideas, discuss sustainability, and connect"
        icon={<MessageSquare size={22} />}
        action={
          <Button
            onClick={() => setShowCreate(!showCreate)}
            icon={showCreate ? <X size={16} /> : <Send size={16} />}
            variant={showCreate ? "secondary" : "primary"}
          >
            {showCreate ? "Cancel" : "New Post"}
          </Button>
        }
      />

      {/* Search Bar (#28) */}
      <motion.div variants={staggerItem} className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/30"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>
        <Button variant="secondary" onClick={handleSearch}>Search</Button>
      </motion.div>

      {/* Create Post */}
      {showCreate && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card variant="glass" padding="lg">
            <form onSubmit={handleCreate} className="space-y-4">
              <textarea
                placeholder="Share your thoughts..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/30 resize-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                required
              />
              <input
                type="text"
                placeholder="Location (optional)"
                value={newPlace}
                onChange={(e) => setNewPlace(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/30"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-green-400 transition-colors cursor-pointer"
                >
                  <ImageIcon size={18} />
                  {newImage ? newImage.name : "Add image/video"}
                </button>
                <Button type="submit" loading={submitting} icon={<Send size={16} />}>
                  Post
                </Button>
              </div>
              <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={(e) => setNewImage(e.target.files?.[0] || null)} />
            </form>
          </Card>
        </motion.div>
      )}

      {/* Posts */}
      {posts.length === 0 ? (
        <EmptyState
          icon={<MessageSquare size={32} />}
          title="No posts yet"
          description="Be the first to start a discussion!"
          action={<Button onClick={() => setShowCreate(true)}>Create Post</Button>}
        />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <motion.div key={post.id} variants={staggerItem}>
              <Card variant="default" padding="md" hover={false}>
                <div className="flex gap-3">
                  <Avatar
                    src={post.authorPicture}
                    name={post.authorName}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm font-medium text-slate-200">
                        {post.authorName}
                      </span>
                      {post.place && (
                        <Badge variant="default" size="sm">{post.place}</Badge>
                      )}
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mt-3 whitespace-pre-line">
                      {post.description || post.content}
                    </p>
                    {(post.mediaUrl || post.image) && (
                      <div className="mt-3 rounded-xl overflow-hidden relative max-h-72">
                        <Image
                          src={post.mediaUrl || post.image || ""}
                          alt="Post media"
                          width={600}
                          height={400}
                          className="object-cover rounded-xl"
                          style={{ maxHeight: "288px", width: "100%" }}
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-4 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <button
                        onClick={() => handlePromote(post.id)}
                        className={`flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer ${post.isPromotedByMe
                            ? "text-green-400"
                            : "text-slate-500 hover:text-green-400"
                          }`}
                      >
                        <ThumbsUp size={16} />
                        {post.promoteCount}
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
