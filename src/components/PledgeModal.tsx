import { useState, useEffect } from "react";
import { PledgeResponse } from "@/types/pledge";

// 백엔드 API URL 환경변수
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4001";

interface PledgeModalProps {
  governorName: string;
  isOpen: boolean;
  onClose: () => void;
}

interface PreviousGovernor {
  name: string;
  jdName: string;
  sgId: string;
}

export default function PledgeModal({ governorName, isOpen, onClose }: PledgeModalProps) {
  const [pledges, setPledges] = useState<PledgeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [previousGovernor, setPreviousGovernor] = useState<PreviousGovernor | null>(null);

  useEffect(() => {
    if (isOpen && governorName) {
      setPledges(null); // 이전 공약 데이터 초기화
      setExpandedIndex(null); // 모달이 열릴 때 드롭다운 초기화
      setPreviousGovernor(null); // 이전 단체장 정보 초기화
      fetchPledges();
    }
  }, [isOpen, governorName]);

  // pledges가 로드되면 권한대행 여부 확인
  useEffect(() => {
    if (pledges && pledges.sidoName) {
      checkForActingGovernor();
    }
  }, [pledges]);

  const fetchPledges = async () => {
    setLoading(true);
    setError(null);

    try {
      // 이름에서 실제 이름만 추출 (대행자의 경우)
      // "김정기(대행) ← 이전: 홍준표" → "김정기"
      // "홍준표" → "홍준표"
      let actualName = governorName;

      if (governorName.includes("(대행)")) {
        // "(대행)" 앞의 이름만 추출
        actualName = governorName.split("(대행)")[0].trim();
      }

      const response = await fetch(`${BACKEND_URL}/api/governors/pledges/${encodeURIComponent(actualName)}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "공약 조회 실패");
      }

      const data = await response.json();
      setPledges(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkForActingGovernor = async () => {
    // 형식: "전임자 → 대행자(대행)"에서 "→"와 "(대행)" 확인
    const isActing = governorName.includes(" → ") && (
                     governorName.includes("(대행)") ||
                     governorName.includes("(권한대행)") ||
                     governorName.includes("(직무대행)")
                     );

    if (!isActing || !pledges || !pledges.sidoName) return;

    try {
      const region = pledges.sidoName;

      const response = await fetch(`${BACKEND_URL}/api/governors/previous/${encodeURIComponent(region)}`);

      if (response.ok) {
        const data = await response.json();
        if (data.governors && data.governors.length >= 2) {
          // 두 번째가 이전 단체장 (첫 번째는 현재 당선자)
          setPreviousGovernor(data.governors[1]);
        } else if (data.governors && data.governors.length === 1) {
          // 당선자가 1명만 있는 경우 (그 사람이 원래 단체장)
          setPreviousGovernor(data.governors[0]);
        }
      }
    } catch (err) {
      // 에러 무시
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl sm:text-2xl font-bold">{governorName}의 공약</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 본문 */}
        <div className="p-4 sm:p-6">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-500"></div>
              <p className="mt-4 text-gray-600">공약 불러오는 중...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700">
              <strong>오류:</strong> {error}
            </div>
          )}

          {pledges && (
            <div className="space-y-6">
              {/* 후보자 정보 */}
              <div className="bg-gray-50 rounded p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <p><strong>정당:</strong> {pledges.partyName}</p>
                  <p><strong>지역:</strong> {pledges.sidoName} {pledges.sggName}</p>
                  <p><strong>총 공약 수:</strong> {pledges.prmsCnt}개</p>
                </div>

                {/* 원래 단체장 정보 (권한대행인 경우) */}
                {previousGovernor && (
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <p className="text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded">
                      <strong>ℹ️ 안내:</strong> 현재 권한대행 중입니다.
                      원래 단체장은 <strong>{previousGovernor.name}</strong>({previousGovernor.jdName})입니다.
                    </p>
                  </div>
                )}
              </div>

              {/* 공약이 없는 경우 */}
              {pledges.pledges.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  등록된 공약이 없습니다.
                </div>
              )}

              {/* 공약 목록 */}
              {pledges.pledges.map((pledge, idx) => (
                <div key={idx} className="border-l-4 border-blue-500 pl-4 rounded-r">
                  <div className="py-3">
                    <button
                      onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                      className="w-full flex items-start gap-3 hover:bg-gray-50 transition-colors rounded p-2 -ml-2 text-left"
                    >
                      <span className="bg-blue-500 text-white rounded-full min-w-[24px] w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                        {pledge.prmsOrd}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm text-gray-500 mb-1">{pledge.prmsRealmName}</div>
                        <h3 className="text-base sm:text-lg font-bold break-words flex items-center justify-between gap-2">
                          <span>{pledge.prmsTitle}</span>
                          <svg
                            className={`w-5 h-5 flex-shrink-0 transition-transform ${expandedIndex === idx ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </h3>
                      </div>
                    </button>

                    {/* 드롭다운 내용 */}
                    {expandedIndex === idx && (
                      <div className="mt-2 ml-11 text-sm sm:text-base text-gray-700 whitespace-pre-line break-words bg-gray-50 p-3 rounded">
                        {pledge.prmsCont}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-4 sm:px-6 py-4 flex justify-between items-center">
          <p className="text-xs text-gray-500">출처: 중앙선거관리위원회</p>
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-2 rounded transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
