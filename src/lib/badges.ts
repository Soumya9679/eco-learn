/**
 * Badge definitions and automated granting logic (#17 / #26).
 * Badges are defined as configurable constants rather than hardcoded in the API.
 */

import { db } from "./firebase";

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: string;
  /** Checker function receives user data and returns whether badge is earned */
  check: (userData: Record<string, unknown>) => boolean;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: "eco-starter",
    title: "Eco Starter",
    description: "Complete your first challenge",
    icon: "🌱",
    requirement: "Complete 1 challenge",
    check: (u) => {
      const progress = u.progress as Record<string, number> | undefined;
      return (progress?.challengesCompleted ?? 0) >= 1;
    },
  },
  {
    id: "knowledge-seeker",
    title: "Knowledge Seeker",
    description: "Complete 5 modules",
    icon: "📚",
    requirement: "Complete 5 modules",
    check: (u) => {
      const progress = u.progress as Record<string, number> | undefined;
      return (progress?.modulesCompleted ?? 0) >= 5;
    },
  },
  {
    id: "eco-champion",
    title: "Eco Champion",
    description: "Complete 10 challenges",
    icon: "🏆",
    requirement: "Complete 10 challenges",
    check: (u) => {
      const progress = u.progress as Record<string, number> | undefined;
      return (progress?.challengesCompleted ?? 0) >= 10;
    },
  },
  {
    id: "point-master",
    title: "Point Master",
    description: "Earn 1000 EcoPoints",
    icon: "⭐",
    requirement: "Earn 1000 EcoPoints",
    check: (u) => ((u.ecoPoints as number) ?? 0) >= 1000,
  },
  {
    id: "quiz-whiz",
    title: "Quiz Whiz",
    description: "Complete 10 quizzes",
    icon: "🧠",
    requirement: "Complete 10 quizzes",
    check: (u) => {
      const progress = u.progress as Record<string, number> | undefined;
      return (progress?.quizzesCompleted ?? 0) >= 10;
    },
  },
  {
    id: "game-guru",
    title: "Game Guru",
    description: "Complete 5 games",
    icon: "🎮",
    requirement: "Complete 5 games",
    check: (u) => {
      const progress = u.progress as Record<string, number> | undefined;
      return (progress?.gamesCompleted ?? 0) >= 5;
    },
  },
  {
    id: "eco-warrior",
    title: "Eco Warrior",
    description: "Earn 5000 EcoPoints",
    icon: "⚔️",
    requirement: "Earn 5000 EcoPoints",
    check: (u) => ((u.ecoPoints as number) ?? 0) >= 5000,
  },
  {
    id: "first-steps",
    title: "First Steps",
    description: "Complete your first module",
    icon: "👣",
    requirement: "Complete 1 module",
    check: (u) => {
      const progress = u.progress as Record<string, number> | undefined;
      return (progress?.modulesCompleted ?? 0) >= 1;
    },
  },
];

/**
 * Check user data against all badge definitions and grant any newly earned badges.
 * This is called automatically after activity recording.
 */
export async function checkAndGrantBadges(uid: string): Promise<string[]> {
  const userDoc = await db.collection("users").doc(uid).get();
  if (!userDoc.exists) return [];

  const userData = userDoc.data()!;
  const currentBadges: string[] = userData.badges || [];
  const newBadges: string[] = [];

  for (const badge of BADGE_DEFINITIONS) {
    if (!currentBadges.includes(badge.title) && badge.check(userData)) {
      newBadges.push(badge.title);
    }
  }

  if (newBadges.length > 0) {
    await db
      .collection("users")
      .doc(uid)
      .update({
        badges: [...currentBadges, ...newBadges],
      });
  }

  return newBadges;
}
