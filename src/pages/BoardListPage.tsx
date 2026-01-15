import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PostsResponse } from "@/types/board";
import Pagination from "@/shared/components/ui/Pagination";

// 백엔드 API URL 환경변수
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4001";

export default function BoardListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

  const [postsResponse, setPostsResponse] = useState<PostsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const fetchPosts = async (page: number) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${BACKEND_URL}/api/board/posts?page=${page}&limit=15`);
      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      const data = await res.json();
      setPostsResponse(data);
    } catch (e) {
      setError("게시글을 불러오는 데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (loading) return <div className="p-6">로딩 중...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!postsResponse) return <div className="p-6">데이터 없음</div>;

  const { posts, pagination } = postsResponse;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">게시판</h1>
        <Link
          to="/board/write"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          글쓰기
        </Link>
      </div>

      {/* 데스크톱 테이블 (md 이상) */}
      <div className="hidden md:block overflow-x-auto border rounded-lg">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-3 text-left w-16">번호</th>
              <th className="border px-4 py-3 text-left">제목</th>
              <th className="border px-4 py-3 text-left w-28">작성자</th>
              <th className="border px-4 py-3 text-center w-20">조회</th>
              <th className="border px-4 py-3 text-center w-32">작성일</th>
              <th className="border px-4 py-3 text-center w-20">댓글</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="border px-4 py-8 text-center text-gray-500">
                  게시글이 없습니다
                </td>
              </tr>
            ) : (
              posts.map((post, index) => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-3 text-center">
                    {pagination.totalPosts - (pagination.currentPage - 1) * pagination.limit - index}
                  </td>
                  <td className="border px-4 py-3">
                    <Link to={`/board/${post._id}`} className="text-blue-600 hover:underline">
                      {post.title}
                    </Link>
                  </td>
                  <td className="border px-4 py-3">{post.nickname}</td>
                  <td className="border px-4 py-3 text-center">{post.viewCount}</td>
                  <td className="border px-4 py-3 text-center text-sm text-gray-600">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="border px-4 py-3 text-center">
                    <span className="text-blue-600">{post.commentCount || 0}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 모바일 카드 (md 미만) */}
      <div className="md:hidden space-y-4">
        {posts.length === 0 ? (
          <div className="border rounded-lg p-8 text-center text-gray-500">게시글이 없습니다</div>
        ) : (
          posts.map((post, index) => (
            <Link
              key={post._id}
              to={`/board/${post._id}`}
              className="block border rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg flex-1">{post.title}</h3>
                <span className="text-sm text-gray-500 ml-2">
                  #{pagination.totalPosts - (pagination.currentPage - 1) * pagination.limit - index}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{post.nickname}</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                <span>조회 {post.viewCount}</span>
                <span className="text-blue-600">댓글 {post.commentCount || 0}</span>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
