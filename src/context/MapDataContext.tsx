import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { feature } from "topojson-client";

type GeoJSON = {
  type: "FeatureCollection";
  features: any[];
};

type TopoJSON = {
  type: "Topology";
  objects: { [key: string]: any };
  arcs: any[];
  transform?: any;
};

interface MapDataContextType {
  geoData: GeoJSON | null;
  isLoading: boolean;
  error: string | null;
}

const MapDataContext = createContext<MapDataContextType | undefined>(undefined);

export function MapDataProvider({ children }: { children: ReactNode }) {
  const [geoData, setGeoData] = useState<GeoJSON | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch once when the provider mounts
    fetch("/maps/korea-provinces.topojson")
      .then((res) => res.json())
      .then((topoData: TopoJSON) => {
        const objectKey = Object.keys(topoData.objects)[0];
        const geoJson = feature(topoData, topoData.objects[objectKey]) as any;
        setGeoData(geoJson);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("지도 데이터 로드 에러:", err);
        setError("지도 데이터를 불러오는데 실패했습니다.");
        setIsLoading(false);
      });
  }, []);

  return (
    <MapDataContext.Provider value={{ geoData, isLoading, error }}>
      {children}
    </MapDataContext.Provider>
  );
}

export function useMapData() {
  const context = useContext(MapDataContext);
  if (context === undefined) {
    throw new Error("useMapData must be used within a MapDataProvider");
  }
  return context;
}
