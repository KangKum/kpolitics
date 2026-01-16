interface ProgressBarProps {
  current: number; // 현재 문항 번호 (1-based)
  total: number; // 전체 문항 수
  answeredCount: number; // 답변한 문항 수
}

/**
 * 테스트 진행률 표시 바
 */
export default function ProgressBar({
  current,
  total,
  answeredCount,
}: ProgressBarProps) {
  const progress = total > 0 ? (answeredCount / total) * 100 : 0;

  return (
    <div className="w-full mb-6">
      {/* 문항 번호 표시 */}
      <div className="flex items-center justify-between mb-2 text-sm sm:text-base">
        <span className="font-semibold text-gray-700">
          문항 {current} / {total}
        </span>
        <span className="text-gray-500">{Math.round(progress)}% 완료</span>
      </div>

      {/* 진행률 바 */}
      <div
        className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
