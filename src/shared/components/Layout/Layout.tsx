import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import JsonLd from "@/shared/components/SEO/JsonLd";

export default function Layout() {
  const location = useLocation();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "한국 정치인 정보",
    "url": "https://www.kpolitics.co.kr",
    "logo": "https://www.kpolitics.co.kr/kp_icon-512x512.png",
    "description": "대한민국 전국 정치인 정보 제공 플랫폼"
  };

  // 페이지 이동 시 확대 배율 초기화 및 스크롤 상단 이동
  useEffect(() => {
    // 스크롤을 최상단으로 이동
    window.scrollTo(0, 0);

    // 모바일 환경에서 viewport 초기화
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      // viewport를 임시로 제거 후 다시 추가하여 강제 리셋
      const content = viewportMeta.getAttribute('content');
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');

      // 즉시 원래 설정으로 복구 (user-scalable을 다시 허용)
      setTimeout(() => {
        viewportMeta.setAttribute('content', content || 'width=device-width, initial-scale=1.0');
      }, 100);
    }
  }, [location.pathname, location.search]);

  return (
    <>
      <JsonLd data={organizationSchema} />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
