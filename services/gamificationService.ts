import { BADGE_DEFINITIONS, CHALLENGE_TEMPLATES, DEFAULT_STREAK } from '../constants';
import type {
  Attempt,
  BadgeDefinition,
  ChallengeProgress,
  ChallengeTemplate,
  StudyStreak,
  UnlockedBadge,
} from '../types';
import { db } from './db';

const DAY_MS = 24 * 60 * 60 * 1000;

const toDateKey = (date: Date): string => date.toISOString().slice(0, 10);

const parseDateKey = (key: string): Date => {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

const diffInDays = (from: string | null, to: string): number => {
  if (!from) {
    return Number.POSITIVE_INFINITY;
  }
  const fromDate = parseDateKey(from);
  const toDate = parseDateKey(to);
  return Math.floor((toDate.getTime() - fromDate.getTime()) / DAY_MS);
};

const getWeekKey = (date: Date): string => {
  const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = utcDate.getUTCDay() || 7; // make Sunday 7
  utcDate.setUTCDate(utcDate.getUTCDate() - day + 1);
  return toDateKey(utcDate);
};

const filterAttemptsByRange = (attempts: Attempt[], start: Date, end: Date): Attempt[] => {
  return attempts.filter((attempt) => {
    const attemptDate = new Date(attempt.createdAt);
    return attemptDate >= start && attemptDate <= end;
  });
};

const calculateAccuracy = (attempts: Attempt[]): number => {
  if (attempts.length === 0) {
    return 0;
  }
  const correct = attempts.filter((attempt) => attempt.correct).length;
  return (correct / attempts.length) * 100;
};

const getWeekRange = (date: Date): { start: Date; end: Date } => {
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = start.getUTCDay() || 7;
  start.setUTCDate(start.getUTCDate() - day + 1);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  end.setUTCHours(23, 59, 59, 999);
  return { start, end };
};

const pruneOutdatedChallenges = async (challenges: ChallengeProgress[]): Promise<void> => {
  const now = new Date();
  const keepThreshold = new Date(now.getTime() - 21 * DAY_MS);
  await Promise.all(
    challenges
      .filter((challenge) => {
        const baseDate = challenge.period === 'daily' ? parseDateKey(challenge.dateKey) : parseDateKey(challenge.dateKey);
        return baseDate < keepThreshold;
      })
      .map((challenge) => db.deleteChallengeProgress(challenge.id)),
  );
};

const ensureAttemptPresence = (attempts: Attempt[], attempt: Attempt): Attempt[] => {
  if (attempts.some((existing) => existing.id === attempt.id)) {
    return attempts;
  }
  return [...attempts, attempt];
};

const computeWeeklySessions = (attempts: Attempt[], reference: Date): number => {
  const { start, end } = getWeekRange(reference);
  const sessions = new Set<string>();
  filterAttemptsByRange(attempts, start, end).forEach((attempt) => {
    sessions.add(toDateKey(new Date(attempt.createdAt)));
  });
  return sessions.size;
};

const computeWeeklyAccuracy = (attempts: Attempt[], reference: Date): number => {
  const { start, end } = getWeekRange(reference);
  return calculateAccuracy(filterAttemptsByRange(attempts, start, end));
};

const computeChallengeCompletions = (challenges: ChallengeProgress[]): number => {
  return challenges.filter((challenge) => Boolean(challenge.completedAt)).length;
};

const updateStreak = async (attemptDateKey: string): Promise<StudyStreak> => {
  const streak = await db.getStudyStreak().catch(() => ({ ...DEFAULT_STREAK }));
  const delta = diffInDays(streak.lastStudyDate, attemptDateKey);
  let current = streak.current;
  if (delta > 1) {
    current = 1;
  } else if (delta === 1) {
    current = streak.current + 1;
  } else if (delta === 0) {
    current = streak.current;
  } else {
    current = 1;
  }

  const updated: StudyStreak = {
    id: streak.id,
    current,
    longest: Math.max(streak.longest, current),
    lastStudyDate: attemptDateKey,
  };
  await db.saveStudyStreak(updated);
  return updated;
};

const updateChallenges = async (
  attempt: Attempt,
  attempts: Attempt[],
  referenceDate: Date,
): Promise<{ all: ChallengeProgress[]; affected: ChallengeProgress[] }> => {
  const allProgress = await db.getAllChallengeProgress();
  const progressMap = new Map<string, ChallengeProgress>();
  allProgress.forEach((progress) => progressMap.set(progress.id, progress));

  const dateKey = toDateKey(referenceDate);
  const affected: ChallengeProgress[] = [];

  for (const template of CHALLENGE_TEMPLATES) {
    const periodKey = template.period === 'daily' ? dateKey : getWeekKey(referenceDate);
    const id = `${template.id}_${periodKey}`;
    const existing = progressMap.get(id) ?? {
      id,
      challengeId: template.id,
      dateKey: periodKey,
      period: template.period,
      progress: 0,
      target: template.target,
      metadata: {},
    };

    const metadata = (existing.metadata ?? {}) as Record<string, unknown>;

    switch (template.metric) {
      case 'cardsReviewed':
        existing.progress += 1;
        break;
      case 'studySessions': {
        const days = new Set<string>(Array.isArray(metadata.days) ? (metadata.days as string[]) : []);
        days.add(dateKey);
        metadata.days = Array.from(days);
        existing.progress = days.size;
        break;
      }
      case 'accuracy': {
        const accuracy = computeWeeklyAccuracy(attempts, referenceDate);
        existing.progress = Math.round(accuracy);
        break;
      }
      case 'streak': {
        existing.progress = Math.max(existing.progress, 1);
        break;
      }
      default:
        break;
    }

    if (existing.progress >= existing.target && !existing.completedAt) {
      existing.completedAt = new Date().toISOString();
    }

    existing.metadata = metadata;
    await db.saveChallengeProgress(existing);
    progressMap.set(id, existing);
    affected.push(existing);
  }

  // Prune older challenge entries asynchronously, but don't block the UI
  pruneOutdatedChallenges(Array.from(progressMap.values())).catch(() => {
    // noop
  });

  return {
    all: Array.from(progressMap.values()),
    affected,
  };
};

const awardBadges = async (
  attempts: Attempt[],
  streak: StudyStreak,
  challenges: ChallengeProgress[],
  referenceDate: Date,
): Promise<UnlockedBadge[]> => {
  const unlocked = await db.getUnlockedBadges();
  const unlockedIds = new Set(unlocked.map((badge) => badge.badgeId));
  const newlyEarned: UnlockedBadge[] = [];

  for (const badge of BADGE_DEFINITIONS) {
    if (unlockedIds.has(badge.id)) {
      continue;
    }

    let value = 0;
    switch (badge.metric) {
      case 'streakDays':
        value = streak.longest;
        break;
      case 'weeklyStudySessions':
        value = computeWeeklySessions(attempts, referenceDate);
        break;
      case 'accuracy':
        value = Math.round(computeWeeklyAccuracy(attempts, referenceDate));
        break;
      case 'challengeCompletions':
        value = computeChallengeCompletions(challenges);
        break;
      default:
        value = 0;
    }

    if (value >= badge.threshold) {
      const record: UnlockedBadge = {
        id: badge.id,
        badgeId: badge.id,
        unlockedAt: new Date().toISOString(),
        progressSnapshot: value,
      };
      await db.upsertUnlockedBadge(record);
      unlockedIds.add(badge.id);
      newlyEarned.push(record);
    }
  }

  return newlyEarned;
};

export const recordStudyActivity = async (
  attempt: Attempt,
): Promise<{
  streak: StudyStreak;
  earnedBadges: UnlockedBadge[];
  updatedChallenges: ChallengeProgress[];
  allChallenges: ChallengeProgress[];
}> => {
  const attemptDate = new Date(attempt.createdAt);
  const attempts = ensureAttemptPresence(await db.getAllAttempts(), attempt);
  const streak = await updateStreak(toDateKey(attemptDate));
  const { all: allChallenges, affected } = await updateChallenges(attempt, attempts, attemptDate);
  const badgeAwards = await awardBadges(attempts, streak, allChallenges, attemptDate);

  return {
    streak,
    earnedBadges: badgeAwards,
    updatedChallenges: affected,
    allChallenges,
  };
};

export const getGamificationState = async (): Promise<{
  streak: StudyStreak;
  badges: { definitions: BadgeDefinition[]; unlocked: UnlockedBadge[] };
  challenges: ChallengeProgress[];
  templates: ChallengeTemplate[];
}> => {
  const [streak, unlocked, challenges] = await Promise.all([
    db.getStudyStreak().catch(() => ({ ...DEFAULT_STREAK })),
    db.getUnlockedBadges(),
    db.getAllChallengeProgress(),
  ]);

  return {
    streak,
    badges: {
      definitions: BADGE_DEFINITIONS,
      unlocked,
    },
    challenges,
    templates: CHALLENGE_TEMPLATES,
  };
};



