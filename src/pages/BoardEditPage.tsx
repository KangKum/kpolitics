import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Post } from "@/types/board";

// 백엔드 API URL 환경변수
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4001";

export default function BoardEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    password: "",
  });
  const [useAdminPassword, setUseAdminPassword] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost();
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
      const post: Post = data.post;

      setFormData({
        title: post.title,
        content: post.content,
        password: "",
      });
    } catch (e) {
      setError("게시글을 불러오는 데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.length < 1 || formData.title.length > 100) {
      newErrors.title = "제목은 1~100자여야 합니다";
    }
    if (!formData.content || formData.content.length < 1 || formData.content.length > 5000) {
      newErrors.content = "내용은 1~5000자여야 합니다";
    }
    if (!useAdminPassword && (!formData.password || formData.password.length < 4 || formData.password.length > 20)) {
      newErrors.password = "비밀번호는 4~20자여야 합니다";
    }
    if (useAdminPassword && (!adminPassword || adminPassword.length < 1)) {
      newErrors.adminPassword = "관리자 비밀번호를 입력해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 입력 시 해당 필드 에러 제거
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const requestBody = useAdminPassword
        ? {
            title: formData.title,
            content: formData.content,
            adminPassword: adminPassword,
          }
        : {
            title: formData.title,
            content: formData.content,
            password: formData.password,
          };

      const res = await fetch(`${BACKEND_URL}/api/board/posts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "게시글 수정 실패");
      }

      alert("게시글이 수정되었습니다");
      navigate(`/board/${id}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "게시글 수정에 실패했습니다");
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">글 수정</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 제목 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            제목
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="제목을 입력하세요 (1~100자)"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>

        {/* 내용 */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            내용
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={15}
            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y ${
              errors.content ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="내용을 입력하세요 (1~5000자)"
          />
          {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
          <p className="mt-1 text-sm text-gray-500">{formData.content.length} / 5000자</p>
        </div>

        {/* 비밀번호 */}
        {!useAdminPassword && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="비밀번호를 입력하세요 (4~20자)"
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            <p className="mt-1 text-sm text-gray-500">작성 시 사용한 비밀번호를 입력하세요</p>
          </div>
        )}

        {/* 관리자 비밀번호 */}
        {useAdminPassword && (
          <div>
            <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-2">
              관리자 비밀번호
            </label>
            <input
              type="password"
              id="adminPassword"
              value={adminPassword}
              onChange={(e) => {
                setAdminPassword(e.target.value);
                if (errors.adminPassword) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.adminPassword;
                    return newErrors;
                  });
                }
              }}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.adminPassword ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="관리자 비밀번호를 입력하세요"
            />
            {errors.adminPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.adminPassword}</p>
            )}
          </div>
        )}

        {/* 관리자 권한 체크박스 */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={useAdminPassword}
              onChange={(e) => {
                setUseAdminPassword(e.target.checked);
                setFormData((prev) => ({ ...prev, password: "" }));
                setAdminPassword("");
                setErrors({});
              }}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">관리자 권한으로 수정</span>
          </label>
        </div>

        {/* 버튼 */}
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 px-6 py-3 rounded-md text-white font-semibold transition ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "수정 중..." : "수정하기"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/board/${id}`)}
            className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-400 transition font-semibold"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
