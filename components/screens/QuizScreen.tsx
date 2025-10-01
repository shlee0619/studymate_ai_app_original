import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import DOMPurify from "dompurify";
import { useQuiz } from "../../hooks/useQuiz";
import type { ErrorTag } from "../../types";
import { MESSAGES, BADGE_DEFINITIONS, CHALLENGE_TEMPLATES } from "../../constants";
import { useApiUrl } from "../../contexts/ApiUrlContext";

const LoadingSpinner: React.FC = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400" />
);

const SafeEvidenceRenderer: React.FC<{ text: string }> = ({ text }) => {
  const sanitizedHtml = useMemo(() => {
    const highlighted = text.replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="text-emerald-600 dark:text-emerald-400">$1</strong>',
    );
    return DOMPurify.sanitize(highlighted, {
      ALLOWED_TAGS: ["strong", "em", "p", "span", "br"],
      ALLOWED_ATTR: ["class"],
    });
  }, [text]);

  return (
    <p
      className="text-gray-600 dark:text-gray-400 italic text-sm"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

const ErrorTagSelector: React.FC<{
  tags: ErrorTag[];
  selectedTags: string[];
  onToggleTag: (tagId: string) => void;
}> = ({ tags, selectedTags, onToggleTag }) => (
  <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
    <h4 className="font-semibold text-red-300 mb-2">{MESSAGES.ERROR_REASON_TITLE}</h4>
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => onToggleTag(tag.id)}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            selectedTags.includes(tag.id)
              ? "bg-red-500 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          {tag.name}
        </button>
      ))}
    </div>
  </div>
);

export const QuizScreen: React.FC = () => {
  const { apiBaseUrl } = useApiUrl();
  const { currentItem, isLoading, feedback, allTags, getNextItem, submitAnswer } = useQuiz({ apiBaseUrl });
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confidence, setConfidence] = useState(0.5);
  const [selectedErrorTags, setSelectedErrorTags] = useState<string[]>([]);
  const startTime = useRef<number>(0);

  const badgeDefinitionMap = useMemo(
    () => new Map(BADGE_DEFINITIONS.map((definition) => [definition.id, definition])),
    [],
  );
  const challengeDefinitionMap = useMemo(
    () => new Map(CHALLENGE_TEMPLATES.map((template) => [template.id, template])),
    [],
  );

  useEffect(() => {
    if (currentItem) {
      startTime.current = Date.now();
      setSelectedOption(null);
      setConfidence(0.5);
      setSelectedErrorTags([]);
    }
  }, [currentItem]);

  const handleToggleErrorTag = useCallback((tagId: string) => {
    setSelectedErrorTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId],
    );
  }, []);

  const handleSubmit = () => {
    if (currentItem && selectedOption !== null) {
      const latencyMs = Date.now() - startTime.current;
      submitAnswer(currentItem, selectedOption, confidence, latencyMs, selectedErrorTags);
    }
  };

  const handleNext = () => {
    if (feedback && !feedback.correct && selectedErrorTags.length === 0) {
      // Optional: surface a toast reminding the learner to tag their mistake
    }
    getNextItem({ refresh: true });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400">
        <p>{MESSAGES.NO_QUIZ_ITEMS}</p>
        <p className="mt-2 text-sm">{MESSAGES.ADD_NOTES_INSTRUCTION}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-5 bg-gray-800 rounded-lg shadow-lg">
        <p className="text-gray-400 text-sm">
          {MESSAGES.DIFFICULTY_LABEL} {currentItem.difficulty.toFixed(2)}
        </p>
        <h3 className="text-xl font-medium mt-2 text-white">{currentItem.stem}</h3>
      </div>

      <div className="space-y-3">
        {currentItem.options.map((option, index) => {
          const isSelected = selectedOption === index;
          const isCorrectChoice = feedback ? index === currentItem.answerIndex : false;
          const isWrongSelection = feedback && isSelected && !isCorrectChoice;

          const baseClasses = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200";
          const stateClasses = feedback
            ? isCorrectChoice
              ? "bg-emerald-800/50 border-emerald-500"
              : isWrongSelection
                ? "bg-red-800/50 border-red-500"
                : "bg-gray-700 border-gray-600"
            : isSelected
              ? "bg-indigo-700 border-indigo-500"
              : "bg-gray-700 border-gray-600 hover:bg-gray-600";

          return (
            <button
              key={index}
              onClick={() => !feedback && setSelectedOption(index)}
              disabled={Boolean(feedback)}
              className={`${baseClasses} ${stateClasses}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
        <label
          htmlFor="confidence"
          className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {MESSAGES.CONFIDENCE_LABEL} {Math.round(confidence * 100)}%
        </label>
        <input
          id="confidence"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={confidence}
          onChange={(event) => setConfidence(parseFloat(event.target.value))}
          disabled={Boolean(feedback)}
          className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {!feedback ? (
        <button
          onClick={handleSubmit}
          disabled={selectedOption === null}
          className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          {MESSAGES.SUBMIT_BUTTON}
        </button>
      ) : (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-lg text-center font-bold ${
              feedback.correct
                ? "bg-emerald-900/50 text-emerald-300"
                : "bg-red-900/50 text-red-300"
            }`}
          >
            {feedback.correct ? MESSAGES.CORRECT_ANSWER : MESSAGES.INCORRECT_ANSWER}
          </div>

          {feedback.evidence && (
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {MESSAGES.EVIDENCE_TITLE}
              </h4>
              <SafeEvidenceRenderer text={feedback.evidence} />
            </div>
          )}

          {feedback.aiFeedback && (
            <div className="p-4 bg-indigo-900/20 border border-indigo-500/40 rounded-lg">
              <h4 className="font-semibold text-indigo-200 mb-2">AI Tutor Feedback</h4>
              <p className="text-sm text-indigo-100">{feedback.aiFeedback.explanation}</p>
              {feedback.aiFeedback.focusConcepts?.length ? (
                <div className="mt-2">
                  <p className="text-xs text-indigo-200 uppercase tracking-wide mb-1">Focus concepts</p>
                  <ul className="text-xs text-indigo-100 list-disc list-inside space-y-1">
                    {feedback.aiFeedback.focusConcepts.map((concept) => (
                      <li key={concept}>{concept}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {feedback.aiFeedback.suggestedResources?.length ? (
                <div className="mt-2">
                  <p className="text-xs text-indigo-200 uppercase tracking-wide mb-1">
                    Suggested next steps
                  </p>
                  <ul className="text-xs text-indigo-100 list-disc list-inside space-y-1">
                    {feedback.aiFeedback.suggestedResources.map((resource) => (
                      <li key={resource}>{resource}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {feedback.aiFeedback.followUpPrompt && (
                <p className="mt-2 text-xs text-indigo-200 italic">
                  {feedback.aiFeedback.followUpPrompt}
                </p>
              )}
            </div>
          )}

          {feedback.streak && (
            <div className="p-3 bg-blue-900/20 border border-blue-500/40 rounded-lg text-xs text-blue-100">
              <p>
                Current streak: <span className="font-semibold">{feedback.streak.current} days</span> (personal best {feedback.streak.longest}).
              </p>
            </div>
          )}

          {feedback.earnedBadges?.length ? (
            <div className="p-3 bg-emerald-900/20 border border-emerald-500/40 rounded-lg">
              <p className="text-sm font-semibold text-emerald-200">New achievements unlocked</p>
              <ul className="mt-2 space-y-1 text-xs text-emerald-100">
                {feedback.earnedBadges.map((badge) => {
                  const definition = badgeDefinitionMap.get(badge.badgeId);
                  return (
                    <li key={badge.id}>
                      {definition?.title ?? badge.badgeId} - keep up the momentum!
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {feedback.challengeUpdates?.length ? (
            <div className="p-3 bg-amber-900/20 border border-amber-500/40 rounded-lg space-y-2">
              <p className="text-sm font-semibold text-amber-200">Challenge progress</p>
              {feedback.challengeUpdates.map((challenge) => {
                const template = challengeDefinitionMap.get(challenge.challengeId);
                const progressPct = Math.min(
                  100,
                  Math.round((challenge.progress / challenge.target) * 100),
                );
                return (
                  <div key={challenge.id}>
                    <div className="flex items-center justify-between text-xs text-amber-100">
                      <span>{template?.title ?? challenge.challengeId}</span>
                      <span>{progressPct}%</span>
                    </div>
                    <div className="h-1.5 bg-amber-500/30 rounded-full mt-1">
                      <div
                        className="h-1.5 bg-amber-400 rounded-full"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          {!feedback.correct && (
            <ErrorTagSelector
              tags={allTags}
              selectedTags={selectedErrorTags}
              onToggleTag={handleToggleErrorTag}
            />
          )}

          <button
            onClick={handleNext}
            className="w-full py-3 px-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors"
          >
            {MESSAGES.NEXT_QUESTION_BUTTON}
          </button>
        </div>
      )}
    </div>
  );
};
