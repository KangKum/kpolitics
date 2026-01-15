# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

한국 정치인 정보 웹사이트 - 17개 광역시/도의 인터랙티브 지도를 통해 지역별 국회의원 정보를 제공하는 React 웹 애플리케이션입니다.

## 개발 명령어

### 개발 서버 실행
```bash
npm run dev
```
- Vite 개발 서버가 포트 3000에서 실행됩니다
- 브라우저가 자동으로 열립니다

### 프로덕션 빌드
```bash
npm run build
```
- TypeScript 컴파일 후 Vite 빌드 실행
- 빌드 결과물은 `dist` 폴더에 생성됩니다

### 프리뷰
```bash
npm run preview
```
- 프로덕션 빌드의 결과물을 로컬에서 미리 확인

## 환경 변수

`.env.local` 파일 필요:
```
VITE_ASSEMBLY_API_KEY=your_api_key_here
VITE_API_BASE_URL=https://open.assembly.go.kr/portal/openapi
```

API 키는 [국회 열린 데이터 광장](https://open.assembly.go.kr/portal/openapi/main.do)에서 발급받습니다.

## 아키텍처 구조

### 디렉토리 구조
- `src/app/` - 애플리케이션 최상위 설정 (App.tsx)
- `src/context/` - React Context (MapDataContext: TopoJSON 데이터 전역 관리)
- `src/components/` - 도메인별 컴포넌트 (지도 관련)
- `src/pages/` - 라우트별 페이지 컴포넌트
- `src/shared/` - 공통 컴포넌트 및 유틸리티
  - `shared/components/Layout/` - 레이아웃 컴포넌트
  - `shared/components/ui/` - 재사용 가능한 UI 컴포넌트
  - `shared/utils/` - 유틸리티 함수 (API 클라이언트 등)
- `src/types/` - TypeScript 타입 정의
- `src/styles/` - 전역 스타일 (Tailwind CSS)
- `public/maps/` - TopoJSON 지도 데이터 파일

### 핵심 아키텍처 패턴

#### 1. 지도 데이터 관리 (Context + Provider)
- `MapDataContext`를 통해 TopoJSON 데이터를 전역으로 관리
- 앱 최상위에서 `MapDataProvider`로 래핑하여 지도 데이터를 한 번만 로드
- `/public/maps/korea-provinces.topojson` 파일을 fetch하여 GeoJSON으로 변환

#### 2. 지도 렌더링 플로우
1. `MapDataContext`에서 TopoJSON을 fetch하고 `topojson-client`의 `feature()` 함수로 GeoJSON 변환
2. `KoreaMap` 컴포넌트에서 d3-geo의 `geoMercator` projection과 `geoPath` 사용
3. `useMemo`를 통해 지도 경로 데이터 계산을 최적화
4. 영문 지역명을 한글로 매핑 (`KOREAN_NAME_MAP`)
5. `MapRegion` 컴포넌트로 각 지역을 SVG path로 렌더링

#### 3. 라우팅 구조
- React Router v6 사용
- 모든 페이지가 `Layout` 컴포넌트로 래핑됨
- 지역 클릭 시 `/test?region=지역명` 형태로 네비게이션

#### 4. API 통신
- Axios 인스턴스를 `src/shared/utils/api.ts`에서 생성
- 국회 Open API 호출 시 공통 파라미터 (KEY, Type, pSize) 자동 설정
- Response interceptor로 에러 처리

### Path Alias
- `@/`가 `./src/`로 매핑되어 있음 (tsconfig.json, vite.config.ts)
- 예: `import Layout from "@/shared/components/Layout/Layout"`

### 반응형 디자인
- Tailwind CSS 사용
- 모든 새로운 UI는 모바일/태블릿/데스크톱을 고려하여 반응형으로 구현

## 코드 스타일
- camelCase 네이밍 규칙
- 코드 주석은 한국어로 작성
- TypeScript strict 모드 활성화
- React 함수형 컴포넌트 + Hooks 사용
