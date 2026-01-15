import { Routes, Route } from "react-router-dom";
import Layout from "@/shared/components/Layout/Layout";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import TestPage from "@/pages/TestPage";
import TestPage2 from "@/pages/TestPage2";
import PoliticalStructurePage from "@/pages/PoliticalStructurePage";
import BoardListPage from "@/pages/BoardListPage";
import BoardWritePage from "@/pages/BoardWritePage";
import BoardDetailPage from "@/pages/BoardDetailPage";
import BoardEditPage from "@/pages/BoardEditPage";
import AssemblyMemberDetailPage from "@/pages/AssemblyMemberDetailPage";
import { MapDataProvider } from "@/context/MapDataContext";

function App() {
  return (
    <MapDataProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="structure" element={<PoliticalStructurePage />} />
            <Route path="test" element={<TestPage />} />
            <Route path="test2" element={<TestPage2 />} />
            <Route path="assembly/:name" element={<AssemblyMemberDetailPage />} />
            <Route path="board" element={<BoardListPage />} />
            <Route path="board/write" element={<BoardWritePage />} />
            <Route path="board/:id" element={<BoardDetailPage />} />
            <Route path="board/:id/edit" element={<BoardEditPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </div>
    </MapDataProvider>
  );
}

export default App;
