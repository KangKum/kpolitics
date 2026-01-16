import { useState, useEffect } from "react";
import { Question, TestState, QuestionsResponse } from "@/types/test";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4001";
const STORAGE_KEY = "political-test-state";

/**
 * 정치성향 테스트 커스텀 훅
 * 문항 로딩, 답변 저장, sessionStorage 관리를 담당
 */
export function usePoliticalTest() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  // 초기 로드: sessionStorage 확인 → API 호출
  useEffect(() => {
    loadTestState();
  }, []);

  // 상태 변경 시 sessionStorage 저장
  useEffect(() => {
    if (questions.length > 0) {
      saveTestState();
    }
  }, [currentQuestionIndex, answers, questions]);

  /**
   * sessionStorage에서 테스트 상태 로드
   * 없으면 API 호출
   */
  const loadTestState = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. sessionStorage 확인
      const savedState = sessionStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const state: TestState = JSON.parse(savedState);
        setQuestions(state.questions);
        setCurrentQuestionIndex(state.currentQuestionIndex);
        setAnswers(state.answers);
        setLoading(false);
        return;
      }

      // 2. API 호출
      const res = await fetch(`${BACKEND_URL}/api/political-test/questions`);
      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      const data: QuestionsResponse = await res.json();

      if (!data.success || !data.questions || data.questions.length === 0) {
        throw new Error("문항 데이터가 없습니다");
      }

      setQuestions(data.questions);
      setCurrentQuestionIndex(0);
      setAnswers({});
    } catch (err: any) {
      setError(err.message || "문항을 불러오는 데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  /**
   * sessionStorage에 테스트 상태 저장
   */
  const saveTestState = () => {
    const state: TestState = {
      currentQuestionIndex,
      answers,
      questions,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  /**
   * 답변 선택
   */
  const selectAnswer = (questionId: string, score: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: score,
    }));
  };

  /**
   * 다음 문항으로 이동
   */
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  /**
   * 이전 문항으로 이동
   */
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  /**
   * 테스트 초기화 (다시 시작)
   */
  const resetTest = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setCurrentQuestionIndex(0);
    setAnswers({});
    loadTestState();
  };

  /**
   * 현재 문항
   */
  const currentQuestion = questions[currentQuestionIndex] || null;

  /**
   * 현재 문항의 답변 여부
   */
  const currentAnswer =
    currentQuestion ? answers[currentQuestion.questionId] : undefined;

  /**
   * 테스트 완료 여부 (모든 문항에 답변했는지)
   */
  const isCompleted = questions.length > 0 && Object.keys(answers).length === questions.length;

  /**
   * 진행률 (%)
   */
  const progress = questions.length > 0
    ? Math.round((Object.keys(answers).length / questions.length) * 100)
    : 0;

  return {
    loading,
    error,
    questions,
    currentQuestion,
    currentAnswer,
    currentQuestionIndex,
    answers,
    isCompleted,
    progress,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    resetTest,
  };
}
