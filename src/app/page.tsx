"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  Leaf,
  BookOpen,
  Trophy,
  Gamepad2,
  Target,
  ArrowRight,
  Mail,
  Lock,
  User,
  Phone,
  Sparkles,
  Globe,
  TrendingUp,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { user, loading, login, register, resetPassword } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      if (showForgot) {
        await resetPassword(formData.email);
        setMessage("Password reset email sent! Check your inbox.");
        setShowForgot(false);
      } else if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (!formData.name.trim()) {
          setError("Name is required");
          setSubmitting(false);
          return;
        }
        await register(
          formData.name,
          formData.email,
          formData.mobile,
          formData.password
        );
      }
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string; message?: string };
      if (
        firebaseErr.code === "auth/user-not-found" ||
        firebaseErr.code === "auth/wrong-password" ||
        firebaseErr.code === "auth/invalid-credential"
      ) {
        setError("Invalid email or password");
      } else if (firebaseErr.code === "auth/email-already-in-use") {
        setError("An account with this email already exists");
      } else if (firebaseErr.code === "auth/weak-password") {
        setError("Password should be at least 6 characters");
      } else {
        setError(firebaseErr.message || "Something went wrong");
      }
    }
    setSubmitting(false);
  };

  const features = [
    {
      icon: BookOpen,
      title: "Interactive Modules",
      desc: "Video lessons, docs & interactive quizzes",
      gradient: "from-blue-500 to-cyan-400",
    },
    {
      icon: Target,
      title: "Eco Challenges",
      desc: "Complete real-world sustainability tasks",
      gradient: "from-emerald-500 to-green-400",
    },
    {
      icon: Gamepad2,
      title: "Fun Games",
      desc: "Play eco-themed games while learning",
      gradient: "from-violet-500 to-purple-400",
    },
    {
      icon: Trophy,
      title: "Earn & Compete",
      desc: "Collect EcoPoints and top the leaderboard",
      gradient: "from-amber-500 to-yellow-400",
    },
  ];

  const stats = [
    { label: "Active Learners", value: "10K+", icon: Globe },
    { label: "Eco Challenges", value: "50+", icon: Target },
    { label: "Points Earned", value: "1M+", icon: TrendingUp },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full border-2 border-transparent"
          style={{ borderTopColor: "var(--primary-500)" }}
        />
      </div>
    );
  }

  if (user) return null;

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Animated Background Orbs */}
      <div
        className="bg-orb"
        style={{
          width: "600px",
          height: "600px",
          left: "-100px",
          top: "-100px",
          background: "radial-gradient(circle, rgba(34, 197, 94, 0.15), transparent 70%)",
          animationDelay: "0s",
        }}
      />
      <div
        className="bg-orb"
        style={{
          width: "500px",
          height: "500px",
          right: "-50px",
          bottom: "-50px",
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.1), transparent 70%)",
          animationDelay: "-7s",
        }}
      />
      <div
        className="bg-orb"
        style={{
          width: "400px",
          height: "400px",
          left: "40%",
          top: "60%",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.08), transparent 70%)",
          animationDelay: "-14s",
        }}
      />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left — Hero Section */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 lg:py-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                style={{
                  background: "linear-gradient(135deg, #22c55e, #15803d)",
                  boxShadow: "0 0 30px rgba(34, 197, 94, 0.3)",
                }}
              >
                <Leaf size={28} />
              </div>
              <span
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                EcoLearn
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight mb-6"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              <span className="text-white">Learn to </span>
              <span className="text-gradient">save</span>
              <br />
              <span className="text-white">the planet</span>
            </h1>
            <p className="text-lg max-w-xl mb-10 leading-relaxed" style={{ color: "#94a3b8" }}>
              Interactive environmental education with gamification.
              Complete modules, take quizzes, conquer challenges, and earn EcoPoints.
            </p>

            {/* Stats Row */}
            <div className="flex gap-6 mb-10">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: "rgba(34, 197, 94, 0.1)",
                      border: "1px solid rgba(34, 197, 94, 0.2)",
                    }}
                  >
                    <stat.icon size={18} style={{ color: "#4ade80" }} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                    <p className="text-xs" style={{ color: "#64748b" }}>
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-3 max-w-lg">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <div
                    className={`w-9 h-9 rounded-lg bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white flex-shrink-0`}
                    style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
                  >
                    <f.icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{f.title}</p>
                    <p className="text-xs" style={{ color: "#64748b" }}>
                      {f.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right — Auth Form */}
        <div className="lg:w-[500px] flex items-center justify-center px-6 py-12 lg:py-0 lg:pr-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-md"
          >
            <div
              className="p-8 rounded-2xl glass-card"
              style={{
                boxShadow:
                  "0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={showForgot ? "forgot" : isLogin ? "login" : "register"}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Header Icon */}
                  <div className="flex items-center gap-2 mb-6">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, #22c55e, #06b6d4)",
                      }}
                    >
                      <Sparkles size={16} className="text-white" />
                    </div>
                    <div>
                      <h2
                        className="text-xl font-bold text-white"
                        style={{ fontFamily: "var(--font-jakarta)" }}
                      >
                        {showForgot
                          ? "Reset Password"
                          : isLogin
                            ? "Welcome back!"
                            : "Create account"}
                      </h2>
                    </div>
                  </div>
                  <p className="text-sm mb-6" style={{ color: "#64748b" }}>
                    {showForgot
                      ? "Enter your email to receive reset instructions"
                      : isLogin
                        ? "Sign in to continue your eco journey"
                        : "Start learning about sustainability"}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && !showForgot && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Full Name
                          </label>
                          <div className="relative">
                            <User
                              size={16}
                              className="absolute left-3 top-1/2 -translate-y-1/2"
                              style={{ color: "#64748b" }}
                            />
                            <input
                              type="text"
                              placeholder="Your name"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                              }
                              required
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                              style={{
                                background: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Mobile
                          </label>
                          <div className="relative">
                            <Phone
                              size={16}
                              className="absolute left-3 top-1/2 -translate-y-1/2"
                              style={{ color: "#64748b" }}
                            />
                            <input
                              type="text"
                              placeholder="Phone number"
                              value={formData.mobile}
                              onChange={(e) =>
                                setFormData({ ...formData, mobile: e.target.value })
                              }
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                              style={{
                                background: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                              }}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        Email
                      </label>
                      <div className="relative">
                        <Mail
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2"
                          style={{ color: "#64748b" }}
                        />
                        <input
                          type="email"
                          placeholder="you@email.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                          style={{
                            background: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                          }}
                        />
                      </div>
                    </div>

                    {!showForgot && (
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                          Password
                        </label>
                        <div className="relative">
                          <Lock
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2"
                            style={{ color: "#64748b" }}
                          />
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) =>
                              setFormData({ ...formData, password: e.target.value })
                            }
                            required
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            style={{
                              background: "rgba(255, 255, 255, 0.05)",
                              border: "1px solid rgba(255, 255, 255, 0.08)",
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm px-3 py-2 rounded-lg"
                        style={{
                          color: "#f87171",
                          background: "rgba(239, 68, 68, 0.1)",
                          border: "1px solid rgba(239, 68, 68, 0.2)",
                        }}
                      >
                        {error}
                      </motion.p>
                    )}

                    {message && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm px-3 py-2 rounded-lg"
                        style={{
                          color: "#34d399",
                          background: "rgba(16, 185, 129, 0.1)",
                          border: "1px solid rgba(16, 185, 129, 0.2)",
                        }}
                      >
                        {message}
                      </motion.p>
                    )}

                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      style={{
                        background: "linear-gradient(135deg, #22c55e, #15803d)",
                        boxShadow: "0 4px 20px rgba(34, 197, 94, 0.3)",
                      }}
                    >
                      {submitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white"
                        />
                      ) : (
                        <>
                          {showForgot
                            ? "Send Reset Email"
                            : isLogin
                              ? "Sign In"
                              : "Create Account"}
                          <ArrowRight size={16} />
                        </>
                      )}
                    </motion.button>
                  </form>

                  <div className="mt-6 space-y-3 text-center">
                    {isLogin && !showForgot && (
                      <button
                        onClick={() => {
                          setShowForgot(true);
                          setError("");
                        }}
                        className="text-sm font-medium cursor-pointer transition-colors"
                        style={{ color: "#4ade80" }}
                      >
                        Forgot password?
                      </button>
                    )}

                    <p className="text-sm" style={{ color: "#64748b" }}>
                      {showForgot ? (
                        <button
                          onClick={() => {
                            setShowForgot(false);
                            setError("");
                          }}
                          className="font-medium cursor-pointer"
                          style={{ color: "#4ade80" }}
                        >
                          ← Back to login
                        </button>
                      ) : isLogin ? (
                        <>
                          Don&apos;t have an account?{" "}
                          <button
                            onClick={() => {
                              setIsLogin(false);
                              setError("");
                            }}
                            className="font-medium cursor-pointer"
                            style={{ color: "#4ade80" }}
                          >
                            Sign up
                          </button>
                        </>
                      ) : (
                        <>
                          Already have an account?{" "}
                          <button
                            onClick={() => {
                              setIsLogin(true);
                              setError("");
                            }}
                            className="font-medium cursor-pointer"
                            style={{ color: "#4ade80" }}
                          >
                            Sign in
                          </button>
                        </>
                      )}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
