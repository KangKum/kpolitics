import { useState } from "react";

interface PasswordModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (password: string, adminPassword?: string) => void;
  showAdminOption?: boolean;
}

export default function PasswordModal({
  isOpen,
  title,
  onClose,
  onSubmit,
  showAdminOption = false,
}: PasswordModalProps) {
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [useAdminPassword, setUseAdminPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (useAdminPassword && adminPassword) {
      onSubmit("", adminPassword);
    } else if (password) {
      onSubmit(password, "");
    }

    // 초기화
    setPassword("");
    setAdminPassword("");
    setUseAdminPassword(false);
  };

  const handleClose = () => {
    setPassword("");
    setAdminPassword("");
    setUseAdminPassword(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        <form onSubmit={handleSubmit}>
          {/* 일반 비밀번호 입력 */}
          {!useAdminPassword && (
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
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
          {showAdminOption && useAdminPassword && (
            <div className="mb-4">
              <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-2">
                관리자 비밀번호
              </label>
              <input
                type="password"
                id="adminPassword"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="관리자 비밀번호를 입력하세요"
                required={useAdminPassword}
                autoFocus
              />
            </div>
          )}

          {/* 관리자 권한 옵션 */}
          {showAdminOption && (
            <div className="mb-4">
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
          )}

          {/* 버튼 */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              확인
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
