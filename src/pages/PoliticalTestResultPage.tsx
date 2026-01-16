import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Question } from "@/types/test";
import { calculateResult, getCategoryName } from "@/utils/testCalculator";
import ResultCard from "@/components/test/ResultCard";
import ResultOverview from "@/components/test/ResultOverview";

/**
 * 정치성향 테스트 결과 페이지
 */
export default function PoliticalTestResultPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<ReturnType<
    typeof calculateResult
  > | null>(null);

  useEffect(() => {
    // sessionStorage에서 테스트 데이터 로드
    const savedState = sessionStorage.getItem("political-test-state");

    if (!savedState) {
      // 테스트를 시작하지 않은 경우 테스트 페이지로 리다이렉트
      navigate("/political-test");
      return;
    }

    try {
      const state = JSON.parse(savedState);
      const { answers, questions } = state;

      // 모든 문항에 답변했는지 확인
      if (Object.keys(answers).length < questions.length) {
        alert("아직 모든 문항에 답변하지 않았습니다.");
        navigate("/political-test");
        return;
      }

      // 결과 계산
      const testResult = calculateResult(answers, questions as Question[]);
      setResult(testResult);
    } catch (error) {
      console.error("결과 계산 실패:", error);
      navigate("/political-test");
    }
  }, [navigate]);

  // 다시 테스트하기
  const handleRetry = () => {
    if (
      confirm(
        "테스트를 다시 시작하시겠습니까? 현재 결과는 사라집니다."
      )
    ) {
      sessionStorage.removeItem("political-test-state");
      navigate("/political-test");
    }
  };

  // 로딩 상태
  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">결과를 계산하는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 페이지 제목 */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-8">
          정치성향 테스트 결과
        </h1>

        {/* 전체 결과 */}
        <div className="mb-8">
          <ResultOverview result={result} />
        </div>

        {/* 영역별 결과 */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            영역별 상세 결과
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ResultCard
              categoryName={getCategoryName("economy")}
              result={result.categoryResults.economy}
            />
            <ResultCard
              categoryName={getCategoryName("society")}
              result={result.categoryResults.society}
            />
            <ResultCard
              categoryName={getCategoryName("government")}
              result={result.categoryResults.government}
            />
            <ResultCard
              categoryName={getCategoryName("security")}
              result={result.categoryResults.security}
            />
          </div>
        </div>

        {/* 다시 테스트하기 버튼 */}
        <div className="text-center">
          <button
            onClick={handleRetry}
            className="px-8 py-3 bg-gray-600 text-white rounded-lg font-medium
                     hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg"
          >
            다시 테스트하기
          </button>
        </div>
      </div>
    </div>
  );
}
