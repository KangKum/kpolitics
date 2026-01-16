import { Question, TestResult, CategoryResult } from "@/types/test";

/**
 * 정치성향 테스트 결과 계산 함수
 * @param answers 사용자 답변 객체 { "Q1": -2, "Q5": 1, ... }
 * @param questions 전체 문항 배열
 * @returns TestResult 객체 (카테고리별 결과 + 전체 결과)
 */
export function calculateResult(
  answers: Record<string, number>,
  questions: Question[]
): TestResult {
  // 1. 카테고리별 점수 합산
  const scores = {
    economy: 0,
    society: 0,
    government: 0,
    security: 0,
  };

  questions.forEach((q) => {
    const answer = answers[q.questionId];
    if (answer !== undefined) {
      scores[q.category] += answer;
    }
  });

  // 2. 유형별 점수 (-100 ~ +100 스케일로 변환)
  // 각 카테고리는 6문항이므로 최소 -12, 최대 +12점
  // Math.round((점수 / 12) * 100)으로 -100 ~ +100으로 정규화
  const categoryScores = {
    economy: Math.round((scores.economy / 12) * 100),
    society: Math.round((scores.society / 12) * 100),
    government: Math.round((scores.government / 12) * 100),
    security: Math.round((scores.security / 12) * 100),
  };

  // 3. 전체 점수 (가중평균)
  // 경제×0.25 + 사회×0.2 + 정부×0.25 + 안보×0.3
  const totalScore = Math.round(
    categoryScores.economy * 0.25 +
      categoryScores.society * 0.2 +
      categoryScores.government * 0.25 +
      categoryScores.security * 0.3
  );

  // 4. 레이블 결정 함수
  const getLabel = (score: number): string => {
    if (score <= -70) return "매우 진보";
    if (score <= -30) return "진보";
    if (score <= 29) return "중도";
    if (score <= 69) return "보수";
    return "매우 보수";
  };

  // 5. 혼합형 체크
  // 4개 영역 중 2개가 양수(+), 2개가 음수(-)이면 혼합형
  const positiveCount = Object.values(categoryScores).filter((s) => s > 0).length;
  const negativeCount = Object.values(categoryScores).filter((s) => s < 0).length;
  const isMixed = positiveCount === 2 && negativeCount === 2;

  // 6. 결과 반환
  return {
    categoryResults: {
      economy: {
        score: categoryScores.economy,
        label: getLabel(categoryScores.economy),
      },
      society: {
        score: categoryScores.society,
        label: getLabel(categoryScores.society),
      },
      government: {
        score: categoryScores.government,
        label: getLabel(categoryScores.government),
      },
      security: {
        score: categoryScores.security,
        label: getLabel(categoryScores.security),
      },
    },
    totalScore,
    totalLabel: isMixed ? "혼합형" : getLabel(totalScore),
  };
}

/**
 * 카테고리명을 한글로 변환
 */
export function getCategoryName(
  category: "economy" | "society" | "government" | "security"
): string {
  const categoryNames = {
    economy: "경제",
    society: "사회",
    government: "정부 역할",
    security: "안보",
  };
  return categoryNames[category];
}
