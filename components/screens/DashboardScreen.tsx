import React, { useEffect, useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useToast } from "../../contexts/ToastContext";
import { useStudySnapshot } from "../../hooks/useStudySnapshot";
import type { ChallengeTemplate } from "../../types";

const LoadingState: React.FC = () => (
  <div className="flex items-center justify-center h-full py-24">
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500" />
      <p className="text-sm text-gray-500 dark:text-gray-400">Loading study insights...</p>
    </div>
  </div>
);

const ErrorState: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-12">
    <p className="text-sm text-red-500">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
    >
      Retry loading data
    </button>
  </div>
);

const formatShortDate = (value: string): string => {
  const date = new Date(value);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

const getCurrentWeekKey = (): string => {
  const now = new Date();
  const day = now.getDay() || 7;
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() - day + 1);
  return monday.toISOString().slice(0, 10);
};

const createChallengeTemplateMap = (templates: ChallengeTemplate[]): Map<string, ChallengeTemplate> => {
  const map = new Map<string, ChallengeTemplate>();
  templates.forEach((template) => {
    map.set(template.id, template);
  });
  return map;
};

export const DashboardScreen: React.FC = () => {
  const { showToast } = useToast();
  const { snapshot, loading, error, refresh } = useStudySnapshot();

  useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error, showToast]);

  const todayKey = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const currentWeekKey = useMemo(getCurrentWeekKey, []);

  const badgeCards = useMemo(() => {
    if (!snapshot) {
      return [];
    }

    const unlockedMap = new Map(snapshot.badges.unlocked.map((badge) => [badge.badgeId, badge]));
    return snapshot.badges.definitions.map((definition) => {
      const unlocked = unlockedMap.get(definition.id);
      return {
        definition,
        unlocked,
        isUnlocked: Boolean(unlocked),
        progressSnapshot: unlocked?.progressSnapshot,
      };
    });
  }, [snapshot]);

  const challengeDefinitions = useMemo(() => {
    if (!snapshot) {
      return new Map<string, ChallengeTemplate>();
    }
    return createChallengeTemplateMap(snapshot.challengeTemplates);
  }, [snapshot]);

  const activeChallenges = useMemo(() => {
    if (!snapshot) {
      return [];
    }

    const filtered = snapshot.challenges.filter((challenge) => {
      if (challenge.period === "daily") {
        return challenge.dateKey === todayKey;
      }
      return challenge.dateKey === currentWeekKey;
    });

    return filtered
      .map((challenge) => {
        const progressPct = Math.min(100, Math.round((challenge.progress / challenge.target) * 100));
        return {
          ...challenge,
          progressPct,
          template: challengeDefinitions.get(challenge.challengeId),
        };
      })
      .sort((a, b) => (b.progressPct ?? 0) - (a.progressPct ?? 0));
  }, [snapshot, challengeDefinitions, currentWeekKey, todayKey]);

  if (loading) {
    return <LoadingState />;
  }

  if (!snapshot) {
    if (error) {
      return <ErrorState message={error} onRetry={refresh} />;
    }
    return null;
  }

  const { totals, dailyMetrics, accuracyTrend, streak, recommendations } = snapshot;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Learning Dashboard</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Track your momentum, celebrate milestones, and follow the next best actions suggested by StudyMate AI.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Total Cards</p>
          <p className="text-2xl font-bold text-indigo-600">{totals.totalItems}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Accuracy</p>
          <p className="text-2xl font-bold text-emerald-600">{totals.correctRate}%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Today Reviewed</p>
          <p className="text-2xl font-bold text-blue-600">{totals.todayStudied}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Due for Review</p>
          <p className="text-2xl font-bold text-orange-500">{totals.dueForReview}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">Daily Study Momentum</h3>
            <span className="text-xs text-gray-500">Last {dailyMetrics.length} days</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyMetrics}>
                <defs>
                  <linearGradient id="studied" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tickFormatter={formatShortDate} stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={{ background: "#1f2937", borderRadius: 8, border: "none", color: "#f9fafb" }}
                  formatter={(value: number) => [`${value} cards`, "Reviewed"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area type="monotone" dataKey="studied" stroke="#4f46e5" fill="url(#studied)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3">Accuracy Trend</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accuracyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tickFormatter={formatShortDate} stroke="#9ca3af" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: "#1f2937", borderRadius: 8, border: "none", color: "#f9fafb" }}
                  formatter={(value: number) => [`${value}%`, "Accuracy"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Bar dataKey="accuracy" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-2">Streak Tracker</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Keep your momentum. Protect your current streak or push for a new personal best.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md">
              <p className="text-xs text-indigo-600 dark:text-indigo-300">Current streak</p>
              <p className="text-xl font-semibold text-indigo-700 dark:text-indigo-200">{streak.current} days</p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-md">
              <p className="text-xs text-emerald-600 dark:text-emerald-300">Best streak</p>
              <p className="text-xl font-semibold text-emerald-700 dark:text-emerald-200">{streak.longest} days</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3">Achievement Badges</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {badgeCards.map(({ definition, isUnlocked, unlocked, progressSnapshot }) => (
              <div
                key={definition.id}
                className={`rounded-md border p-3 text-sm ${
                  isUnlocked
                    ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30"
                    : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                }`}
              >
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">{definition.title}</p>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">{definition.description}</p>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {isUnlocked ? (
                    <span>Unlocked {new Date(unlocked?.unlockedAt ?? "").toLocaleDateString()}</span>
                  ) : (
                    <span>Target: {definition.threshold}</span>
                  )}
                </div>
                {progressSnapshot !== undefined && (
                  <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-300">
                    Snapshot: {progressSnapshot}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">Active Challenges</h3>
            <span className="text-xs text-gray-400">Daily & Weekly</span>
          </div>
          {activeChallenges.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Fresh challenges will appear after your next study session.
            </p>
          ) : (
            <div className="space-y-3">
              {activeChallenges.map((challenge) => (
                <div key={challenge.id} className="border border-gray-200 dark:border-gray-700 rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {challenge.template?.title ?? challenge.challengeId}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {challenge.template?.description ?? "Stay focused and keep progressing."}
                      </p>
                    </div>
                    <span className="text-xs text-indigo-500 uppercase">
                      {challenge.period === "daily" ? "Daily" : "Weekly"}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-2 ${challenge.progressPct >= 100 ? "bg-emerald-500" : "bg-indigo-500"}`}
                        style={{ width: `${challenge.progressPct}%` }}
                      />
                    </div>
                    <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        {challenge.progress}/{challenge.target}
                      </span>
                      {challenge.completedAt && <span>Completed</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3">Recommended Focus</h3>
          {recommendations.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You are fully on track. Consider exploring new concepts.
            </p>
          ) : (
            <div className="space-y-3">
              {recommendations.map((recommendation) => (
                <div key={recommendation.id} className="border border-gray-200 dark:border-gray-700 rounded-md p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{recommendation.title}</p>
                    <span
                      className={`text-xs font-semibold ${
                        recommendation.urgency === "overdue"
                          ? "text-red-500"
                          : recommendation.urgency === "today"
                            ? "text-orange-500"
                            : "text-emerald-500"
                      }`}
                    >
                      {recommendation.urgency.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{recommendation.description}</p>
                  <div className="mt-2 text-xs text-gray-400">
                    {recommendation.itemCount > 0 && (
                      <span>{recommendation.itemCount} cards affected</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
