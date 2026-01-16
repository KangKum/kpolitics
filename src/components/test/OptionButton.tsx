import { QuestionOption } from "@/types/test";

interface OptionButtonProps {
  option: QuestionOption;
  isSelected: boolean;
  onSelect: () => void;
}

/**
 * 문항 선택지 버튼 컴포넌트
 */
export default function OptionButton({
  option,
  isSelected,
  onSelect,
}: OptionButtonProps) {
  return (
    <button
      onClick={onSelect}
      className={`
        w-full p-4 text-left rounded-lg border-2 transition-all
        hover:shadow-md active:scale-[0.98]
        ${
          isSelected
            ? "border-blue-600 bg-blue-50 shadow-sm"
            : "border-gray-300 bg-white hover:border-blue-400"
        }
      `}
      aria-pressed={isSelected}
    >
      <div className="flex items-start gap-3">
        {/* 선택지 라벨 (A, B, C, D) */}
        <span
          className={`
            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
            text-sm font-bold
            ${
              isSelected
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }
          `}
        >
          {option.label}
        </span>

        {/* 선택지 텍스트 */}
        <span
          className={`
            flex-1 text-sm sm:text-base leading-relaxed
            ${isSelected ? "text-blue-900 font-medium" : "text-gray-800"}
          `}
        >
          {option.text}
        </span>
      </div>
    </button>
  );
}
