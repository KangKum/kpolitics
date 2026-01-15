# 배포 가이드

이 문서는 한국 정치인 정보 웹사이트를 Vercel(프론트엔드)과 Render(백엔드)에 배포하는 전체 프로세스를 설명합니다.

## 목차
1. [사전 준비](#사전-준비)
2. [백엔드 배포 (Render)](#백엔드-배포-render)
3. [프론트엔드 배포 (Vercel)](#프론트엔드-배포-vercel)
4. [배포 후 확인](#배포-후-확인)
5. [트러블슈팅](#트러블슈팅)

---

## 사전 준비

### 1. GitHub 저장소 생성
```bash
# 프론트엔드와 백엔드를 별도 저장소로 관리 (권장)
# 또는 모노레포로 관리

# 백엔드 저장소
cd kpoliticsBack
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/kpolitics-backend.git
git push -u origin main

# 프론트엔드 저장소
cd kpolitics
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/kpolitics-frontend.git
git push -u origin main
```

### 2. 필수 API 키 발급
- **국회 Open API**: https://open.assembly.go.kr/portal/openapi/main.do
- **공공데이터포털 (선거 API)**: https://www.data.go.kr/

---

## 백엔드 배포 (Render)

### 1단계: Render 계정 생성 및 서비스 추가
1. https://render.com 에서 GitHub 계정으로 로그인
2. Dashboard에서 **New +** 버튼 클릭
3. **Web Service** 선택

### 2단계: 저장소 연결
1. 백엔드 GitHub 저장소 선택
2. 설정 입력:
   - **Name**: `kpolitics-backend`
   - **Region**: `Singapore` (한국과 가장 가까운 지역)
   - **Branch**: `main`
   - **Root Directory**: (모노레포인 경우 `kpoliticsBack` 입력)
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: `Free`

### 3단계: 환경 변수 설정
Render 대시보드에서 **Environment** 탭 이동 후 아래 환경변수 추가:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kpolitics?retryWrites=true&w=majority
VITE_ASSEMBLY_API_KEY=your_assembly_api_key
VITE_API_BASE_URL=https://open.assembly.go.kr/portal/openapi
ADMIN_PASSWORD=your_secure_admin_password
VITE_DATAGO_API_KEY=your_datago_api_key
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

**주의**: `FRONTEND_URL`은 Vercel 배포 후 실제 도메인으로 업데이트 필요

### 4단계: 배포
1. **Create Web Service** 클릭
2. 빌드 및 배포 자동 시작 (5~10분 소요)
3. 배포 완료 후 URL 확인: `https://kpolitics-backend.onrender.com`

### 5단계: Health Check 확인
```bash
# 백엔드가 정상 작동하는지 확인
curl https://kpolitics-backend.onrender.com/api/governors/metropolitan
```

---

## 프론트엔드 배포 (Vercel)

### 1단계: Vercel 계정 생성 및 프로젝트 추가
1. https://vercel.com 에서 GitHub 계정으로 로그인
2. **Add New...** → **Project** 선택

### 2단계: 저장소 연결
1. 프론트엔드 GitHub 저장소 선택
2. **Import** 클릭
3. 설정 확인:
   - **Framework Preset**: `Vite` (자동 감지)
   - **Root Directory**: `./` (또는 `kpolitics` for 모노레포)
   - **Build Command**: `npm run build` (자동)
   - **Output Directory**: `dist` (자동)

### 3단계: 환경 변수 설정
**Environment Variables** 섹션에서 추가:

```
VITE_ASSEMBLY_API_KEY=your_assembly_api_key
VITE_API_BASE_URL=https://open.assembly.go.kr/portal/openapi
VITE_BACKEND_URL=https://kpolitics-backend.onrender.com
```

**중요**: Render에서 생성된 백엔드 URL을 `VITE_BACKEND_URL`에 입력

### 4단계: 배포
1. **Deploy** 클릭
2. 빌드 완료 후 URL 확인: `https://your-project.vercel.app`

### 5단계: Render에서 CORS 업데이트
1. Render 대시보드 → 백엔드 서비스 → **Environment** 탭
2. `FRONTEND_URL` 환경변수를 Vercel 도메인으로 업데이트:
   ```
   FRONTEND_URL=https://your-project.vercel.app
   ```
3. 서비스 재배포 (자동 시작)

---

## 배포 후 확인

### 체크리스트
- [ ] 백엔드 API 응답 확인 (`/api/governors/metropolitan`)
- [ ] 프론트엔드 페이지 로드 확인
- [ ] 프론트엔드 → 백엔드 API 통신 확인 (Network 탭)
- [ ] CORS 에러 없는지 확인
- [ ] 지도 클릭 시 데이터 로드 확인
- [ ] 게시판 CRUD 기능 테스트
- [ ] 모바일 반응형 확인

### 성능 최적화 (선택사항)
- Vercel에서 Custom Domain 연결
- Render에서 Persistent Disk 설정 (유료)
- MongoDB Atlas에서 인덱스 최적화
- Vercel Analytics 활성화

---

## 트러블슈팅

### 1. 백엔드가 Sleep 상태에서 깨어나지 않음
**증상**: 첫 요청 시 30초 이상 대기
**해결**: Render Free Plan의 제한사항. Cron Job 또는 외부 Uptime Monitor로 주기적 ping 전송
```bash
# 예: cron-job.org에서 5분마다 ping
https://kpolitics-backend.onrender.com/api/governors/metropolitan
```

### 2. CORS 에러 발생
**증상**: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`
**해결**:
1. Render 환경변수 `FRONTEND_URL`이 Vercel 도메인과 일치하는지 확인
2. 쉼표로 구분하여 여러 도메인 허용 가능:
   ```
   FRONTEND_URL=https://app1.vercel.app,https://app2.vercel.app
   ```

### 3. Puppeteer 실행 실패
**증상**: 단체장 데이터 스크래핑 실패
**해결**: Render는 Puppeteer를 기본 지원. 로그 확인 후 메모리 부족 시 Render Pro Plan 고려

### 4. 환경 변수가 적용되지 않음
**증상**: `undefined` 또는 로컬 값 사용됨
**해결**:
- **Vercel**: 환경변수는 빌드 시점에 주입되므로 수정 후 재배포 필요
- **Render**: 환경변수 수정 시 자동 재배포

### 5. MongoDB 연결 실패
**증상**: `MongoServerError: bad auth`
**해결**:
1. MongoDB Atlas에서 IP 화이트리스트 확인 (0.0.0.0/0 허용)
2. 사용자 권한 확인 (읽기/쓰기 권한)
3. 연결 문자열 형식 확인

### 6. 빌드 실패
**프론트엔드**:
- `node_modules` 삭제 후 재설치
- `package-lock.json` 커밋 확인

**백엔드**:
- TypeScript 컴파일 에러 확인
- `tsconfig.json`의 `outDir` 경로 확인

---

## 추가 자료

- [Render 문서](https://render.com/docs)
- [Vercel 문서](https://vercel.com/docs)
- [MongoDB Atlas 문서](https://www.mongodb.com/docs/atlas/)
- [Puppeteer on Render](https://render.com/docs/puppeteer)

---

## 연락처
문제가 발생하면 GitHub Issues에 등록해주세요.
