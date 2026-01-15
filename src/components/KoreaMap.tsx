import { useMemo, useState, useCallback, useEffect, useRef } from "react";
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
  const [modalViewport, setModalViewport] = useState({ scale: 1, left: 0, top: 0, width: 0, height: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

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

  // 모바일에서 한 손가락 드래그 스크롤 방지 (핀치 줌은 허용, 탭은 허용)
  useEffect(() => {
    const mapContainer = mapContainerRef.current;
    if (!mapContainer || !isMobile) return;

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touchMoveX = e.touches[0].clientX;
        const touchMoveY = e.touches[0].clientY;
        const deltaX = Math.abs(touchMoveX - touchStartX);
        const deltaY = Math.abs(touchMoveY - touchStartY);

        // 5px 이상 움직이면 드래그로 간주
        if (deltaX > 5 || deltaY > 5) {
          e.preventDefault(); // 드래그일 때만 스크롤 방지
        }
      }
      // 두 손가락은 항상 허용 (핀치 줌)
    };

    mapContainer.addEventListener("touchstart", handleTouchStart, { passive: true });
    mapContainer.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      mapContainer.removeEventListener("touchstart", handleTouchStart);
      mapContainer.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isMobile]);

  // Stable callback references
  const handleRegionClick = useCallback(
    (name: string) => {
      if (isMobile) {
        // 모바일: 현재 viewport 정보를 읽어서 모달 위치/크기 결정
        if (window.visualViewport) {
          const vp = window.visualViewport;
          setModalViewport({
            scale: vp.scale,
            left: vp.offsetLeft,
            top: vp.offsetTop,
            width: vp.width,
            height: vp.height,
          });
        } else {
          // visualViewport 미지원 브라우저
          setModalViewport({
            scale: 1,
            left: 0,
            top: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          });
        }
        setSelectedMobileRegion(name);
      } else {
        // 데스크톱: 기존 로직 유지 (바로 페이지 이동)
        setSelectedName((prev) => (prev === name ? null : name));
        navigate(`/test?region=${encodeURIComponent(name)}`);
      }
    },
    [isMobile, navigate]
  );

  const handleMouseEnter = useCallback(
    (name: string) => {
      // 모바일에서는 hover 이벤트 무시
      if (!isMobile) {
        setHoveredName(name);
      }
    },
    [isMobile]
  );

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
    <div
      ref={mapContainerRef}
      className="relative w-full"
      style={{
        touchAction: isMobile ? "pinch-zoom" : "auto",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
      }}
    >
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
          className="fixed z-50 flex items-center justify-center"
          style={{
            left: `${modalViewport.left}px`,
            top: `${modalViewport.top}px`,
            width: `${modalViewport.width}px`,
            height: `${modalViewport.height}px`,
          }}
          onClick={() => setSelectedMobileRegion(null)}
        >
          <div
            className="bg-white rounded-lg p-3 shadow-lg"
            style={{
              width: `${300 + (modalViewport.scale - 1) * 100}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-bold mb-2 text-center text-gray-800">{selectedMobileRegion}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const region = selectedMobileRegion;
                  setSelectedMobileRegion(null);
                  navigate(`/test?region=${encodeURIComponent(region)}`);
                }}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-1.5 px-2 rounded text-xs transition-colors"
              >
                이동
              </button>
              <button
                onClick={() => setSelectedMobileRegion(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1.5 px-2 rounded text-xs transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {processedFeatures.map((feature) => {
          const isSelectedRegion = isMobile ? selectedMobileRegion === feature.name : selectedName === feature.name;
          const hasSelectedRegion = isMobile ? selectedMobileRegion !== null : selectedName !== null;

          return (
            <MapRegion
              key={feature.id}
              pathData={feature.pathData}
              name={feature.name}
              isSelected={isSelectedRegion}
              isHovered={hoveredName === feature.name}
              hasSelection={hasSelectedRegion}
              hasHover={hoveredName !== null}
              onMouseEnter={() => handleMouseEnter(feature.name)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleRegionClick(feature.name)}
            />
          );
        })}
      </svg>
    </div>
  );
}
