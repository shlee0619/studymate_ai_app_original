import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../../services/db';
import type { Item, Attempt } from '../../types';

interface StudyGoal {
  id: string;
  type: 'daily' | 'weekly';
  target: number;
  category: 'study' | 'review';
  createdAt: string;
}

interface DashboardScreenProps {
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ showToast }) => {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalAttempts: 0,
    correctRate: 0,
    todayStudied: 0,
    weekStudied: 0,
    dueForReview: 0
  });
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [newGoal, setNewGoal] = useState<Partial<StudyGoal>>({
    type: 'daily',
    category: 'study',
    target: 20
  });

  const loadStats = useCallback(async () => {
    try {
      const items = await db.getAllItems();
      const attempts = await db.getAllAttempts();
      const dueItems = await db.getDueItems();

      const today = new Date().toDateString();
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const todayAttempts = attempts.filter(a => 
        new Date(a.createdAt).toDateString() === today
      );

      const weekAttempts = attempts.filter(a => 
        new Date(a.createdAt) >= weekAgo
      );

      const correctAttempts = attempts.filter(a => a.correct);
      const correctRate = attempts.length > 0 
        ? (correctAttempts.length / attempts.length) * 100 
        : 0;

      setStats({
        totalItems: items.length,
        totalAttempts: attempts.length,
        correctRate: Math.round(correctRate),
        todayStudied: todayAttempts.length,
        weekStudied: weekAttempts.length,
        dueForReview: dueItems.length
      });

      // Load goals from localStorage
      const savedGoals = localStorage.getItem('studyGoals');
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
      showToast('통계 로드에 실패했습니다.', 'error');
    }
  }, [showToast]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleAddGoal = () => {
    if (!newGoal.target || newGoal.target <= 0) {
      showToast('유효한 목표 수치를 입력해주세요.', 'error');
      return;
    }

    const goal: StudyGoal = {
      id: `goal_${Date.now()}`,
      type: newGoal.type || 'daily',
      category: newGoal.category || 'study',
      target: newGoal.target,
      createdAt: new Date().toISOString()
    };

    const updatedGoals = [...goals, goal];
    setGoals(updatedGoals);
    localStorage.setItem('studyGoals', JSON.stringify(updatedGoals));
    
    setNewGoal({ type: 'daily', category: 'study', target: 20 });
    showToast('목표가 추가되었습니다.', 'success');
  };

  const handleDeleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter(g => g.id !== goalId);
    setGoals(updatedGoals);
    localStorage.setItem('studyGoals', JSON.stringify(updatedGoals));
    showToast('목표가 삭제되었습니다.', 'success');
  };

  const getGoalProgress = (goal: StudyGoal) => {
    if (goal.type === 'daily' && goal.category === 'study') {
      return (stats.todayStudied / goal.target) * 100;
    } else if (goal.type === 'weekly' && goal.category === 'study') {
      return (stats.weekStudied / goal.target) * 100;
    } else if (goal.category === 'review') {
      const reviewed = goal.type === 'daily' ? stats.todayStudied : stats.weekStudied;
      return (reviewed / goal.target) * 100;
    }
    return 0;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 70) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">학습 대시보드</h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">전체 카드</p>
          <p className="text-2xl font-bold text-indigo-600">{stats.totalItems}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">정답률</p>
          <p className="text-2xl font-bold text-green-600">{stats.correctRate}%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">오늘 학습</p>
          <p className="text-2xl font-bold text-blue-600">{stats.todayStudied}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">복습 대기</p>
          <p className="text-2xl font-bold text-orange-600">{stats.dueForReview}</p>
        </div>
      </div>

      {/* Study Goals */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-300 dark:border-gray-700">
        <h3 className="text-md font-medium text-gray-600 dark:text-gray-400 mb-3">학습 목표</h3>
        
        {/* Add New Goal */}
        <div className="flex gap-2 mb-4">
          <select
            value={newGoal.type}
            onChange={(e) => setNewGoal({...newGoal, type: e.target.value as 'daily' | 'weekly'})}
            className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white"
          >
            <option value="daily">일일</option>
            <option value="weekly">주간</option>
          </select>
          <select
            value={newGoal.category}
            onChange={(e) => setNewGoal({...newGoal, category: e.target.value as 'study' | 'review'})}
            className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white"
          >
            <option value="study">학습</option>
            <option value="review">복습</option>
          </select>
          <input
            type="number"
            value={newGoal.target}
            onChange={(e) => setNewGoal({...newGoal, target: parseInt(e.target.value)})}
            className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white w-20"
            min="1"
          />
          <button
            onClick={handleAddGoal}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors"
          >
            추가
          </button>
        </div>

        {/* Goals List */}
        {goals.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">설정된 목표가 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {goals.map(goal => {
              const progress = Math.min(100, Math.round(getGoalProgress(goal)));
              const current = goal.type === 'daily' 
                ? (goal.category === 'study' ? stats.todayStudied : stats.todayStudied)
                : (goal.category === 'study' ? stats.weekStudied : stats.weekStudied);

              return (
                <div key={goal.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {goal.type === 'daily' ? '일일' : '주간'} {goal.category === 'study' ? '학습' : '복습'} 목표
                    </span>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-red-500 hover:text-red-600 text-sm"
                    >
                      삭제
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${getProgressColor(progress)}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {current}/{goal.target} ({progress}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Weekly Chart (Simple Text-based) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-300 dark:border-gray-700">
        <h3 className="text-md font-medium text-gray-600 dark:text-gray-400 mb-3">주간 학습 요약</h3>
        <div className="text-center">
          <p className="text-3xl font-bold text-indigo-600">{stats.weekStudied}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">최근 7일간 학습한 카드</p>
        </div>
      </div>
    </div>
  );
};