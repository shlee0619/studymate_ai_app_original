import type { BadgeDefinition, ChallengeTemplate, ErrorTag, StudyStreak } from './types';

export const DB_NAME = 'StudyMateAIDB';
export const DB_VERSION = 3;
export const STORE_ITEMS = 'Items';
export const STORE_ATTEMPTS = 'Attempts';
export const STORE_ERRORTAGS = 'ErrorTags';
export const STORE_CONCEPTS = 'Concepts';
export const STORE_EVIDENCES = 'Evidences';
export const STORE_GOALS = 'Goals';
export const STORE_BADGES = 'Badges';
export const STORE_STREAKS = 'Streaks';
export const STORE_CHALLENGES = 'Challenges';

export const SAMPLE_TEXT = `Photosynthesis is a process used by plants, algae, and certain bacteria to convert light energy into chemical energy, through a process that converts carbon dioxide and water into glucose (a sugar) and oxygen. The overall chemical equation for photosynthesis is 6CO2 + 6H2O + Light Energy -> C6H12O6 + 6O2. This process is crucial for life on Earth as it produces most of the oxygen in the atmosphere. The process occurs in two stages: the light-dependent reactions and the light-independent reactions (Calvin cycle). The light-dependent reactions take place in the thylakoid membranes of chloroplasts and use light energy to make ATP and NADPH. The Calvin cycle occurs in the stroma of the chloroplasts and uses the energy from ATP and NADPH to convert CO2 into glucose.`;

export const INITIAL_ERROR_TAGS: ErrorTag[] = [
  { id: 'misread', name: 'Misread the question' },
  { id: 'calculation_error', name: 'Calculation Error' },
  { id: 'forgot_formula', name: 'Forgot Formula' },
  { id: 'conceptual_misunderstanding', name: 'Conceptual Misunderstanding' },
  { id: 'careless_mistake', name: 'Careless Mistake' },
];

export const DEFAULT_STREAK: StudyStreak = {
  id: 'global',
  current: 0,
  longest: 0,
  lastStudyDate: null,
};

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'streak_starter',
    title: 'Streak Starter',
    description: 'Maintain a study streak for three consecutive days.',
    category: 'streak',
    icon: 'streak-3',
    metric: 'streakDays',
    threshold: 3,
  },
  {
    id: 'weekly_warrior',
    title: 'Weekly Warrior',
    description: 'Complete five study sessions within a week.',
    category: 'momentum',
    icon: 'calendar-5',
    metric: 'weeklyStudySessions',
    threshold: 5,
  },
  {
    id: 'accuracy_ace',
    title: 'Accuracy Ace',
    description: 'Reach an average accuracy of 85% in a rolling week.',
    category: 'mastery',
    icon: 'accuracy-85',
    metric: 'accuracy',
    threshold: 85,
  },
  {
    id: 'challenge_champion',
    title: 'Challenge Champion',
    description: 'Finish three weekly challenges.',
    category: 'challenge',
    icon: 'trophy-3',
    metric: 'challengeCompletions',
    threshold: 3,
  },
];

export const CHALLENGE_TEMPLATES: ChallengeTemplate[] = [
  {
    id: 'daily_cards_15',
    title: 'Daily Momentum',
    description: 'Review fifteen cards today.',
    period: 'daily',
    metric: 'cardsReviewed',
    target: 15,
  },
  {
    id: 'daily_streak_lock',
    title: 'Keep The Chain',
    description: 'Log any study activity today to protect your streak.',
    period: 'daily',
    metric: 'streak',
    target: 1,
  },
  {
    id: 'weekly_accuracy_focus',
    title: 'Sharpen Accuracy',
    description: 'Finish the week with at least 80% accuracy.',
    period: 'weekly',
    metric: 'accuracy',
    target: 80,
  },
  {
    id: 'weekly_sessions_5',
    title: 'Consistency Five',
    description: 'Complete five study sessions this week.',
    period: 'weekly',
    metric: 'studySessions',
    target: 5,
  },
];

export const SCHEDULE_LOOKBACK_DAYS = 14;

export const MESSAGES = {
  EVIDENCE_LOAD_FAILED: 'Failed to load evidence.',
  NO_QUIZ_ITEMS: 'No quiz items available.',
  ADD_NOTES_INSTRUCTION: 'Please add notes in the \'Library\' tab and run \'Auto Card Generation\'.',
  DIFFICULTY_LABEL: 'Difficulty:',
  CONFIDENCE_LABEL: 'Confidence:',
  SUBMIT_BUTTON: 'Submit',
  NEXT_QUESTION_BUTTON: 'Next Question',
  CORRECT_ANSWER: 'Correct!',
  INCORRECT_ANSWER: 'Incorrect.',
  EVIDENCE_TITLE: 'Related Evidence',
  ERROR_REASON_TITLE: 'Please select the reason for the incorrect answer (multiple selection allowed)'
} as const;
