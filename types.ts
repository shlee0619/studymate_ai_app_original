export interface Item {
  id: string;
  stem: string;
  options: string[];
  answerIndex: number;
  conceptId?: string;
  difficulty: number; // 0.0 to 1.0
  sourceRef?: string;
  ef: number; // easiness factor
  intervalDays: number;
  reps: number;
  nextReview?: string; // ISO string
}

export interface AiFeedback {
  explanation: string;
  focusConcepts: string[];
  suggestedResources: string[];
  followUpPrompt?: string;
  createdAt: string; // ISO string
}

export interface Attempt {
  id: string;
  itemId: string;
  correct: boolean;
  latencyMs: number;
  confidence: number; // 0.0 to 1.0
  errorTagIds: string[];
  createdAt: string; // ISO string
  aiFeedback?: AiFeedback;
  remediationConcepts?: string[];
}

export interface StudyGoal {
  id: string;
  type: "daily" | "weekly";
  target: number;
  category: "study" | "review";
  createdAt: string;
}

export interface ErrorTag {
  id: string;
  name: string;
  pattern?: string;
  notes?: string;
}

export interface Concept {
  id: string;
  title: string;
  prereqIds: string[];
  mastery: number;
}

export interface Evidence {
  id: string;
  itemId: string;
  sourceUri?: string;
  snippet: string;
  offsets?: [number, number];
}

export interface ErrorTagHistogram {
  [tagId: string]: {
    name: string;
    count: number;
  };
}

export interface SearchHit {
  snippet: string;
  sourceUri?: string;
  offsets?: [number, number];
}

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  category: "streak" | "mastery" | "momentum" | "challenge";
  icon: string;
  metric: "streakDays" | "weeklyStudySessions" | "accuracy" | "challengeCompletions";
  threshold: number;
}

export interface UnlockedBadge {
  id: string;
  badgeId: string;
  unlockedAt: string;
  progressSnapshot?: number;
  metadata?: Record<string, unknown>;
}

export interface StudyStreak {
  id: string;
  current: number;
  longest: number;
  lastStudyDate: string | null;
}

export interface ChallengeTemplate {
  id: string;
  title: string;
  description: string;
  period: "daily" | "weekly";
  metric: "studySessions" | "cardsReviewed" | "accuracy" | "streak";
  target: number;
}

export interface ChallengeProgress {
  id: string;
  challengeId: string;
  dateKey: string; // e.g. 2025-09-30
  period: "daily" | "weekly";
  progress: number;
  target: number;
  completedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface DailyStudyMetric {
  date: string;
  studied: number;
  correct: number;
  incorrect: number;
  accuracy: number;
}

export interface ScheduleRecommendation {
  id: string;
  title: string;
  description: string;
  suggestedAt: string;
  dueAt: string;
  urgency: "overdue" | "today" | "upcoming";
  priority: "high" | "medium" | "low";
  itemCount: number;
  metadata?: Record<string, unknown>;
}

export type Screen =
  | "dashboard"
  | "library"
  | "quiz"
  | "review"
  | "errors"
  | "concepts"
  | "settings";
