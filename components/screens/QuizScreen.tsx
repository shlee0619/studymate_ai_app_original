
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import DOMPurify from 'dompurify';
import { useQuiz } from '../../hooks/useQuiz';
import type { ErrorTag } from '../../types';
import { MESSAGES } from '../../constants';
import { useApiUrl } from '../../contexts/ApiUrlContext';

const LoadingSpinner: React.FC = () => (
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
);

// Safe HTML renderer for evidence text
const SafeEvidenceRenderer: React.FC<{ text: string }> = ({ text }) => {
    const sanitizedHtml = useMemo(() => {
        const highlighted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-600 dark:text-emerald-400">$1</strong>');
        return DOMPurify.sanitize(highlighted, { ALLOWED_TAGS: ['strong', 'em', 'p', 'span', 'br'], ALLOWED_ATTR: ['class'] });
    }, [text]);

    return (
        <p
            className="text-gray-600 dark:text-gray-400 italic text-sm"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
    );
};

const ErrorTagSelector: React.FC<{ tags: ErrorTag[], selectedTags: string[], onToggleTag: (tagId: string) => void }> = ({ tags, selectedTags, onToggleTag }) => (
    <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
        <h4 className="font-semibold text-red-300 mb-2">{MESSAGES.ERROR_REASON_TITLE}</h4>
        <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
                <button
                    key={tag.id}
                    onClick={() => onToggleTag(tag.id)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        selectedTags.includes(tag.id) 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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
    
    useEffect(() => {
        if (currentItem) {
            startTime.current = Date.now();
            setSelectedOption(null);
            setConfidence(0.5);
            setSelectedErrorTags([]);
        }
    }, [currentItem]);
    
    const handleToggleErrorTag = useCallback((tagId: string) => {
        setSelectedErrorTags(prev => 
            prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
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
            // Can show a toast here to remind user to select tags
        }
        getNextItem({ refresh: true });
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
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
                <p className="text-gray-400 text-sm">{MESSAGES.DIFFICULTY_LABEL} {currentItem.difficulty.toFixed(2)}</p>
                <h3 className="text-xl font-medium mt-2 text-white">{currentItem.stem}</h3>
            </div>
            
            <div className="space-y-3">
                {currentItem.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => !feedback && setSelectedOption(index)}
                        disabled={!!feedback}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 
                            ${feedback ? 
                                (index === currentItem.answerIndex ? 'bg-emerald-800/50 border-emerald-500' : 
                                (index === selectedOption ? 'bg-red-800/50 border-red-500' : 'bg-gray-700 border-gray-600')) :
                                (selectedOption === index ? 'bg-indigo-700 border-indigo-500' : 'bg-gray-700 border-gray-600 hover:bg-gray-600')
                            }
                        `}
                    >
                        {option}
                    </button>
                ))}
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                <label htmlFor="confidence" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {MESSAGES.CONFIDENCE_LABEL} {Math.round(confidence * 100)}%
                </label>
                <input
                    id="confidence"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={confidence}
                    onChange={(e) => setConfidence(parseFloat(e.target.value))}
                    disabled={!!feedback}
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
                    <div className={`p-4 rounded-lg text-center font-bold ${feedback.correct ? 'bg-emerald-900/50 text-emerald-300' : 'bg-red-900/50 text-red-300'}`}>
                        {feedback.correct ? MESSAGES.CORRECT_ANSWER : MESSAGES.INCORRECT_ANSWER}
                    </div>

                    {feedback.evidence && (
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{MESSAGES.EVIDENCE_TITLE}</h4>
                            <SafeEvidenceRenderer text={feedback.evidence} />
                        </div>
                    )}

                    {!feedback.correct && <ErrorTagSelector tags={allTags} selectedTags={selectedErrorTags} onToggleTag={handleToggleErrorTag} />}

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
