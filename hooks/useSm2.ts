import { useCallback } from 'react';
import type { Item } from '../types';

export interface Sm2Result {
  ef: number;
  intervalDays: number;
  reps: number;
  nextReview: string;
}

export const useSm2 = () => {
  return useCallback(
    (item: Item, correct: boolean, confidence: number, latencyMs: number): Sm2Result => {
      const quality = (correct ? 1 : 0) * (0.6 + 0.4 * confidence) * (1 - 0.2 * Math.min(1, latencyMs / 3000));

      const updatedEf = Math.max(1.3, item.ef + (0.1 - (1 - quality) * (0.08 + (1 - quality) * 0.02)));
      const repetitions = correct ? item.reps + 1 : 0;

      let intervalDays: number;
      if (!correct || repetitions <= 1) {
        intervalDays = 1;
      } else if (repetitions === 2) {
        intervalDays = 6;
      } else {
        intervalDays = Math.min(3650, Math.round(item.intervalDays * updatedEf));
      }

      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);

      return {
        ef: updatedEf,
        intervalDays,
        reps: repetitions,
        nextReview: nextReviewDate.toISOString(),
      };
    },
    [],
  );
};
