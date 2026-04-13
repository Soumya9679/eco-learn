"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import { Gamepad2, Recycle, Droplets, TreePine, Play, Trophy } from "lucide-react";

const games = [
  {
    id: "sorting",
    title: "Waste Sorting Game",
    description: "Sort items into correct recycling categories before time runs out!",
    icon: Recycle,
    color: "from-green-400 to-green-600",
    items: [
      { name: "Plastic Bottle", correct: "Recyclable" },
      { name: "Banana Peel", correct: "Compost" },
      { name: "Glass Jar", correct: "Recyclable" },
      { name: "Used Tissue", correct: "Non-Recyclable" },
      { name: "Newspaper", correct: "Recyclable" },
      { name: "Battery", correct: "Hazardous" },
      { name: "Apple Core", correct: "Compost" },
      { name: "Plastic Bag", correct: "Non-Recyclable" },
    ],
    bins: ["Recyclable", "Compost", "Non-Recyclable", "Hazardous"],
  },
  {
    id: "water",
    title: "Water Conservation",
    description: "Make the best choices to save water in daily scenarios!",
    icon: Droplets,
    color: "from-blue-400 to-blue-600",
    scenarios: [
      { situation: "You're brushing your teeth. What do you do?", options: [{ text: "Keep the tap running", points: 0 }, { text: "Turn off the tap while brushing", points: 10 }] },
      { situation: "Your garden needs watering. When do you water?", options: [{ text: "During noon", points: 0 }, { text: "Early morning or evening", points: 10 }] },
      { situation: "You notice a leaky faucet at school.", options: [{ text: "Ignore it", points: 0 }, { text: "Report it to maintenance", points: 10 }] },
      { situation: "How do you wash vegetables?", options: [{ text: "Under running water", points: 0 }, { text: "In a bowl of water", points: 10 }] },
    ],
  },
  {
    id: "tree",
    title: "Tree Planting Challenge",
    description: "Answer eco-questions to plant virtual trees and grow a forest!",
    icon: TreePine,
    color: "from-emerald-400 to-emerald-600",
    questions: [
      { q: "How many years can a single tree provide oxygen?", options: ["1 year", "2 years", "4 years"], correct: 2 },
      { q: "Which tree absorbs the most CO2?", options: ["Pine", "Oak", "Teak"], correct: 1 },
      { q: "What percentage of Earth's oxygen comes from forests?", options: ["10%", "28%", "50%"], correct: 1 },
      { q: "How many trees are cut per minute globally?", options: ["100", "2,400", "48,000"], correct: 2 },
    ],
  },
];

export default function GamesPage() {
  const { addPoints, recordActivity } = useAuth();
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [sortingScore, setSortingScore] = useState(0);
  const [sortingIdx, setSortingIdx] = useState(0);
  const [waterIdx, setWaterIdx] = useState(0);
  const [waterScore, setWaterScore] = useState(0);
  const [treeIdx, setTreeIdx] = useState(0);
  const [treeScore, setTreeScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const resetGame = () => {
    setSortingScore(0); setSortingIdx(0);
    setWaterScore(0); setWaterIdx(0);
    setTreeScore(0); setTreeIdx(0);
    setGameComplete(false); setActiveGame(null);
  };

  const completeGame = async (gameName: string, score: number) => {
    const pts = Math.round(score / 10) * 5;
    setGameComplete(true);
    await addPoints(pts);
    await recordActivity("game", gameName, gameName, pts, score);
  };

  // Sorting Game
  if (activeGame === "sorting") {
    const game = games[0];
    if (gameComplete) {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto space-y-6 text-center mt-12">
          <div className="text-6xl">🎉</div>
          <h2 className="text-2xl font-bold text-white">Game Complete!</h2>
          <p className="text-3xl font-bold text-emerald-600">{sortingScore}/{game.items!.length} correct</p>
          <Button onClick={resetGame}>Back to Games</Button>
        </motion.div>
      );
    }
    if (sortingIdx >= game.items!.length) {
      completeGame("Waste Sorting", (sortingScore / game.items!.length) * 100);
      return null;
    }
    const item = game.items![sortingIdx];
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">{game.title}</h2>
          <Button variant="ghost" size="sm" onClick={resetGame}>Exit</Button>
        </div>
        <Card variant="glass" padding="lg" className="text-center space-y-6">
          <p className="text-sm text-slate-500">Item {sortingIdx + 1} of {game.items!.length}</p>
          <motion.div key={sortingIdx} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-5xl py-4">
            🗑️
          </motion.div>
          <h3 className="text-xl font-bold text-white">{item.name}</h3>
          <p className="text-sm text-slate-500">Which bin does this belong in?</p>
          <div className="grid grid-cols-2 gap-3">
            {game.bins!.map((bin) => (
              <Button
                key={bin}
                variant={bin === item.correct ? "primary" : "secondary"}
                onClick={() => {
                  if (bin === item.correct) setSortingScore(sortingScore + 1);
                  setSortingIdx(sortingIdx + 1);
                }}
                fullWidth
              >
                {bin}
              </Button>
            ))}
          </div>
        </Card>
      </motion.div>
    );
  }

  // Water Game
  if (activeGame === "water") {
    const game = games[1];
    if (gameComplete) {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto space-y-6 text-center mt-12">
          <div className="text-6xl">💧</div>
          <h2 className="text-2xl font-bold text-white">Game Complete!</h2>
          <p className="text-3xl font-bold text-blue-600">{waterScore} points</p>
          <Button onClick={resetGame}>Back to Games</Button>
        </motion.div>
      );
    }
    if (waterIdx >= game.scenarios!.length) {
      completeGame("Water Conservation", waterScore);
      return null;
    }
    const s = game.scenarios![waterIdx];
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">{game.title}</h2>
          <Button variant="ghost" size="sm" onClick={resetGame}>Exit</Button>
        </div>
        <Card variant="glass" padding="lg" className="space-y-6">
          <p className="text-base font-semibold text-white">{s.situation}</p>
          <div className="space-y-3">
            {s.options.map((opt, i) => (
              <Button
                key={i}
                variant="secondary"
                fullWidth
                onClick={() => {
                  setWaterScore(waterScore + opt.points);
                  setWaterIdx(waterIdx + 1);
                }}
              >
                {opt.text}
              </Button>
            ))}
          </div>
        </Card>
      </motion.div>
    );
  }

  // Tree Game
  if (activeGame === "tree") {
    const game = games[2];
    if (gameComplete) {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto space-y-6 text-center mt-12">
          <div className="text-6xl">🌳</div>
          <h2 className="text-2xl font-bold text-white">Forest Grown!</h2>
          <p className="text-3xl font-bold text-emerald-600">{treeScore}/{game.questions!.length} trees</p>
          <Button onClick={resetGame}>Back to Games</Button>
        </motion.div>
      );
    }
    if (treeIdx >= game.questions!.length) {
      completeGame("Tree Planting", (treeScore / game.questions!.length) * 100);
      return null;
    }
    const tq = game.questions![treeIdx];
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">{game.title}</h2>
          <Button variant="ghost" size="sm" onClick={resetGame}>Exit</Button>
        </div>
        <Card variant="glass" padding="lg" className="space-y-6">
          <p className="text-base font-semibold text-white">{tq.q}</p>
          <div className="space-y-3">
            {tq.options.map((opt, i) => (
              <Button
                key={i}
                variant="secondary"
                fullWidth
                onClick={() => {
                  if (i === tq.correct) setTreeScore(treeScore + 1);
                  setTreeIdx(treeIdx + 1);
                }}
              >
                {opt}
              </Button>
            ))}
          </div>
        </Card>
      </motion.div>
    );
  }

  // Game Selection
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <PageHeader title="Eco Games" subtitle="Learn sustainability through fun interactive games" icon={<Gamepad2 size={22} />} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {games.map((game) => (
          <motion.div key={game.id} variants={staggerItem}>
            <Card variant="glass" padding="none" className="overflow-hidden cursor-pointer" onClick={() => setActiveGame(game.id)}>
              <div className={`h-32 bg-gradient-to-br ${game.color} flex items-center justify-center`}>
                <game.icon size={48} className="text-white/90" />
              </div>
              <div className="p-5 space-y-3">
                <h3 className="text-lg font-semibold text-white">{game.title}</h3>
                <p className="text-sm text-slate-500">{game.description}</p>
                <Button size="sm" icon={<Play size={16} />}>Play Now</Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
