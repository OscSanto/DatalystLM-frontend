// --- Auth ---
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
}

// --- Practice ---
export type Topic = "ML" | "SQL" | "STATISTICS" | "PYTHON";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface QuestionResponse {
  questionId: number;
  text: string;
  topic: Topic;
  difficulty: Difficulty;
  keywords: string[];
  timeLimitSeconds: number;
}

export interface AnswerRequest {
  questionId: number;
  transcribedAnswer: string;
  durationSeconds: number;
  pauseCount: number;
  confidenceScore: number;
}

export interface VoiceMetrics {
  wordsPerMinute: number;
  fillerWordCount: number;
  confidenceScore: number;
  durationSeconds: number;
  pauseCount: number;
  totalWordCount: number;
  keywordDensityScore: number;
}

export interface QuestionStats {
  attemptCount: number;
  meanScore: number;
  stdDev: number;
}

export interface HistoryItem {
  resultId: number;
  questionText: string;
  topic: Topic;
  difficulty: Difficulty;
  score: number | null;
  isOutlier: boolean;
  keywordsHit: string | null;
  wordsPerMinute: number | null;
  durationSeconds: number | null;
  createdAt: string | null;
}

export interface LLMFeedback {
  concepts: string;
  accuracy: string;
  missing: string;
  tip: string;
}

export interface FeedbackResponse {
  resultId: number | null;
  score: number | null;
  isOutlier: boolean;
  llmFeedBack: LLMFeedback | null;  // structured — null for FREE tier and outliers
  subscriptionTier: string;          // "FREE" | "PRO" — tier at time of submission
  questionText: string | null;
  transcribedAnswer: string | null;
  keyWordHit: string[];
  keyWordMiss: string[];
  voiceMetrics: VoiceMetrics;
  stats: QuestionStats | null;
  matchedIdealAnswerText: string | null;
}
