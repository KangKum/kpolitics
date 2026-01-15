import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DataTable from "../components/DataTable";
import { AssemblyMember } from "@/types";

// 백엔드 API URL 환경변수
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4001";

interface Governor {
  position: string; // 직책명 (예: "서울특별시장", "강남구청장")
  name: string;
  party: string;
  inaugurationDate: string;
  status: string;
  notes?: string;
  metropolitanRegion?: string;
  [key: string]: string | undefined; // DataTable 호환성을 위한 index signature
}

export default function TestPage() {
  const [searchParams] = useSearchParams();
  const region = searchParams.get("region");

  const [assemblyMembers, setAssemblyMembers] = useState<AssemblyMember[]>([]);
  const [metropolitanGovernor, setMetropolitanGovernor] = useState<Governor | null>(null);
  const [metropolitanGovernors, setMetropolitanGovernors] = useState<Governor[]>([]); // 전체보기용
  const [basicGovernors, setBasicGovernors] = useState<Governor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 섹션 접기/펼치기 상태
  const [expandedSections, setExpandedSections] = useState({
    metropolitan: true,
    assembly: true,
    basic: true,
  });

  useEffect(() => {
    fetchAllData();
  }, [region]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. 국회의원 데이터
      let assemblyUrl = `${BACKEND_URL}/api/assembly/members`;
      if (region) {
        assemblyUrl += `?region=${encodeURIComponent(region)}`;
      }
      const assemblyRes = await fetch(assemblyUrl);
      if (!assemblyRes.ok) throw new Error(`국회의원 데이터 로드 실패: ${assemblyRes.status}`);
      const assemblyJson = await assemblyRes.json();
      setAssemblyMembers(Array.isArray(assemblyJson) ? assemblyJson : []);

      // 2. 광역단체장 데이터
      let metroUrl = `${BACKEND_URL}/api/governors/metropolitan`;
      if (region) {
        metroUrl += `?region=${encodeURIComponent(region)}`;
      }
      const metroRes = await fetch(metroUrl);
      if (!metroRes.ok) throw new Error(`광역단체장 데이터 로드 실패: ${metroRes.status}`);
      const metroJson = await metroRes.json();

      if (region) {
        // 특정 지역 선택 시: 해당 광역단체장 1명만
        setMetropolitanGovernor(metroJson.governors && metroJson.governors.length > 0 ? metroJson.governors[0] : null);
        setMetropolitanGovernors([]); // 전체보기 배열은 비움
      } else {
        // 전체보기: 광역단체장 전체를 배열로 저장
        setMetropolitanGovernor(null); // 단일 표시는 안 함
        setMetropolitanGovernors(metroJson.governors || []); // 전체 목록 저장
      }

      // 3. 기초단체장 데이터
      let basicUrl = `${BACKEND_URL}/api/governors/basic`;
      if (region) {
        basicUrl += `?metro=${encodeURIComponent(region)}`;
      }
      const basicRes = await fetch(basicUrl);
      if (!basicRes.ok) throw new Error(`기초단체장 데이터 로드 실패: ${basicRes.status}`);
      const basicJson = await basicRes.json();
      setBasicGovernors(basicJson.governors || []);
    } catch (e) {
      setError("데이터 불러오기 실패");
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (loading) return <div className="p-6">로딩중...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{region ? `${region}` : "전국"}</h1>
        {region && (
          <button onClick={() => (window.location.href = "/test")} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            전체 보기
          </button>
        )}
      </div>

      {/* 광역단체장 섹션 - 특정 지역 선택 시 */}
      {region && metropolitanGovernor && (
        <div className="mb-6 border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("metropolitan")}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-colors flex items-center justify-between"
          >
            <h2 className="text-lg font-semibold text-gray-800">🏛️ 광역단체장 (1명)</h2>
            <span className="text-gray-600">{expandedSections.metropolitan ? "▼" : "▶"}</span>
          </button>
          {expandedSections.metropolitan && (
            <div className="p-6 bg-white">
              <DataTable data={[metropolitanGovernor]} />
            </div>
          )}
        </div>
      )}

      {/* 광역단체장 섹션 - 전체보기 시 */}
      {!region && metropolitanGovernors.length > 0 && (
        <div className="mb-6 border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("metropolitan")}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-colors flex items-center justify-between"
          >
            <h2 className="text-lg font-semibold text-gray-800">🏛️ 광역단체장 ({metropolitanGovernors.length}명)</h2>
            <span className="text-gray-600">{expandedSections.metropolitan ? "▼" : "▶"}</span>
          </button>
          {expandedSections.metropolitan && (
            <div className="p-6 bg-white">
              <DataTable data={metropolitanGovernors} />
            </div>
          )}
        </div>
      )}

      {/* 국회의원 섹션 */}
      <div className="mb-6 border rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection("assembly")}
          className="w-full px-6 py-4 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-colors flex items-center justify-between"
        >
          <h2 className="text-lg font-semibold text-gray-800">🏛️ 국회의원 ({assemblyMembers.length}명)</h2>
          <span className="text-gray-600">{expandedSections.assembly ? "▼" : "▶"}</span>
        </button>
        {expandedSections.assembly && (
          <div className="p-6 bg-white">
            {assemblyMembers.length > 0 ? <DataTable data={assemblyMembers} /> : <p className="text-gray-500 text-center py-4">국회의원 데이터가 없습니다.</p>}
          </div>
        )}
      </div>

      {/* 기초단체장 섹션 */}
      {basicGovernors.length > 0 && (
        <div className="mb-6 border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("basic")}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-colors flex items-center justify-between"
          >
            <h2 className="text-lg font-semibold text-gray-800">🏢 기초단체장 ({basicGovernors.length}명)</h2>
            <span className="text-gray-600">{expandedSections.basic ? "▼" : "▶"}</span>
          </button>
          {expandedSections.basic && (
            <div className="p-6 bg-white">
              <DataTable data={basicGovernors} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
