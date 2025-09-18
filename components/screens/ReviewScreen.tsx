import React, { useState, useEffect } from 'react';
import { db } from '../../services/db';
import type { Item } from '../../types';
// Removed unused/broken import of useIsFocused (defined locally below)

const getInitialFocusState = () => {
  if (typeof document === 'undefined') {
    return true;
  }
  return document.hasFocus();
};

const useIsFocused = () => {
  const [isFocused, setIsFocused] = useState(getInitialFocusState());
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const onFocus = () => setIsFocused(true);
    const onBlur = () => setIsFocused(false);
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  }, []);
  return isFocused;
};

const calculateReviewScheduling = (item: Item, correct: boolean) => {
  const quality = correct ? 5 : 2;
  let newEf = item.ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  newEf = Math.max(1.3, newEf);

  const newReps = correct ? item.reps + 1 : 0;

  let newInterval: number;
  if (!correct || newReps <= 1) {
    newInterval = 1;
  } else if (newReps === 2) {
    newInterval = 6;
  } else {
    newInterval = Math.min(3650, Math.round(item.intervalDays * newEf));
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    ef: newEf,
    intervalDays: newInterval,
    reps: newReps,
    nextReview: nextReviewDate.toISOString(),
  };
};

export const ReviewScreen: React.FC = () => {
  const [dueItems, setDueItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewResults, setReviewResults] = useState<{ itemId: string; correct: boolean }[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchDueItems = async () => {
      setIsLoading(true);
      try {
        const items = await db.getDueItems();
        setDueItems(items);
        setCurrentIndex(0);
        setShowAnswer(false);
        setReviewMode(false);
        setReviewResults([]);
      } catch (error) {
        console.error('Failed to fetch due items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDueItems();
  }, [isFocused]);

  const handleReviewResponse = async (correct: boolean) => {
    const currentItem = dueItems[currentIndex];
    setReviewResults([...reviewResults, { itemId: currentItem.id, correct }]);

    const scheduling = calculateReviewScheduling(currentItem, correct);

    await db.updateItemScheduling(
      currentItem.id,
      scheduling.ef,
      scheduling.intervalDays,
      scheduling.reps,
      scheduling.nextReview,
    );

    // 다음 카드로 이동
    if (currentIndex < dueItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      // 복습 완료
      const correctCount = reviewResults.filter((r) => r.correct).length + (correct ? 1 : 0);
      alert(`복습 완료! ${correctCount}/${dueItems.length}개 정답`);
      setReviewMode(false);
      setCurrentIndex(0);
      setShowAnswer(false);
      // 리스트 새로고침
      const items = await db.getDueItems();
      setDueItems(items);
    }
  };
  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 0.33) return 'text-emerald-400';
    if (difficulty <= 0.66) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (isLoading) {
    return <div className="text-center text-gray-600 dark:text-gray-400">복습 항목 로딩 중...</div>;
  }

  if (dueItems.length === 0) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400">
        오늘 복습할 항목이 없습니다!
      </div>
    );
  }

  if (reviewMode && dueItems.length > 0) {
    const currentItem = dueItems[currentIndex];
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            복습 진행 중 ({currentIndex + 1}/{dueItems.length})
          </h2>
          <button
            onClick={() => setReviewMode(false)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕ 종료
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-300 dark:border-gray-700">
          <h3 className="text-xl mb-4 text-gray-800 dark:text-gray-200">{currentItem.stem}</h3>

          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors"
            >
              정답 확인
            </button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-md">
                <p className="font-medium text-green-800 dark:text-green-300 mb-2">정답:</p>
                <p className="text-gray-700 dark:text-gray-300">
                  {currentItem.options[currentItem.answerIndex]}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleReviewResponse(false)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition-colors"
                >
                  틀렸어요 ❌
                </button>
                <button
                  onClick={() => handleReviewResponse(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition-colors"
                >
                  맞았어요 ✅
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>난이도: {currentItem.difficulty.toFixed(2)}</span>
            <span>반복: {currentItem.reps}회</span>
            <span>EF: {currentItem.ef.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          오늘의 복습 항목 ({dueItems.length}개)
        </h2>
        <button
          onClick={() => setReviewMode(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors"
        >
          복습 시작
        </button>
      </div>
      {dueItems.map((item) => (
        <div
          key={item.id}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700"
        >
          <p className="text-gray-800 dark:text-white">{item.stem}</p>
          <div className="flex justify-between items-center mt-3 text-sm text-gray-600 dark:text-gray-400">
            <span className={`font-semibold ${getDifficultyColor(item.difficulty)}`}>
              난이도: {item.difficulty.toFixed(2)}
            </span>
            <span>반복: {item.reps}회</span>
          </div>
        </div>
      ))}
    </div>
  );
};
