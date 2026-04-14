"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import ProgressBar from "@/components/ui/ProgressBar";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { HelpCircle, ChevronRight, CheckCircle, X, RotateCcw, Timer } from "lucide-react";

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  questions?: { question: string; choices: string[]; correctAnswer: number }[];
}

export default function QuizPage() {
  const { firebaseUser, addPoints, recordActivity } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const res = await fetch("/api/quizzes");
      if (res.ok) setQuizzes(await res.json());
      setLoading(false);
    };
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (!activeQuiz || showResult) return;
    setTimer(30);
    const interval = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, [qIdx, activeQuiz, showResult]);

  if (loading) return <PageSkeleton />;

  const startQuiz = async (quiz: Quiz) => {
    if (!firebaseUser) return;
    const token = await firebaseUser.getIdToken();
    const res = await fetch(`/api/quizzes/${quiz.id}`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const full = await res.json();
      setActiveQuiz(full);
      setAnswers(new Array(full.questions.length).fill(null));
      setQIdx(0);
      setShowResult(false);
    }
  };

  const submitQuiz = async () => {
    if (!activeQuiz?.questions) return;
    const correct = activeQuiz.questions.filter((q, i) => answers[i] === q.correctAnswer).length;
    const total = activeQuiz.questions.length;
    const score = Math.round((correct / total) * 100);
    const points = correct * 10;

    setShowResult(true);
    if (firebaseUser) {
      await addPoints(points);
      await recordActivity("quiz", activeQuiz.id, activeQuiz.title, points, score);
    }
  };

  // Quiz Player
  if (activeQuiz && activeQuiz.questions) {
    if (showResult) {
      const correct = activeQuiz.questions.filter((q, i) => answers[i] === q.correctAnswer).length;
      const total = activeQuiz.questions.length;
      const score = Math.round((correct / total) * 100);

      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl mx-auto">
          <Card variant="glass" padding="lg" className="text-center space-y-6">
            <div className="text-6xl">{score >= 80 ? "🎉" : score >= 50 ? "👍" : "📚"}</div>
            <div>
              <h2 className="text-2xl font-bold text-white">Quiz Complete!</h2>
              <p className="text-slate-500 mt-1">{activeQuiz.title}</p>
            </div>
            <div className="text-5xl font-bold text-[var(--primary-400)]">{score}%</div>
            <p className="text-slate-400">{correct}/{total} correct • +{correct * 10} EcoPoints</p>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => { setActiveQuiz(null); setShowResult(false); }} icon={<X size={16} />}>Close</Button>
              <Button onClick={() => { setQIdx(0); setShowResult(false); setAnswers(new Array(total).fill(null)); }} icon={<RotateCcw size={16} />}>Retry</Button>
            </div>
          </Card>

          {/* Review Answers */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-200">Review</h3>
            {activeQuiz.questions.map((q, i) => (
              <Card key={i} variant="default" padding="md">
                <p className="text-sm font-medium text-white mb-2">{q.question}</p>
                <div className="space-y-1">
                  {q.choices.map((c, ci) => (
                    <div key={ci} className={`px-3 py-2 rounded-lg text-sm ${ci === q.correctAnswer ? "bg-[var(--primary-400)]/10 text-[var(--primary-400)] font-medium glow-[0_0_10px_var(--shadow-glow)]" :
                        ci === answers[i] && ci !== q.correctAnswer ? "bg-red-500/10 text-red-400" :
                          "text-slate-400"
                      }`}>
                      {ci === q.correctAnswer && "✅ "}{ci === answers[i] && ci !== q.correctAnswer && "❌ "}{c}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      );
    }

    const q = activeQuiz.questions[qIdx];
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">{activeQuiz.title}</h2>
          <Button variant="ghost" size="sm" onClick={() => setActiveQuiz(null)}>
            <X size={16} /> Exit
          </Button>
        </div>

        <ProgressBar value={qIdx + 1} max={activeQuiz.questions.length} showValue />

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Timer size={16} className={timer <= 5 ? "text-red-500" : ""} />
          <span className={timer <= 5 ? "text-red-500 font-bold" : ""}>{timer}s</span>
        </div>

        <Card variant="glass" padding="lg" className="space-y-4">
          <p className="text-base font-semibold text-white">Q{qIdx + 1}. {q.question}</p>
          <div className="space-y-2">
            {q.choices.map((c, ci) => (
              <motion.button
                key={ci}
                whileTap={{ scale: 0.98 }}
                onClick={() => { const a = [...answers]; a[qIdx] = ci; setAnswers(a); }}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all cursor-pointer ${answers[qIdx] === ci
                    ? "border-[var(--primary-400)] bg-[var(--primary-400)]/10 text-[var(--primary-400)] shadow-[0_0_15px_var(--shadow-glow)]"
                    : "border-white/10 hover:border-white/20 text-slate-300 hover:bg-white/5"
                  }`}
              >
                {c}
              </motion.button>
            ))}
          </div>
        </Card>

        <div className="flex justify-between">
          <Button variant="secondary" disabled={qIdx === 0} onClick={() => setQIdx(qIdx - 1)}>
            Previous
          </Button>
          {qIdx < activeQuiz.questions.length - 1 ? (
            <Button onClick={() => setQIdx(qIdx + 1)} icon={<ChevronRight size={16} />} disabled={answers[qIdx] === null}>
              Next
            </Button>
          ) : (
            <Button onClick={submitQuiz} icon={<CheckCircle size={16} />} disabled={answers.includes(null)}>
              Submit Quiz
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <PageHeader title="Quizzes" subtitle="Test your environmental knowledge" icon={<HelpCircle size={22} />} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map((quiz) => (
          <motion.div key={quiz.id} variants={staggerItem}>
            <Card variant="glass" padding="none" className="overflow-hidden cursor-pointer" onClick={() => startQuiz(quiz)}>
              <div className="h-2 bg-gradient-to-r from-[var(--accent-400)] to-purple-600" />
              <div className="p-5 space-y-3">
                <h3 className="text-base font-semibold text-white">{quiz.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2">{quiz.description}</p>
                <Badge variant="purple">{quiz.category}</Badge>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
