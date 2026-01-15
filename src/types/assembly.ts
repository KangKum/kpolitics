// 국회의원 기본 정보
export interface AssemblyMember {
  HG_NM: string; // 이름
  POLY_NM: string; // 정당
  ORIG_NM: string; // 지역구
}

// 발의 법률안
export interface Bill {
  BILL_ID?: string; // 의안ID
  BILL_NO?: string; // 의안번호
  BILL_NAME?: string; // 의안명
  PROPOSE_DT?: string; // 발의일자
  PROPOSER?: string; // 발의자
  COMMITTEE?: string; // 소관위원회
  PROC_RESULT?: string; // 처리결과
  [key: string]: any; // API 응답의 다른 필드들
}

// 국회의원 상세 정보 응답
export interface AssemblyMemberDetailResponse {
  member: {
    name: string;
    party: string;
    region: string;
  };
  representativeBills: Bill[];
  jointBills: Bill[];
  statistics: {
    representativeCount: number;
    jointCount: number;
    totalCount: number;
  };
  lastUpdated: string;
}
