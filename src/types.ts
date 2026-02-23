// ── Firestore Document Types ──

export interface UserDoc {
    name: string;
    email: string;
    mobile?: string;
    school?: string;
    state?: string;
    country?: string;
    profilePicture?: string;
    role: "user" | "admin" | "superadmin";
    status: "active" | "banned";
    ecoPoints: number;
    badges: string[];
    stats: {
        waterSaved: number;
        wasteDiverted: number;
        treesPlanted: number;
    };
    progress: {
        modulesCompleted: number;
        challengesCompleted: number;
        quizzesCompleted: number;
        gamesCompleted: number;
    };
    createdAt: string;
    updatedAt?: string;
}

export interface Lesson {
    title: string;
    type: "learn_video" | "learn_document" | "interact" | "quiz";
    videoUrl?: string;
    content?: string;
    question?: string;
    choices?: string[];
    correctAnswer?: number;
}

export interface ModuleDoc {
    id?: string;
    title: string;
    description: string;
    category: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    lessons: Lesson[];
    createdAt?: string;
}

export interface QuizQuestion {
    question: string;
    choices: string[];
    correctAnswer: number;
}

export interface QuizDoc {
    id?: string;
    title: string;
    description: string;
    category: string;
    questions: QuizQuestion[];
    createdAt?: string;
}

export interface ChallengeDoc {
    id?: string;
    category: string;
    title: string;
    description: string;
    points: number;
    createdAt?: string;
}

export interface PostDoc {
    id?: string;
    authorId: string;
    authorName: string;
    authorPicture?: string;
    description: string;
    place?: string;
    nearestSpot?: string;
    mediaUrl: string;
    mediaType: string;
    promoters: string[];
    promoteCount: number;
    createdAt: string;
}

export interface ProofDoc {
    id?: string;
    userId: string;
    challengeTitle: string;
    imageUrl: string;
    status: "Pending" | "Approved";
    createdAt: string;
}

export interface UserActivityDoc {
    id?: string;
    userId: string;
    activityType: string;
    activityId: string;
    activityTitle: string;
    pointsEarned: number;
    score?: number | null;
    status?: string;
    createdAt: string;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    earned: boolean;
    requirement: string;
}
