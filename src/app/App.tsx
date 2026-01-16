import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Layout from "@/shared/components/Layout/Layout";
import { MapDataProvider } from "@/context/MapDataContext";

// Lazy load pages
const HomePage = lazy(() => import("@/pages/HomePage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const TestPage = lazy(() => import("@/pages/TestPage"));
const TestPage2 = lazy(() => import("@/pages/TestPage2"));
const PoliticalStructurePage = lazy(() => import("@/pages/PoliticalStructurePage"));
const BoardListPage = lazy(() => import("@/pages/BoardListPage"));
const BoardWritePage = lazy(() => import("@/pages/BoardWritePage"));
const BoardDetailPage = lazy(() => import("@/pages/BoardDetailPage"));
const BoardEditPage = lazy(() => import("@/pages/BoardEditPage"));
const AssemblyMemberDetailPage = lazy(() => import("@/pages/AssemblyMemberDetailPage"));
const PoliticalTestPage = lazy(() => import("@/pages/PoliticalTestPage"));
const PoliticalTestResultPage = lazy(() => import("@/pages/PoliticalTestResultPage"));

function App() {
  return (
    <HelmetProvider>
      <MapDataProvider>
        <div className="min-h-screen bg-gray-50">
          <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full" />
            </div>
          }>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="structure" element={<PoliticalStructurePage />} />
                <Route path="test" element={<TestPage />} />
                <Route path="test2" element={<TestPage2 />} />
                <Route path="political-test" element={<PoliticalTestPage />} />
                <Route path="political-test/result" element={<PoliticalTestResultPage />} />
                <Route path="assembly/:name" element={<AssemblyMemberDetailPage />} />
                <Route path="board" element={<BoardListPage />} />
                <Route path="board/write" element={<BoardWritePage />} />
                <Route path="board/:id" element={<BoardDetailPage />} />
                <Route path="board/:id/edit" element={<BoardEditPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Suspense>
        </div>
      </MapDataProvider>
    </HelmetProvider>
  );
}

export default App;
