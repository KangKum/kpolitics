import { useEffect, useState } from "react";
import DataTable from "../components/DataTable";

// 백엔드 API URL 환경변수
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4001";

interface Governor {
  position: string; // 직책명 (예: "서울특별시장", "강남구청장")
  name: string;
  party: string;
  inaugurationDate: string;
  status: string;
  notes?: string;
  metropolitanRegion?: string; // 기초단체장만
  [key: string]: string | undefined; // DataTable 호환성을 위한 index signature
}

interface GovernorData {
  governors: Governor[];
  lastUpdated: string;
  count: number;
}

export default function TestPage2() {
  const [metropolitanData, setMetropolitanData] = useState<GovernorData | null>(null);
  const [basicData, setBasicData] = useState<GovernorData | null>(null);
  const [activeTab, setActiveTab] = useState<"metropolitan" | "basic">("metropolitan");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 광역단체장 데이터 가져오기
      const metroRes = await fetch(`${BACKEND_URL}/api/governors/metropolitan`);
      if (!metroRes.ok) {
        throw new Error(`HTTP error: ${metroRes.status}`);
      }
      const metroJson = await metroRes.json();
      setMetropolitanData(metroJson);

      // 기초단체장 데이터 가져오기
      const basicRes = await fetch(`${BACKEND_URL}/api/governors/basic`);
      if (!basicRes.ok) {
        throw new Error(`HTTP error: ${basicRes.status}`);
      }
      const basicJson = await basicRes.json();
      setBasicData(basicJson);
    } catch (e) {
      setError("데이터 불러오기 실패");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  const currentData = activeTab === "metropolitan" ? metropolitanData : basicData;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">단체장 정보</h1>

      {/* 탭 버튼 */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab("metropolitan")}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === "metropolitan"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          광역단체장 ({metropolitanData?.count || 0}개)
        </button>
        <button
          onClick={() => setActiveTab("basic")}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === "basic" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          기초단체장 ({basicData?.count || 0}개)
        </button>
      </div>

      {/* 데이터 표시 */}
      {currentData ? (
        <div>
          <div className="mb-4 text-sm text-gray-600">
            총 {currentData.count}명 | 마지막 업데이트: {new Date(currentData.lastUpdated).toLocaleString("ko-KR")}
          </div>
          <DataTable data={currentData.governors} />
        </div>
      ) : (
        <div className="text-gray-500">데이터 없음</div>
      )}
    </div>
  );
}
