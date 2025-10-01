import { SCHEDULE_LOOKBACK_DAYS } from '../constants';
import type {
  DailyStudyMetric,
  ScheduleRecommendation,
  StudyStreak,
  BadgeDefinition,
  UnlockedBadge,
  ChallengeProgress,
  ChallengeTemplate,
} from '../types';
import { db } from './db';
import { getGamificationState } from './gamificationService';

const DAY_MS = 24 * 60 * 60 * 1000;

export interface StudySnapshot {
  totals: {
    totalItems: number;
    totalAttempts: number;
    correctRate: number;
    todayStudied: number;
    weekStudied: number;
    dueForReview: number;
  };
  dailyMetrics: DailyStudyMetric[];
  accuracyTrend: { date: string; accuracy: number }[];
  streak: StudyStreak;
  badges: { definitions: BadgeDefinition[]; unlocked: UnlockedBadge[] };
  challenges: ChallengeProgress[];
  challengeTemplates: ChallengeTemplate[];
  recommendations: ScheduleRecommendation[];
}

const toStartOfDay = (date: Date): Date => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const toDateKey = (date: Date): string => date.toISOString().slice(0, 10);

const buildDailyMetrics = (attempts: Awaited<ReturnType<typeof db.getAllAttempts>>): DailyStudyMetric[] => {
  const now = new Date();
  const start = new Date(now.getTime() - (SCHEDULE_LOOKBACK_DAYS - 1) * DAY_MS);
  const buckets = new Map<string, { studied: number; correct: number; incorrect: number }>();

  attempts.forEach((attempt) => {
    const attemptDate = new Date(attempt.createdAt);
    if (attemptDate < start) {
      return;
    }
    const key = toDateKey(attemptDate);
    const bucket = buckets.get(key) ?? { studied: 0, correct: 0, incorrect: 0 };
    bucket.studied += 1;
    if (attempt.correct) {
      bucket.correct += 1;
    } else {
      bucket.incorrect += 1;
    }
    buckets.set(key, bucket);
  });

  const metrics: DailyStudyMetric[] = [];
  for (let i = SCHEDULE_LOOKBACK_DAYS - 1; i >= 0; i--) {
    const day = new Date(now.getTime() - i * DAY_MS);
    const key = toDateKey(day);
    const bucket = buckets.get(key) ?? { studied: 0, correct: 0, incorrect: 0 };
    const accuracy = bucket.studied === 0 ? 0 : (bucket.correct / bucket.studied) * 100;
    metrics.push({
      date: key,
      studied: bucket.studied,
      correct: bucket.correct,
      incorrect: bucket.incorrect,
      accuracy,
    });
  }

  return metrics;
};

const buildRecommendations = async (
  totalItems: number,
  attemptsCount: number,
  dueItems: number,
  upcomingItems: number,
  accuracy: number,
): Promise<ScheduleRecommendation[]> => {
  const now = new Date();
  const recommendations: ScheduleRecommendation[] = [];

  if (dueItems > 0) {
    recommendations.push({
      id: 'review-overdue',
      title: 'Clear overdue reviews',
      description: `You have ${dueItems} cards waiting for review. Start with the highest priority set to rebuild momentum.`,
      suggestedAt: now.toISOString(),
      dueAt: now.toISOString(),
      urgency: 'overdue',
      priority: 'high',
      itemCount: dueItems,
      metadata: { type: 'due' },
    });
  }

  if (upcomingItems > 0) {
    const dueSoon = new Date(now.getTime() + 2 * DAY_MS);
    recommendations.push({
      id: 'plan-upcoming',
      title: 'Plan upcoming reviews',
      description: `Prepare for ${upcomingItems} cards that will be due within 48 hours. Scheduling a short session now will keep the streak alive.`,
      suggestedAt: now.toISOString(),
      dueAt: dueSoon.toISOString(),
      urgency: 'today',
      priority: 'medium',
      itemCount: upcomingItems,
      metadata: { type: 'upcoming' },
    });
  }

  if (attemptsCount > 0 && accuracy < 80) {
    recommendations.push({
      id: 'accuracy-focus',
      title: 'Focus on accuracy',
      description: 'Recent accuracy dipped below 80%. Revisit tricky concepts and slow down to check reasoning before submitting.',
      suggestedAt: now.toISOString(),
      dueAt: new Date(now.getTime() + 3 * DAY_MS).toISOString(),
      urgency: 'upcoming',
      priority: 'medium',
      itemCount: 0,
      metadata: { type: 'accuracy' },
    });
  }

  if (recommendations.length === 0 && totalItems > 0) {
    recommendations.push({
      id: 'create-new-cards',
      title: 'Add new practice cards',
      description: 'Everything looks on track. Consider generating new cards to stretch your knowledge.',
      suggestedAt: now.toISOString(),
      dueAt: new Date(now.getTime() + 5 * DAY_MS).toISOString(),
      urgency: 'upcoming',
      priority: 'low',
      itemCount: 0,
      metadata: { type: 'growth' },
    });
  }

  return recommendations.slice(0, 3);
};

export const loadStudySnapshot = async (): Promise<StudySnapshot> => {
  const now = new Date();
  const todayKey = toDateKey(now);
  const weekAgo = new Date(now.getTime() - 7 * DAY_MS);

  const [items, attempts, gamification] = await Promise.all([
    db.getAllItems(),
    db.getAllAttempts(),
    getGamificationState(),
  ]);

  const dueItems = items.filter((item) => item.nextReview && new Date(item.nextReview) <= now);
  const upcomingItems = items.filter((item) => {
    if (!item.nextReview) {
      return false;
    }
    const reviewDate = new Date(item.nextReview);
    return reviewDate > now && reviewDate <= new Date(now.getTime() + 2 * DAY_MS);
  });

  const todayAttempts = attempts.filter((attempt) => toDateKey(new Date(attempt.createdAt)) === todayKey);
  const weekAttempts = attempts.filter((attempt) => new Date(attempt.createdAt) >= weekAgo);
  const totalCorrect = attempts.filter((attempt) => attempt.correct).length;
  const correctRate = attempts.length === 0 ? 0 : (totalCorrect / attempts.length) * 100;

  const dailyMetrics = buildDailyMetrics(attempts);
  const accuracyTrend = dailyMetrics.map((metric) => ({ date: metric.date, accuracy: metric.accuracy }));

  const recommendations = await buildRecommendations(
    items.length,
    attempts.length,
    dueItems.length,
    upcomingItems.length,
    Math.round(correctRate),
  );

  return {
    totals: {
      totalItems: items.length,
      totalAttempts: attempts.length,
      correctRate: Math.round(correctRate),
      todayStudied: todayAttempts.length,
      weekStudied: weekAttempts.length,
      dueForReview: dueItems.length,
    },
    dailyMetrics,
    accuracyTrend,
    streak: gamification.streak,
    badges: gamification.badges,
    challenges: gamification.challenges,
    challengeTemplates: gamification.templates,
    recommendations,
  };
};

