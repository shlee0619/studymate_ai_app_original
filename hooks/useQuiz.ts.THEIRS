import { useState, useRef, useCallback, useEffect } from 'react';
import type { Item, Attempt, ErrorTag } from '../types';
import { db } from '../services/db';
import { searchEvidence } from '../services/apiService';
import { MESSAGES } from '../constants';

interface UseQuizParams {
  apiBaseUrl: string;
}

// UCB1 Bandit Logic
const useUcb1 = (numArms: number) => {
  const pulls = useRef<number[]>(new Array(numArms).fill(0));
  const rewards = useRef<number[]>(new Array(numArms).fill(0));
  const totalPulls = useRef(0);

  const selectArm = useCallback(() => {
    // First, play any arm that hasn't been played
    for (let i = 0; i < numArms; i++) {
      if (pulls.current[i] === 0) return i;
    }

    // Otherwise, use UCB1 formula
    let maxUcb = -1;
    let bestArm = -1;
    for (let i = 0; i < numArms; i++) {
      const averageReward = rewards.current[i] / pulls.current[i];
      const explorationBonus = Math.sqrt((2 * Math.log(totalPulls.current)) / pulls.current[i]);
      const ucb = averageReward + explorationBonus;
      if (ucb > maxUcb) {
        maxUcb = ucb;
        bestArm = i;
      }
    }
    return bestArm;
  }, [numArms]);

  const update = useCallback((arm: number, reward: number) => {
    pulls.current[arm]++;
    rewards.current[arm] += reward;
    totalPulls.current++;
  }, []);

  return { selectArm, update };
};

const getDifficultyArm = (difficulty: number): number => {
  if (difficulty <= 0.33) return 0; // Easy
  if (difficulty <= 0.66) return 1; // Medium
  return 2; // Hard
};

// SM-2 Spaced Repetition Logic
const calculateSm2 = (item: Item, correct: boolean, confidence: number, latencyMs: number) => {
  const q =
    (correct ? 1 : 0) * (0.6 + 0.4 * confidence) * (1 - 0.2 * Math.min(1, latencyMs / 3000));

  const newEf = Math.max(1.3, item.ef + (0.1 - (1 - q) * (0.08 + (1 - q) * 0.02)));
  const newReps = correct ? item.reps + 1 : 0;

  let newIntervalDays: number;
  if (!correct || newReps <= 1) {
    newIntervalDays = 1;
  } else if (newReps === 2) {
    newIntervalDays = 6;
  } else {
    newIntervalDays = Math.min(3650, Math.round(item.intervalDays * newEf));
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newIntervalDays);

  return {
    ef: newEf,
    intervalDays: newIntervalDays,
    reps: newReps,
    nextReview: nextReviewDate.toISOString(),
  };
};

export const useQuiz = ({ apiBaseUrl }: UseQuizParams) => {
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allTags, setAllTags] = useState<ErrorTag[]>([]);
  const [feedback, setFeedback] = useState<{ correct: boolean; evidence?: string } | null>(null);
  const quizItems = useRef<Item[]>([]);

  const ucb1 = useUcb1(3);

  useEffect(() => {
    db.getAllErrorTags().then(setAllTags);
  }, []);

  const getNextItem = useCallback(async () => {
    setIsLoading(true);
    setFeedback(null);

    quizItems.current = await db.getAllItems();
    if (quizItems.current.length === 0) {
      setCurrentItem(null);
      setIsLoading(false);
      return;
    }

    const arm = ucb1.selectArm();
    const difficultyRanges = [
      [0, 0.33],
      [0.34, 0.66],
      [0.67, 1.0],
    ];
    const [min, max] = difficultyRanges[arm];

    let candidates = quizItems.current.filter(
      (item) => item.difficulty >= min && item.difficulty <= max,
    );
    if (candidates.length === 0) {
      // fallback to any item if bucket is empty
      candidates = quizItems.current;
    }

    const nextItem = candidates[Math.floor(Math.random() * candidates.length)];
    setCurrentItem(nextItem);
    setIsLoading(false);
  }, [ucb1]);

  const submitAnswer = useCallback(
    async (
      item: Item,
      answerIndex: number,
      confidence: number,
      latencyMs: number,
      errorTagIds: string[],
    ) => {
      const correct = item.answerIndex === answerIndex;

      // 1. Create and save attempt
      const attempt: Attempt = {
        id: `attempt_${Date.now()}`,
        itemId: item.id,
        correct,
        latencyMs,
        confidence,
        errorTagIds: correct ? [] : errorTagIds,
        createdAt: new Date().toISOString(),
      };
      await db.addAttempt(attempt);

      // 2. Update UCB1 bandit
      const reward = (correct ? 1 : 0) * (0.5 + 0.5 * confidence);
      ucb1.update(getDifficultyArm(item.difficulty), reward);

      // 3. Update SM-2 scheduling
      const scheduling = calculateSm2(item, correct, confidence, latencyMs);
      await db.updateItemScheduling(
        item.id,
        scheduling.ef,
        scheduling.intervalDays,
        scheduling.reps,
        scheduling.nextReview,
      );
      // Update item in local ref to reflect new scheduling
      const itemIndex = quizItems.current.findIndex((i) => i.id === item.id);
      if (itemIndex > -1) {
        quizItems.current[itemIndex] = { ...quizItems.current[itemIndex], ...scheduling };
      }

      // 4. Get evidence and show feedback
      try {
        const evidenceRes = await searchEvidence(apiBaseUrl, item.stem, 1);
        setFeedback({ correct, evidence: evidenceRes.hits[0]?.snippet });
      } catch (error) {
        console.error('Failed to fetch evidence:', error);
        setFeedback({ correct, evidence: MESSAGES.EVIDENCE_LOAD_FAILED });
      }
    },
    [apiBaseUrl, ucb1],
  );

  useEffect(() => {
    getNextItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { currentItem, isLoading, feedback, allTags, getNextItem, submitAnswer };
};
