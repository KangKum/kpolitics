import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostFormData } from "@/types/board";

// 백엔드 API URL 환경변수
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4001";

export default function BoardWritePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    content: "",
    nickname: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.length < 1 || formData.title.length > 100) {
      newErrors.title = "제목은 1~100자여야 합니다";
    }
    if (!formData.content || formData.content.length < 1 || formData.content.length > 5000) {
      newErrors.content = "내용은 1~5000자여야 합니다";
    }
    if (!formData.nickname || formData.nickname.length < 1 || formData.nickname.length > 20) {
      newErrors.nickname = "닉네임은 1~20자여야 합니다";
    }
    if (!formData.password || formData.password.length < 4 || formData.password.length > 20) {
      newErrors.password = "비밀번호는 4~20자여야 합니다";
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

      const res = await fetch(`${BACKEND_URL}/api/board/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "게시글 작성 실패");
      }

      const data = await res.json();

      // 작성 완료 후 상세 페이지로 이동
      navigate(`/board/${data.postId}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "게시글 작성에 실패했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">글쓰기</h1>

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

        {/* 닉네임 */}
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
            닉네임
          </label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.nickname ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="닉네임을 입력하세요 (1~20자)"
          />
          {errors.nickname && <p className="mt-1 text-sm text-red-500">{errors.nickname}</p>}
        </div>

        {/* 비밀번호 */}
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
          <p className="mt-1 text-sm text-gray-500">게시글 수정/삭제 시 사용됩니다</p>
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
          <p className="mt-1 text-sm text-gray-500">
            {formData.content.length} / 5000자
          </p>
        </div>

        {/* 버튼 */}
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 px-6 py-3 rounded-md text-white font-semibold transition ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "작성 중..." : "작성하기"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/board")}
            className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-400 transition font-semibold"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
