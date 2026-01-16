import { CategoryResult } from "@/types/test";
import Card from "@/shared/components/ui/Card";

interface ResultCardProps {
  categoryName: string;
  result: CategoryResult;
}

/**
 * 영역별 결과 카드 컴포넌트
 */
export default function ResultCard({ categoryName, result }: ResultCardProps) {
  // 점수에 따른 색상 결정
  const getColorClass = (score: number): string => {
    if (score <= -70) return "text-blue-700 bg-blue-50 border-blue-300";
    if (score <= -30) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score <= 29) return "text-gray-700 bg-gray-50 border-gray-300";
    if (score <= 69) return "text-red-600 bg-red-50 border-red-200";
    return "text-red-700 bg-red-50 border-red-300";
  };

  // 게이지 바 배경색
  const getGaugeColor = (score: number): string => {
    if (score <= -30) return "bg-blue-500";
    if (score <= 29) return "bg-gray-400";
    return "bg-red-500";
  };

  // 게이지 바 위치 계산 (-100 ~ +100을 0% ~ 100%로 변환)
  const gaugePosition = ((result.score + 100) / 200) * 100;

  return (
    <Card className="relative overflow-hidden">
      {/* 카테고리명 */}
      <h3 className="text-lg font-bold text-gray-900 mb-4">{categoryName}</h3>

      {/* 점수 및 레이블 */}
      <div
        className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 mb-4
        ${getColorClass(result.score)}
      `}
      >
        <span className="text-2xl font-bold">{result.score}</span>
        <span className="text-sm font-medium">{result.label}</span>
      </div>

      {/* 게이지 바 */}
      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        {/* 중앙선 (0점 위치) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-400 z-10" />

        {/* 진행 바 */}
        <div
          className={`absolute top-0 bottom-0 transition-all duration-500 ${getGaugeColor(
            result.score
          )}`}
          style={{
            left: result.score < 0 ? `${gaugePosition}%` : "50%",
            right: result.score > 0 ? `${100 - gaugePosition}%` : "50%",
          }}
        />
      </div>

      {/* 레이블 (진보 ← | → 보수) */}
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        <span>진보</span>
        <span>보수</span>
      </div>
    </Card>
  );
}
