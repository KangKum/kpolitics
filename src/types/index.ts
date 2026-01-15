export interface Politician {
  id: string;
  name: string;
  party: string;
  region: string;
  district: string;
}

export interface Region {
  id: string;
  name: string;
  englishName: string;
  pathData: string;
  apiCode: string;
  color: string;
}

export interface ApiResponse {
  [key: string]: any;
}

export interface ElectionWinner {
  [key: string]: string; // 동적 필드 지원 (DataTable 호환)
}

export interface ElectionData {
  sgId: string;
  sgTypecode: string;
  winners: ElectionWinner[];
  lastUpdated: string;
}

export interface AssemblyMember {
  HG_NM: string;           // 한글명
  POLY_NM: string;         // 정당명
  ORIG_NM: string;         // 지역구명 (예: "서울 강남구갑", "비례대표")
  [key: string]: string;   // 동적 필드 지원 (DataTable 호환)
}
