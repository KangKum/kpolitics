import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center" onClick={closeMobileMenu}>
            <h1 className="text-2xl font-bold text-gray-900">K-politics</h1>
          </Link>

          {/* 데스크톱 메뉴 */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className={`text-gray-700 hover:text-gray-900 transition ${location.pathname === "/" ? "font-bold text-gray-900" : ""}`}>
              지도
            </Link>
            <Link
              to="/structure"
              className={`text-gray-700 hover:text-gray-900 transition ${location.pathname === "/structure" ? "font-bold text-gray-900" : ""}`}
            >
              선거구조
            </Link>
            <Link
              to="/political-test"
              className={`text-gray-700 hover:text-gray-900 transition whitespace-nowrap ${location.pathname.startsWith("/political-test") ? "font-bold text-gray-900" : ""}`}
            >
              정치성향 테스트
            </Link>
            <Link
              to="/board"
              className={`text-gray-700 hover:text-gray-900 transition ${location.pathname.startsWith("/board") ? "font-bold text-gray-900" : ""}`}
            >
              게시판
            </Link>
          </nav>

          {/* 모바일 햄버거 버튼 */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="메뉴 열기"
          >
            {mobileMenuOpen ? (
              // X 아이콘
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // 햄버거 아이콘
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* 모바일 메뉴 오버레이 배경 */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-transparent z-40"
            onClick={closeMobileMenu}
          />
        )}

        {/* 모바일 메뉴 (펼쳤을 때) */}
        {mobileMenuOpen && (
          <nav className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t z-50 py-4 px-4 space-y-3">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className={`block py-2 text-right text-gray-700 hover:text-gray-900 transition ${location.pathname === "/" ? "font-bold text-gray-900" : ""}`}
            >
              지도
            </Link>
            <Link
              to="/structure"
              onClick={closeMobileMenu}
              className={`block py-2 text-right text-gray-700 hover:text-gray-900 transition ${location.pathname === "/structure" ? "font-bold text-gray-900" : ""}`}
            >
              선거구조
            </Link>
            <Link
              to="/political-test"
              onClick={closeMobileMenu}
              className={`block py-2 text-right text-gray-700 hover:text-gray-900 transition ${location.pathname.startsWith("/political-test") ? "font-bold text-gray-900" : ""}`}
            >
              정치성향 테스트
            </Link>
            <Link
              to="/board"
              onClick={closeMobileMenu}
              className={`block py-2 text-right text-gray-700 hover:text-gray-900 transition ${location.pathname.startsWith("/board") ? "font-bold text-gray-900" : ""}`}
            >
              게시판
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
