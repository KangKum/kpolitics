import { Question } from "@/types/test";
import OptionButton from "./OptionButton";

interface QuestionCardProps {
  question: Question;
  selectedScore?: number;
  onSelectOption: (score: number) => void;
  onNext: () => void;
  onPrevious?: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
}

/**
 * 문항 카드 컴포넌트
 */
export default function QuestionCard({
  question,
  selectedScore,
  onSelectOption,
  onNext,
  onPrevious,
  isFirstQuestion,
  isLastQuestion,
}: QuestionCardProps) {
  const hasAnswer = selectedScore !== undefined;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-3xl mx-auto">
      {/* 질문 텍스트 */}
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 whitespace-pre-line leading-relaxed">
        {question.questionText}
      </h2>

      {/* 선택지 목록 */}
      <div className="space-y-3 mb-8">
        {question.options.map((option) => (
          <OptionButton
            key={option.label}
            option={option}
            isSelected={selectedScore === option.score}
            onSelect={() => onSelectOption(option.score)}
          />
        ))}
      </div>

      {/* 네비게이션 버튼 */}
      <div className="flex items-center justify-between gap-4">
        {/* 이전 버튼 */}
        {!isFirstQuestion && onPrevious ? (
          <button
            onClick={onPrevious}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium
                     hover:bg-gray-300 transition-colors"
          >
            이전
          </button>
        ) : (
          <div />
        )}

        {/* 다음/완료 버튼 */}
        <button
          onClick={onNext}
          disabled={!hasAnswer}
          className={`
            px-8 py-3 rounded-lg font-medium transition-all
            ${
              hasAnswer
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          {isLastQuestion ? "결과 보기" : "다음"}
        </button>
      </div>
    </div>
  );
}
