import { useMemo, useState, useCallback, useEffect } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { useNavigate } from "react-router-dom";
import MapRegion from "./MapRegion";
import { useMapData } from "@/context/MapDataContext";

const KOREAN_NAME_MAP: Record<string, string> = {
  Busan: "부산",
  Seoul: "서울",
  Incheon: "인천",
  Daegu: "대구",
  Gwangju: "광주",
  Daejeon: "대전",
  Ulsan: "울산",
  Sejong: "세종",

  Gyeonggi: "경기도",
  Gangwon: "강원도",
  Chungcheongbuk: "충북",
  Chungcheongnam: "충남",
  Jeollabuk: "전북",
  Jeollanam: "전남",
  Gyeongsangbuk: "경북",
  Gyeongsangnam: "경남",
  Jeju: "제주",
};

interface ProcessedFeature {
  id: string;
  name: string;
  pathData: string;
}

export default function KoreaMap() {
  const navigate = useNavigate();
  const { geoData: geo, isLoading, error } = useMapData();
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedMobileRegion, setSelectedMobileRegion] = useState<string | null>(null);

  const width = 800;
  const height = 900;

  const projection = useMemo(() => {
    if (!geo) return null;
    return geoMercator().fitSize([width, height], geo as any);
  }, [geo]);

  const path = useMemo(() => {
    if (!projection) return null;
    return geoPath(projection);
  }, [projection]);

  // Cache processed features with path data
  const processedFeatures = useMemo<ProcessedFeature[]>(() => {
    if (!geo || !path) return [];

    return geo.features.map((feature, index) => {
      const rawEngName = feature.properties.NAME_1;
      const normalized = rawEngName.replace(/-do$/i, "").replace(/-si$/i, "");
      const name = KOREAN_NAME_MAP[normalized] ?? rawEngName;
      const pathData = path(feature) || "";

      return {
        id: `${name}-${index}`,
        name,
        pathData,
      };
    });
  }, [geo, path]);

  // 화면 크기 변경 감지 (모바일/데스크톱 구분)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Stable callback references
  const handleRegionClick = useCallback((name: string) => {
    if (isMobile) {
      // 모바일: 모달만 표시, 페이지 이동 안 함
      setSelectedMobileRegion(name);
    } else {
      // 데스크톱: 기존 로직 유지 (바로 페이지 이동)
      setSelectedName((prev) => (prev === name ? null : name));
      navigate(`/test?region=${encodeURIComponent(name)}`);
    }
  }, [isMobile, navigate]);

  const handleMouseEnter = useCallback((name: string) => {
    // 모바일에서는 hover 이벤트 무시
    if (!isMobile) {
      setHoveredName(name);
    }
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    // 모바일에서는 hover 이벤트 무시
    if (!isMobile) {
      setHoveredName(null);
    }
  }, [isMobile]);

  if (isLoading) {
    return <div>지도 로딩중...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!geo || !path || processedFeatures.length === 0) {
    return <div>지도 데이터를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="relative w-full">
      {/* 데스크톱에서만 hover 툴팁 표시 */}
      {!isMobile && hoveredName && (
        <div
          className="pointer-events-none absolute z-10
                     left-1/2 top-2 -translate-x-1/2
                     bg-black text-white text-sm px-3 py-1 rounded shadow"
        >
          {hoveredName}
        </div>
      )}

      {/* 모바일용 지역 선택 모달 */}
      {selectedMobileRegion && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
          onClick={() => setSelectedMobileRegion(null)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              {selectedMobileRegion}
            </h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              해당 지역의 정치인 정보를 확인하시겠습니까?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  navigate(`/test?region=${encodeURIComponent(selectedMobileRegion)}`);
                  setSelectedMobileRegion(null);
                }}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                이동하기
              </button>
              <button
                onClick={() => setSelectedMobileRegion(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {processedFeatures.map((feature) => (
          <MapRegion
            key={feature.id}
            pathData={feature.pathData}
            name={feature.name}
            isSelected={selectedName === feature.name}
            isHovered={hoveredName === feature.name}
            hasSelection={selectedName !== null}
            hasHover={hoveredName !== null}
            onMouseEnter={() => handleMouseEnter(feature.name)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleRegionClick(feature.name)}
          />
        ))}
      </svg>
    </div>
  );
}
