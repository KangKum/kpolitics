import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import JsonLd from "@/shared/components/SEO/JsonLd";

export default function Layout() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "한국 정치인 정보",
    "url": "https://www.kpolitics.co.kr",
    "logo": "https://www.kpolitics.co.kr/og-image.png",
    "description": "대한민국 전국 정치인 정보 제공 플랫폼"
  };

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
