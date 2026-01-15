// 공약 타입 정의

export interface Pledge {
  prmsOrd: number;           // 공약 순번
  prmsRealmName: string;     // 공약 분야명
  prmsTitle: string;         // 공약 제목
  prmsCont: string;          // 공약 내용
}

export interface PledgeResponse {
  resultCode: string;
  resultMsg: string;
  krName: string;            // 후보자명
  partyName: string;         // 정당명
  sidoName: string;          // 시도명
  sggName?: string;          // 선거구명
  prmsCnt: number;           // 공약 개수
  pledges: Pledge[];         // 공약 목록 (1~10)
}
