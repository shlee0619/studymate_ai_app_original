import { useState, useCallback, useEffect } from 'react';
import type { Item, Attempt, ErrorTag, AiFeedback, UnlockedBadge, StudyStreak, ChallengeProgress } from '../types';
import { db } from '../services/db';
import { searchEvidence } from '../services/apiService';
import { MESSAGES } from '../constants';
import { recordStudyActivity } from '../services/gamificationService';
import { fetchAiFeedback } from '../services/aiTutorService';
import { useUcb1 } from './useUcb1';
import { useSm2 } from './useSm2';

interface UseQuizParams {
  apiBaseUrl: string;
}

const DIFFICULTY_BUCKETS: Array<[number, number]> = [
  [0, 0.33],
  [0.34, 0.66],
  [0.67, 1.0],
];

const getDifficultyArm = (difficulty: number): number => {
  if (difficulty <= 0.33) return 0; // Easy
  if (difficulty <= 0.66) return 1; // Medium
  return 2; // Hard
};

interface QuizFeedback {
  correct: boolean;
  evidence?: string;
  aiFeedback?: AiFeedback;
  earnedBadges?: UnlockedBadge[];
  streak?: StudyStreak;
  challengeUpdates?: ChallengeProgress[];
}


export const useQuiz = ({ apiBaseUrl }: UseQuizParams) => {
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allTags, setAllTags] = useState<ErrorTag[]>([]);
  const [feedback, setFeedback] = useState<QuizFeedback | null>(null);
  const [quizItems, setQuizItems] = useState<Item[]>([]);

  const { selectArm, update } = useUcb1(3);
  const calculateSm2 = useSm2();

  useEffect(() => {
    let isActive = true;

    db.getAllErrorTags().then((tags) => {
      if (isActive) {
        setAllTags(tags);
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  const getNextItem = useCallback(
    async (options?: { refresh?: boolean }) => {
      setIsLoading(true);
      setFeedback(null);

      let items = quizItems;

      if (options?.refresh || items.length === 0) {
        items = await db.getAllItems();
        setQuizItems(items);
      }

      if (items.length === 0) {
        setCurrentItem(null);
        setIsLoading(false);
        return;
      }

      const arm = selectArm();
      const [min, max] = DIFFICULTY_BUCKETS[arm] ?? DIFFICULTY_BUCKETS[0];

      let candidates = items.filter((item) => item.difficulty >= min && item.difficulty <= max);
      if (candidates.length === 0) {
        candidates = items;
      }

      const nextItem = candidates[Math.floor(Math.random() * candidates.length)];
      setCurrentItem(nextItem);
      setIsLoading(false);
    },
    [quizItems, selectArm],
  );

  const submitAnswer = useCallback(
    async (
      item: Item,
      answerIndex: number,
      confidence: number,
      latencyMs: number,
      errorTagIds: string[],
    ) => {
      const correct = item.answerIndex === answerIndex;

      const attempt: Attempt = {
        id: 'attempt_' + Date.now(),
        itemId: item.id,
        correct,
        latencyMs,
        confidence,
        errorTagIds: correct ? [] : errorTagIds,
        createdAt: new Date().toISOString(),
      };

      try {
        await db.addAttempt(attempt);
      } catch (error) {
        console.error('Failed to record attempt:', error);
      }

      const reward = (correct ? 1 : 0) * (0.5 + 0.5 * confidence);
      update(getDifficultyArm(item.difficulty), reward);

      const scheduling = calculateSm2(item, correct, confidence, latencyMs);
      try {
        await db.updateItemScheduling(
          item.id,
          scheduling.ef,
          scheduling.intervalDays,
          scheduling.reps,
          scheduling.nextReview,
        );
        setQuizItems((prev) =>
          prev.map((quizItem) => (quizItem.id === item.id ? { ...quizItem, ...scheduling } : quizItem)),
        );
      } catch (error) {
        console.error('Failed to update item scheduling:', error);
      }

      const evidencePromise = searchEvidence(apiBaseUrl, item.stem, 1).catch((error) => {
        console.error('Failed to fetch evidence:', error);
        return null;
      });

      const gamificationPromise = recordStudyActivity(attempt).catch((error) => {
        console.error('Gamification update failed:', error);
        return null;
      });

      let aiFeedback: AiFeedback | undefined;
      if (!correct) {
        try {
          aiFeedback = await fetchAiFeedback({
            baseUrl: apiBaseUrl,
            item,
            attempt,
            selectedOption: answerIndex,
            errorTagIds,
          });
          attempt.aiFeedback = aiFeedback;
          attempt.remediationConcepts = aiFeedback.focusConcepts;
        } catch (error) {
          console.error('AI tutor feedback failed:', error);
        }

        if (aiFeedback) {
          try {
            await db.updateAttemptFeedback(attempt.id, aiFeedback, aiFeedback.focusConcepts);
          } catch (error) {
            console.warn('Persisting AI feedback failed:', error);
          }
        }
      }

      const [evidenceRes, gamificationRes] = await Promise.all([evidencePromise, gamificationPromise]);

      const evidenceSnippet =
        evidenceRes?.hits?.[0]?.snippet ?? (!correct ? MESSAGES.EVIDENCE_LOAD_FAILED : undefined);

      setFeedback({
        correct,
        evidence: evidenceSnippet,
        aiFeedback,
        earnedBadges: gamificationRes?.earnedBadges,
        streak: gamificationRes?.streak,
        challengeUpdates: gamificationRes?.updatedChallenges,
      });
    },
    [apiBaseUrl, calculateSm2, update],
  );

  useEffect(() => {
    getNextItem({ refresh: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { currentItem, isLoading, feedback, allTags, getNextItem, submitAnswer };
};






