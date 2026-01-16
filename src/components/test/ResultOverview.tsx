import { TestResult } from "@/types/test";

interface ResultOverviewProps {
  result: TestResult;
}

/**
 * 전체 결과 텍스트 컴포넌트
 */
export default function ResultOverview({ result }: ResultOverviewProps) {
  // 점수에 따른 색상 결정
  const getColorClass = (score: number): string => {
    if (score <= -70) return "text-blue-700";
    if (score <= -30) return "text-blue-600";
    if (score <= 29) return "text-gray-700";
    if (score <= 69) return "text-red-600";
    return "text-red-700";
  };

  const isMixed = result.totalLabel === "혼합형";

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center">
      {/* 전체 결과 제목 */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
        전체 정치성향
      </h2>

      {/* 점수 및 레이블 */}
      {isMixed ? (
        <div className="mb-6">
          <div className="text-5xl sm:text-6xl font-bold text-purple-600 mb-2">
            혼합형
          </div>
          <p className="text-gray-600 text-sm sm:text-base">
            영역별로 다양한 성향을 보입니다
          </p>
        </div>
      ) : (
        <div className="mb-6">
          <div
            className={`text-5xl sm:text-6xl font-bold ${getColorClass(
              result.totalScore
            )} mb-2`}
          >
            {result.totalScore}
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-gray-700">
            {result.totalLabel}
          </div>
        </div>
      )}

      {/* 영역별 요약 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">경제</div>
          <div className="text-sm font-semibold">
            {result.categoryResults.economy.label}
          </div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">사회</div>
          <div className="text-sm font-semibold">
            {result.categoryResults.society.label}
          </div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">정부 역할</div>
          <div className="text-sm font-semibold">
            {result.categoryResults.government.label}
          </div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">안보</div>
          <div className="text-sm font-semibold">
            {result.categoryResults.security.label}
          </div>
        </div>
      </div>

      {/* 참고 문구 */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-gray-700 leading-relaxed">
          이 테스트에서 사용한 '진보·보수'는
          <br className="sm:hidden" />
          대한민국의 정당 구분이나 이념과 완전히 동일하지 않습니다.
        </p>
      </div>
    </div>
  );
}
