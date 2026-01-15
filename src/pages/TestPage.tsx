import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DataTable from "../components/DataTable";
import { AssemblyMember } from "@/types";
import SEO from "@/shared/components/SEO/SEO";
import BreadcrumbJsonLd from "@/shared/components/SEO/BreadcrumbJsonLd";

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

  // 지역별 키워드 매핑
  const getRegionKeywords = (regionName: string | null) => {
    if (!regionName) {
      return "전국,국회의원,광역단체장,기초단체장,정치인,시장,도지사";
    }

    const baseKeywords = `${regionName},${regionName} 국회의원,${regionName} 정치인,${regionName} 시장,${regionName} 도지사`;

    // 지역별 특화 키워드
    const regionSpecificKeywords: Record<string, string> = {
      "서울": "서울특별시,서울시장,강남구,강서구,송파구",
      "부산": "부산광역시,부산시장,해운대구,부산진구",
      "대구": "대구광역시,대구시장,수성구,달서구",
      "인천": "인천광역시,인천시장,연수구,남동구",
      "광주": "광주광역시,광주시장,북구,광산구",
      "대전": "대전광역시,대전시장,서구,유성구",
      "울산": "울산광역시,울산시장,남구,북구",
      "세종": "세종특별자치시,세종시장",
      "경기도": "경기도,경기도지사,수원,성남,고양,용인",
      "강원도": "강원도,강원도지사,춘천,원주,강릉",
      "충청북도": "충청북도,충북도지사,청주,충주",
      "충청남도": "충청남도,충남도지사,천안,아산,공주",
      "전라북도": "전라북도,전북도지사,전주,군산,익산",
      "전라남도": "전라남도,전남도지사,목포,여수,순천",
      "경상북도": "경상북도,경북도지사,포항,경주,구미",
      "경상남도": "경상남도,경남도지사,창원,김해,양산",
      "제주도": "제주특별자치도,제주도지사,제주시,서귀포시"
    };

    const specificKeywords = regionSpecificKeywords[regionName] || "";
    return `${baseKeywords},${specificKeywords}`;
  };

  const getSEOTitle = () => {
    if (!region) return "전국 정치인 정보";
    return `${region} 국회의원 및 단체장 정보`;
  };

  const getSEODescription = () => {
    if (!region) {
      return "대한민국 전국 국회의원, 광역단체장, 기초단체장 정보를 한눈에 확인하세요. 300명의 국회의원과 17개 광역시도, 226개 기초단체의 정치인 정보를 제공합니다.";
    }

    return `${region} 지역의 국회의원, 광역단체장, 기초단체장 정보를 확인하세요. ${region} 소속 국회의원 명단, 의정활동 내역, 발의 법안, 단체장 정보를 제공합니다.`;
  };

  if (loading) return <div className="p-6">로딩중...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <>
      <SEO
        title={getSEOTitle()}
        description={getSEODescription()}
        keywords={getRegionKeywords(region)}
        canonical={region ? `/test?region=${encodeURIComponent(region)}` : "/test"}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "홈", url: "/" },
          { name: region ? `${region}` : "전국", url: region ? `/test?region=${encodeURIComponent(region)}` : "/test" }
        ]}
      />
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
    </>
  );
}
