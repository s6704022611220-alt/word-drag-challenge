export type GameMode = 'all' | 'typing' | 'drag_drop' | 'keyboard_arrows';

export type QuestionType = 'typing' | 'drag_drop' | 'keyboard_arrows';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  title: string;
  instruction: string;
  category: string;
  explanation: string;
  timeLimitSeconds?: number;
}

export interface TypingQuestionData extends BaseQuestion {
  type: 'typing';
  word: string; // Correct english word
  thaiMeaning: string;
  hint: string;
  exampleSentence: string;
  missingSentence?: string; // e.g. "I love to eat fresh ___ in the morning."
  acceptableAnswers?: string[];
}

export interface DragItem {
  id: string;
  text: string;
  thai: string;
  targetCategoryId: string;
  icon?: string;
}

export interface CategoryDropZone {
  id: string;
  name: string;
  thaiName: string;
  color: string;
  borderColor: string;
  bgColor: string;
  iconName: string;
}

export interface DragDropQuestionData extends BaseQuestion {
  type: 'drag_drop';
  categories: CategoryDropZone[];
  items: DragItem[];
}

export interface KeyboardChoiceQuestionData extends BaseQuestion {
  type: 'keyboard_arrows';
  promptWord: string;
  thaiMeaning: string;
  context: string;
  leftOption: {
    text: string;
    thai: string;
    isCorrect: boolean;
  };
  rightOption: {
    text: string;
    thai: string;
    isCorrect: boolean;
  };
}

export type Question = TypingQuestionData | DragDropQuestionData | KeyboardChoiceQuestionData;

export type GameStatus = 'idle' | 'playing' | 'question_completed' | 'game_over';

export interface QuestionResult {
  questionId: string;
  questionTitle: string;
  type: QuestionType;
  isCorrect: boolean;
  userScoreEarned: number;
  timeSpentSeconds: number;
  userFeedback?: string;
}

export interface GameState {
  status: GameStatus;
  currentQuestionIndex: number;
  score: number;
  streak: number;
  timeRemaining: number;
  totalTimeLimit: number;
  results: QuestionResult[];
  soundEnabled: boolean;
}
