import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">K-politics</h1>
          </Link>

          <nav className="flex space-x-6">
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
              to="/board"
              className={`text-gray-700 hover:text-gray-900 transition ${location.pathname.startsWith("/board") ? "font-bold text-gray-900" : ""}`}
            >
              게시판
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
