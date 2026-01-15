import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AssemblyMemberDetailResponse, Bill } from "@/types/assembly";
import SEO from "@/shared/components/SEO/SEO";
import JsonLd from "@/shared/components/SEO/JsonLd";
import BreadcrumbJsonLd from "@/shared/components/SEO/BreadcrumbJsonLd";

// 백엔드 API URL 환경변수
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4001";

export default function AssemblyMemberDetailPage() {
  const { name } = useParams<{ name: string }>();
  const [data, setData] = useState<AssemblyMemberDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (name) {
      fetchMemberDetail();
    }
  }, [name]);

  const fetchMemberDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = `${BACKEND_URL}/api/assembly/member/${encodeURIComponent(name!)}`;

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      const jsonData = await res.json();
      setData(jsonData);
    } catch (e) {
      setError("국회의원 정보를 불러오는 데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      // YYYYMMDD 형식을 YYYY-MM-DD로 변환
      if (dateString.length === 8) {
        return `${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6, 8)}`;
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  const getSEOTitle = () => {
    if (!data) return "국회의원 상세 정보";
    return `${data.member.name} 국회의원 - ${data.member.region}`;
  };

  const getSEODescription = () => {
    if (!data) return "국회의원의 상세 정보를 확인하세요.";

    return `${data.member.name} 국회의원 (${data.member.party}, ${data.member.region})의 의정활동 정보입니다. 대표발의 ${data.statistics.representativeCount}건, 공동발의 ${data.statistics.jointCount}건, 총 ${data.statistics.totalCount}건의 법안을 발의했습니다.`;
  };

  const getSEOKeywords = () => {
    if (!data) return "";

    const regionParts = data.member.region.split(" ");
    const province = regionParts[0] || "";

    return `${data.member.name},국회의원,${data.member.party},${data.member.region},${province},의정활동,법안발의,대표발의,공동발의`;
  };

  const getPersonSchema = () => {
    if (!data) return null;

    return {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": data.member.name,
      "jobTitle": "국회의원",
      "affiliation": {
        "@type": "Organization",
        "name": data.member.party
      },
      "workLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressRegion": data.member.region
        }
      },
      "description": `${data.member.name} 국회의원 (${data.member.party}, ${data.member.region})의 의정활동 정보`
    };
  };

  if (loading) return <div className="p-6">로딩 중...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!data) return <div className="p-6">데이터 없음</div>;

  return (
    <>
      <SEO
        title={getSEOTitle()}
        description={getSEODescription()}
        keywords={getSEOKeywords()}
        canonical={`/assembly/${encodeURIComponent(name!)}`}
        ogType="article"
      />
      {getPersonSchema() && <JsonLd data={getPersonSchema()!} />}
      <BreadcrumbJsonLd
        items={[
          { name: "홈", url: "/" },
          { name: "전국", url: "/test" },
          { name: data.member.name, url: `/assembly/${encodeURIComponent(name!)}` }
        ]}
      />
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* 상단 버튼 */}
      <div className="mb-6">
        <Link
          to="/test"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          ← 목록으로 돌아가기
        </Link>
      </div>

      {/* 기본 프로필 */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">{data.member.name}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg">
          <div>
            <span className="text-gray-600">정당:</span>{" "}
            <span className="font-semibold">{data.member.party}</span>
          </div>
          <div>
            <span className="text-gray-600">지역구:</span>{" "}
            <span className="font-semibold">{data.member.region}</span>
          </div>
        </div>
      </div>

      {/* 국회 활동 통계 */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">국회 활동 통계</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-gray-600 text-sm mb-1">전체 발의안</div>
            <div className="text-3xl font-bold text-blue-600">
              {data.statistics.totalCount}건
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-gray-600 text-sm mb-1">대표발의안</div>
            <div className="text-3xl font-bold text-green-600">
              {data.statistics.representativeCount}건
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-gray-600 text-sm mb-1">공동발의안</div>
            <div className="text-3xl font-bold text-purple-600">
              {data.statistics.jointCount}건
            </div>
          </div>
        </div>
      </div>

      {/* 대표발의안 목록 */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">
          대표발의안 ({data.statistics.representativeCount}건)
        </h2>

        {data.representativeBills.length === 0 ? (
          <p className="text-gray-500 text-center py-8">대표발의한 법률안이 없습니다</p>
        ) : (
          <>
            {/* 데스크톱 테이블 */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2 text-left w-16">#</th>
                    <th className="border px-3 py-2 text-left">의안명</th>
                    <th className="border px-3 py-2 text-left w-32">의안번호</th>
                    <th className="border px-3 py-2 text-left w-28">발의일</th>
                    <th className="border px-3 py-2 text-left w-32">소관위원회</th>
                    <th className="border px-3 py-2 text-left w-24">처리결과</th>
                  </tr>
                </thead>
                <tbody>
                  {data.representativeBills.map((bill: Bill, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border px-3 py-2 text-center">{index + 1}</td>
                      <td className="border px-3 py-2">
                        {bill.BILL_NAME || "-"}
                      </td>
                      <td className="border px-3 py-2">{bill.BILL_NO || "-"}</td>
                      <td className="border px-3 py-2">{formatDate(bill.PROPOSE_DT)}</td>
                      <td className="border px-3 py-2">{bill.COMMITTEE || "-"}</td>
                      <td className="border px-3 py-2">{bill.PROC_RESULT || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 모바일 카드 */}
            <div className="md:hidden space-y-4">
              {data.representativeBills.map((bill: Bill, index: number) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-base flex-1">
                      {bill.BILL_NAME || "의안명 없음"}
                    </h3>
                    <span className="text-sm text-gray-500 ml-2">#{index + 1}</span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">의안번호:</span> {bill.BILL_NO || "-"}
                    </div>
                    <div>
                      <span className="font-medium">발의일:</span> {formatDate(bill.PROPOSE_DT)}
                    </div>
                    <div>
                      <span className="font-medium">소관위원회:</span> {bill.COMMITTEE || "-"}
                    </div>
                    <div>
                      <span className="font-medium">처리결과:</span>{" "}
                      <span
                        className={
                          bill.PROC_RESULT?.includes("가결")
                            ? "text-green-600 font-semibold"
                            : bill.PROC_RESULT?.includes("부결")
                            ? "text-red-600 font-semibold"
                            : ""
                        }
                      >
                        {bill.PROC_RESULT || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 공동발의안 목록 */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">
          공동발의안 ({data.statistics.jointCount}건)
        </h2>

        {data.jointBills.length === 0 ? (
          <p className="text-gray-500 text-center py-8">공동발의한 법률안이 없습니다</p>
        ) : (
          <>
            {/* 데스크톱 테이블 */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2 text-left w-16">#</th>
                    <th className="border px-3 py-2 text-left">의안명</th>
                    <th className="border px-3 py-2 text-left w-32">의안번호</th>
                    <th className="border px-3 py-2 text-left w-28">발의일</th>
                    <th className="border px-3 py-2 text-left w-32">소관위원회</th>
                    <th className="border px-3 py-2 text-left w-24">처리결과</th>
                  </tr>
                </thead>
                <tbody>
                  {data.jointBills.map((bill: Bill, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border px-3 py-2 text-center">{index + 1}</td>
                      <td className="border px-3 py-2">
                        {bill.BILL_NAME || "-"}
                      </td>
                      <td className="border px-3 py-2">{bill.BILL_NO || "-"}</td>
                      <td className="border px-3 py-2">{formatDate(bill.PROPOSE_DT)}</td>
                      <td className="border px-3 py-2">{bill.COMMITTEE || "-"}</td>
                      <td className="border px-3 py-2">{bill.PROC_RESULT || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 모바일 카드 */}
            <div className="md:hidden space-y-4">
              {data.jointBills.map((bill: Bill, index: number) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-base flex-1">
                      {bill.BILL_NAME || "의안명 없음"}
                    </h3>
                    <span className="text-sm text-gray-500 ml-2">#{index + 1}</span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">의안번호:</span> {bill.BILL_NO || "-"}
                    </div>
                    <div>
                      <span className="font-medium">발의일:</span> {formatDate(bill.PROPOSE_DT)}
                    </div>
                    <div>
                      <span className="font-medium">소관위원회:</span> {bill.COMMITTEE || "-"}
                    </div>
                    <div>
                      <span className="font-medium">처리결과:</span>{" "}
                      <span
                        className={
                          bill.PROC_RESULT?.includes("가결")
                            ? "text-green-600 font-semibold"
                            : bill.PROC_RESULT?.includes("부결")
                            ? "text-red-600 font-semibold"
                            : ""
                        }
                      >
                        {bill.PROC_RESULT || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 업데이트 정보 */}
      <div className="mt-4 text-sm text-gray-500 text-center">
        마지막 업데이트: {new Date(data.lastUpdated).toLocaleString("ko-KR")}
      </div>
      </div>
    </>
  );
}
