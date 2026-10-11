export type LessonId = 'lesson-1' | 'lesson-2' | 'lesson-3';

export type TabType = 'overview' | 'simulation' | 'quiz' | 'game';

export interface Lesson {
  id: LessonId;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  durationMinutes: number;
  learningOutcomes: string[];
  cambridgeCode: string;
  color: string;
  iconName: string;
}

export interface Question {
  id: string;
  lessonId: LessonId;
  type: 'mcq' | 'fill' | 'drag-match';
  questionText: string;
  contextText?: string;
  imageOrDiagram?: string;
  options?: string[];
  correctAnswer: string | number | Record<string, string>;
  explanation: string;
  geometricReason?: string;
  points: number;
  hint: string;
}

export interface CheckpointQuestion {
  id: string;
  xpThreshold: number;
  title: string;
  subtitle: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  rewardBadges: string;
  explanation: string;
  bonusPoints: number;
}

export interface StudentState {
  name: string;
  grade: string;
  school: string;
  totalXp: number;
  level: number;
  levelTitle: string;
  completedLessons: LessonId[];
  answeredQuestions: Record<string, boolean>;
  solvedCheckpoints: string[];
  gameHighScores: {
    game1: number;
    game2: number;
    game3: number;
  };
  unlockedBadges: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpRequired: number;
}
