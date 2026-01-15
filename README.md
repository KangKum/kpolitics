# 한국 정치인 정보 웹사이트

한국의 17개 광역시/도를 인터랙티브 지도로 표시하고, 지역별 국회의원 정보를 확인할 수 있는 웹 애플리케이션입니다.

## 주요 기능

- 🗺️ 한국 지도 인터랙티브 SVG 표시
- 🖱️ 지역 hover 시 지역명 툴팁 표시
- 📍 지역 클릭 시 해당 지역 국회의원 목록 표시
- 👤 국회의원 이름 및 소속 정당 정보 제공
- 📱 반응형 디자인 (모바일/태블릿/데스크톱)

## 기술 스택

- **프레임워크**: React 18 + TypeScript
- **빌드 도구**: Vite
- **라우팅**: React Router v6
- **스타일링**: Tailwind CSS
- **HTTP 클라이언트**: Axios
- **데이터 출처**: 국회 Open API

## 시작하기

### 1. 환경 변수 설정

`.env.local` 파일을 생성하고 국회 API 키를 설정하세요:

```bash
VITE_ASSEMBLY_API_KEY=your_api_key_here
VITE_API_BASE_URL=https://open.assembly.go.kr/portal/openapi
```

**API 키 발급 방법:**
1. [국회 열린 데이터 광장](https://open.assembly.go.kr/portal/openapi/main.do) 접속
2. 회원가입 및 로그인
3. API 인증키 발급

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 4. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

## 프로젝트 구조

```
kpolitics/
├── src/
│   ├── app/                    # 앱 설정
│   ├── features/
│   │   ├── map/               # 지도 기능
│   │   └── politicians/       # 국회의원 기능
│   ├── pages/                 # 페이지 컴포넌트
│   ├── shared/                # 공통 컴포넌트/유틸
│   ├── styles/                # 전역 스타일
│   └── types/                 # TypeScript 타입
├── public/                    # 정적 파일
└── ...
```

## 배포 (Vercel)

### Vercel CLI 사용

```bash
npm install -g vercel
vercel login
vercel
```

### Vercel 웹 대시보드 사용

1. [Vercel](https://vercel.com) 접속
2. GitHub 저장소 연결
3. 환경 변수 설정:
   - `VITE_ASSEMBLY_API_KEY`: 국회 API 키
   - `VITE_API_BASE_URL`: `https://open.assembly.go.kr/portal/openapi`
4. 배포 시작

## 향후 개선 계획

- [ ] 실제 한국 지도 SVG path 데이터 적용
- [ ] 검색 및 필터링 기능
- [ ] 국회의원 상세 페이지
- [ ] 정당별 색상 구분
- [ ] 지역별 통계 차트
- [ ] 캐싱 최적화

## 라이선스

MIT

## 참고

- [국회 Open API](https://open.assembly.go.kr/portal/openapi/main.do)
- [React 문서](https://react.dev/)
- [Vite 문서](https://vitejs.dev/)
- [Tailwind CSS 문서](https://tailwindcss.com/)
