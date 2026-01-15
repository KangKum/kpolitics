import { useState } from "react";
import { Comment } from "@/types/board";

interface CommentItemProps {
  comment: Comment;
  onUpdate: (commentId: string, content: string, password: string, adminPassword?: string) => Promise<void>;
  onDelete: (commentId: string, password: string, adminPassword?: string) => Promise<void>;
}

export default function CommentItem({ comment, onUpdate, onDelete }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [useAdminPassword, setUseAdminPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editContent.trim()) {
      alert("댓글 내용을 입력하세요");
      return;
    }

    try {
      if (useAdminPassword) {
        await onUpdate(comment._id, editContent, "", adminPassword);
      } else {
        await onUpdate(comment._id, editContent, password, "");
      }
      setIsEditing(false);
      setPassword("");
      setAdminPassword("");
      setUseAdminPassword(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : "댓글 수정에 실패했습니다");
    }
  };

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (useAdminPassword) {
        await onDelete(comment._id, "", adminPassword);
      } else {
        await onDelete(comment._id, password, "");
      }
      setShowDeleteConfirm(false);
      setPassword("");
      setAdminPassword("");
      setUseAdminPassword(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : "댓글 삭제에 실패했습니다");
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

  if (isEditing) {
    return (
      <div className="border-b py-4">
        <form onSubmit={handleUpdateSubmit} className="space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            rows={3}
            maxLength={500}
            placeholder="댓글 내용 (1~500자)"
          />
          <p className="text-sm text-gray-500">{editContent.length} / 500자</p>

          {/* 비밀번호 입력 */}
          {!useAdminPassword && (
            <div>
              <label htmlFor="edit-password" className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호
              </label>
              <input
                type="password"
                id="edit-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="비밀번호를 입력하세요"
                required={!useAdminPassword}
              />
            </div>
          )}

          {/* 관리자 비밀번호 입력 */}
          {useAdminPassword && (
            <div>
              <label htmlFor="edit-admin-password" className="block text-sm font-medium text-gray-700 mb-1">
                관리자 비밀번호
              </label>
              <input
                type="password"
                id="edit-admin-password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="관리자 비밀번호를 입력하세요"
                required={useAdminPassword}
              />
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
                  setPassword("");
                  setAdminPassword("");
                }}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">관리자 권한으로 수정</span>
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
            >
              저장
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditContent(comment.content);
                setPassword("");
                setAdminPassword("");
                setUseAdminPassword(false);
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition text-sm"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (showDeleteConfirm) {
    return (
      <div className="border-b py-4">
        <div className="mb-3">
          <p className="text-gray-700 mb-1">{comment.content}</p>
          <p className="text-sm text-gray-500">
            {comment.nickname} · {formatDate(comment.createdAt)}
          </p>
        </div>

        <form onSubmit={handleDeleteSubmit} className="space-y-3">
          <p className="text-sm font-medium text-red-600">정말 삭제하시겠습니까?</p>

          {/* 비밀번호 입력 */}
          {!useAdminPassword && (
            <div>
              <label htmlFor="delete-password" className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호
              </label>
              <input
                type="password"
                id="delete-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="비밀번호를 입력하세요"
                required={!useAdminPassword}
                autoFocus
              />
            </div>
          )}

          {/* 관리자 비밀번호 입력 */}
          {useAdminPassword && (
            <div>
              <label htmlFor="delete-admin-password" className="block text-sm font-medium text-gray-700 mb-1">
                관리자 비밀번호
              </label>
              <input
                type="password"
                id="delete-admin-password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="관리자 비밀번호를 입력하세요"
                required={useAdminPassword}
                autoFocus
              />
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
                  setPassword("");
                  setAdminPassword("");
                }}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">관리자 권한으로 삭제</span>
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition text-sm"
            >
              삭제
            </button>
            <button
              type="button"
              onClick={() => {
                setShowDeleteConfirm(false);
                setPassword("");
                setAdminPassword("");
                setUseAdminPassword(false);
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition text-sm"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="border-b py-4">
      <p className="text-gray-700 mb-2 whitespace-pre-wrap">{comment.content}</p>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {comment.nickname} · {formatDate(comment.createdAt)}
          {comment.updatedAt && comment.updatedAt !== comment.createdAt && " (수정됨)"}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            수정
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-sm text-red-600 hover:underline"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
