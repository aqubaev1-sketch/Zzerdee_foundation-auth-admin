export type Subject = 'history' | 'reading' | 'math';
export type AnswerType = 'single' | 'multiple';

// --- users/{userId} ---
export interface UserDoc {
  role: 'student' | 'admin'; // справочное поле для UI; реальная роль — только custom claim
  bestScore: number;
  lastScore: number;
  totalAttempts: number;
  lastAttemptAt: string | null; // ISO string
  subjectBestScores: Record<Subject, number>;
}

// --- questions/{questionId} — ПОЛНЫЙ документ, виден только админу ---
export interface QuestionDoc {
  subject: Subject;
  text: string;
  imageUrl?: string;
  answerType: AnswerType;
  options: string[];
  // single -> number; multiple -> number[]
  correctAnswer: number | number[];
  explanation: string;
  tags: string[];
  createdAt: string;
  createdBy: string;
}

// --- questions/{questionId} — версия БЕЗ ключа, которую видит студент во время теста ---
export type PublicQuestion = Pick<QuestionDoc, 'subject' | 'text' | 'imageUrl' | 'answerType' | 'options'> & {
  id: string;
};

// --- customTests/{testId} ---
export interface CustomTestDoc {
  title: string;
  isPublished: boolean;
  publishAt: string | null; // ISO string; для отложенной публикации
  questionIds: Record<Subject, string[]>; // сгруппировано по предмету, а не плоский массив
  createdAt: string;
  createdBy: string;
}

// --- entAttempts/{attemptId} ---
export interface EntAttemptDoc {
  userId: string;
  testType: 'random' | `customTest_${string}`;
  startedAt: string;
  expiresAt: string;
  status: 'in_progress' | 'completed' | 'timed_out';
  questionIds: string[];
  answers: Record<string, number | number[]>;
  result: {
    totalScore: number;
    maxScore: number;
    percentage: number;
    isNewRecord: boolean;
    bySubject: Record<Subject, { score: number; total: number }>;
  } | null;
}

export const SUBJECT_LABELS: Record<Subject, string> = {
  history: 'Қазақстан тарихы',
  reading: 'Оқу сауаттылығы',
  math: 'Математикалық сауаттылық',
};

export const SUBJECT_QUESTION_COUNTS: Record<Subject, number> = {
  history: 20,
  reading: 10,
  math: 10,
};

export const ATTEMPT_DURATION_MINUTES = 90;
