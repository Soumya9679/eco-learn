"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import { PageSkeleton } from "@/components/ui/Skeleton";
import ProgressBar from "@/components/ui/ProgressBar";
import {
  BookOpen,
  Search,
  Play,
  ChevronRight,
  CheckCircle,
  Video,
  FileText,
  HelpCircle,
  X,
} from "lucide-react";

interface Lesson {
  title: string;
  type: string;
  videoUrl?: string;
  content?: string;
  question?: string;
  choices?: string[];
  correctAnswer?: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  lessons: Lesson[];
}

export default function ModulesPage() {
  const { firebaseUser, addPoints, recordActivity } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [lessonIdx, setLessonIdx] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState("");

  useEffect(() => {
    const fetchModules = async () => {
      const res = await fetch("/api/modules");
      if (res.ok) setModules(await res.json());
      setLoading(false);
    };
    fetchModules();
  }, []);

  if (loading) return <PageSkeleton />;

  const categories = ["All", ...new Set(modules.map((m) => m.category))];
  const filtered = modules.filter((m) => {
    const matchCat = category === "All" || m.category === category;
    const matchSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const difficultyColor: Record<string, "success" | "warning" | "error"> = {
    Beginner: "success",
    Intermediate: "warning",
    Advanced: "error",
  };

  const lessonIcon: Record<string, React.ReactNode> = {
    learn_video: <Video size={16} />,
    learn_document: <FileText size={16} />,
    interact: <Play size={16} />,
    quiz: <HelpCircle size={16} />,
  };

  const handleQuizSubmit = (lesson: Lesson) => {
    if (quizAnswer === lesson.correctAnswer) {
      setQuizFeedback("✅ Correct!");
    } else {
      setQuizFeedback(`❌ Incorrect. The correct answer was: ${lesson.choices?.[lesson.correctAnswer || 0]}`);
    }
  };

  const handleCompleteModule = async () => {
    if (!activeModule) return;
    await addPoints(20);
    await recordActivity("module", activeModule.id, activeModule.title, 20);
    setActiveModule(null);
    setLessonIdx(0);
    setQuizAnswer(null);
    setQuizFeedback("");
  };

  // Module Player
  if (activeModule) {
    const lesson = activeModule.lessons[lessonIdx];
    const isLastLesson = lessonIdx === activeModule.lessons.length - 1;

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">{activeModule.category}</p>
            <h1 className="text-xl font-bold text-slate-800">{activeModule.title}</h1>
          </div>
          <Button variant="ghost" onClick={() => { setActiveModule(null); setLessonIdx(0); }}>
            <X size={18} /> Close
          </Button>
        </div>

        <ProgressBar
          value={lessonIdx + 1}
          max={activeModule.lessons.length}
          label={`Lesson ${lessonIdx + 1} of ${activeModule.lessons.length}`}
          showValue
        />

        {/* Lesson Stepper */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {activeModule.lessons.map((l, i) => (
            <button
              key={i}
              onClick={() => { setLessonIdx(i); setQuizAnswer(null); setQuizFeedback(""); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${i === lessonIdx
                  ? "bg-emerald-100 text-emerald-700"
                  : i < lessonIdx
                    ? "bg-emerald-50 text-emerald-500"
                    : "bg-slate-100 text-slate-400"
                }`}
            >
              {i < lessonIdx ? <CheckCircle size={14} /> : lessonIcon[l.type]}
              {l.title}
            </button>
          ))}
        </div>

        {/* Lesson Content */}
        <Card variant="default" padding="lg">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">{lesson.title}</h3>

          {lesson.type === "learn_video" && lesson.videoUrl && (
            <div className="aspect-video rounded-xl overflow-hidden bg-slate-900">
              <iframe src={lesson.videoUrl} className="w-full h-full" allowFullScreen />
            </div>
          )}

          {lesson.type === "learn_document" && lesson.content && (
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
              {lesson.content}
            </div>
          )}

          {(lesson.type === "quiz" || lesson.type === "interact") && lesson.question && (
            <div className="space-y-4">
              <p className="text-slate-700 font-medium">{lesson.question}</p>
              <div className="space-y-2">
                {lesson.choices?.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => { setQuizAnswer(i); setQuizFeedback(""); }}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all cursor-pointer ${quizAnswer === i
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                      }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              {quizAnswer !== null && !quizFeedback && (
                <Button onClick={() => handleQuizSubmit(lesson)}>Submit Answer</Button>
              )}
              {quizFeedback && (
                <p className={`text-sm font-medium ${quizFeedback.startsWith("✅") ? "text-emerald-600" : "text-red-500"}`}>
                  {quizFeedback}
                </p>
              )}
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="secondary" disabled={lessonIdx === 0} onClick={() => { setLessonIdx(lessonIdx - 1); setQuizAnswer(null); setQuizFeedback(""); }}>
            Previous
          </Button>
          {isLastLesson ? (
            <Button onClick={handleCompleteModule} icon={<CheckCircle size={18} />}>
              Complete Module (+20 pts)
            </Button>
          ) : (
            <Button onClick={() => { setLessonIdx(lessonIdx + 1); setQuizAnswer(null); setQuizFeedback(""); }} icon={<ChevronRight size={18} />}>
              Next Lesson
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <PageHeader title="Learning Modules" subtitle="Explore interactive environmental education content" icon={<BookOpen size={22} />} />

      {/* Search & Filter */}
      <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search modules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${category === cat
                  ? "bg-emerald-500 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((mod) => (
          <motion.div key={mod.id} variants={staggerItem}>
            <Card variant="glass" padding="none" className="overflow-hidden cursor-pointer" onClick={() => setActiveModule(mod)}>
              <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-400" />
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-semibold text-slate-800">{mod.title}</h3>
                  <Badge variant={difficultyColor[mod.difficulty] || "default"}>{mod.difficulty}</Badge>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2">{mod.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-400">{mod.lessons.length} lessons</span>
                  <Badge variant="default">{mod.category}</Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium">No modules found</p>
        </div>
      )}
    </motion.div>
  );
}
