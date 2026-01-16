import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePoliticalTest } from "@/hooks/usePoliticalTest";
import ProgressBar from "@/components/test/ProgressBar";
import QuestionCard from "@/components/test/QuestionCard";

/**
 * 정치성향 테스트 메인 페이지
 */
export default function PoliticalTestPage() {
  const navigate = useNavigate();
  const [hasStarted, setHasStarted] = useState<boolean>(() => {
    // sessionStorage에서 시작 여부 복원
    const saved = sessionStorage.getItem("political-test-started");
    return saved === "true";
  });

  const {
    loading,
    error,
    currentQuestion,
    currentAnswer,
    currentQuestionIndex,
    questions,
    answers,
    isCompleted,
    selectAnswer,
    nextQuestion,
    previousQuestion,
  } = usePoliticalTest();

  // 테스트 완료 시 결과 페이지로 자동 이동
  useEffect(() => {
    if (!loading && isCompleted) {
      navigate("/political-test/result");
    }
  }, [isCompleted, loading, navigate]);

  // 시작 버튼 클릭 핸들러
  const handleStart = () => {
    setHasStarted(true);
    sessionStorage.setItem("political-test-started", "true");
  };

  // 답변 선택 처리
  const handleSelectOption = (score: number) => {
    if (currentQuestion) {
      selectAnswer(currentQuestion.questionId, score);
    }
  };

  // 다음 문항/결과 페이지 이동
  const handleNext = () => {
    if (isCompleted) {
      // 마지막 문항 완료 시 결과 페이지로 이동
      navigate("/political-test/result");
    } else {
      nextQuestion();
    }
  };

  // 이전 문항 이동
  const handlePrevious = () => {
    previousQuestion();
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">문항을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">오류 발생</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 소개 화면 (테스트 시작 전)
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 max-w-2xl w-full">
          {/* 제목 */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">정치성향 테스트</h1>

          {/* 설명 */}
          <div className="space-y-4 mb-8 text-gray-700">
            <p className="text-base sm:text-lg leading-relaxed">24개의 문항을 통해 당신의 정치성향을 확인해보세요.</p>

            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
              <p className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>
                  총 <strong className="text-blue-600">24개 문항</strong> (경제, 사회, 정부 역할, 안보)
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>
                  각 문항은 <strong className="text-blue-600">4지선다</strong> 형식입니다
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>
                  소요 시간: 약 <strong className="text-blue-600">5-10분</strong>
                </span>
              </p>
            </div>

            <p className="text-sm text-gray-500 italic mt-6 leading-relaxed">
              * 이 테스트에서 사용한 '진보·보수'는 대한민국의 정당 구분이나 이념과 완전히 동일하지 않습니다.
            </p>
          </div>

          {/* 시작 버튼 */}
          <button
            onClick={handleStart}
            className="w-full py-4 bg-blue-600 text-white text-lg font-bold rounded-lg
                     hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            테스트 시작하기
          </button>
        </div>
      </div>
    );
  }

  // 문항이 없는 경우
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600">문항을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 진행률 바 */}
        <ProgressBar current={currentQuestionIndex + 1} total={questions.length} answeredCount={Object.keys(answers).length} />

        {/* 문항 카드 */}
        <QuestionCard
          question={currentQuestion}
          selectedScore={currentAnswer}
          onSelectOption={handleSelectOption}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isFirstQuestion={isFirstQuestion}
          isLastQuestion={isLastQuestion}
        />
      </div>
    </div>
  );
}
