import { useMemo, useState, useCallback } from "react";
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

  // Stable callback references
  const handleRegionClick = useCallback((name: string) => {
    setSelectedName((prev) => (prev === name ? null : name));
    navigate(`/test?region=${encodeURIComponent(name)}`);
  }, [navigate]);

  const handleMouseEnter = useCallback((name: string) => {
    setHoveredName(name);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredName(null);
  }, []);

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
      {hoveredName && (
        <div
          className="pointer-events-none absolute z-10
                     left-1/2 top-2 -translate-x-1/2
                     bg-black text-white text-sm px-3 py-1 rounded shadow"
        >
          {hoveredName}
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
