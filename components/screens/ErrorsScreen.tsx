import React, { useState, useEffect } from 'react';
import { db } from '../../services/db';
import type { ErrorTagHistogram, Item, Attempt } from '../../types';

export const ErrorsScreen: React.FC = () => {
  const [histogram, setHistogram] = useState<ErrorTagHistogram | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalErrors, setTotalErrors] = useState(0);
  const [incorrectItems, setIncorrectItems] = useState<Item[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizResults, setQuizResults] = useState<boolean[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await db.getErrorTagHistogram();
        setHistogram(data);
        const total = Object.values(data).reduce((sum, tag) => sum + (tag as { count: number }).count, 0);
        setTotalErrors(total);
        
        // 오답 항목 가져오기
        const attempts = await db.getAllAttempts();
        const incorrectAttempts = attempts.filter(a => !a.correct);
        const incorrectItemIds = [...new Set(incorrectAttempts.map(a => a.itemId))];
        
        const allItems = await db.getAllItems();
        const incorrectItemsList = allItems.filter(item => incorrectItemIds.includes(item.id));
        setIncorrectItems(incorrectItemsList);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const startQuiz = () => {
    if (incorrectItems.length > 0) {
      setShowQuiz(true);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setQuizResults([]);
    }
  };

  const handleAnswer = () => {
    if (selectedAnswer === null) return;
    
    const currentItem = incorrectItems[currentQuestion];
    const isCorrect = selectedAnswer === currentItem.answerIndex;
    setQuizResults([...quizResults, isCorrect]);
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < incorrectItems.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // 퀴즈 종료
      const correctCount = quizResults.filter(r => r).length;
      alert(`퀴즈 완료! ${correctCount}/${incorrectItems.length} 개 정답`);
      setShowQuiz(false);
    }
  };

  if (isLoading) {
    return <div className="text-center text-gray-600 dark:text-gray-400">오답 데이터 분석 중...</div>;
  }
  
  if (!histogram || totalErrors === 0) {
      return <div className="text-center text-gray-600 dark:text-gray-400">기록된 오답이 없습니다.</div>;
  }

  if (showQuiz && incorrectItems.length > 0) {
    const currentItem = incorrectItems[currentQuestion];
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">오답 노트 퀴즈</h2>
          <button 
            onClick={() => setShowQuiz(false)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕ 닫기
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-300 dark:border-gray-700">
          <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            문제 {currentQuestion + 1} / {incorrectItems.length}
          </div>
          
          <h3 className="text-lg mb-4 text-gray-800 dark:text-gray-200">{currentItem.stem}</h3>
          
          <div className="space-y-2 mb-4">
            {currentItem.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => !showResult && setSelectedAnswer(idx)}
                disabled={showResult}
                className={`w-full text-left p-3 rounded-md border transition-colors ${
                  showResult && idx === currentItem.answerIndex
                    ? 'bg-green-100 dark:bg-green-900 border-green-500'
                    : showResult && idx === selectedAnswer && idx !== currentItem.answerIndex
                    ? 'bg-red-100 dark:bg-red-900 border-red-500'
                    : selectedAnswer === idx
                    ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-500'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          
          {!showResult ? (
            <button
              onClick={handleAnswer}
              disabled={selectedAnswer === null}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              제출
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition-colors"
            >
              {currentQuestion < incorrectItems.length - 1 ? '다음 문제' : '퀴즈 종료'}
            </button>
          )}
        </div>
      </div>
    );
  }

  // FIX: Cast Object.entries result to a typed array to help TypeScript infer correct types for `a`, `b`, and `data` in subsequent operations.
  // This resolves errors where properties `count` and `name` were accessed on type `unknown`.
  const sortedTags = (Object.entries(histogram) as [string, { name: string; count: number }][]).sort(([, a], [, b]) => b.count - a.count);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">오답 유형 분석</h2>
        {incorrectItems.length > 0 && (
          <button
            onClick={startQuiz}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors text-sm"
          >
            오답 노트 퀴즈 ({incorrectItems.length}문제)
          </button>
        )}
      </div>
      
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
        {sortedTags.map(([tagId, data]) => {
          const percentage = totalErrors > 0 ? (data.count / totalErrors) * 100 : 0;
          return (
            <div key={tagId} className="mb-4 last:mb-0">
              <div className="flex justify-between items-center mb-1 text-sm text-gray-700 dark:text-gray-300">
                <span>{data.name}</span>
                <span>{data.count}회 ({percentage.toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
