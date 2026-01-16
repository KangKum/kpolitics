import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Post, Comment, CommentFormData } from "@/types/board";
import CommentItem from "@/components/board/CommentItem";
import PasswordModal from "@/shared/components/ui/PasswordModal";

// 백엔드 API URL 환경변수
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4001";

export default function BoardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 조회수 증가 중복 방지 (React StrictMode 대응)
  const hasIncrementedView = useRef<string | null>(null);

  // 댓글 작성 폼
  const [commentForm, setCommentForm] = useState<CommentFormData>({
    content: "",
    nickname: "",
    password: "",
  });
  const [commentErrors, setCommentErrors] = useState<Record<string, string>>({});
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // 비밀번호 모달 (게시글 수정/삭제)
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordModalType, setPasswordModalType] = useState<"edit" | "delete">("delete");

  useEffect(() => {
    // 이미 이 게시글의 조회수를 증가시켰는지 확인
    if (id && hasIncrementedView.current !== id) {
      hasIncrementedView.current = id;
      fetchPost();
      fetchComments();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${BACKEND_URL}/api/board/posts/${id}`);
      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      const data = await res.json();
      setPost(data.post);
    } catch (e) {
      setError("게시글을 불러오는 데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/board/posts/${id}/comments`);
      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      const data = await res.json();
      setComments(data.comments);
    } catch (e) {
      // 댓글 로드 실패 시 조용히 무시
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 게시글 삭제/수정 모달 열기
  const handlePostAction = (action: "edit" | "delete") => {
    setPasswordModalType(action);
    setShowPasswordModal(true);
  };

  // 게시글 삭제/수정 비밀번호 제출
  const handlePasswordSubmit = async (password: string, adminPassword?: string) => {
    try {
      if (passwordModalType === "delete") {
        const res = await fetch(`${BACKEND_URL}/api/board/posts/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, adminPassword }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "게시글 삭제 실패");
        }

        alert("게시글이 삭제되었습니다");
        navigate("/board");
      } else {
        // 수정: 비밀번호 검증만 하고 수정 페이지로 이동
        const res = await fetch(`${BACKEND_URL}/api/board/posts/${id}/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, adminPassword }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "비밀번호 검증 실패");
        }

        navigate(`/board/${id}/edit`);
      }

      setShowPasswordModal(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : "작업에 실패했습니다");
    }
  };

  // 댓글 작성
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!commentForm.content || commentForm.content.length < 1 || commentForm.content.length > 500) {
      newErrors.content = "댓글은 1~500자여야 합니다";
    }
    if (!commentForm.nickname || commentForm.nickname.length < 1 || commentForm.nickname.length > 20) {
      newErrors.nickname = "닉네임은 1~20자여야 합니다";
    }
    if (!commentForm.password || commentForm.password.length < 4 || commentForm.password.length > 20) {
      newErrors.password = "비밀번호는 4~20자여야 합니다";
    }

    setCommentErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setIsSubmittingComment(true);

      const res = await fetch(`${BACKEND_URL}/api/board/posts/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentForm),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "댓글 작성 실패");
      }

      // 댓글 목록 새로고침
      await fetchComments();

      // 폼 초기화
      setCommentForm({ content: "", nickname: "", password: "" });
      setCommentErrors({});
    } catch (error) {
      alert(error instanceof Error ? error.message : "댓글 작성에 실패했습니다");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // 댓글 수정
  const handleCommentUpdate = async (
    commentId: string,
    content: string,
    password: string,
    adminPassword?: string
  ) => {
    const res = await fetch(`${BACKEND_URL}/api/board/comments/${commentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, password, adminPassword }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "댓글 수정 실패");
    }

    // 댓글 목록 새로고침
    await fetchComments();
  };

  // 댓글 삭제
  const handleCommentDelete = async (commentId: string, password: string, adminPassword?: string) => {
    const res = await fetch(`${BACKEND_URL}/api/board/comments/${commentId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, adminPassword }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "댓글 삭제 실패");
    }

    // 댓글 목록 새로고침
    await fetchComments();
  };

  const handleCommentFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCommentForm((prev) => ({ ...prev, [name]: value }));
    // 입력 시 해당 필드 에러 제거
    if (commentErrors[name]) {
      setCommentErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">게시글을 불러오는 중...</p>
        </div>
      </div>
    );
  }
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!post) return <div className="p-6">게시글을 찾을 수 없습니다</div>;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* 게시글 */}
      <div className="bg-white border rounded-lg p-4 sm:p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4 break-words">{post.title}</h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 pb-4 border-b text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span className="font-medium">{post.nickname}</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>조회 {post.viewCount}</span>
            <span>댓글 {comments.length}</span>
          </div>
        </div>

        <div className="text-gray-700 whitespace-pre-wrap mb-6 leading-relaxed">{post.content}</div>

        {/* 게시글 버튼 */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <Link
            to="/board"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
          >
            목록
          </Link>
          <button
            onClick={() => handlePostAction("edit")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            수정
          </button>
          <button
            onClick={() => handlePostAction("delete")}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            삭제
          </button>
        </div>
      </div>

      {/* 댓글 영역 */}
      <div className="bg-white border rounded-lg p-4 sm:p-6">
        <h2 className="text-xl font-bold mb-4">댓글 ({comments.length})</h2>

        {/* 댓글 목록 */}
        <div className="mb-6">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">첫 댓글을 작성해보세요</p>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                onUpdate={handleCommentUpdate}
                onDelete={handleCommentDelete}
              />
            ))
          )}
        </div>

        {/* 댓글 작성 폼 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-3">댓글 작성</h3>
          <form onSubmit={handleCommentSubmit} className="space-y-3">
            {/* 닉네임, 비밀번호 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  name="nickname"
                  value={commentForm.nickname}
                  onChange={handleCommentFormChange}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    commentErrors.nickname ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="닉네임 (1~20자)"
                />
                {commentErrors.nickname && (
                  <p className="mt-1 text-sm text-red-500">{commentErrors.nickname}</p>
                )}
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  value={commentForm.password}
                  onChange={handleCommentFormChange}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    commentErrors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="비밀번호 (4~20자)"
                />
                {commentErrors.password && (
                  <p className="mt-1 text-sm text-red-500">{commentErrors.password}</p>
                )}
              </div>
            </div>

            {/* 댓글 내용 */}
            <div>
              <textarea
                name="content"
                value={commentForm.content}
                onChange={handleCommentFormChange}
                rows={4}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y ${
                  commentErrors.content ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="댓글 내용 (1~500자)"
              />
              {commentErrors.content && (
                <p className="mt-1 text-sm text-red-500">{commentErrors.content}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">{commentForm.content.length} / 500자</p>
            </div>

            <button
              type="submit"
              disabled={isSubmittingComment}
              className={`w-full px-4 py-2 rounded-md text-white font-semibold transition ${
                isSubmittingComment
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmittingComment ? "작성 중..." : "댓글 작성"}
            </button>
          </form>
        </div>
      </div>

      {/* 비밀번호 모달 */}
      <PasswordModal
        isOpen={showPasswordModal}
        title={passwordModalType === "delete" ? "게시글 삭제" : "게시글 수정"}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handlePasswordSubmit}
        showAdminOption={true}
      />
    </div>
  );
}
