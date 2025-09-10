
export interface Item {
  id: string;
  stem: string;
  options: string[];
  answerIndex: number;
  conceptId?: string;
  difficulty: number; // 0.0 to 1.0
  sourceRef?: string;
  ef: number; // easiness factor
  intervalDays: number;
  reps: number;
  nextReview?: string; // ISO string
}

export interface Attempt {
  id: string;
  itemId: string;
  correct: boolean;
  latencyMs: number;
  confidence: number; // 0.0 to 1.0
  errorTagIds: string[];
  createdAt: string; // ISO string
}

export interface ErrorTag {
  id: string;
  name: string;
  pattern?: string;
  notes?: string;
}

export interface Concept {
  id: string;
  title: string;
  prereqIds: string[];
  mastery: number;
}

export interface Evidence {
  id: string;
  itemId: string;
  sourceUri?: string;
  snippet: string;
  offsets?: [number, number];
}

export interface ErrorTagHistogram {
  [tagId: string]: {
    name: string;
    count: number;
  };
}

export interface SearchHit {
  snippet: string;
  sourceUri?: string;
  offsets?: [number, number];
}

export type Screen = 'dashboard' | 'library' | 'quiz' | 'review' | 'errors' | 'concepts' | 'settings';
