
import type { ErrorTag } from './types';

export const DB_NAME = 'StudyMateAIDB';
export const DB_VERSION = 2;
export const STORE_ITEMS = 'Items';
export const STORE_ATTEMPTS = 'Attempts';
export const STORE_ERRORTAGS = 'ErrorTags';
export const STORE_CONCEPTS = 'Concepts';
export const STORE_EVIDENCES = 'Evidences';
export const STORE_GOALS = 'Goals';

export const SAMPLE_TEXT = `Photosynthesis is a process used by plants, algae, and certain bacteria to convert light energy into chemical energy, through a process that converts carbon dioxide and water into glucose (a sugar) and oxygen. The overall chemical equation for photosynthesis is 6CO2 + 6H2O + Light Energy ??C6H12O6 + 6O2. This process is crucial for life on Earth as it produces most of the oxygen in the atmosphere. The process occurs in two stages: the light-dependent reactions and the light-independent reactions (Calvin cycle). The light-dependent reactions take place in the thylakoid membranes of chloroplasts and use light energy to make ATP and NADPH. The Calvin cycle occurs in the stroma of the chloroplasts and uses the energy from ATP and NADPH to convert CO2 into glucose.`;

export const INITIAL_ERROR_TAGS: ErrorTag[] = [
  { id: 'misread', name: 'Misread the question' },
  { id: 'calculation_error', name: 'Calculation Error' },
  { id: 'forgot_formula', name: 'Forgot Formula' },
  { id: 'conceptual_misunderstanding', name: 'Conceptual Misunderstanding' },
  { id: 'careless_mistake', name: 'Careless Mistake' },
];

// UI Messages
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
