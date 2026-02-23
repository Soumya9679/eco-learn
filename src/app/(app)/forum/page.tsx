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
import {
  MessageSquare,
  Send,
  ThumbsUp,
  Image as ImageIcon,
  Clock,
  X,
} from "lucide-react";

interface Post {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorPicture?: string;
  image?: string;
  promoteCount: number;
  promoters: string[];
  createdAt: string;
}

export default function ForumPage() {
  const { user, firebaseUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await fetch("/api/forum");
    if (res.ok) setPosts(await res.json());
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser || !newTitle.trim() || !newContent.trim()) return;
    setSubmitting(true);

    const token = await firebaseUser.getIdToken();
    const formData = new FormData();
    formData.append("title", newTitle);
    formData.append("content", newContent);
    if (newImage) formData.append("image", newImage);

    const res = await fetch("/api/forum", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) {
      setNewTitle("");
      setNewContent("");
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
      method: "POST",
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

      {/* Create Post */}
      {showCreate && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card variant="glass" padding="lg">
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                placeholder="Post title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                required
              />
              <textarea
                placeholder="Share your thoughts..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-none"
                required
              />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
                >
                  <ImageIcon size={18} />
                  {newImage ? newImage.name : "Add image"}
                </button>
                <Button type="submit" loading={submitting} icon={<Send size={16} />}>
                  Post
                </Button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setNewImage(e.target.files?.[0] || null)} />
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
            <motion.div key={post._id} variants={staggerItem}>
              <Card variant="default" padding="md" hover={false}>
                <div className="flex gap-3">
                  <Avatar
                    src={post.authorPicture}
                    name={post.authorName}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-semibold text-slate-800">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-medium text-slate-600">
                            {post.authorName}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mt-3 whitespace-pre-line">
                      {post.content}
                    </p>
                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post"
                        className="mt-3 rounded-xl max-h-72 object-cover border border-slate-100"
                      />
                    )}
                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-50">
                      <button
                        onClick={() => handlePromote(post._id)}
                        className={`flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer ${user && post.promoters.includes(user._id)
                            ? "text-emerald-600"
                            : "text-slate-400 hover:text-emerald-500"
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
