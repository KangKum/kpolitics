// 정치성향 테스트 관련 타입 정의

export interface QuestionOption {
  label: string; // "A", "B", "C", "D"
  text: string;
  score: number; // -2, -1, +1, +2
}

export interface Question {
  questionId: string; // "Q1" ~ "Q24"
  order: number; // 1 ~ 24
  category: "economy" | "society" | "government" | "security";
  questionText: string;
  options: QuestionOption[];
}

export interface TestState {
  currentQuestionIndex: number; // 0 ~ 23
  answers: Record<string, number>; // { "Q1": -2, "Q5": 1, ... }
  questions: Question[];
}

export interface CategoryResult {
  score: number; // -100 ~ +100
  label: string; // "매우 진보" | "진보" | "중도" | "보수" | "매우 보수"
}

export interface TestResult {
  categoryResults: {
    economy: CategoryResult;
    society: CategoryResult;
    government: CategoryResult;
    security: CategoryResult;
  };
  totalScore: number;
  totalLabel: string; // 전체 성향 또는 "혼합형"
}

// API 응답 타입
export interface QuestionsResponse {
  success: boolean;
  questions: Question[];
  count: number;
}
